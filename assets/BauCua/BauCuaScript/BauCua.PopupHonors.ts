import Configs from "../../Loading/src/Configs";
import Http from "../../Loading/src/Http";
import App from "../../Lobby/LobbyScript/Script/common/App";
import Dialog from "../../Lobby/LobbyScript/Script/common/Dialog";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";


const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupHonors extends Dialog {
    @property(cc.Node)
    itemTemplate: cc.Node = null;

    private items = new Array<cc.Node>();

    show() {
        super.show();
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
        if (this.itemTemplate != null) this.itemTemplate.active = false;
    }

    dismiss() {
        super.dismiss();
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
    }

    _onShowed() {
        super._onShowed();
        this.loadData();
    }

    private loadData() {
        App.instance.showLoading(true);
        Http.get(Configs.App.API, { "c": 120, "mt": Configs.App.MONEY_TYPE }, (err, res) => {
            App.instance.showLoading(false);
            if (err != null) return;
            //  cc.log("BauCua rank res : ", JSON.stringify(res));
            if (res["success"]) {
                if (this.items.length == 0) {
                    for (var i = 0; i < 10; i++) {
                        let item = cc.instantiate(this.itemTemplate);
                        item.parent = this.itemTemplate.parent;
                        this.items.push(item);
                    }
                    this.itemTemplate.destroy();
                    this.itemTemplate = null;
                }

                for (let i = 0; i < this.items.length; i++) {
                    let item = this.items[i];
                    if (i < res["topBC"].length) {
                        let itemData = res["topBC"][i];
                        item.getChildByName("bg").opacity = i % 2 == 0 ? 10 : 0;
                        item.getChildByName("Rank").getComponent(cc.Label).string = (i + 1).toString();
                        item.getChildByName("Account").getComponent(cc.Label).string = itemData["username"];
                        item.getChildByName("Win").getComponent(cc.Label).string = Utils.formatNumber(itemData["money"]);
                        item.active = true;
                    } else {
                        item.active = false;
                    }
                }
            }
        });
    }
}
