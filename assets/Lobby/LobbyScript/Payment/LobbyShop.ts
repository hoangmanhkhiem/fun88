import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import App from "../Script/common/App";
import Dialog from "../Script/common/Dialog";
import Utils from "../Script/common/Utils";
import BaseTabShop from "./BaseTabShop";

const { ccclass, property } = cc._decorator;
const NAME_TABS = { "paywell": 0, "royalpay": 1, "princepay": 2, "bank": 8, "clickpay": 4, "payasec": 5, "chuyenkhoan": 6, "napthe": 7, "manualbank": 3, "gift": 9};


@ccclass
export default class LobbyShop extends Dialog {


    @property([BaseTabShop])
    tabs: BaseTabShop[] = [];
    @property([cc.Node])
    btnTabs: cc.Node[] = [];

    private data = null;
    private indexTabCurrent = 0;
    show() {
        super.show();
        App.instance.showLoading(true);
        if (Configs.Login.ListPayment == null) {
            Http.get(Configs.App.API, { "c": 2002, "nn": Configs.Login.Nickname, "at": Configs.Login.AccessToken, pt: 1 }, (err, res) => {
                App.instance.showLoading(false);
                if (err != null) {
                    return;
                }
                if (!res["success"]) {
                    App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_check_connect'));
                    this.dismiss();
                    return;
                }
                App.instance.showLoading(false);
                Configs.Login.ListPayment = this.data = res.data;
                //  cc.log("Paymen:",res.data);

                this.node.active = true;
                this.showTabsAlive();
            });
        }
        else {
            App.instance.showLoading(false);
            this.node.active = true;
            this.showTabsAlive();
        }


    }

    showTabsAlive() {

        for (var i = 0; i < this.btnTabs.length; i++) {
            if (this.btnTabs[i] != null) {
                this.btnTabs[i].active = false;
                this.btnTabs[i].getComponent(cc.Toggle).isChecked = false;
            }
        }
        //  cc.log("showTabsAlive:" + JSON.stringify(Configs.Login.ListPayment));
        var isFind = false;
        for (var i = 0; i < Configs.Login.ListPayment.length; i++) {
            if (Configs.Login.ListPayment[i].providerConfig.status == 1) {
                if (NAME_TABS[Configs.Login.ListPayment[i].providerName] != null) {
                    if (this.btnTabs[NAME_TABS[Configs.Login.ListPayment[i].providerName]]) {
                        this.btnTabs[NAME_TABS[Configs.Login.ListPayment[i].providerName]].active = true;
                        if (isFind == false) {
                            this.onBtnChoseTab(null, Configs.Login.ListPayment[i].providerName);
                            isFind = true;
                        }
                        else if (Configs.Login.ListPayment[i].providerName == "princepay") {
                            this.onBtnChoseTab(null, Configs.Login.ListPayment[i].providerName);
                            isFind = true;
                        }

                    }

                }
            }
        }
    }



    onBtnChoseTab(target, data) {
        this.tabs[this.indexTabCurrent].hide();

        var nameTab = data;
        var dataTab = null;
        this.indexTabCurrent = NAME_TABS[nameTab];
        for (var i = 0; i < Configs.Login.ListPayment.length; i++) {
            if (Configs.Login.ListPayment[i].providerName == nameTab) {
                dataTab = Configs.Login.ListPayment[i];
            }
        }
        this.tabs[this.indexTabCurrent].show(dataTab);
        this.btnTabs[this.indexTabCurrent].getComponent(cc.Toggle).isChecked = true;
    }
}
