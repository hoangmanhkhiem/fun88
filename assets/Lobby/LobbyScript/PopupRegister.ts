
import BundleControl from "../../Loading/src/BundleControl";
import Configs from "../../Loading/src/Configs";
import { Global } from "../../Loading/src/Global";
import Http from "../../Loading/src/Http";
import LogEvent from "../../Loading/src/LogEvent/LogEvent";
import App from "./Script/common/App";
import Dialog from "./Script/common/Dialog";
import Utils from "./Script/common/Utils";

const { ccclass, property } = cc._decorator;

namespace Lobby {

    @ccclass
    export class PopupRegister extends Dialog {

        @property(cc.EditBox)
        edbUsername: cc.EditBox = null;
        @property(cc.EditBox)
        edbCodeDaiLi: cc.EditBox = null;
        @property(cc.EditBox)
        edbPassword: cc.EditBox = null;
        @property(cc.EditBox)
        edbRePassword: cc.EditBox = null;
        @property(cc.EditBox)
        edbCaptcha: cc.EditBox = null;
        @property(cc.Sprite)
        sprCaptcha: cc.Sprite = null;
        @property(cc.RichText)
        txtCodeCheck: cc.RichText = null;
        @property(cc.Button)
        btnRegister: cc.Button = null;


        @property(cc.Button)
        btn_refresh: cc.Button = null;


        private captchaId: string = "";
        start() {
            Global.PopupRegister = this;
        }
        show(even = null, data = null) {
            this.txtCodeCheck.string = "";

            super.show();
            this.edbUsername.tabIndex = 0;
            this.edbPassword.tabIndex = 0;
            this.edbRePassword.tabIndex = -1;
            this.edbCaptcha.tabIndex = -1;
            this.edbCodeDaiLi.tabIndex = -1;
            this.refreshCaptcha();
            if (Configs.App.AGENCY_CODE != "") {
                this.edbCodeDaiLi.string = Configs.App.AGENCY_CODE;
                this.edbCodeDaiLi.node.getComponent(cc.EditBox).enabled = false;
            }

        }

        actCheckCodeDaiLi() {
            if (this.edbCodeDaiLi.string) {
                var repParams = {};
                repParams["c"] = 18;
                repParams["code"] = this.edbCodeDaiLi.string;
                Http.get(Configs.App.API, repParams, (err, res) => {
                     //Utils.Log("actCheckCodeDaiLi:" + JSON.stringify(res));
                    if (res.success == false) {
                        this.txtCodeCheck.string = "<color=#FF2C23>Không hợp lệ</color>";
                    }
                    else {
                        this.txtCodeCheck.string = "<color=#23FF23>Hợp lệ</color>";
                    }
                });
            }
        }
        public actRegister() {
            let _this = this;
            let username = this.edbUsername.string.trim();
            let password = this.edbPassword.string;
            let rePassword = this.edbRePassword.string;
            let captcha = this.edbCaptcha.string;
            if (username.length == 0) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_login_username_not_blank"));
                return;
            }

            if (password.length == 0) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_login_password_not_blank"));
                return;
            }

            if (password != rePassword) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_password_incorrect3'));
                return;
            }

        //    if (captcha.length == 0) {
        //        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_otp_blank'));
        //        return;
        //    }

            App.instance.showLoading(true);
            let reqParams = { "c": 1, "un": username, "pw": md5(password), "cp": captcha, "cid": this.captchaId, "ac": this.edbCodeDaiLi.string };
            if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
                reqParams["utm_source"] = "IOS";
                reqParams["utm_medium"] = "IOS";
                reqParams["utm_term"] = "IOS";
                reqParams["utm_content"] = "IOS";
                reqParams["utm_campaign"] = "IOS";
            } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
                reqParams["utm_source"] = "ANDROID";
                reqParams["utm_medium"] = "ANDROID";
                reqParams["utm_term"] = "ANDROID";
                reqParams["utm_content"] = "ANDROID";
                reqParams["utm_campaign"] = "ANDROID";
            }
            Http.get(Configs.App.API, reqParams, (err, res) => {
                App.instance.showLoading(false);
                if (err != null) {
                    App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_error'));
                    return;
                }
                 //Utils.Log(res);
                if (!res["success"]) {
                    switch (parseInt(res["errorCode"])) {
                        case 1001:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_check_connect'));
                            _this.refreshCaptcha();
                            break;
                        case 101:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_username_error'));
                            _this.refreshCaptcha();
                            break;
                        case 1006:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_exsisted'));
                            _this.refreshCaptcha();
                            break;
                        case 102:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_password_error'));
                            _this.refreshCaptcha();
                            break;
                        case 108:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_name_not_the_same1'));
                            _this.refreshCaptcha();
                            break;
                        case 115:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_incorrect_otp'));
                            break;
                        case 1114:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_room_err6'));
                            _this.refreshCaptcha();
                            break;
                        default:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_error'));
                            break;
                    }
                    return;
                }
                //  //Utils.Log("Dang ky thanh cong ne!");
                LogEvent.getInstance().sendEventSigupSuccess("normal");
                _this.dismiss();
                _this.atcPopupUpdateNickName(username, password);
            });
        }

        public refreshCaptcha() {
            var _this = this;

            let url = Configs.App.API;
            Http.get(url, { "c": 124 }, (err, res) => {
                if (err != null) {
                    App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_error'));
                    return;
                }
                _this.captchaId = res["id"];
                 //Utils.Log("captcha:" + JSON.stringify(res["img"]));
                Utils.loadSpriteFrameFromBase64(res["img"], (sprFrame) => {
                    _this.sprCaptcha.spriteFrame = sprFrame;
                });
            });
        }
        atcPopupUpdateNickName(username, password) {
            let cb = (prefab) => {
                let popupDaily = cc.instantiate(prefab).getComponent("PopupUpdateNickname");
                App.instance.canvas.addChild(popupDaily.node)
                App.instance.popupUpdateNickname = popupDaily;
                App.instance.popupUpdateNickname.show2(username, password);
            }
            BundleControl.loadPrefabPopup("PrefabPopup/PopupUpdateNickname", cb);
        }





    }
}
export default Lobby.PopupRegister;
