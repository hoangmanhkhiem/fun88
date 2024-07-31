import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import App from "../../../Lobby/LobbyScript/Script/common/App";
import Dialog from "../../../Lobby/LobbyScript/Script/common/Dialog";
import ScrollViewControl from "../../../Lobby/LobbyScript/Script/common/ScrollViewControl";
import Utils from "../../../Lobby/LobbyScript/Script/common/Utils";

const { ccclass, property } = cc._decorator;

namespace taixiumini {
    @ccclass
    export class PopupHonors extends Dialog {
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
            Http.get(Configs.App.API, { "c": 101, "mt": Configs.App.MONEY_TYPE, "txType": 1, "md5": 1 }, (err, res) => {
                App.instance.showLoading(false);
                if (err != null) return;
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
                        if (i < res["topTX"].length) {
                            let itemData = res["topTX"][i];
                            item.getChildByName("bg").opacity = i % 2 == 0 ? 10 : 0;
                            item.getChildByName("lblRank").getComponent(cc.Label).string = (i + 1).toString();
                            item.getChildByName("lblAccount").getComponent(cc.Label).string = itemData["username"];
                            item.getChildByName("lblWin").getComponent(cc.Label).string = Utils.formatNumber(itemData["money"]);
                            if (i == 0) {
                                item.getChildByName("animRank").active = true;
                                item.getChildByName("animRank").getComponent(sp.Skeleton).animation = "Rank1";
                                item.getChildByName("lblAccount").color = cc.Color.RED;
                            } else if (i == 1) {
                                item.getChildByName("animRank").active = true;
                                item.getChildByName("animRank").getComponent(sp.Skeleton).animation = "Rank2";
                                item.getChildByName("lblAccount").color = cc.Color.YELLOW;
                            } else if (i == 2) {
                                item.getChildByName("rank3").active = true;
                                item.getChildByName("lblAccount").color = cc.Color.GREEN;
                            } else {
                                item.getChildByName("lblAccount").color =  new cc.Color(31,112,233);;
                            }
                            item.active = true;
                        } else {
                            item.active = false;
                        }
                    }
                }
            });
        }
    }

}

export default taixiumini.PopupHonors;