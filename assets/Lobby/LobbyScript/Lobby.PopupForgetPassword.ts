import Configs from "../../Loading/src/Configs";
import Http from "../../Loading/src/Http";
import App from "./Script/common/App";
import Dialog from "./Script/common/Dialog";
import Utils from "./Script/common/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupForgetPassword extends Dialog {
    @property(cc.Node)
    info: cc.Node = null;
    @property(cc.Node)
    continue: cc.Node = null;

    @property(cc.EditBox)
    edbUsername: cc.EditBox = null;
    @property(cc.EditBox)
    edbCaptcha: cc.EditBox = null;
    @property(cc.Sprite)
    sprCaptcha: cc.Sprite = null;

    @property(cc.EditBox)
    edbOTP: cc.EditBox = null;
    @property(cc.Toggle)
    toggleAppOTP: cc.Toggle = null;

    private captchaId;

    show() {
        super.show();
        this.info.active = true;
        this.continue.active = false;
        this.toggleAppOTP.isChecked = false;
        this.edbCaptcha.string = "";
        this.edbUsername.string = "";
        this.edbOTP.string = "";
        this.actRefreshCaptcha();
    }

    public actRefreshCaptcha() {
        Http.get(Configs.App.API, { "c": 124 }, (err, res) => {
            if (err != null) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_error'));
                return;
            }
            this.captchaId = res["id"];
            Utils.loadSpriteFrameFromBase64(res["img"], (sprFrame) => {
                this.sprCaptcha.spriteFrame = sprFrame;
            });
        });
    }

    actSubmit() {
        let username = this.edbUsername.string.trim();
        let captcha = this.edbCaptcha.string.trim();
        if (username.length == 0) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_username_not_blank'));
            return;
        }
        if (captcha.length == 0) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_otp_blank'));
            return;
        }
        Http.get(Configs.App.API, { "c": 127, "un": username, "cp": captcha, "cid": this.captchaId }, (err, res) => {
            if (err != null) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_unknown_error1'));
                return;
            }
            switch (res["errorCode"]) {
                case "115":
                    this.edbCaptcha.string = "";
                    this.actRefreshCaptcha();
                    App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_incorrect_otp'));
                    break;
                case "116":
                    App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_notify_fast_action'));
                    this.edbCaptcha.string = "";
                    this.actRefreshCaptcha();
                    break;
                case "1001":
                    App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_check_connect'));
                    this.actRefreshCaptcha();
                    break;
                case "1005":
                    App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_not_exsist'));
                    this.edbCaptcha.string = "";
                    this.actRefreshCaptcha();
                    break;
                case "2001":
                    App.instance.alertDialog.showMsg("Hệ thống không hỗ trợ các tài khoản chưa cập nhật Nickname!");
                    this.edbCaptcha.string = "";
                    this.actRefreshCaptcha();
                    break;
                case "1023":
                    this.info.active = false;
                    this.continue.active = true;
                    break;
                default:
                    App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_unknown_error') + "\n" + res["errorCode"]);
                    this.edbCaptcha.string = "";
                    this.actRefreshCaptcha();
                    break;
            }
        });
    }

    actContinue() {
        let username = this.edbUsername.string.trim();
        let otp = this.edbOTP.string.trim();
        if (otp.length == 0) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_otp_blank'));
            return;
        }
        Http.get(Configs.App.API, { "c": 128, "un": username, "otp": otp, "type": (this.toggleAppOTP.isChecked ? 1 : 0) }, (err, res) => {
            if (err != null) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_error'));
                return;
            }
            if (!res["success"]) {
                switch (res["errorCode"]) {
                    case "1001":
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_room_err6'));
                        break;
                    case "1008":
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_incorrect_otp'));
                        break;
                    case "1021":
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_expired_otp'));
                        break;
                    case "1022":
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_expired_otp'));
                        break;
                    case "1114":
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_room_err6'));
                        break;
                    default:
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_unknown_error') + "\n" + res["errorCode"]);
                        break;
                }
                return;
            }
            this.dismiss();
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_change_password_note'));
        });
    }
}
