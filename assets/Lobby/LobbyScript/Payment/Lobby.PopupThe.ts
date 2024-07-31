import Dialog from "../Script/common/Dialog";
import cmd from "../Lobby.Cmd";
import InPacket from "../Script/networks/Network.InPacket";
import MiniGameNetworkClient2 from "../Script/networks/MiniGameNetworkClient2";
import Dropdown from "../Script/common/Dropdown";
import Configs from "../../../Loading/src/Configs";
import App from "../Script/common/App";
import Utils from "../Script/common/Utils";
import Http from "../Script/common/Http";
import BroadcastReceiver from "../Script/common/BroadcastReceiver";
//import VersionConfig from "../Script/common/VersionConfig";
//import ShootFishNetworkClient from "../Script/networks/ShootFishNetworkClient";
const { ccclass, property } = cc._decorator;
@ccclass("Lobby.PopupShop.TabNapThe")
export class TabNapThe {
    @property(Dropdown)
    dropdownTelco: Dropdown = null;
    @property(Dropdown)
    dropdownAmount: Dropdown = null;
    @property(cc.EditBox)
    edbCode: cc.EditBox = null;
    @property(cc.EditBox)
    edbSerial: cc.EditBox = null;
    @property(cc.Node)
    itemFactorTemplate: cc.Node = null;

    start() {
        this.itemFactorTemplate.active = false;
        for (let i = 0; i < Configs.App.SERVER_CONFIG.listMenhGiaNapThe.length; i++) {
            let node = cc.instantiate(this.itemFactorTemplate);
            node.parent = this.itemFactorTemplate.parent;
            node.active = true;

            let menhGia = Configs.App.SERVER_CONFIG.listMenhGiaNapThe[i];
            let nhan = Math.ceil(menhGia * Configs.App.SERVER_CONFIG.ratioNapThe);
            node.getChildByName("menhgia").getComponent(cc.Label).string = Utils.formatNumber(menhGia);
            node.getChildByName("khuyenmai").getComponent(cc.Label).string = "0%";
            node.getChildByName("nhan").getComponent(cc.Label).string = Utils.formatNumber(nhan);
        }
    }
    reset() {
        this.dropdownTelco.setOptions(["Chọn nhà mạng"].concat(Configs.App.SERVER_CONFIG.listTenNhaMang));
        let listMenhGia = ["Chọn mệnh giá"];
        for (let i = 0; i < Configs.App.SERVER_CONFIG.listMenhGiaNapThe.length; i++) {
            listMenhGia.push(Utils.formatNumber(Configs.App.SERVER_CONFIG.listMenhGiaNapThe[i]));
        }
        this.dropdownAmount.setOptions(listMenhGia);
        this.resetForm();
    }
    resetForm() {
        this.dropdownTelco.setValue(0);
        this.dropdownAmount.setValue(0);
        this.edbCode.string = "";
        this.edbSerial.string = "";
    }
    submit() {
        let ddTelcoValue = this.dropdownTelco.getValue();
        let ddAmountValue = this.dropdownAmount.getValue();
        let code = this.edbCode.string.trim();
        let serial = this.edbSerial.string.trim();
        if (ddTelcoValue == 0) {
            App.instance.alertDialog.showMsg("Vui lòng chọn nhà mạng.");
            return;
        }
        if (ddAmountValue == 0) {
            App.instance.alertDialog.showMsg("Vui lòng chọn mệnh giá.");
            return;
        }
        if (code == "" || parseInt(code) <= 0 || isNaN(parseInt(code))) {
            App.instance.alertDialog.showMsg("Mã thẻ không hợp lệ.");
            return;
        }
        if (serial == "" || parseInt(serial) <= 0 || isNaN(parseInt(serial))) {
            App.instance.alertDialog.showMsg("Mã serial không hợp lệ.");
            return;
        }
        let telcoId = Configs.App.SERVER_CONFIG.listIdNhaMang[ddTelcoValue - 1];
        let amount = Configs.App.SERVER_CONFIG.listMenhGiaNapThe[ddAmountValue - 1].toString();
        App.instance.showLoading(true);
        MiniGameNetworkClient2.getInstance().send(new cmd.ReqDepositCard(telcoId, serial, code, amount));
    }
}
@ccclass
export default class PopupShop extends Dialog {

    @property(cc.ToggleContainer)
    tabs: cc.ToggleContainer = null;
    @property(cc.Node)
    tabContents: cc.Node = null;

    @property(TabNapThe)
    tabNapThe: TabNapThe = null;
    @property([cc.Label])
    lblContainsBotOTPs: cc.Label[] = [];
    private tabSelectedIdx = 0;
    start() {
		this.tabNapThe.reset();
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
        MiniGameNetworkClient2.getInstance().addListener((data) => {
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
                    {
                        this.tabTransfer.edbNickname.string ="";
                        App.instance.alertDialog.showMsg("Tài khoản "+this.tabTransfer.edbNickname.string+" Không phải là tài khoản đại lý.");
                        break;
                    }
                    this.tabTransfer.lblDaiLy.node.active = res.type == 1 || res.type == 2;
                    this.tabTransfer.lblFee.string = res.fee + "%";
                    this.tabTransfer.ratioTransfer = (100 - res.fee) / 100;
                    break;
                }
                case cmd.Code.TRANSFER_COIN: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResTransferCoin(data);
                    // console.log(res);
                    switch (res.error) {
                        case 0:
                            this.tabTransfer.panelContent.active = false;
                            this.tabTransfer.panelContinue.active = true;
                            this.tabTransfer.edbOTP.string = "";
                            App.instance.alertDialog.showMsg("Vui lòng nhấn \"Lấy OTP SMS\" hoặc lấy OTP từ Telegram và nhập mã OTP để tiếp tục!");
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
                  //  console.log(res.error);
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
                //    console.log(res.error);
                    break;
                }
            }
        }, this);

        this.tabNapThe.start();
       
       
        
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
                this.tabNapThe.reset();
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                this.tabNapThe.reset();
                break;
            case 5:
                this.tabNapThe.reset();
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
            App.instance.showLoading(true);
            MiniGameNetworkClient2.getInstance().send(new cmd.ReqCheckNicknameTransfer(nickname));
        }
    }
    actSubmitNapThe() {
        this.tabNapThe.submit();
    }
    actContinueTransfer() {
        if(!this.tabTransfer.receiverAgent)
        {
            App.instance.alertDialog.showMsg("Chỉ có thể chuyển tiền cho tài khoản đại lý");
            return;
        }
        this.tabTransfer.continue();
    }
    actGetOTP() {
        App.instance.showLoading(true);
        MiniGameNetworkClient2.getInstance().send(new cmd.ReqGetOTP());
    }
    actSubmitTransfer() {
        let otp = this.tabTransfer.edbOTP.string.trim();
        if (otp.length == 0) {
            App.instance.alertDialog.showMsg("Mã xác thực không được bỏ trống.");
            return;
        }
        App.instance.showLoading(true);
        MiniGameNetworkClient2.getInstance().send(new cmd.ReqSendOTP(otp, 0));
    }
    actSubmitCard() {
        this.tabCard.submit();
    }
}
 