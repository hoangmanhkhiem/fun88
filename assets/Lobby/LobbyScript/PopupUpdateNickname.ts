
import Configs from "../../Loading/src/Configs";
import { Global } from "../../Loading/src/Global";
import Http from "../../Loading/src/Http";
import LogEvent from "../../Loading/src/LogEvent/LogEvent";
import cmd from "./Lobby.Cmd";
import App from "./Script/common/App";
import BroadcastReceiver from "./Script/common/BroadcastReceiver";
import Dialog from "./Script/common/Dialog";
import SPUtils from "./Script/common/SPUtils";
import Utils from "./Script/common/Utils";
import MiniGameNetworkClient from "./Script/networks/MiniGameNetworkClient";
import SlotNetworkClient from "./Script/networks/SlotNetworkClient";

const { ccclass, property } = cc._decorator;

namespace Lobby {
    @ccclass
    export class PopupUpdateNickname extends Dialog {

        @property(cc.EditBox)
        edbNickname: cc.EditBox = null;
        @property(cc.EditBox)
        edbInviteCode: cc.EditBox = null;
        @property(cc.Node)
        nodeNotiTele: cc.Node = null;
        @property(cc.Node)
        nodeChangeNickName: cc.Node = null;
        @property(cc.Button)
        btnConfirm: cc.Button = null;
        @property(cc.Label)
        lbTitle: cc.Label = null;


        private username: string = "";
        private password: string = "";
        private at: string = "";
        show() {
            super.show();
            this.edbNickname.string = "";
            this.nodeNotiTele.active = false;
            this.nodeChangeNickName.active = true;
            this.edbInviteCode.string = "";
            if (cc.sys.isBrowser) {
                //  cc.log("URL Game==" + window.location.href);
                let url = window.location.href;
                // let url = "https://play.go88s.fun/?aff=NhungNgao4";
                if (url.includes("aff=")) {
                    let indexOfEqual = url.indexOf("=");
                    let inviteCode = url.substring(indexOfEqual + 1, url.length);
                    this.edbInviteCode.string = inviteCode;
                    this.edbInviteCode.enabled = false;
                }
            }
        }

        public show2(username: string, password: string) {

            this.show();
            this.username = username;
            this.password = password;
            this.at = "";

        }

        public showFb(at) {
            this.show();
            this.at = at;
            this.username = "";
            this.password = "";
        }

        public dismiss() {
            this.node.destroy();
        }

