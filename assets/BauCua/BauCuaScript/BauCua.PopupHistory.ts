import Configs from "../../Loading/src/Configs";
import Http from "../../Loading/src/Http";
import App from "../../Lobby/LobbyScript/Script/common/App";
import Dialog from "../../Lobby/LobbyScript/Script/common/Dialog";
import ScrollViewControl from "../../Lobby/LobbyScript/Script/common/ScrollViewControl";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import BauCuaController from "./BauCua.BauCuaController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupHistory extends Dialog {
    @property(ScrollViewControl)
    scrList: ScrollViewControl = null;

    private page: number = 1;
    private maxPage: number = 1;
    private dataHistory = [];
    private totalPageLoaded = 0;
    onLoad() {
        var scrollViewEventHandler = new cc.Component.EventHandler();
        scrollViewEventHandler.target = this.node; // This node is the node to which your event handler code component belongs
        scrollViewEventHandler.component = "BauCua.PopupHistory";// This is the code file name
        scrollViewEventHandler.handler = "onScrollEvent";
        this.scrList.scrollView.scrollEvents.push(scrollViewEventHandler);
    }
    show() {
        super.show();
        this.dataHistory = [];
        this.totalPageLoaded = 0
        this.scrList.setStateItem(false);
    }

    dismiss() {
        super.dismiss();
        this.scrList.setStateItem(false);
    }

    _onShowed() {
        super._onShowed();
        this.page = 1;
        this.maxPage = 1;
        this.loadData();
    }

    actNextPage() {
        if (this.page < this.maxPage) {
            this.page++;
            this.loadData();
        }
    }

    actPrevPage() {
        if (this.page > 1) {
            this.page--;
            this.loadData();
        }
    }

    private loadData(isReloadScr = true) {
        App.instance.showLoading(true);
        Http.get(Configs.App.API, { "c": 121, "mt": Configs.App.MONEY_TYPE, "p": this.page, "un": Configs.Login.Nickname }, (err, res) => {
            App.instance.showLoading(false);
            if (err != null) return;
            if (res["success"]) {
                this.maxPage = res["totalPages"];
                if (this.totalPageLoaded < this.maxPage) {
                    this.dataHistory.push(...res["transactions"]);
                }
                this.totalPageLoaded++;
                let dataHistory = this.dataHistory.slice();
                if (isReloadScr) {
                    this.scrList.setDataList(this.setItemData.bind(this), dataHistory);
                } else {
                    this.scrList.updateDataList(dataHistory);
                }
            }
        });
    }
    setItemData(item, itemData) {
        item.getChildByName("bg").opacity = itemData.index % 2 == 0 ? 10 : 0;
        item.getChildByName("Session").getComponent(cc.Label).string = "#" + itemData["referenceId"];
        item.getChildByName("Time").getComponent(cc.Label).string = itemData["timestamp"];

        let betValues = itemData["betValues"][0] + itemData["betValues"][1] + itemData["betValues"][2] + itemData["betValues"][3] + itemData["betValues"][4] + itemData["betValues"][5];
        item.getChildByName("Bet").getComponent(cc.Label).string = Utils.formatNumber(betValues);

        let prizes = itemData["prizes"][0] + itemData["prizes"][1] + itemData["prizes"][2] + itemData["prizes"][3] + itemData["prizes"][4] + itemData["prizes"][5];
        item.getChildByName("Win").getComponent(cc.Label).string = Utils.formatNumber(prizes);

        let dices = itemData["dices"].split(",");
        let result = item.getChildByName("Result");
        result.children[0].getComponent(cc.Sprite).spriteFrame = BauCuaController.instance.sprResultDices[dices[0]];
        result.children[1].getComponent(cc.Sprite).spriteFrame = BauCuaController.instance.sprResultDices[dices[1]];
        result.children[2].getComponent(cc.Sprite).spriteFrame = BauCuaController.instance.sprResultDices[dices[2]];
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
