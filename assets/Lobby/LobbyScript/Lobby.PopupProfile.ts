
import DropDown from "../../Loading/Add-on/DropDown/Script/DropDown";
import Configs from "../../Loading/src/Configs";
import { Global } from "../../Loading/src/Global";
import Http from "../../Loading/src/Http";
import cmd from "./Lobby.Cmd";
import App from "./Script/common/App";
import BroadcastReceiver from "./Script/common/BroadcastReceiver";
import Dialog from "./Script/common/Dialog";
import Utils from "./Script/common/Utils";
import MiniGameNetworkClient from "./Script/networks/MiniGameNetworkClient";
import InPacket from "./Script/networks/Network.InPacket";

const { ccclass, property } = cc._decorator;

@ccclass("Lobby.PopupProfile.TabProfile")
export class TabProfile {
    @property(cc.Label)
    lblNickname: cc.Label = null;
    @property(cc.Label)
    lblChip: cc.Label = null;
    @property(cc.Label)
    lblVipPoint: cc.Label = null;
    @property(cc.Label)
    lblEmail: cc.Label = null;
    @property(cc.Label)
    lblGender: cc.Label = null;
    @property(cc.Label)
    lblBirthday: cc.Label = null;
    @property(cc.Label)
    lblVipPointPercent: cc.Label = null;
    @property(cc.Label)
    lblPhone: cc.Label = null;
    @property(cc.Label)
    lblAddress: cc.Label = null;
    @property(cc.Label)
    lblRefcode: cc.Label = null;
    @property(cc.Label)
    lblVipName: cc.Label = null;
    @property(cc.Slider)
    sliderVipPoint: cc.Slider = null;
    @property(cc.Sprite)
    spriteProgressVipPoint: cc.Sprite = null;

    @property(cc.Sprite)
    spriteAvatar: cc.Sprite = null;
}

@ccclass("Lobby.PopupProfile.PopupUpdateInfo")
export class PopupUpdateInfo {
    @property(cc.EditBox)
    edbMail: cc.EditBox = null;
    @property(cc.EditBox)
    edbAddress: cc.EditBox = null;
    @property(cc.EditBox)
    edbBirthday: cc.EditBox = null;
    @property(cc.EditBox)
    edbRefCode: cc.EditBox = null;
    @property(cc.ToggleContainer)
    toggleContainer: cc.ToggleContainer = null;
    @property(cc.Node)
    bg: cc.Node = null;
    type = 1;//1-address,2-Email;
    gender = 1;
    refcode = "";

    setInfo() {
        this.edbBirthday.string = Configs.Login.Birthday;
        this.edbAddress.string = Configs.Login.Address;
        this.edbMail.string = Configs.Login.Mail;
        this.edbRefCode.string = this.refcode;
        if (Configs.Login.Gender) {
            this.toggleContainer.node.children[0].getComponent(cc.Toggle).isChecked = true;
        } else {
            this.toggleContainer.node.children[2].getComponent(cc.Toggle).isChecked = true;
        }
    }
    dismiss() {
        cc.tween(this.bg).to(0.3, { scale: 0.8, opacity: 150 }, { easing: cc.easing.backIn }).call(() => {
            this.bg.parent.active = false;
        }).start();
    }
    show() {
        this.bg.parent.active = true;
        cc.tween(this.bg).set({ scale: 0.8, opacity: 150 }).to(0.3, { scale: 1, opacity: 255 }, { easing: cc.easing.backOut }).start();
    }
    onClickUpdate() {
        // this.dismiss();
        // if (this.edbBirthday.string == "" && this.edbAddress.string == "" && this.edbMail.string == "") {
        //     App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_input_all"));
        //     return;
        // }

        let birthday = this.edbBirthday.string.trim();
        let address = this.edbAddress.string.trim();
        let mail = this.edbMail.string.trim();
        let refCode = this.edbRefCode.string.trim();
        let count = 0;
        if (birthday.length > 0) {
            for (let i = 0, l = birthday.length; i < l; i++) {
                if (birthday[i] == "-")
                    count++;
            };
            if (count < 2) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_error_birthday"));
                return;
            }
        }
        MiniGameNetworkClient.getInstance().send(new cmd.ReqUpdateUserInfo(mail, birthday, address, this.gender, refCode));
    }
    onClickGender(data) {
        this.gender = parseInt(data);
    }
}
@ccclass("Lobby.PopupProfile.TabVip")
export class TabVip {
    @property(cc.Label)
    lblVipPointName: cc.Label = null;
    @property(cc.Label)
    lblVipPoint: cc.Label = null;
    @property(cc.Label)
    lblTotalVipPoint: cc.Label = null;
    @property(cc.Label)
    lblVipPointNextLevel: cc.Label = null;
    @property(cc.Sprite)
    spriteProgressVipPoint: cc.Sprite = null;
    @property(cc.Node)
    items: cc.Node = null;