        public actUpdate() {
            let _this = this;
            let nickname = this.edbNickname.string.trim();
            let inviteCode = this.edbInviteCode.string.trim();
            if (nickname.length == 0) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_nickname_not_blank'));
                return;
            }
            if (this.at == "") {
                //normal
                App.instance.showLoading(true);
                Http.get(Configs.App.API, { "c": 5, "un": _this.username, "pw": md5(_this.password), "nn": nickname, "inv": inviteCode }, (err, res) => {
                    App.instance.showLoading(false);
                    if (err != null) {
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_error'));
                        return;
                    }
                    //Utils.Log("Update NickName:" + JSON.stringify(err) + " => " + JSON.stringify(res));
                    if (!res["success"]) {
                        switch (parseInt(res["errorCode"])) {
                            case 1001:
                                App.instance.alertDialog.showMsg("Mất kết nối đến Server!");
                                break;
                            case 1005:
                                App.instance.alertDialog.showMsg("Tài khoản không tồn tại.");
                                break;
                            case 1007:
                                App.instance.alertDialog.showMsg("Mật khẩu không chính xác.");
                                break;
                            case 1109:
                                App.instance.alertDialog.showMsg("Tài khoản đã bị khóa.");
                                break;
                            case 106:
                                App.instance.alertDialog.showMsg("Tên hiển thị không hợp lệ.");
                                break;
                            case 1010:
                            case 1013:
                                App.instance.alertDialog.showMsg("Tên hiển thị đã tồn tại.");
                                break;
                            case 1011:
                                App.instance.alertDialog.showMsg("Tên hiển thị khôn được trùng với tên đăng nhập.");
                                break;
                            case 116:
                                App.instance.alertDialog.showMsg("Không chọn tên hiển thị nhạy cảm.");
                                break;
                            case 1114:
                                App.instance.alertDialog.showMsg("Hệ thống đang bảo trì. Vui lòng quay trở lại sau!");
                                break;
                            default:
                                App.instance.alertDialog.showMsg("Xảy ra lỗi, vui lòng thử lại sau!");
                                break;
                        }
                        return;
                    }
                    else {
                        switch (parseInt(res["errorCode"])) {
                            case 0:
                                App.instance.showLoading(false);
							//	App.instance.showLoading(true);
                
                                //  //Utils.Log("Đăng nhập thành công.");
                                Configs.Login.IsLogin = true;
								Configs.Login.Username = this.username;
                        Configs.Login.Password = this.password;
                                SPUtils.setUserName(_this.username);
                                SPUtils.setUserPass(_this.password);
                                LogEvent.getInstance().sendEventClickShop("vin", 100000);
                                LogEvent.getInstance().sendEventSdt("0123456789");
                                LogEvent.getInstance().sendEventPurchase("vin", 100000);
                                LogEvent.getInstance().sendEventSigupSuccess("normal");
                                LogEvent.getInstance().sendEventLogin("normal")
                                Configs.Login.AccessToken = res["accessToken"];
                                Configs.Login.SessionKey = res["sessionKey"];
                                var userInfo = JSON.parse(base64.decode(Configs.Login.SessionKey));
                                var dataLogin = {};
                                dataLogin["u"] = userInfo["nickname"];
                                dataLogin["at"] = res["accessToken"];
                                Configs.Login.Nickname = userInfo["nickname"];
                                Configs.Login.Avatar = userInfo["avatar"];
                                Configs.Login.Coin = userInfo["vinTotal"];
                                Configs.Login.IpAddress = userInfo["ipAddress"];
                                Configs.Login.CreateTime = userInfo["createTime"];
                                Configs.Login.Birthday = userInfo["birthday"];
                                Configs.Login.Birthday = userInfo["birthday"];
                                Configs.Login.VipPoint = userInfo["vippoint"];
                                Configs.Login.VipPointSave = userInfo["vippointSave"];
								var data = {};
                data["c"] = 2008;
                data["nn"] = Configs.Login.Nickname;
                data["pn"] = 1;
                data["l"] = 10;
                Http.get(Configs.App.API, data, (err, res) => {
                    App.instance.showLoading(false);
                    var list = JSON.parse(res.data).data;
                    Configs.Login.ListBankRut = list;
                });
                                // MiniGameNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeJackpots());
                                SlotNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeHallSlot());
                                BroadcastReceiver.send(BroadcastReceiver.USER_INFO_UPDATED);
                                break;
                        }
                    }
                    // _this.dismiss();
                    this.nodeChangeNickName.active = false;
                    this.nodeNotiTele.active = true;
                    let eventHandler = new cc.Component.EventHandler();
                    eventHandler.target = this.node;
                    eventHandler.component = "PopupUpdateNickname";
                    eventHandler.handler = "onClickConfirm";
                    this.btnConfirm.clickEvents[0] = eventHandler;
                    this.btnConfirm.node.getComponentInChildren(cc.Label).string = App.instance.getTextLang("txt_confirm").toUpperCase();
                    this.lbTitle.string = App.instance.getTextLang("txt_notify").toUpperCase();
                    BroadcastReceiver.send(BroadcastReceiver.UPDATE_NICKNAME_SUCCESS, { "username": _this.username, "password": _this.password });
                });
            }
            else {
                App.instance.showLoading(true);
                Http.get(Configs.App.API, { "c": 5, "s": "fb", "at": this.at, "nn": nickname, "inv": inviteCode }, (err, res) => {
                    App.instance.showLoading(false);
                    if (err != null) {
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_error'));
                        return;
                    }
                    //Utils.Log("Update NickName:" + JSON.stringify(err) + " => " + JSON.stringify(res));
                    if (!res["success"]) {
                        switch (parseInt(res["errorCode"])) {
                            case 1001:
                                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_check_connect'));
                                break;
                            case 1005:
                                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_not_exsist'));
                                break;
                            case 1007:
                                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_password_error'));
                                break;
                            case 1109:
                                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_blocked'));
                                break;
                            case 106:
                                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_nickname_error'));
                                break;
                            case 1010:
                            case 1013:
                                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_nickname_exist'));
                                break;
                            case 1011:
                                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_nickname_error1'));
                                break;
                            case 116:
                                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_nickname_error2'));
                                break;
                            case 1114:
                                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_room_err6'));
                                break;
                            default:
                                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_error'));
                                break;
                        }
                        return;
                    }
                    else {
                        switch (parseInt(res["errorCode"])) {
                            case 0:
                                App.instance.showLoading(false);
                                //  //Utils.Log("Đăng nhập thành công.");
                                Configs.Login.IsLogin = true;
                                LogEvent.getInstance().sendEventClickShop("vin", 100000);
                                LogEvent.getInstance().sendEventSdt("0123456789");
                                LogEvent.getInstance().sendEventPurchase("vin", 100000);
                                LogEvent.getInstance().sendEventSigupSuccess("normal");
                                LogEvent.getInstance().sendEventLogin("normal")
                                Configs.Login.AccessToken = res["accessToken"];
                                Configs.Login.SessionKey = res["sessionKey"];
                                var userInfo = JSON.parse(base64.decode(Configs.Login.SessionKey));
                                var dataLogin = {};
                                dataLogin["u"] = userInfo["nickname"];
                                dataLogin["at"] = res["accessToken"];
                                Configs.Login.Nickname = userInfo["nickname"];
                                Configs.Login.Avatar = userInfo["avatar"];
                                Configs.Login.Coin = userInfo["vinTotal"];
                                Configs.Login.IpAddress = userInfo["ipAddress"];
                                Configs.Login.CreateTime = userInfo["createTime"];
                                Configs.Login.Birthday = userInfo["birthday"];
                                Configs.Login.Birthday = userInfo["birthday"];
                                Configs.Login.VipPoint = userInfo["vippoint"];
                                Configs.Login.VipPointSave = userInfo["vippointSave"];
                                MiniGameNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeJackpots());
                                SlotNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeHallSlot());
                                BroadcastReceiver.send(BroadcastReceiver.USER_INFO_UPDATED);

                                break;
                        }
                    }
                    // _this.dismiss();
                    this.nodeChangeNickName.active = false;
                    this.nodeNotiTele.active = true;
                    let eventHandler = new cc.Component.EventHandler();
                    eventHandler.target = this.node;
                    eventHandler.component = "PopupUpdateNickname";
                    eventHandler.handler = "onClickConfirm";
                    this.btnConfirm.clickEvents[0] = eventHandler;
                    this.btnConfirm.node.getComponentInChildren(cc.Label).string = App.instance.getTextLang("txt_confirm");
                    this.lbTitle.string = App.instance.getTextLang("txt_notify");
                });
            }

        }
        onClickConfirm() {
            this.dismiss();
        }
        showPopupNotiTele() {

        }
    }

}
export default Lobby.PopupUpdateNickname;
