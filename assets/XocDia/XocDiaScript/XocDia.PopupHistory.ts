import Configs from "../../Loading/src/Configs";
import Http from "../../Loading/src/Http";
import App from "../../Lobby/LobbyScript/Script/common/App";
import Dialog from "../../Lobby/LobbyScript/Script/common/Dialog";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";



const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupTransaction extends Dialog {
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    prefab: cc.Node = null;
    
    @property(cc.Label)
    lblPage: cc.Label = null;



    @property([cc.BitmapFont])
    fontNumber: cc.BitmapFont[] = [];

    private page: number = 1;
    private maxPage: number = 1;
    private items = new Array<cc.Node>();
    private data = null;
    private dataPlay = [];
    private dataCashout = [];
    private dataExchange = [];
    private currentData = [];
    private totalPageLoaded = 0;
    onLoad() {

    }
    start() {

       
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

    show() {
        super.show();
        this.resetDataLoaded();
        this.currentData = [];
        this.data

        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
    }
    resetDataLoaded() {
        this.totalPageLoaded = 0;
        this.currentData = [];
        this.dataCashout = [];
        this.dataPlay = [];
        this.dataExchange = [];
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
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

   

    loadPage(res) {
        this.content.removeAllChildren();
        for (let i = 0; i < 13; i++) {
            var indexData = i;

            if (indexData < res["transactions"].length) {
                let item = cc.instantiate(this.prefab);
                item.parent = this.content;
                let itemData = res["transactions"][indexData];
                var json = JSON.parse(itemData["description"]);
                item.getChildByName("Trans").getComponent(cc.Label).string = itemData["transId"];
                item.getChildByName("Time").getComponent(cc.Label).string = itemData["transactionTime"];
                item.getChildByName("Service").getComponent(cc.Label).string = json["roomID"];
                item.getChildByName("Coin").getComponent(cc.Label).string = (itemData["moneyExchange"] > 0 ? "+" : "") + Utils.formatNumber(itemData["moneyExchange"]);
                item.getChildByName("Balance").getComponent(cc.Label).string = Utils.formatNumber(itemData["currentMoney"]);
                item.getChildByName("Coin").getComponent(cc.Label).font = itemData["moneyExchange"] > 0 ? this.fontNumber[0] : this.fontNumber[1];
                item.getChildByName("Coin").getComponent(cc.Label).fontSize = itemData["moneyExchange"] > 0 ? 15 : 15;

                var pos =  item.getChildByName("Coin").getComponent(cc.Label).node.position;
                item.getChildByName("Coin").getComponent(cc.Label).node.position = itemData["moneyExchange"] > 0 ? cc.v3(pos.x,15,0) : cc.v3(pos.x,5,0);

            }
        }
    }


    private loadData(isReloadScr = true) {
        App.instance.showLoading(true);
        let params = null;
        params = { "c": 140, "un": Configs.Login.Nickname, "p": this.page };
        //  cc.log("HistoryTienLen request:"+JSON.stringify(params));
        Http.get(Configs.App.API, params, (err, res) => {
            App.instance.showLoading(false);
            //  cc.log("HistoryTienLen response:"+JSON.stringify(res));
            if (err != null) {

                return;
            }
            if (res["success"]) {
                this.maxPage = res["totalPages"];
                this.totalPageLoaded++;
                this.data = res;
                let transactionData = res['transactions'];
                //  cc.log("transactionData:" + JSON.stringify(transactionData));
                if (this.totalPageLoaded < this.maxPage) {
                    this.dataPlay.push(...transactionData);
                    this.currentData = this.dataPlay;
                }
               
                this.maxPage = res["totalPages"];
                this.lblPage.string = this.page + "/" + this.maxPage;
                this.loadPage(res);

            } else {
                this.content.removeAllChildren();
            }
        });
    }
   
    private setDataItem(item, itemData) {
        var json = JSON.parse(itemData["description"]);
        item.getChildByName("Trans").getComponent(cc.Label).string = itemData["transId"];
        item.getChildByName("Time").getComponent(cc.Label).string = itemData["transactionTime"];
        item.getChildByName("Service").getComponent(cc.Label).string = json["roomID"];
        item.getChildByName("Coin").getComponent(cc.Label).string = (itemData["moneyExchange"] > 0 ? "+" : "") + Utils.formatNumber(itemData["moneyExchange"]);
        item.getChildByName("Coin").getComponent(cc.Label).font = itemData["moneyExchange"] > 0 ? this.fontNumber[0] : this.fontNumber[1];
        item.getChildByName("Coin").getComponent(cc.Label).fontSize = itemData["moneyExchange"] > 0 ? 8 : 7;
        item.getChildByName("Balance").getComponent(cc.Label).string = Utils.formatNumber(itemData["currentMoney"]);
        item.getChildByName("Desc").getComponent(cc.RichText).string = itemData["description"];
        item.active = true;
    }
    convertNameThirdParty(serviceName) {
        switch (serviceName) {
            case "WM_DEPOSIT":
            case "WM_WITHDRAW":
                return "Live casino WM";
            case "IBC2_DEPOSIT":
            case "IBC2_WITHDRAW":
                return "Thể Thao IBC";
            case "AG_DEPOSIT":
            case "AG_WITHDRAW":
                return "Live casino AG";
            case "CMD_DEPOSIT":
            case "CMD_WITHDRAW":
                return "Thể thao CMD368";
            case "Cashout":
                return "Rút tiền";
            case "190":
                return "Tài Xỉu Siêu Tốc";
            default:
                return serviceName
        }
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
