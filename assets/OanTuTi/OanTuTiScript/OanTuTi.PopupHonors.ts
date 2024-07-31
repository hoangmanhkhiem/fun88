import Configs from "../../Loading/src/Configs";
import App from "../../Lobby/LobbyScript/Script/common/App";
import Dialog from "../../Lobby/LobbyScript/Script/common/Dialogz";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import ShootFishNetworkClient from "../../Lobby/LobbyScript/Script/networks/ShootFishNetworkClient";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupHonors extends Dialog {
    @property(cc.Label)
    lblPage: cc.Label = null;
    @property(cc.Node)
    itemTemplate: cc.Node = null;

    private page: number = 1;
    private maxPage: number = 1;
    private items = new Array<cc.Node>();

    private data: any = null;

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
            this.loadDataLocal();
        }
    }

    actPrevPage() {
        if (this.page > 1) {
            this.page--;
            this.lblPage.string = this.page + "/" + this.maxPage;
            this.loadDataLocal();
        }
    }

    private loadData() {
        App.instance.showLoading(true);
        ShootFishNetworkClient.getInstance().request("OTT4", {
            "userId": Configs.Login.UserIdFish
        }, (res) => {
         //   console.log(res);
            App.instance.showLoading(false);
            if (res["code"] != 200) return;

            if (this.items.length == 0) {
                for (var i = 0; i < 10; i++) {
                    let item = cc.instantiate(this.itemTemplate);
                    item.parent = this.itemTemplate.parent;
                    this.items.push(item);
                }
                this.itemTemplate.destroy();
                this.itemTemplate = null;
            }

            this.data = res["data"];
            this.maxPage = Math.ceil(this.data.length / 10);
            this.page = 1;
            this.loadDataLocal();
        }, this);
    }

    private loadDataLocal() {
        if (this.data == null) return;
        this.lblPage.string = this.page + "/" + this.maxPage;
        let startIdx = (this.page - 1) * 10;
        let count = 10;
        if (startIdx + count > this.data.length) count = this.data.length - startIdx;
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            if (i < count) {
                let itemData = this.data[startIdx + i];
                item.getChildByName("bg").opacity = i % 2 == 0 ? 10 : 0;
                item.getChildByName("Time").getComponent(cc.Label).string = itemData["GameTime"];
                item.getChildByName("Bet").getComponent(cc.Label).string = Utils.formatNumber(itemData["Blind"]);
                item.getChildByName("Player").getComponent(cc.Label).string = itemData["Nickname1"];
                item.getChildByName("Choice").getComponent(cc.Label).string = this.getChoiceName(itemData["Choice1"]);
                item.getChildByName("OtherPlayer").getComponent(cc.Label).string = itemData["Nickname2"];
                item.getChildByName("OtherChoice").getComponent(cc.Label).string = this.getChoiceName(itemData["Choice2"]);
                item.getChildByName("Receive").getComponent(cc.Label).string = itemData["CashChange1"] > itemData["CashChange2"] ? Utils.formatNumber(itemData["CashChange1"]) : Utils.formatNumber(itemData["CashChange2"]);
                item.active = true;
            } else {
                item.active = false;
            }
        }
    }

    //selectValue: 0: kéo, 1: bao, 2: búa
    private getChoiceName(choice: number) {
        switch (choice) {
            case 0:
                return "Kéo";
            case 1:
                return "Bao";
            case 2:
                return "Búa";
        }
    }
}
