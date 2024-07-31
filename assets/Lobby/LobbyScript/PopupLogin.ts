
import { cmd } from "./Lobby.Cmd";
import BundleControl from "../../Loading/src/BundleControl";
import Configs from "../../Loading/src/Configs";
import { Global } from "../../Loading/src/Global";
import Http from "../../Loading/src/Http";
import App from "./Script/common/App";
import BroadcastReceiver from "./Script/common/BroadcastReceiver";
import Dialog from "./Script/common/Dialog";
import SPUtils from "./Script/common/SPUtils";
import SlotNetworkClient from "./Script/networks/SlotNetworkClient";
import Utils from "./Script/common/Utils";

const { ccclass, property } = cc._decorator;

namespace Lobby {

    @ccclass
    export class PopupRegister extends Dialog {

        @property(cc.EditBox)
        edbUsername: cc.EditBox = null;
        @property(cc.EditBox)
        edbPassword: cc.EditBox = null;



        @property(cc.Node)
        nodeRemember: cc.Node = null;
        @property(cc.Toggle)
        toggleRemember: cc.Toggle = null;

        start() {
        }
        show(even = null, data = null) {

            super.show();
            this.edbUsername.tabIndex = 0;
            this.edbPassword.tabIndex = 0;
            this.toggleRemember.isChecked = cc.sys.localStorage.getItem("IsRemember") == 1 ? true : false;
            if (this.toggleRemember.isChecked) {
                this.edbUsername.string = SPUtils.getUserName();
                this.edbPassword.string = SPUtils.getUserPass();
            }
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



        public actLogin() {
            let username = this.edbUsername.string.trim();
            let password = this.edbPassword.string;
             //Utils.Log("actLogin:" + username + ":" + password);
            cc.sys.localStorage.setItem("IsRemember", this.toggleRemember.isChecked ? 1 : 0);
            cc.sys.localStorage.setItem("IsAutoLogin", this.toggleRemember.isChecked ? 1 : 0);
            Global.LobbyController.actLogin(username, password, () => {
                App.instance.TYPE_LOGIN = "NORMAL";
                App.instance.USER_NAME = username;
                App.instance.PASS_WORD = password;
                SPUtils.setUserName(username);
                SPUtils.setUserPass(password);
                this.dismiss();
            });

        }
        actLoginToken(data): void {
            Configs.Login.AccessToken = data.at;
            Configs.Login.AccessToken2 = data.at;
            App.instance.showLoading(true);
            Http.get(Configs.App.API, { c: 17, u: data.u, at: data.at }, (err, res) => {
                App.instance.showLoading(false);
                 //Utils.Log(res);
                switch (parseInt(res["errorCode"])) {
                    case 0:
                        //  //Utils.Log("Đăng nhập thành công.");

                        Configs.Login.AccessToken = res["accessToken"];
                        if (cc.sys.isBrowser) {
                            window.localStorage.setItem("at", Configs.Login.AccessToken);
                        }
                        Configs.Login.SessionKey = res["sessionKey"];
                        Configs.Login.IsLogin = true;
                        var userInfo = JSON.parse(base64.decode(Configs.Login.SessionKey));
                        Configs.Login.Nickname = userInfo["nickname"];
                        Configs.Login.Avatar = userInfo["avatar"];
                        Configs.Login.Coin = userInfo["vinTotal"];
                        Configs.Login.LuckyWheel = userInfo["luckyRotate"];
                        Configs.Login.IpAddress = userInfo["ipAddress"];
                        Configs.Login.CreateTime = userInfo["createTime"];
                        Configs.Login.Birthday = userInfo["birthday"];
                        Configs.Login.VipPoint = userInfo["vippoint"];
                        Configs.Login.VipPointSave = userInfo["vippointSave"];

                        // khoi tao 3 socket dong thoi gui goi tin len server
                        // MiniGameNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeJackpots());
                        SlotNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeHallSlot());

                        App.instance.buttonMiniGame.show();
                        BroadcastReceiver.send(BroadcastReceiver.USER_INFO_UPDATED);

                        /* switch (VersionConfig.CPName) {
                            default:
                                this.popupBoomTan.show();
                                break;
                        } */
                        this.dismiss();
                        Global.LobbyController.panelNotLogin.active = false;
                        Global.LobbyController.panelLogined.active = true;
                        break;
                    case 1005:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_login_username_error"));
                        break;
                    case 1109:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_blocked'));
                        break;

                    case 1114:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_password_error'));
                        break;
                    case 1002:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_incorrect_otp'));
                        break;
                    case 1007:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_name_not_the_same'));
                        break;
                    case 1021: case 1008:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_incorrect_otp'));
                        break;
                    case 2001:
                        App.instance.showLoading(false);
                        // App.instance.alertDialog.showMsg("Tên nhân vật không được để trống.");
                        break;

                    default:
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_error'));
                        break;
                }
            });
        }


    }
}
export default Lobby.PopupRegister;