    getVipPointInfo() {
        App.instance.showLoading(true);
        Http.get(Configs.App.API, { "c": 126, "nn": Configs.Login.Nickname }, (err, res) => {
            App.instance.showLoading(false);
            if (err != null) {
                return;
            }
            if (!res["success"]) {
                App.instance.alertDialog.showMsg("Lỗi kết nối, vui lòng thử lại.");
                return;
            }
            //Utils.Log("getVipPointInfo:" + JSON.stringify(res));
            Configs.Login.VipPoint = res["vippoint"];
            Configs.Login.VipPointSave = res["vippointSave"];
            for (let i = 0; i < this.items.childrenCount; i++) {
                let item = this.items.children[i];
                if (i < res["ratioList"].length) {
                    item.getChildByName("lblVipPoint").getComponent(cc.Label).string = Utils.formatNumber(Configs.Login.VipPoints[i]);
                    item.getChildByName("lblCoin").getComponent(cc.Label).string = Utils.formatNumber(Configs.Login.VipPoint * res["ratioList"][i]);
                    item.getChildByName("btnReceive").active = res["ratioList"][i] > 0;
                    item.getChildByName("btnReceive").getComponent(cc.Button).interactable = i == Configs.Login.getVipPointIndex() && Configs.Login.VipPoint > 0;
                    item.getChildByName("btnReceive").getComponentInChildren(cc.Label).node.color = i == Configs.Login.getVipPointIndex() ? cc.Color.YELLOW : cc.Color.GRAY;
                    item.getChildByName("btnReceive").off("click");
                    item.getChildByName("btnReceive").on("click", () => {
                        App.instance.confirmDialog.show2("Bạn có chắc chắn muốn nhận thưởng vippoint\nTương ứng với cấp Vippoint hiện tại bạn nhận được :\n" + Utils.formatNumber(Configs.Login.VipPoint * res["ratioList"][i]) + " Xu", (isConfirm) => {
                            if (isConfirm) {
                                App.instance.showLoading(true);
                                MiniGameNetworkClient.getInstance().send(new cmd.ReqExchangeVipPoint());
                            }
                        });
                    });
                    item.active = true;
                } else {
                    item.active = false;
                }
            }

            this.lblVipPointName.string = Configs.Login.getVipPointName();
            this.lblVipPoint.string = Utils.formatNumber(Configs.Login.VipPoint);
            this.lblTotalVipPoint.string = Utils.formatNumber(Configs.Login.VipPointSave);
            this.lblVipPointNextLevel.string = Utils.formatNumber(Configs.Login.getVipPointNextLevel());

            // let VipPoints = [80, 800, 4500, 8600, 50000, 1000000];
            let VipPoints = Configs.Login.VipPoints;
            let vipPointIdx = 0;
            for (let i = VipPoints.length - 1; i >= 0; i--) {
                if (Configs.Login.VipPoint > VipPoints[i]) {
                    vipPointIdx = i;
                    break;
                }
            }

            let vipPointNextLevel = VipPoints[0];
            for (let i = VipPoints.length - 1; i >= 0; i--) {
                if (Configs.Login.VipPoint > VipPoints[i]) {
                    if (i == VipPoints.length - 1) {
                        vipPointNextLevel = VipPoints[i];
                        break;
                    }
                    vipPointNextLevel = VipPoints[i + 1];
                    break;
                }
            }

            let vipPointStartLevel = 0;
            for (let i = VipPoints.length - 1; i >= 0; i--) {
                if (Configs.Login.VipPoint > VipPoints[i]) {
                    vipPointStartLevel = VipPoints[i];
                    break;
                }
            }
            let delta = (Configs.Login.VipPoint - vipPointStartLevel) / (vipPointNextLevel - vipPointStartLevel);
            //Utils.Log("delta: " + delta);
            this.spriteProgressVipPoint.fillRange = (vipPointIdx + 1 / 6) + delta * (1 / 6);
        });
    }


}

