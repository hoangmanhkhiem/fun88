
import Configs from "../../Loading/src/Configs";
import { Global } from "../../Loading/src/Global";
import Http from "../../Loading/src/Http";
import App from "./Script/common/App";
import BroadcastReceiver from "./Script/common/BroadcastReceiver";
import Dialog from "./Script/common/Dialog";
import Utils from "./Script/common/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupGiftCode extends Dialog {

    @property(cc.EditBox)
    edbCode: cc.EditBox = null;

    start() {

    }

    show() {
        super.show();
        this.edbCode.string = "";
    }

    actSubmit() {
        let code = this.edbCode.string.trim();
        if (code == "") {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_giftcode_blank'));
            return;
        }
        App.instance.showLoading(true);
        Http.get(Configs.App.API, { c: "19", un: Configs.Login.Nickname, giftcode: code }, (err, res) => {
            App.instance.showLoading(false);
            if (err != null) return;
            //Utils.Log("Giftcode:" + JSON.stringify(res));
            if (res.success == true) {
                Configs.Login.Coin = res.currentMoney;
                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_giftcode_success'));
            }
            else {
                if (res.errorCode == 1) {
                    App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_giftcode_expired'));
                }
                else if (res.errorCode == 2) {
                    App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_giftcode_expired'));
                }
                else if (res.errorCode == 3) {
                    App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_giftcode_not_suitable'));
                }
                else if (res.errorCode == 4) {
                    App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_giftcode_used'));
                }
                else if (res.errorCode == 5) {
                    App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_giftcode_used_event'));
                }
                else if (res.errorCode == 6) {
                    App.instance.alertDialog.showMsgWithOnDismissed(App.instance.getTextLang('txt_giftcode_check_phone'), () => {
                        Global.LobbyController.actSecurity();
                    });
                }
                else if (res.errorCode == 100) {
                    App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_giftcode_incorrect'));
                }
                else {
                    App.instance.alertDialog.showMsg(res.message);

                }
            }
        });
    }
}
