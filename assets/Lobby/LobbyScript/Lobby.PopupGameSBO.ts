import Configs from "../../Loading/src/Configs";
import Http from "../../Loading/src/Http";
import App from "./Script/common/App";
import Utils from "./Script/common/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupGameSBO extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.y = cc.winSize.height;
    }

    start() {

    }
    show() {
        this.node.active = true;
        cc.tween(this.node).to(0.3, { y: 0 }, { easing: cc.easing.sineIn }).call(() => {
        }).start();
    }
    onClickGame(even, data) {
        let gameName = data;
        switch (data) {
            case "SportsBook":
                break;
            case "Casino":
                break;
            case "Games":
                break;
            case "VirtualSports":
                break;
            case "SeamlessGame":
                break;
            case "ThirdPartySportsBook":
                break;
        }
        Http.get(App.API_SBO, { t: "Login", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken, gc: gameName }, (err, res) => {
             ////Utils.Log("updateInfoSBO:" + JSON.stringify(res));
            App.instance.showLoading(false);
            if (res["res"] == 0) {
                if (Configs.App.IS_PRO == true && Configs.Login.UserType != "2") {
                    var url = "https://mkt.l0030.ig128.com/deposit_processlogin.aspx?lang=vn&token=" + res["data"]["data"];
                    if (cc.sys.isMobile == true) {
                        url = "https://ismart.l0030.ig128.com/deposit_processlogin.aspx?lang=vn&token=" + res["data"]["data"];
                    }
                    cc.sys.openURL(url);

                }
                else {
                    var url = "https:" + res['data'] + "&lang=vi-vn&oddstyle=MY&theme=sbo&device=" + (cc.sys.isNative ? "m" : "d");
                     ////Utils.Log("url=" + url);
                    cc.sys.openURL(url);
                }
            }
            else {
                App.instance.ShowAlertDialog(res["message"]);
            }
        });
    }
    onClickBack() {
        cc.tween(this.node).to(0.3, { y: cc.winSize.height }, { easing: cc.easing.backIn }).call(() => {
            this.node.active = false;
        }).start();
    }

    // update (dt) {}
}
