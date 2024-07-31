import Configs from "../../Loading/src/Configs";
import { Global } from "../../Loading/src/Global";
import LogEvent from "../../Loading/src/LogEvent/LogEvent";
import UtilsNative from "../../Loading/src/UtilsNative";
import cmd from "./Lobby.Cmd";
import App from "./Script/common/App";
import BroadcastReceiver from "./Script/common/BroadcastReceiver";
import Dialog from "./Script/common/Dialog";
import Utils from "./Script/common/Utils";
import MiniGameNetworkClient from "./Script/networks/MiniGameNetworkClient";
import InPacket from "./Script/networks/Network.InPacket";

const { ccclass, property } = cc._decorator;
@ccclass("Lobby.PopupSecurity.PanelSmsPlus")
export class PanelSmsPlus {
    @property(cc.Node)
    node: cc.Node = null;

    @property(cc.Node)
    info: cc.Node = null;
    @property(cc.Node)
    update: cc.Node = null;
    @property(cc.Node)
    continue: cc.Node = null;

    @property(cc.Label)
    infoLblUsername: cc.Label = null;
    @property(cc.Label)
    infoLblPhoneNumber: cc.Label = null;
    @property(cc.Button)
    infoBtnActive: cc.Button = null;
    @property(cc.Button)
    infoBtnChange: cc.Button = null;

    @property(cc.Node)
    updateBtnsActive: cc.Node = null;
    @property(cc.Node)
    updateBtnsNotActive: cc.Node = null;
    @property(cc.EditBox)
    updateEdbPhoneNumber: cc.EditBox = null;

    @property(cc.EditBox)
    continueEdbOTP: cc.EditBox = null;
    @property(cc.Button)
    btnGetOTP: cc.Button = null;
}

@ccclass("Lobby.PopupSecurity.TabSafes")
export class TabSafes {
    @property(cc.Node)
    node: cc.Node = null;

    @property(cc.ToggleContainer)
    tabs: cc.ToggleContainer = null;
    @property(cc.Node)
    tabContents: cc.Node = null;

    @property(cc.Label)
    lblBalance: cc.Label = null;
    @property(cc.Label)
    lblBalanceSafes: cc.Label = null;

    @property(cc.EditBox)
    edbCoinNap: cc.EditBox = null;

    @property(cc.EditBox)
    edbCoinRut: cc.EditBox = null;
    @property(cc.EditBox)
    edbOTP: cc.EditBox = null;
    @property(cc.Toggle)
    toggleAppOTP: cc.Toggle = null;

    tabSelectedIdx = 0;

    start() {
        this.edbCoinRut.node.on("editing-did-ended", () => {
            let number = Utils.stringToInt(this.edbCoinRut.string);
            this.edbCoinRut.string = Utils.formatNumber(number);
        });
        this.edbCoinNap.node.on("editing-did-ended", () => {
            let number = Utils.stringToInt(this.edbCoinNap.string);
            this.edbCoinNap.string = Utils.formatNumber(number);
        });
        for (let i = 0; i < this.tabs.toggleItems.length; i++) {
            this.tabs.toggleItems[i].node.on("toggle", () => {
                this.tabSelectedIdx = i;
                this.onTabChanged();
            });
        }
    }

    onTabChanged() {
        for (let i = 0; i < this.tabContents.childrenCount; i++) {
            this.tabContents.children[i].active = i == this.tabSelectedIdx;
        }
        for (let j = 0; j < this.tabs.toggleItems.length; j++) {
            this.tabs.toggleItems[j].node.getComponentInChildren(cc.Label).node.color = j == this.tabSelectedIdx ? cc.Color.YELLOW : cc.Color.WHITE;
        }
        switch (this.tabSelectedIdx) {
            case 0:
                this.edbCoinNap.string = "";
                break;
            case 1:
                this.edbCoinRut.string = "";
                this.edbOTP.string = "";
                break;
        }
    }
}

@ccclass
export default class PopupSecurity extends Dialog {
    @property(cc.ToggleContainer)
    tabs: cc.ToggleContainer = null;
    @property(cc.Node)
    tabContents: cc.Node = null;
    @property(PanelSmsPlus)
    panelSmsPlus: PanelSmsPlus = null;
    @property(TabSafes)
    tabSafes: TabSafes = null;
    @property([cc.Label])
    lblContainsBotOTPs: cc.Label[] = [];
    @property(cc.Node)
    tabTeleSafe: cc.Node = null;
    @property(cc.EditBox)
    edbTeleSafe: cc.EditBox = null;