@ccclass("Lobby.PopupProfile.TabBank")
export class TabBank {
    @property(cc.EditBox)
    editBank: cc.EditBox = null;
    @property(cc.EditBox)
    editName: cc.EditBox = null;
    @property(cc.EditBox)
    editNumber: cc.EditBox = null;
    @property(cc.EditBox)
    editBranch: cc.EditBox = null;
    @property(cc.Node)
    dropBank: cc.Node = null;
    @property(cc.Node)
    contentItem: cc.Node = null;
    @property(cc.Node)
    prefabItem: cc.Node = null;

    @property(cc.Label)
    lbNote1: cc.Label = null;


    @property(cc.Node)
    boxList: cc.Node = null;
    @property(cc.Node)
    boxListEmpty: cc.Node = null;

    @property(cc.Node)
    boxUpdate: cc.Node = null;
    @property(cc.EditBox)
    editNameUpdate: cc.EditBox = null;
    @property(cc.EditBox)
    editNumberUpdate: cc.EditBox = null;
    @property(cc.EditBox)
    editBranchUpdate: cc.EditBox = null;
    @property(cc.Node)
    dropBankUpdate: cc.Node = null;
    @property(cc.Node)
    popupAddBank: cc.Node = null;

    private idBankChosing = -1;
    private listBank;
    dropBankComp: DropDown = null;
    dropBankUpdateComp: DropDown = null;
    show() {
        this.editBank.node.active = false;
        // this.dropBank = this.dropBankComp.getComponent("DropDown");
        this.dropBank.on("touchend", this.onClickBank, this);
        this.dropBankComp = this.dropBank.getComponent("DropDown");
        this.dropBankUpdateComp = this.dropBankUpdate.getComponent("DropDown");
        this.editName.string = "";
        this.editNumber.string = "";
        this.editBranch.string = "";

        this.loadBankList();
        this.GetListBankProfile();


    }

    public onClickBank() {
        //Utils.Log("onClickBank:" + this.dropBankComp.isShow);
        if (!this.dropBankComp.isShow) {
            this.editBank.node.active = true;
            this.editBank.focus();
        } else {
            this.editBank.node.active = false;
        }
    }

    showPopupAddBank() {
        this.popupAddBank.active = true;
        cc.tween(this.popupAddBank).set({ scale: 0.8, opacity: 255 }).to(0.3, { scale: 1.0, opacity: 255 }, { easing: cc.easing.backOut }).start();
    }
    closeTabAddBank() {
        cc.tween(this.popupAddBank).to(0.3, { scale: 0.8, opacity: 150 }, { easing: cc.easing.backIn }).call(() => {
            this.popupAddBank.active = false;
        }).start();
    }
    loadBankList() {
        var data = {};
        data["c"] = 2011;
        Http.get(Configs.App.API, data, (err, res) => {
            //Utils.Log("loadBankList:" + JSON.stringify(res));
            this.listBank = res.bank.split(',');
            var datas = new Array();
            this.listBank.sort((a, b) => {
                return a.charCodeAt(0) - b.charCodeAt(0);
            })
            for (var i = 0; i < this.listBank.length; i++) {
                datas.push({ optionString: this.listBank[i] });
            }
            this.dropBankComp.clearOptionDatas();
            this.dropBankComp.addOptionDatas(datas);
            this.dropBankComp.selectedIndex = 0;
        });

    }

