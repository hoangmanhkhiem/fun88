import Configs from "../../Loading/src/Configs";
import Http from "../../Loading/src/Http";
import App from "../../Lobby/LobbyScript/Script/common/App";
import Dialog from "../../Lobby/LobbyScript/Script/common/Dialog";
import ScrollViewControl from "../../Lobby/LobbyScript/Script/common/ScrollViewControl";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import TaiXiuSTNetworkClient from "../../Lobby/LobbyScript/Script/networks/TaiXiuSieuToc.NetworkClient";
import cmd from "./TaiXiuSieuToc.Cmd";


const { ccclass, property } = cc._decorator;

namespace TaiXiuSieuToc {
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
            App.instance.showBgMiniGame("TaiXiuSieuToc");
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
            TaiXiuSTNetworkClient.getInstance().getHistory(this.page - 1, 10, (err, res) => {
                App.instance.showLoading(false);
                if (err != null) {
                    //  cc.log("err:", err);
                    return;
                };
                if (res["message"] != "SUCCES") return;
                // this.totalPageLoaded++;
                this.maxPage = res["totalPages"];
                this.lblPage.string = this.page + "/" + this.maxPage;
                this.loadHistory(res["content"]);
            });
        }
        loadHistory(datahistory) {
            this.scroll.content.removeAllChildren();
            for (var i = 0; i < datahistory.length; i++) {
                var node = cc.instantiate(this.prefab);
                node.parent = this.scroll.content;
                datahistory[i].index = i;
                this.setItemData(node, datahistory[i]);
            }
            this.scroll.scrollToTop(0.3);
        }
        setItemData(item, itemData) {
            let index = itemData['index']
            item.getChildByName("bg").opacity = index % 2 == 0 ? 255 : 0;
            item.getChildByName("lblSession").getComponent(cc.Label).string = "#" + itemData["taixiuId"];
            let time = itemData["bettime"];
            time = time.substr(0, time.indexOf("."));
            item.getChildByName("lblTime").getComponent(cc.Label).string = time.replace("T", "\n");
            item.getChildByName("lblBetDoor").getComponent(cc.Label).string = itemData["typed"] == 1 ? "TÀI" : "XỈU";
            item.getChildByName("lblResult").getComponent(cc.Label).string = itemData["description"] == null ? "Chưa có kết quả" : itemData["description"];
            item.getChildByName("lblBet").getComponent(cc.Label).string = Utils.formatNumber(itemData["betamount"]);
            item.getChildByName("lblRefund").getComponent(cc.Label).string = Utils.formatNumber(itemData["refundamount"]);
            item.getChildByName("lblRefund").getComponent(cc.Label).node.color = itemData['refundamount'] > 0 ? new cc.Color(240, 191, 11) : new cc.Color(240, 48, 11);
            item.getChildByName("lblWin").getComponent(cc.Label).string = Utils.formatNumber(itemData["winamount"]);
            item.getChildByName("lblWin").getComponent(cc.Label).node.color = itemData['winamount'] > 0 ? new cc.Color(240, 191, 11) : new cc.Color(240, 48, 11);
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
export default TaiXiuSieuToc.PopupHistory;