    private tabSelectedIdx = 0;
    private phoneNumber = "";
    public sessionInfo = "";
    private captchaToken = ""
    private isMobileSecure = false;
    onLoad() {
        Global.PopupSecurity = this;
        this.panelSmsPlus.infoLblUsername.string = Configs.Login.Nickname;
    }
    start() {
        for (let i = 0; i < this.lblContainsBotOTPs.length; i++) {
            let lbl = this.lblContainsBotOTPs[i];
            lbl.string = lbl.string.replace("$bot_otp", "@" + Configs.App.getLinkTelegram());
        }

        this.tabSafes.start();

        for (let i = 0; i < this.tabs.toggleItems.length; i++) {
            this.tabs.toggleItems[i].node.on("toggle", () => {
                this.tabSelectedIdx = i;
                this.onTabChanged();
            });
        }

        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            this.tabSafes.lblBalance.string = Utils.formatNumber(Configs.Login.Coin);
        }, this);

        MiniGameNetworkClient.getInstance().addListener((data) => {
            if (!this.node.active) return;
            let inpacket = new InPacket(data);
            //  //Utils.Log(inpacket.getCmdId());
            switch (inpacket.getCmdId()) {
                case cmd.Code.GET_SECURITY_INFO: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResGetSecurityInfo(data);
                    //Utils.Log("ResGetSecurityInfo:", JSON.stringify(res));
                    if (this.panelSmsPlus.node.active) {
                        this.phoneNumber = res.mobile;
                        this.isMobileSecure = res.mobileSecure == 1;
                        // if (res.mobile.length > 0||res.isVerifyPhone) {
                        if (res.isVerifyPhone) {
                            this.panelSmsPlus.info.active = true;
                            this.panelSmsPlus.update.active = false;
                            this.panelSmsPlus.continue.active = false;
                            this.panelSmsPlus.infoLblUsername.string = res.username;
                            this.panelSmsPlus.infoLblPhoneNumber.string = "*******" + this.phoneNumber.substring(this.phoneNumber.length - 3);
                            // this.panelSmsPlus.infoBtnActive.node.active = !this.isMobileSecure;
                            this.panelSmsPlus.infoBtnActive.node.active = false;

                        } else {
                            this.panelSmsPlus.info.active = false;
                            this.panelSmsPlus.update.active = true;
                            this.panelSmsPlus.continue.active = false;
                        }
                        this.panelSmsPlus.updateBtnsActive.active = this.isMobileSecure;
                        this.panelSmsPlus.updateBtnsNotActive.active = !this.isMobileSecure;
                    }
                    if (this.tabSafes.node.active) {
                        this.tabSafes.lblBalanceSafes.string = Utils.formatNumber(res.safe);
                        this.tabSafes.lblBalance.string = Utils.formatNumber(Configs.Login.Coin);
                    }
                    //  //Utils.Log(res);
                    break;
                }
                case cmd.Code.UPDATE_USER_INFO: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResUpdateUserInfo(data);
                    if (res.error != 0) {
                        switch (res.error) {
                            case 1:
                                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_check_connect'));
                                break;
                            case 4:
                                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_phone_number_incorrect'));
                                break;
                            case 5:
                            case 11:
                                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_phone_number_incorrect1'));
                                break;
                            default:
                                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_unknown_error'));
                                break;
                        }
                        return;
                    }
                    this.showSmsPlusContinue();
                    this.actSmsPlusActivePhone();
                    break;
                }
                case cmd.Code.CHANGE_PHONE_NUMBER: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResChangePhoneNumber(data);
                    if (res.error != 0) {
                        switch (res.error) {
                            case 1:
                                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_check_connect'));
                                break;
                            case 2:
                                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_phone_number_incorrect'));
                                break;
                            case 3:
                                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_phone_number_incorrect2'));
                                break;
                            case 4:
                            case 5:
                                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_phone_number_incorrect1'));
                                break;
                            default:
                                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_unknown_error'));
                                break;
                        }
                        return;
                    }
                    this.showSmsPlusContinue();
                    App.instance.alertDialog.showMsg("Vui lòng nhập mã OTP (Số điện thoại cũ) để tiếp tục thay đổi số điện thoại bảo mật!");
                    break;
                }
                case cmd.Code.GET_OTP: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResGetOTP(data);
                    //Utils.Log("GET_OTP:" + JSON.stringify(res));
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
                    App.instance.showLoading(false);
                    let res = new cmd.ResSendOTP(data);
                    //  //Utils.Log(res);
                    if (res.error != 0) {
                        switch (res.error) {
                            case 1:
                            case 2:
                                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_error'));
                                break;
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
                        return;
                    }
                    break;
                }
                case cmd.Code.ACTIVE_PHONE: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResActivePhone(data);
                    switch (res.error) {
                        case 0:
                            this.showSmsPlusContinue();
                            break;
                        case 1:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_check_connect'));
                            break;
                        case 2:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_phone_number_incorrect1'));
                            break;
                        default:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_unknown_error'));
                            break;
                    }
                    break;
                }
                case cmd.Code.RESULT_ACTIVE_MOBILE: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResResultActiveMobie(data);
                    if (res.error == 0) {
                        LogEvent.getInstance().sendEventSdt(this.panelSmsPlus.updateEdbPhoneNumber.string.trim());
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_security_success'));
                        this.onTabChanged();
                    } else {
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_security_error'));
                    }
                    break;
                }
                case cmd.Code.RESULT_ACTIVE_NEW_MOBILE: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResResultActiveMobie(data);
                    if (res.error == 0) {
                        LogEvent.getInstance().sendEventSdt(this.panelSmsPlus.updateEdbPhoneNumber.string.trim());
                        App.instance.alertDialog.showMsg("Thay đổi số điện thoại và kích hoạt bảo mật thành công!");
                        this.onTabChanged();
                    } else {
                        App.instance.alertDialog.showMsg("Thao tác không thành công, vui lòng thử lại sau!");
                    }
                    break;
                }
                case cmd.Code.RESULT_CHANGE_MOBILE_ACTIVED: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResResultActiveMobie(data);
                    if (res.error == 0) {
                        this.showSmsPlusContinue();
                        App.instance.alertDialog.showMsg("Vui lòng nhập mã OTP (Số điện thoại mới) để hoàn tất thay đổi số điện thoại bảo mật!");
                    } else {
                        App.instance.alertDialog.showMsg("Thao tác không thành công, vui lòng thử lại sau!");
                    }
                    break;
                }
                case cmd.Code.SAFES: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResSafes(data);
                    switch (res.error) {
                        case 0:
                            if (this.tabSafes.tabSelectedIdx == 0) {
                                //nap
                            } else if (this.tabSafes.tabSelectedIdx == 1) {
                                //rut
                                App.instance.showLoading(true);
                                MiniGameNetworkClient.getInstance().send(new cmd.ReqSendOTP(this.tabSafes.edbOTP.string.trim(), this.tabSafes.toggleAppOTP.isChecked ? 1 : 0));
                            }
                            break;
                        case 1:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_check_connect'));
                            break;
                        case 2:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_not_enough'));
                            break;
                        default:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_unknown_error'));
                            break;
                    }
                    break;
                }
                case cmd.Code.RESULT_SAFES: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResResultSafes(data);
                    //  //Utils.Log(res);
                    switch (res.error) {
                        case 0:
                            if (this.tabSafes.tabSelectedIdx == 0) {
                                //nap
                                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_action_success'));
                                this.tabSafes.lblBalanceSafes.string = Utils.formatNumber(res.safe);
                                this.tabSafes.edbCoinNap.string = "";
                                Configs.Login.Coin = res.currentMoney;
                                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            } else if (this.tabSafes.tabSelectedIdx == 1) {
                                //rut
                                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_action_success'));
                                this.tabSafes.lblBalanceSafes.string = Utils.formatNumber(res.safe);
                                this.tabSafes.edbCoinRut.string = "";
                                this.tabSafes.edbOTP.string = "";
                                Configs.Login.Coin = res.currentMoney;
                                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            }
                            break;
                        default:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_unknown_error'));
                            break;
                    }
                    break;
                }
            }
        }, this);
    }

    show() {
        super.show();
        this.tabSelectedIdx = 0;
        this.tabs.toggleItems[this.tabSelectedIdx].isChecked = true;
        this.onTabChanged();

        // Global.PopupSecurity.recaptchaVerifier = firebase.auth.RecaptchaVerifier(
        //     "recaptcha-container",
        //     {
        //       size: "normal",
        //       callback: function(response) {
        //         Global.PopupSecurity.submitPhoneNumberAuth();
        //       }
        //     }
        //   );
    }



    actSmsPlusInfo() {
        this.panelSmsPlus.info.active = true;
        this.panelSmsPlus.update.active = false;
        this.panelSmsPlus.continue.active = false;
    }

    actSmsPlusUpdate() {
        this.panelSmsPlus.info.active = false;
        this.panelSmsPlus.update.active = true;
        this.panelSmsPlus.continue.active = false;
        this.panelSmsPlus.updateEdbPhoneNumber.string = "";
    }

    private showSmsPlusContinue() {
        this.panelSmsPlus.info.active = false;
        this.panelSmsPlus.update.active = false;
        this.panelSmsPlus.continue.active = true;
        this.panelSmsPlus.continueEdbOTP.string = "";
    }

    actSmsPlusSubmitUpdateUserInfo() {
        // let phoneNumber = this.panelSmsPlus.updateEdbPhoneNumber.string.trim();
        // if (phoneNumber.length == 0) {
        //     App.instance.alertDialog.showMsg("Số điện thoại không được bỏ trống.");
        //     return;
        // }
        // MiniGameNetworkClient.getInstance().send(new cmd.ReqUpdateUserInfo(phoneNumber));
        this.actGetToken();
    }
    actTeleSafe() {
        // let phoneNumber = this.edbTeleSafe.string.trim();
        // if (phoneNumber.length < 10) {
        //     App.instance.ShowAlertDialog(App.instance.getTextLang('txt_check_phone_number'));
        // }
        // if (phoneNumber[0] === "0") {
        //     phoneNumber = phoneNumber.replace('0', '+84');
        // }
        // let url = Configs.App.API + "?c=2028&nn=%s&at=%s&pn=%s";
        // url = cc.js.formatStr(url, Configs.Login.Nickname, Configs.Login.AccessToken, phoneNumber);
        // var _this = this;
        // this.httpGet(url, (err, res) => {
        //     if (err != null) {
        //         App.instance.ShowAlertDialog(App.instance.getTextLang("txt_error"));
        //         return;
        //     }
        //     App.instance.showLoading(false);
        //     let dataRes = res;
        //     if (dataRes.success == true) {
        //         // _this.actSmsPlusInfo();
        //         // App.instance.ShowAlertDialog(App.instance.getTextLang("txt_check_teleSafe"));

        //     } else {
        //         if (dataRes.message != null && dataRes.message != "") {
        //             App.instance.ShowAlertDialog(dataRes.message);
        //         } else {
        //             App.instance.ShowAlertDialog(App.instance.getTextLang("txt_error"));
        //         }
        //     }

        // });
        App.instance.confirmDialog.show2(App.instance.getTextLang('txt_check_teleSafe'), () => {
            //cc.sys.openURL("https://www.telegram.me/lu88_otp_bot?start=" + Configs.Login.AccessToken + "-" + Configs.Login.Nickname);
        });
        App.instance.confirmDialog.onConfirmClicked = () => {
            cc.sys.openURL("https://www.telegram.me/" + Configs.App.getLinkTelegram() + "?start=" + Configs.Login.AccessToken + "-" + Configs.Login.Nickname);
        };
    }
    actSmsPlusSubmitUpdatePhoneNumber() {
        let phoneNumber = this.panelSmsPlus.updateEdbPhoneNumber.string.trim();
        if (phoneNumber.length == 0) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_phone_input1'));
            return;
        }
        App.instance.showLoading(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqChangePhoneNumber(phoneNumber));

    }

    actSmsPlusSubmitContinuePhoneNumber() {
        if (Global.LobbyController.isUseSDK()) {
            let codeOTP = this.panelSmsPlus.continueEdbOTP.string.trim();
            if (codeOTP == "" || codeOTP.length < 6) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_otp_invalid"));
                return;
            }
            UtilsNative.verifyOTP(codeOTP);
        } else {
            this.actConfirmOtp();
        }

    }

    actSmsPlusActivePhone() {
        App.instance.showLoading(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqActivePhone());
    }

    actSubmitSafesNap() {
        let coin = Utils.stringToInt(this.tabSafes.edbCoinNap.string);
        if (coin <= 0) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_money_amount_invalid'));
            return;
        }
        App.instance.showLoading(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqSafes(coin, 1));
    }

    actSubmitSafesRut() {
        let coin = Utils.stringToInt(this.tabSafes.edbCoinRut.string);
        let otp = this.tabSafes.edbOTP.string;
        if (coin <= 0) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_money_amount_invalid'));
            return;
        }
        if (otp.length == 0) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_otp_blank'));
            return;
        }
        App.instance.showLoading(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqSafes(coin, 0));
    }

    actGetOTP() {
        // App.instance.showLoading(true);
        // MiniGameNetworkClient.getInstance().send(new cmd.ReqGetOTP());
        var phoneNumber = this.panelSmsPlus.updateEdbPhoneNumber.string.trim();
        if (phoneNumber[0] === "0") {
            phoneNumber = phoneNumber.replace('0', '+84');
        }
        this.submitPhoneNumberAuth(phoneNumber);
        this.panelSmsPlus.btnGetOTP.node.active = false;
    }

    actTelegram() {
        App.instance.openTelegram();
    }

    // This function runs when the 'confirm-code' button is clicked
    // Takes the value from the 'code' input and submits the code to verify the phone number
    // Return a user object if the authentication was successful, and auth is complete

    actGetToken() {
        var _this = this;
        var phoneNumber = _this.panelSmsPlus.updateEdbPhoneNumber.string.trim();
        if (phoneNumber[0] === "0") {
            phoneNumber = phoneNumber.replace('0', '+84');
        } else {
            phoneNumber = "+84" + phoneNumber;
        }
        //Utils.Log("actGetToken:" + phoneNumber);
        if (!Global.LobbyController.isUseSDK()) {
            this.showSmsPlusContinue();
            this.submitPhoneNumberAuth(phoneNumber);
        } else {
            App.instance.showLoading(true);
            UtilsNative.verifyPhone(phoneNumber);
        }

    }
    actGetOtpServer(token) {
        let phoneNumber = this.panelSmsPlus.updateEdbPhoneNumber.string.trim();
        let url = Configs.App.API + "?c=2012&nn=%s&pn=%s&cpt=%s&at=%s";
        if (phoneNumber[0] === "0") {
            phoneNumber = phoneNumber.replace('0', '+84');
        }
        url = cc.js.formatStr(url, Configs.Login.Nickname, phoneNumber, token, Configs.Login.AccessToken2);
        let data = Object.create({});
        data.nn = Configs.Login.Nickname;
        data.pn = phoneNumber;
        data.cpt = token;
        var _this = this;
        if (!Global.LobbyController.isUseSDK()) {//tren web van dang dùng tạm qua thằng 2012
            this.httpGet(url, (err, res) => {
                if (err != null) {
                    App.instance.ShowAlertDialog(App.instance.getTextLang("txt_error"));
                    return;
                }
                App.instance.showLoading(false);
                let data = res;
                if (data != {} && data.hasOwnProperty("success") && data.success == true) {
                    _this.sessionInfo = data.data;
                    _this.actGetVerifyCode();
                } else {
                    App.instance.ShowAlertDialog(App.instance.getTextLang("txt_error"));
                }
            });
        } else {//tren native thi bỏ qua 2012 ,Lưu sessionid lại rồi sau khi nhâp otp call luôn 2013;
            App.instance.showLoading(false)
            this.sessionInfo = token;
            this.showSmsPlusContinue();
        }
    }
    actGetVerifyCode(isValidOpt = null) {//send otp lên server
        if (Global.LobbyController.isUseSDK()) {
            if (isValidOpt == "Failed") {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_error"));
                return;
            }
        }
        if (this.sessionInfo == "" || this.panelSmsPlus.continueEdbOTP.string == "") {
            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_otp_invalid"));
            return;
        }
        let codeOTP = this.panelSmsPlus.continueEdbOTP.string.trim();
        let phoneNumber = this.panelSmsPlus.updateEdbPhoneNumber.string.trim();
        if (codeOTP.length < 6) {
            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_otp_invalid"));
            return;
        }
        App.instance.showLoading(true);
        let url = Configs.App.API + "?c=2013&nn=%s&at=%s&pn=%s";
        url = cc.js.formatStr(url, Configs.Login.Nickname, Configs.Login.AccessToken, phoneNumber);
        var _this = this;
        this.httpGet(url, (err, res) => {
            if (err != null) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_error"));
                return;
            }
            App.instance.showLoading(false);
            let dataRes = res;
            if (dataRes.success == true) {
                _this.actSmsPlusInfo();
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_verify_phone_success"));
            } else {
                if (dataRes.message != null && dataRes.message != "") {
                    App.instance.ShowAlertDialog(dataRes.message);
                } else {
                    App.instance.ShowAlertDialog(App.instance.getTextLang("txt_error"));
                }
            }

        });

    }
    actConfirmOtp() {//Dùng thằng firebase để xác thực mã otp gửi lên.Hàm này dùng cho web .Trong native đã có 1 hàm của sdk rồi.
        if (this.panelSmsPlus.continueEdbOTP.string == "") {
            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_otp_invalid"));
            return;
        }
        let codeOTP = this.panelSmsPlus.continueEdbOTP.string.trim();
        if (codeOTP.length < 6) {
            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_otp_invalid"));
            return;
        }
        var _this = this;
        window.confirmationResult.confirm(codeOTP).then((result) => {
            // User signed in successfully.
            //Utils.Log("VERIFY OTP SUCCESS:", result);
            _this.actGetVerifyCode();
            const user = result.user;
        }).catch((error) => {
            //Utils.Log("VERIFY OTP FAILED");
            App.instance.showLoading(false);
            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_error"));
        });
    }
    setupRecaptcha() {
        //Utils.Log("Setup Captchar");
        var _this = this;
        if (window.recaptchaVerifier == null) {
            window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
                "recaptcha-container",
                {
                    size: "invisible",
                    callback: function (response) {
                        //Utils.Log("setupRecaptcha:CB==", response);
                        _this.sessionInfo = response;
                    }
                }
            );
        }

    }
    submitPhoneNumberAuth(phoneNum) {
        this.setupRecaptcha();
        var appVerifier = window.recaptchaVerifier;
        var _this = this;
        firebase.auth().signInWithPhoneNumber(phoneNum, appVerifier).then(function (confirmationResult) {
            //Utils.Log("SMS  Sended");
            window.confirmationResult = confirmationResult;
            App.instance.showLoading(false);
            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_sms_otp_sended"));
        }).catch(function (error) {
            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_error"));
            _this.panelSmsPlus.btnGetOTP.node.active = true;
            App.instance.showLoading(false);
            //Utils.Log("SMS Not Send", error);
        });
    }
    httpGet(url: string, onFinished: (err: any, json: any) => void) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var data = null;
                    var e = null;
                    try {
                        data = JSON.parse(xhr.responseText);
                    } catch (ex) {
                        e = ex;
                    }
                    onFinished(e, data);
                } else {
                    onFinished(xhr.status, null);
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    }
    private onTabChanged() {
        for (let i = 0; i < this.tabContents.childrenCount; i++) {
            this.tabContents.children[i].active = i == this.tabSelectedIdx;
            if (i == this.tabSelectedIdx) {
                //Utils.Log("onTabChanged");
            }
        }
        for (let j = 0; j < this.tabs.toggleItems.length; j++) {
            this.tabs.toggleItems[j].node.getComponentInChildren(cc.Label).node.color = j == this.tabSelectedIdx ? cc.Color.YELLOW : cc.Color.WHITE;
        }
        //Utils.Log("tab selectedidx=" + this.tabSelectedIdx);
        switch (this.tabSelectedIdx) {
            case 0:
                App.instance.showLoading(true);
                MiniGameNetworkClient.getInstance().send(new cmd.ReqGetSecurityInfo());
                break;
            case 1:
                break;
            case 2:
                App.instance.showLoading(true);
                MiniGameNetworkClient.getInstance().send(new cmd.ReqGetSecurityInfo());
                this.tabSafes.tabSelectedIdx = 0;
                this.tabSafes.tabs.toggleItems[this.tabSafes.tabSelectedIdx].isChecked = true;
                this.tabSafes.onTabChanged();
                break;
        }
    }
}