    GetListBankProfile() {
        this.contentItem.removeAllChildren();
        var self = this;
        var data = {};
        data["c"] = 2008;
        data["nn"] = encodeURIComponent(Configs.Login.Nickname.trim());
        data["pn"] = 1;
        data["l"] = 10;
        Http.get(Configs.App.API, data, (err, res) => {
            var list = JSON.parse(res.data).data;
            Configs.Login.ListBankRut = list;
            if (res == null || list.length == 0) {
                self.boxList.active = false;
                self.boxListEmpty.active = true;
            }
            else {
                self.boxList.active = true;
                self.boxListEmpty.active = false;
                let txtNote1 = App.instance.getTextLang("txt_profile_note_bank1");
                this.lbNote1.string = txtNote1.replace("%s", list.length);
                for (var i = 0; i < list.length; i++) {
                    var nodeItem = cc.instantiate(self.prefabItem);
                    nodeItem.parent = self.contentItem;
                    nodeItem.setPosition(cc.v2(0, 0));
                    nodeItem.getComponent("ItemBankProfile").init(list[i], self);
                }
            }
        });
    }



    CreateBank() {
        if (this.editName.string == "" || this.editNumber.string == "" || this.editBranch.string == "") {
            App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_input_all"));
            return;
        }
        if (this.editName.string.indexOf(' ') == -1) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_not_blank'));
            return;
        }
        var self = this;
        var data = {};
        data["c"] = 2007;
        data["nn"] = encodeURIComponent(Configs.Login.Nickname.trim());
        data["bn"] = encodeURIComponent(this.dropBankComp.labelCaption.string.trim());;
        data["cn"] = encodeURIComponent(this.editName.string.trim());
        data["bnum"] = this.editNumber.string;
        data["br"] = encodeURIComponent(this.editBranch.string.trim());;
        data["t"] = 0;
        //Utils.Log("CreateBank:" + JSON.stringify(data));
        Http.get(Configs.App.API, data, (err, res) => {
            //Utils.Log("response CreateBank:" + JSON.stringify(err) + " : " + JSON.stringify(res));
            this.closeTabAddBank();
            if (res.success) {
                self.GetListBankProfile();
            }
            else {
                App.instance.alertDialog.showMsg(res.message);
            }
        });


    }



    loadBankUpdateList() {
        var datas = new Array();
        for (var i = 0; i < this.listBank.length; i++) {
            datas.push({ optionString: this.listBank[i] });
        }
        this.dropBankUpdateComp.clearOptionDatas();
        this.dropBankUpdateComp.addOptionDatas(datas);
        this.dropBankUpdateComp.selectedIndex = 0;
    }

    ShowBoxUpdate(dataItem) {
        this.loadBankUpdateList();
        this.boxUpdate.active = true;
        var indexBank = 0;
        for (var i = 0; i < this.listBank.length; i++) {
            if (this.listBank[i] == dataItem.bankName) {
                indexBank = i;
            }
        }
        this.dropBankUpdateComp.selectedIndex = indexBank;
        this.dropBankUpdateComp.labelCaption.string = dataItem.bankName;
        this.editNameUpdate.string = dataItem.customerName;
        this.editNumberUpdate.string = dataItem.bankNumber;
        this.editBranchUpdate.string = dataItem.branch;
        this.idBankChosing = dataItem.id;

    }

    onChangeEditBank() {
        //  //Utils.Log("vao day ne:" + this.editBank.string + ":" + this.editBank.node.active);
        var datas = new Array();
        for (var i = 0; i < this.listBank.length; i++) {
            //  //Utils.Log("filer:" + i + ":" + this.editBank.string + ":" + this.listBank[i].toLowerCase());
            if (this.listBank[i].toLowerCase().includes(this.editBank.string.toLowerCase())) {
                //Utils.Log("match:" + this.listBank[i]);
                datas.push({ optionString: this.listBank[i] });
            }
        }
        //Utils.Log("load:" + JSON.stringify(datas));
        this.dropBankComp.hide();
        this.dropBankComp.clearOptionDatas();
        this.dropBankComp.addOptionDatas(datas);
        this.dropBankComp.selectedIndex = 0;
        this.dropBankComp.show();
    }

    onBtnChoseItemBank() {
        this.editBank.node.active = false;
        this.dropBankComp.hide();
    }

    onChangeEditNumber() {
        this.editNumber.string = Utils.formatNumberBank(this.editNumber.string).toUpperCase();

    }

    onChangeEditNumberUpdate() {
        this.editNumberUpdate.string = Utils.formatNumberBank(this.editNumberUpdate.string).toUpperCase();

    }

    onChangeEditBranch() {
        this.editBranch.string = Utils.formatNameBank(this.editBranch.string).toUpperCase();

    }

    onChangeEditBranchUpdate() {
        this.editBranchUpdate.string = Utils.formatNameBank(this.editBranchUpdate.string).toUpperCase();

    }

    onChangeEditName() {
        this.editName.string = Utils.formatNameBank(this.editName.string).toUpperCase();

    }

    onChangeEditNameUpdate() {
        this.editNameUpdate.string = Utils.formatNameBank(this.editNameUpdate.string).toUpperCase();

    }

    HideBoxUpdate() {
        this.boxUpdate.active = false;
        this.idBankChosing = -1;
    }

    UpdateBank() {
        //Utils.Log("UpdateBank:" + this.editNameUpdate.string + ":" + this.editNumberUpdate.string + ":" + this.editBranchUpdate.string + ":" + this.dropBankUpdate.selectedIndex + ":" + this.idBankChosing);
        if (this.editNameUpdate.string == "" || this.editNumberUpdate.string == "" || this.editBranchUpdate.string == "" || this.idBankChosing == -1) {
            App.instance.alertDialog.showMsg("Vui lòng điền đầy đủ thông tin.");
            return;
        }
        if (this.editName.string.indexOf(' ') == -1) {
            App.instance.alertDialog.showMsg("Chủ tài khoản bắt buộc phải có 1 khoảng trắng.");
            return;
        }
        var self = this;
        var data = {};
        data["c"] = 2007;
        data["nn"] = Configs.Login.Nickname;
        data["bn"] = this.dropBankUpdateComp.labelCaption.string;
        data["cn"] = this.editNameUpdate.string;
        data["bnum"] = this.editNumberUpdate.string;
        data["br"] = this.editBranchUpdate.string;
        data["t"] = 1;
        data["id"] = this.idBankChosing;
        Http.get(Configs.App.API, data, (err, res) => {
            if (res.success) {
                //Utils.Log("UpdateBank success:", res);
                self.GetListBankProfile();
                self.HideBoxUpdate();
            }
            else {
                App.instance.alertDialog.showMsg(res.message);
            }
        });
    }
}
@ccclass
export default class PopupProfile extends Dialog {
    @property(cc.ToggleContainer)
    tabs: cc.ToggleContainer = null;
    @property(cc.Node)
    tabContents: cc.Node = null;

