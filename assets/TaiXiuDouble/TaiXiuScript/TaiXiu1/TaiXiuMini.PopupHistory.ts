import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import App from "../../../Lobby/LobbyScript/Script/common/App";
import Dialog from "../../../Lobby/LobbyScript/Script/common/Dialog";
import Utils from "../../../Lobby/LobbyScript/Script/common/Utils";


const { ccclass, property } = cc._decorator;

namespace taixiumini {
    @ccclass
    export class PopupHistory extends Dialog {

        @property(cc.Label)
        lblPage: cc.Label = null;

        @property(cc.Node)
        prefab: cc.Node = null;
        @property(cc.ScrollView)
        scroll: cc.ScrollView = null;

        // @property([cc.BitmapFont])
        // fontNumber: cc.BitmapFont[] = [];

        private page: number = 1;
        private maxPage: number = 1;
        private items = new Array<cc.Node>();
        private historyData = [];
        private totalPageLoaded = 0;

        onLoad() {

        }

        show() {
            super.show();
            App.instance.showBgMiniGame("TaiXiu");
            this.historyData = [];
            this.totalPageLoaded = 0;
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].active = false;
            }
        }

        dismiss() {
            super.dismiss();
            this.scroll.content.removeAllChildren();
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

        private loadData(isReloadScr = true) {
            App.instance.showLoading(true);
            Http.get(Configs.App.API, { "c": 100, "p": this.page, "un": Configs.Login.Nickname, "mt": Configs.App.MONEY_TYPE, "txType": 1 }, (err, res) => {
                App.instance.showLoading(false);
                if (err != null) return;
                if (!res["success"]) return;
                //  cc.log("History :" + this.page + " : " + JSON.stringify(res));
                this.totalPageLoaded++;
                this.maxPage = res["totalPages"];
                this.lblPage.string = this.page + "/" + this.maxPage;
                this.loadHistory(res["transactions"]);
            });
        }
        loadHistory(datahistory) {
            //  cc.log("loadHistory:", datahistory);
            this.scroll.content.removeAllChildren();
            for (var i = 0; i < datahistory.length; i++) {
                var node = cc.instantiate(this.prefab);
                node.parent = this.scroll.content;
                this.setItemData(node, datahistory[i]);
            }
        }
        setItemData(item, itemData) {
            let index = itemData['index']
            //item.getChildByName("bg").opacity = index % 2 == 0 ? 255 : 0;
            item.getChildByName("lblSession").getComponent(cc.Label).string = "#" + itemData["referenceId"];
            item.getChildByName("lblTime").getComponent(cc.Label).string = itemData["timestamp"].replace(" ", "\n");
            item.getChildByName("lblBetDoor").getComponent(cc.Label).string = itemData["betSide"] == 1 ? "TÀI" : "XỈU";
            item.getChildByName("lblResult").getComponent(cc.Label).string = itemData["resultPhien"];
            item.getChildByName("lblBet").getComponent(cc.Label).string = Utils.formatNumber(itemData["betValue"]);
            item.getChildByName("lblRefund").getComponent(cc.Label).string = Utils.formatNumber(itemData["totalRefund"]);
            item.getChildByName("lblJackpot").getComponent(cc.Label).string = Utils.formatNumber(itemData["totalJp"]);
            item.getChildByName("lblRefund").getComponent(cc.Label).node.color = itemData['totalRefund'] > 0 ? new cc.Color(240, 191, 11) : new cc.Color(240, 48, 11);
            item.getChildByName("lblWin").getComponent(cc.Label).string = Utils.formatNumber(itemData["totalPrize"]);
            item.getChildByName("lblWin").getComponent(cc.Label).node.color = itemData['totalPrize'] > 0 ? new cc.Color(0,255,0) : new cc.Color(240, 48, 11);
            item.active = true;
        }
        onScrollEvent(scrollview, eventType, customEventData) {
            if (eventType == cc.ScrollView.EventType.SCROLL_TO_BOTTOM) {
                if (this.page < this.maxPage) {
                    this.page++;
                    this.loadData(false);
                }
            }
        }
    }

}
export default taixiumini.PopupHistory;