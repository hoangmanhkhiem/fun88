import Dialog from "../Script/common/Dialog";
import cmd from "../Lobby.Cmd";
import InPacket from "../Script/networks/Network.InPacket";
import MiniGameNetworkClient from "../Script/networks/MiniGameNetworkClient";
//import Dropdown from "../Script/common/Dropdown";
import Configs from "../../../Loading/src/Configs";
import App from "../Script/common/App";
import Utils from "../Script/common/Utils";
//import Http from "../Script/common/Http";
import BroadcastReceiver from "../Script/common/BroadcastReceiver";
//import VersionConfig from "../Script/common/VersionConfig";
//import ShootFishNetworkClient from "../../scripts/networks/ShootFishNetworkClient";

const { ccclass, property } = cc._decorator;


@ccclass("Lobby.PopupShop.TabTransfer")
export class TabTransfer {
    @property(cc.Node)
    panelContent: cc.Node = null;
    @property(cc.Node)
    panelContinue: cc.Node = null;

    @property(cc.Label)
    lblBalance: cc.Label = null;
    @property(cc.Label)
    lblFee: cc.Label = null;
    @property(cc.Label)
    lblReceive: cc.Label = null;
    @property(cc.Label)
    lblDaiLy: cc.Label = null;
    @property(cc.Label)
    lblNote: cc.Label = null;
    @property(cc.EditBox)
    edbNickname: cc.EditBox = null;
    @property(cc.EditBox)
    edbReNickname: cc.EditBox = null;
    @property(cc.EditBox)
    edbCoinTransfer: cc.EditBox = null;
    @property(cc.EditBox)
    edbNote: cc.EditBox = null;

    @property(cc.EditBox)
    edbOTP: cc.EditBox = null;

    ratioTransfer = Configs.App.SERVER_CONFIG.ratioTransfer;
    
    receiverAgent: boolean= false;

    start() {
        this.edbCoinTransfer.node.on("editing-did-ended", () => {
            let number = Utils.stringToInt(this.edbCoinTransfer.string);
            this.edbCoinTransfer.string = Utils.formatNumber(number);
            this.lblReceive.string = Utils.formatNumber(Math.round(this.ratioTransfer * number));
        });
        this.edbNickname.node.on("editing-did-ended", () => {
            let nickname = this.edbNickname.string.trim();
            if (nickname != "") {
               App.instance.showLoading(true);
               MiniGameNetworkClient.getInstance().send(new cmd.ReqCheckNicknameTransfer(nickname));
            }
        });
    }

    reset() {
        this.panelContent.active = true;
     //   this.panelContinue.active = false;
        this.lblDaiLy.node.active = false;
        this.lblFee.string = "0";
        this.lblBalance.string = Utils.formatNumber(Configs.Login.Coin);
        this.lblReceive.string = "0";
        this.edbNickname.string = "";
        this.edbReNickname.string = "";
        this.edbNote.string = "";
        this.edbCoinTransfer.string = "";
        this.lblNote.string = this.lblNote.string.replace("%s", Math.round((1 - this.ratioTransfer) * 100) + "%");
        this.lblFee.string = Math.round((1 - this.ratioTransfer) * 100) + "%";
    }

    continue() {
        let nickname = this.edbNickname.string.trim();
        let reNickname = this.edbReNickname.string.trim();
        let coin = Utils.stringToInt(this.edbCoinTransfer.string);
        let note = this.edbNote.string.trim();
        if (nickname == "") {
            App.instance.alertDialog.showMsg("Nickname không được để trống.");
            return;
        }
        if (nickname != reNickname) {
            App.instance.alertDialog.showMsg("Hai nickname không giống nhau.");
            return;
        }
        if (note == "") {
            App.instance.alertDialog.showMsg("Lý do chuyển khoản không được để trống.");
            return;
        }
        if (coin < 10000) {
            App.instance.alertDialog.showMsg("Số tiền giao dịch tối thiểu bằng 200.000.");
            return;
        }
        if (coin > Configs.Login.Coin) {
            App.instance.alertDialog.showMsg("Số dư không đủ.");
            return;
        }

        App.instance.confirmDialog.show2("Bạn có chắc chắn muốn chuyển cho\nTài khoản: \"" + nickname + "\" (Không phải Đ.Lý)\nSố tiền: " + this.edbCoinTransfer.string + "\nLý do: " + note, (isConfirm) => {
            if (isConfirm) {
                App.instance.showLoading(true);
                MiniGameNetworkClient.getInstance().send(new cmd.ReqTransferCoin(nickname, coin, note));
            }
        });
    }
}


