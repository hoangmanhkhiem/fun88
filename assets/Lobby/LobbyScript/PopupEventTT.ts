import Configs from "../../Loading/src/Configs";
import { Global } from "../../Loading/src/Global";
import Http from "../../Loading/src/Http";
import App from "./Script/common/App";
import BroadcastReceiver from "./Script/common/BroadcastReceiver";
import Dialog from "./Script/common/Dialog";
import Utils from "./Script/common/Utils";


const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupEventTT extends Dialog {

    // LIFE-CYCLE CALLBACKS:
    @property([cc.Button])
    listBtn: cc.Button[] = [];
    // onLoad () {}
    dataEvent: any = null;
    listPackage = [];
    start() {
        this.node.zIndex = cc.macro.MAX_ZINDEX;
    }
    showpPopup(data) {
        super.show();
        this.listPackage = [];
        this.dataEvent = data;
        for (let i = 0; i < this.dataEvent['lstMoonEvents'].length; i++) {
            this.listPackage.push(this.dataEvent['lstMoonEvents'][i]);
            if (this.listBtn[i]) {
                this.listBtn[i].clickEvents[0].customEventData = this.dataEvent['lstMoonEvents'][i]['idEvent'];
            }
        }
    }
    onClick(even, data) {
        data = JSON.parse(data)
        let nameCake = "";
        if (data == 11) {
            nameCake = "Bạch Kim";
        } else if (data == 12) {
            nameCake = "Hoàng Kim";
        }
        else if (data == 13) {
            nameCake = "Kim Cương";
        }
        this.node.zIndex = 0;
        App.instance.confirmDialog.show2("Bạn chắc chắn muốn mua\ngói quà " + nameCake + " chứ?", (isConfirm) => {
            if (isConfirm) {
                App.instance.showLoading(true);
                Http.get(Configs.App.API, { "c": 21, "nn": Configs.Login.Nickname, "at": Configs.Login.AccessToken, "id": data }, (err, res) => {
                   //  //Utils.Log("On Buy Moon:", res);
                    App.instance.showLoading(false);
                    if (err) {
                        App.instance.ShowAlertDialog(App.instance.getTextLang("txt_unknown_error1"));
                        return;
                    } else {
                        // //Utils.Log("succes ko dkm:", res.success);

                        if (res.success) {
                            switch (res.errorCode) {
                                case "0":
                                    App.instance.ShowAlertDialog("Chúc mừng bạn đã mua thành công gói quà:" + nameCake);
                                    Configs.Login.Coin = res.money;
                                    BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                                    this.dismiss();
                                    break;
                                case "1":
                                    App.instance.ShowAlertDialog("Bạn đã mua gói quà này,\nVui lòng chọn gói quà khác nhé!");
                                    break;
                                case "2":
                                    App.instance.ShowAlertDialog("Bạn không đủ tiền để mua gói quà này!\nVui lòng liên hệ CSKH để được hướng dẫn.");
                                    break;
                                default:
                                    App.instance.ShowAlertDialog(App.instance.getTextLang("txt_unknown_error1" + res.errorCode));
                                    break;
                            }
                        } else {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_unknown_error1"));
                        }
                    }
                });
            }

        })

    }

    // update (dt) {}
}
