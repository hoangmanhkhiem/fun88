import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import App from "../../../Lobby/LobbyScript/Script/common/App";
import Dialog from "../../../Lobby/LobbyScript/Script/common/Dialog";
import Utils from "../../../Lobby/LobbyScript/Script/common/Utils";
import Tween from "../../../Lobby/LobbyScript/Script/common/Tween";

const { ccclass, property } = cc._decorator;

namespace taixiumini {
    @ccclass
    export class PopupHistory extends Dialog {

        @property(cc.Label)
        lblPage: cc.Label = null;
        @property(cc.Node)
        itemTemplate: cc.Node = null;

        private page: number = 1;
        private maxPage: number = 1;
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

            this.page = 1;
            this.maxPage = 1;
            this.lblPage.string = this.page + "/" + this.maxPage;
            this.loadData();
        }

        actNextPage() {
            if (this.page < this.maxPage) {
                this.page++;
                this.lblPage.string = this.page + "/" + this.maxPage;
                this.loadData();
            }
        }

        actPrevPage() {
            if (this.page > 1) {
                this.page--;
                this.lblPage.string = this.page + "/" + this.maxPage;
                this.loadData();
            }
        }

        private loadData() {
            App.instance.showLoading(true);
            Http.get(Configs.App.API, { "c": 100, "p": this.page, "un": Configs.Login.Nickname, "mt": Configs.App.MONEY_TYPE, "txType": 1 }, (err, res) => {
                App.instance.showLoading(false);
                if (err != null) return;
                if (!res["success"]) return;

                if (this.items.length == 0) {
                    for (var i = 0; i < 10; i++) {
                        let item = cc.instantiate(this.itemTemplate);
                        item.parent = this.itemTemplate.parent;
                        this.items.push(item);
                    }
                    this.itemTemplate.destroy();
                    this.itemTemplate = null;
                }

                this.maxPage = res["totalPages"];
                this.lblPage.string = this.page + "/" + this.maxPage;
                for (let i = 0; i < this.items.length; i++) {
                    let item = this.items[i];
                    if (i < res["transactions"].length) {
                        let itemData = res["transactions"][i];
                        item.getChildByName("bg").opacity = i % 2 == 0 ? 10 : 0;
                        item.getChildByName("lblSession").getComponent(cc.Label).string = "#" + itemData["referenceId"];
                        item.getChildByName("lblTime").getComponent(cc.Label).string = itemData["timestamp"];
                        item.getChildByName("lblBetDoor").getComponent(cc.Label).string = itemData["betSide"] == 1 ? "TÀI" : "XỈU";
                        item.getChildByName("lblResult").getComponent(cc.Label).string = itemData["resultPhien"];
                        item.getChildByName("lblBet").getComponent(cc.Label).string = Utils.formatNumber(itemData["betValue"]);
                        item.getChildByName("lblRefund").getComponent(cc.Label).string = Utils.formatNumber(itemData["totalRefund"]);
                        item.getChildByName("lblWin").getComponent(cc.Label).string = Utils.formatNumber(itemData["totalPrize"]);
                        item.active = true;
                    } else {
                        item.active = false;
                    }
                }
            });
        }
    }
}
export default taixiumini.PopupHistory;