@ccclass
export default class PopupShop extends Dialog {

    @property(cc.ToggleContainer)
    tabs: cc.ToggleContainer = null;
    @property(cc.Node)
    tabContents: cc.Node = null;

    
    @property(TabTransfer)
    tabTransfer: TabTransfer = null;
    
    

    @property([cc.Label])
    lblContainsBotOTPs: cc.Label[] = [];


    



    private tabSelectedIdx = 0;

    start() {
		this.tabTransfer.reset();
        /* switch (VersionConfig.CPName) {
            case VersionConfig.CP_NAME_F69:
                this.tabs.toggleItems[2].node.active = false;//inactive momo tab
                this.tabs.toggleItems[5].node.active = true;//active bitcoin tab
                break;
            default:
                this.tabs.toggleItems[2].node.active = true;//active momo tab
                this.tabs.toggleItems[5].node.active = false;//inactive bitcoin tab
                break;
        } */

        for (let i = 0; i < this.lblContainsBotOTPs.length; i++) {
            let lbl = this.lblContainsBotOTPs[i];
            lbl.string = lbl.string.replace("$bot_otp", "@" + Configs.App.getLinkTelegram());
        }

        for (let i = 0; i < this.tabs.toggleItems.length; i++) {
            this.tabs.toggleItems[i].node.on("toggle", () => {
                this.tabSelectedIdx = i;
                this.onTabChanged();
            });
        }

        MiniGameNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            console.log(inpacket.getCmdId());
            switch (inpacket.getCmdId()) {
                case cmd.Code.DEPOSIT_CARD: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResDepositCard(data);
                    switch (res.error) {
                        case 0:
                            App.instance.alertDialog.showMsg("Nạp thẻ thành công.");
                            Configs.Login.Coin = res.currentMoney;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            break;
                        case 30:
                            this.tabNapThe.resetForm();
                            App.instance.alertDialog.showMsg("Hệ thống đã ghi nhận giao dịch, vui lòng chờ hệ thống xử lý.");
                            break;
                        case 31:
                            App.instance.alertDialog.showMsg("Thẻ đã được sử dụng.");
                            break;
                        case 32:
                            App.instance.alertDialog.showMsg("Thẻ đã bị khóa.");
                            break;
                        case 33:
                            App.instance.alertDialog.showMsg("Thẻ chưa được kích hoạt.");
                            break;
                        case 34:
                            App.instance.alertDialog.showMsg("Thẻ đã hết hạn sử dụng.");
                            break;
                        case 35:
                            App.instance.alertDialog.showMsg("Mã thẻ không đúng.");
                            break;
                        case 36:
                            App.instance.alertDialog.showMsg("Số serial không đúng.");
                            break;
                        case 8:
                            App.instance.alertDialog.showMsg("Tài khoản đã bị khóa nạp thẻ do nạp sai quá nhiều lần! Thời gian khóa nạp thẻ còn lại: " + this.longToTime(res.timeFail));
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Lỗi " + res.error + ". Không xác định.");
                            break;
                    }
                    break;
                }
                case cmd.Code.CHECK_NICKNAME_TRANSFER: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResCheckNicknameTransfer(data);
                    // console.log(res);
                    if (res.error == 0) {
                        this.tabTransfer.edbNickname.string = this.tabTransfer.edbReNickname.string = "";
                        App.instance.alertDialog.showMsg("Tài khoản không tồn tại.");
                        break;
                    }
                    this.tabTransfer.receiverAgent=res.type == 1 || res.type == 2;
                    if(!this.tabTransfer.receiverAgent)
                //    {
                //        this.tabTransfer.edbNickname.string ="";
                //        App.instance.alertDialog.showMsg("Tài khoản "+this.tabTransfer.edbNickname.string+" Không phải là tài khoản đại lý.");
                //        break;
                //    }
                    this.tabTransfer.lblDaiLy.node.active = res.type == 1 || res.type == 2;
                    this.tabTransfer.lblFee.string = res.fee + "%";
                    this.tabTransfer.ratioTransfer = (100 - res.fee) / 100;
                    break;
                }
                case cmd.Code.TRANSFER_COIN: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResTransferCoin(data);
                     console.log(res);
                    switch (res.error) {
                        case 0:
                            this.tabTransfer.panelContent.active = true;
                         //   this.tabTransfer.panelContinue.active = true;
                        //    this.tabTransfer.edbOTP.string = "";
                            App.instance.alertDialog.showMsg("Chuyển khoản thành công");
                            break;
                        case 2:
                            App.instance.alertDialog.showMsg("Số tiền tối thiểu là 200.000.");
                            break;
                        case 3:
                            App.instance.alertDialog.showMsg("Chức năng chỉ dành cho những tài khoản đăng ký bảo mật SMS PLUS.");
                            break;
                        case 4:
                            App.instance.alertDialog.showMsg("Số dư không đủ.");
                            break;
                        case 5:
                            App.instance.alertDialog.showMsg("Tài khoản bị cấm chuyển tiền.");
                            break;
                        case 6:
                            App.instance.alertDialog.showMsg("Nickname nhận không tồn tại.");
                            break;
                        case 10:
                            App.instance.alertDialog.showMsg("Chức năng bảo mật sẽ tự động kích hoạt sau 24h kể từ thời điểm đăng ký thành công!");
                            break;
                        case 11:
                            App.instance.alertDialog.showMsg("Bạn chỉ được chuyển cho Đại lý tổng trong khoảng tiền quy định!");
                            break;
                        case 22:
                            App.instance.alertDialog.showMsg("Tài khoản chưa đủ điều kiện để chuyển tiền.");
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Lỗi " + res.error + ". vui lòng thử lại sau.");
                            break;
                    }
                    break;
                }
                case cmd.Code.GET_OTP: {
                    if (!this.node.active) return;
                    App.instance.showLoading(false);
                    let res = new cmd.ResGetOTP(data);
                    // console.log(res);
                    if (res.error == 0) {
                        App.instance.alertDialog.showMsg("Mã OTP đã được gửi đi!");
                    } else if (res.error == 30) {
                        App.instance.alertDialog.showMsg("Mỗi thao tác lấy SMS OTP phải cách nhau ít nhất 5 phút!");
                    } else {
                        App.instance.alertDialog.showMsg("Thao tác không thành công vui lòng thử lại sau!");
                    }
                    break;
                }
                case cmd.Code.SEND_OTP: {
                    let res = new cmd.ResSendOTP(data);
                    // console.log(res);
                    if (res.error != 0) {
                        App.instance.showLoading(false);
                        switch (res.error) {
                            case 1:
                            case 2:
                                App.instance.alertDialog.showMsg("Giao dịch thất bại!");
                                break;
                            case 3:
                                App.instance.alertDialog.showMsg("Mã xác thực không chính xác, vui lòng thử lại!");
                                break;
                            case 4:
                                App.instance.alertDialog.showMsg("Mã OTP đã hết hạn!");
                                break;
                            default:
                                App.instance.alertDialog.showMsg("Lỗi " + res.error + ". Không xác định.");
                                break;
                        }
                        return;
                    }
                    App.instance.showLoading(true);
                    break;
                }
                case cmd.Code.RESULT_TRANSFER_COIN: {
                    if (!this.node.active) return;
                    App.instance.showLoading(false);
                    let res = new cmd.ResResultTransferCoin(data);
                    // console.log(res);
                    switch (res.error) {
                        case 0:
                            Configs.Login.Coin = res.currentMoney;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            App.instance.alertDialog.showMsg("Giao dịch chuyển khoản thành công!");
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Lỗi " + res.error + ". vui lòng thử lại sau.");
                            break;
                    }
                    this.tabTransfer.reset();
                    break;
                }
                case cmd.Code.INSERT_GIFTCODE: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResInsertGiftcode(data);
                    switch (res.error) {
                        case 0:
                            App.instance.alertDialog.showMsg("Mã thẻ không chính xác. Vui lòng kiểm tra lại!");
                            break;
                        case 1:
                            App.instance.alertDialog.showMsg("Mã thẻ đã được sử dụng.");
                            break;
                        case 3:
                            App.instance.alertDialog.showMsg("Để sử dụng tính năng này vui lòng đăng ký bảo mật.");
                            break;
                        case 4:
                        case 5:
                        case 6:
                            App.instance.alertDialog.showMsg("Mã thẻ đã nhập không hợp lệ.");
                            break;
                        case 2:
                            Configs.Login.Coin = res.currentMoneyVin;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            App.instance.alertDialog.showMsg("Nạp thẻ thành công.");
                            break;
                    }
                    break;
                }
                case cmd.Code.DEPOSIT_BANK: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResDepositBank(data);
                    switch(res.error){
                        case 0:
                            App.instance.alertDialog.showMsg("Hệ thống đã ghi nhận giao dịch của bạn, vui lòng chờ trong giây lát để chúng tôi xử lý");
                            break;
                        case 3:
                            App.instance.alertDialog.showMsg("Bạn đang có giao dịch chờ xử lý, vui lòng chờ đến khi giao dịch được hoàn tất");
                            break;
                        case 2:
                        case 1:
                            App.instance.alertDialog.showMsg("Dữ liệu lỗi, vui lòng thử lại!");
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Dữ liệu lỗi, vui lòng thử lại!");
                    }
                    console.log(res.error);
                    break;
                }
                case cmd.Code.DEPOSIT_MOMO: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResDepositMomo(data);
                    switch(res.error){
                        case 0:
                            App.instance.alertDialog.showMsg("Hệ thống đã ghi nhận giao dịch của bạn, vui lòng chờ trong giây lát để chúng tôi xử lý");
                            break;
                        case 3:
                            App.instance.alertDialog.showMsg("Bạn đang có giao dịch chờ xử lý, vui lòng chờ đến khi giao dịch được hoàn tất");
                            break;
                        case 2:
                        case 1:
                            App.instance.alertDialog.showMsg("Dữ liệu lỗi, vui lòng thử lại!");
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Dữ liệu lỗi, vui lòng thử lại!");
                    }
                    console.log(res.error);
                    break;
                }
            }
        }, this);

        
        this.tabTransfer.start();
        
    }

    private onTabChanged() {
        for (let i = 0; i < this.tabContents.childrenCount; i++) {
            this.tabContents.children[i].active = i == this.tabSelectedIdx;
        }
        for (let j = 0; j < this.tabs.toggleItems.length; j++) {
            this.tabs.toggleItems[j].node.getComponentInChildren(cc.Label).node.color = j == this.tabSelectedIdx ? cc.Color.YELLOW : cc.Color.WHITE;
        }
        switch (this.tabSelectedIdx) {
            case 0:
                this.tabNapThe.reset();
                break;
            case 1:
                this.tabTransfer.reset();
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                this.tabCard.reset();
                break;
            case 5:
                this.tabBitCoin.start(this);
                break;
        }
    }

    private longToTime(l: number): string {
        return (l / 60) + " giờ " + (l % 60) + " phút";
    }

    show() {
        super.show();
        this.tabSelectedIdx = 0;
        this.tabs.toggleItems[this.tabSelectedIdx].isChecked = true;
        this.onTabChanged();
    }

    showAndOpenTransfer(nickname: string = null) {
        super.show();
        this.tabSelectedIdx = 1;
        this.tabs.toggleItems[this.tabSelectedIdx].isChecked = true;
        this.onTabChanged();
        if (nickname != null) {
            this.tabTransfer.edbNickname.string = this.tabTransfer.edbReNickname.string = nickname;
          //  App.instance.showLoading(true);
          //  MiniGameNetworkClient.getInstance().send(new cmd.ReqCheckNicknameTransfer(nickname));
        }
    }

    

    actContinueTransfer() {
        
        this.tabTransfer.continue();
    }

    actGetOTP() {
        App.instance.showLoading(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqGetOTP());
    }

    actSubmitTransfer() {
        let otp = this.tabTransfer.edbOTP.string.trim();
        if (otp.length == 0) {
            App.instance.alertDialog.showMsg("Mã xác thực không được bỏ trống.");
            return;
        }
        App.instance.showLoading(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqSendOTP(otp, 0));
    }

    actSubmitNapMomo() {
        this.tabMomo.submit();
    }

    actSubmitNapNganHang() {
        this.tabBank.submit();
    }

    actSubmitCard() {
        this.tabCard.submit();
    }
}