    @property(TabProfile)
    tabProfile: TabProfile = null;
    @property(TabVip)
    tabVip: TabVip = null;
    @property(TabBank)
    tabBank: TabBank = null;
    @property(PopupUpdateInfo)
    popupUpdateInfo: PopupUpdateInfo = null;

    private tabSelectedIdx = 0;


    start() {

        for (let i = 0; i < this.tabs.toggleItems.length; i++) {
            this.tabs.toggleItems[i].node.on("toggle", () => {
                if (this.tabSelectedIdx != i) {
                    this.tabSelectedIdx = i;
                    this.onTabChanged();
                }
            });
        }
        BroadcastReceiver.register(BroadcastReceiver.USER_INFO_UPDATED, () => {
            if (!this.node.active) return;
            this.tabProfile.spriteAvatar.spriteFrame = App.instance.getAvatarSpriteFrame(Configs.Login.Avatar);
        }, this);

        MiniGameNetworkClient.getInstance().addListener((data) => {
            if (!this.node.active) return;
            let inpacket = new InPacket(data);
            //  //Utils.Log(inpacket.getCmdId());
            switch (inpacket.getCmdId()) {
                case cmd.Code.EXCHANGE_VIP_POINT: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResExchangeVipPoint(data);
                    switch (res.error) {
                        case 0:
                            App.instance.alertDialog.showMsg("Vui lòng nhấn \"Lấy OTP\" hoặc nhận OTP qua APP OTP, và nhập để tiếp tục.");
                            break;
                        case 1:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_room_err6"));
                            break;
                        case 2:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_profile_note'));
                            break;
                        default:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_unknown_error"));
                            break;
                    }
                    break;
                }
                case cmd.Code.RESULT_EXCHANGE_VIP_POINT: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResResultExchangeVipPoint(data);
                    switch (res.error) {
                        case 0:
                            Configs.Login.Coin = res.currentMoney;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_reward') + "\n" + Utils.formatNumber(res.moneyAdd) + " Xu");
                            break;
                        case 1:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_room_err6"));
                            break;
                        case 2:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_profile_note'));
                            break;
                        default:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_unknown_error"));
                            break;
                    }
                    break;
                }
                case cmd.Code.GET_OTP: {
                    if (!this.node.active) return;
                    App.instance.showLoading(false);
                    let res = new cmd.ResGetOTP(data);
                    //  //Utils.Log(res);
                    if (res.error == 0) {
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_otp_send'));
                    } else if (res.error == 30) {
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_otp_delay_time'));
                    } else {
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_action_not_success'));
                    }
                    break;
                }
                case cmd.Code.SEND_OTP: {
                    let res = new cmd.ResSendOTP(data);
                    //  //Utils.Log(res);
                    App.instance.showLoading(false);
                    switch (res.error) {
                        case 0:
                            break;
                        case 1:
                        case 2:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_error_exchange'));
                            break;
                        case 77:
                        case 3:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_incorrect_otp'));
                            break;
                        case 4:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_expired_otp'));
                            break;
                        default:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_unknown_error'));
                            break;
                    }
                    break;
                }
                case cmd.Code.CHANGE_EMAIL: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResChangeEmail(data);
                    this.actCloseUpdateInfo();
                    if (res.error == 0) {
                        let lblEmail = this.tabProfile.lblEmail;
                        lblEmail.enableItalic = false;
                        lblEmail.enableUnderline = false;
                        lblEmail.node.parent.getComponent(cc.Button).interactable = false;
                        lblEmail.node.color = cc.Color.WHITE;
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_profile_info_change'));
                        this.tabProfile.lblEmail.string = this.popupUpdateInfo.edbMail.string;
                    } else {
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_unknown_error1'));
                    }
                    break;
                }
                case cmd.Code.UPDATE_USER_INFO: {
                    let res = new cmd.ResUpdateUserInfo(data);
                    this.actCloseUpdateInfo();
                    if (res.error == 0) {
                        this.tabProfile.lblEmail.string = this.popupUpdateInfo.edbMail.string;
                        this.tabProfile.lblAddress.string = this.popupUpdateInfo.edbAddress.string;
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_profile_info_change'));
                        MiniGameNetworkClient.getInstance().send(new cmd.ReqGetSecurityInfo());
                    } else {
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_unknown_error1'));
                    }
                    break;
                }
                case cmd.Code.GET_SECURITY_INFO: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResGetSecurityInfo(data);
                    //Utils.Log("GET_SECURITY_INFO=", res);
                    Configs.Login.Mail = res.email;
                    Configs.Login.Address = res.address;
                    Configs.Login.Gender = res.gender;
                    Configs.Login.VerifyMobile = res.isVerifyPhone;
                    let lblPhone = this.tabProfile.lblPhone;
                    let lblEmail = this.tabProfile.lblEmail;
                    let lblAddress = this.tabProfile.lblAddress;
                    this.popupUpdateInfo.refcode = res.refferalCode;
                    this.tabProfile.lblGender.string = Configs.Login.Gender == true ? App.instance.getTextLang("txt_gender_male") : App.instance.getTextLang("txt_gender_female");
                    let msg = App.instance.getTextLang("txt_not_config");
                    let msg1 = App.instance.getTextLang("txt_not_update");
                    this.tabProfile.lblRefcode.string = res.refferalCode != "" ? res.refferalCode : msg1;
                    lblPhone.string = res.mobile == "" ? msg : res.mobile.substring(0, res.mobile.length - 3) + "***";
                    lblPhone.enableItalic = res.mobile == "" ? true : false;
                    lblPhone.enableUnderline = res.mobile == "" ? true : false;
                    lblPhone.node.color = res.mobile == "" ? cc.Color.GREEN : cc.Color.WHITE;
                    lblEmail.string = res.email == "" ? msg1 : res.email;
                    this.tabProfile.lblBirthday.string = res['birthday'] != "" ? res['birthday'].replace(/-/g, '/') : msg1;


                    lblAddress.string = Configs.Login.Address != "" ? Configs.Login.Address : msg1;
                    if (Configs.Login.Address == "") {
                        lblAddress.string = Configs.Login.FacebookID != "" ? App.instance.getTextLang('txt_profile_click') : msg1;
                    }
                    lblAddress.enableItalic = Configs.Login.FacebookID != "" ? true : false;
                    lblAddress.node.color = Configs.Login.FacebookID != "" ? cc.Color.GREEN : cc.Color.WHITE;
                    lblAddress.node.parent.getComponent(cc.Button).interactable = Configs.Login.FacebookID != "" ? true : false;
                    break;
                }
            }
        }, this);
    }

    actRule() {
        App.instance.actRule();
        this.dismiss();
    }

    onBtnChangePass() {
        App.instance.actChangePass();
    }
	actBack() {
            App.instance.confirmDialog.show3(App.instance.getTextLang("txt_ask_logout"), "ĐĂNG XUẤT", (isConfirm) => {
                if (isConfirm) {
                    App.instance.checkMailUnread = false;
                    this.panelMenu.node.parent.active = false;
                    this.panelMenu.hide();

                    if (cc.sys.isBrowser) {
                        window.localStorage.removeItem('u');
                        window.localStorage.removeItem('at');
                        window.localStorage.removeItem('at_fb');
                        window.localStorage.removeItem('un');
                        window.localStorage.removeItem('pw');

                    }
                    SPUtils.setUserName("");
                    SPUtils.setUserPass("");
                    cc.sys.localStorage.setItem("IsAutoLogin", 0);
                    BroadcastReceiver.send(BroadcastReceiver.USER_LOGOUT);
                    App.instance.updateConfigGame(App.DOMAIN);
                    App.instance.RECONNECT_GAME = false;
                }
            });
        }
    onBtnRefund() {
        this.dismiss();
        Global.LobbyController.actRefund();
    }
    onClickAddress() {
        cc.sys.openURL("https://www.facebook.com/" + Configs.Login.FacebookID);
    }
    actChangeAvatar() {
        App.instance.actChangeAvatar();
    }
    actUpdateInfo() {
        this.popupUpdateInfo.show();
    }
    actSendUpdateInfo() {
        this.popupUpdateInfo.onClickUpdate();
    }
    actCloseUpdateInfo() {
        this.popupUpdateInfo.dismiss();
    }
    actChangeUserInfo(even, data) {
        //Utils.Log("Data==" + data);
        switch (data) {
            case "1": {
                Global.LobbyController.actSecurity();
                this.dismiss();
                break;
            }
            case "2":
            case "3": {
                this.popupUpdateInfo.show()
                this.popupUpdateInfo.setInfo();
                break;
            }
        }
    }
    actChooseGender(even, data) {
        this.popupUpdateInfo.onClickGender(data);
    }
    show(tabIndex = 0) {
        super.show();
        this.tabSelectedIdx = tabIndex;
        this.tabs.toggleItems[this.tabSelectedIdx].isChecked = true;
        this.onTabChanged();
    }

    showTabBank() {
        super.show();

        this.tabSelectedIdx = 2;
        this.tabs.toggleItems[this.tabSelectedIdx].isChecked = true;
        this.onTabChanged();
    }

    actChoseItemBank() {
        this.tabBank.onBtnChoseItemBank();
    }
    actEditBank() {
        this.tabBank.onChangeEditBank();
    }

    actEditNumber() {
        this.tabBank.onChangeEditNumber();
    }

    actEditNumberUpdate() {
        this.tabBank.onChangeEditNumberUpdate();
    }

    actEditBranch() {
        this.tabBank.onChangeEditBranch();
    }

    actEditBranchUpdate() {
        this.tabBank.onChangeEditBranchUpdate();
    }

    actEditNameBank() {
        this.tabBank.onChangeEditName();
    }

    actEditNameBankUpdate() {
        this.tabBank.onChangeEditNameUpdate();
    }

    actHideUpdateBank() {
        this.tabBank.HideBoxUpdate();
    }
    actHideAddBank() {
        this.tabBank.closeTabAddBank();
    }
    actUpdateBank() {
        this.tabBank.UpdateBank();
    }

    actCreateBank() {
        this.tabBank.CreateBank();
    }
    actAddBankAccount() {
        this.tabBank.showPopupAddBank();
    }
    actShowAddCoin() {
        this.dismiss();
        App.instance.popupShop.show();
    }



    actGetOTP() {
        App.instance.showLoading(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqGetOTP());
    }

    private onTabChanged() {
        for (let i = 0; i < this.tabContents.childrenCount; i++) {
            this.tabContents.children[i].active = i == this.tabSelectedIdx;
        }
        // for (let j = 0; j < this.tabs.toggleItems.length; j++) {
        //     this.tabs.toggleItems[j].node.getComponentInChildren(cc.Label).node.color = j == this.tabSelectedIdx ? cc.Color.YELLOW : cc.Color.WHITE;
        // }
        switch (this.tabSelectedIdx) {
            case 0:
                App.instance.showLoading(true);
                MiniGameNetworkClient.getInstance().send(new cmd.ReqGetSecurityInfo());
                this.tabProfile.lblNickname.string = Configs.Login.Nickname;
                this.tabProfile.lblChip.string = Utils.formatNumber(Configs.Login.Coin);
                this.tabProfile.lblVipPoint.string = "VP: " + Utils.formatNumber(Configs.Login.VipPoint) + "/" + Utils.formatNumber(Configs.Login.getVipPointNextLevel());
                this.tabProfile.lblVipName.string = Configs.Login.getVipPointName();
                this.tabProfile.sliderVipPoint.progress = Math.min(Configs.Login.VipPoint / Configs.Login.getVipPointNextLevel(), 1);
                this.tabProfile.spriteProgressVipPoint.fillRange = this.tabProfile.sliderVipPoint.progress;
                this.tabProfile.lblVipPointPercent.string = Math.floor(this.tabProfile.sliderVipPoint.progress * 100) + "%";
                this.tabProfile.spriteAvatar.spriteFrame = App.instance.getAvatarSpriteFrame(Configs.Login.Avatar);
                break;
            case 1:
                this.tabVip.getVipPointInfo();
                break;
            case 2:
                this.tabBank.show();
                break;
        }
    }
}
