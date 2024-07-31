
import Configs from "../../Loading/src/Configs";
import Http from "../../Loading/src/Http";
import App from "../../Lobby/LobbyScript/Script/common/App";
import Tween from "../../Lobby/LobbyScript/Script/common/Tween";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Slot4History extends cc.Component {
    @property(cc.Node)
    nodeBox:cc.Node = null;
    @property(cc.Label)
    lblPage: cc.Label = null;
    @property(cc.Node)
    itemTemplate: cc.Node = null;

    private page: number = 1;
    private maxPage: number = 1;
    private items = new Array<cc.Node>();

    show() {
        Tween.showPopup(this.nodeBox,this.nodeBox.parent);
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
        if (this.itemTemplate != null) this.itemTemplate.active = false;
        this.page = 1;
        this.maxPage = 1;
        this.lblPage.string = this.page + "/" + this.maxPage;
        this.loadData();
    }

    dismiss() {
        Tween.hidePopup(this.nodeBox,this.nodeBox.parent,false);
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

    private loadData() {
        App.instance.showLoading(true);
        Http.get(Configs.App.API, { "c": 137, "p": this.page, "un": Configs.Login.Nickname, "gn": "TAMHUNG" }, (err, res) => {
            App.instance.showLoading(false);
            if (err != null) return;
            if (!res["success"]) return;

            if (this.items.length == 0) {
                for (var i = 0; i < 7; i++) {
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
                if (i < res["results"].length) {
                    let itemData = res["results"][i];
                    item.getChildByName("Id").getComponent(cc.Label).string = itemData["rf"];
                    item.getChildByName("Time").getComponent(cc.Label).string = itemData["ts"];
                    item.getChildByName("Bet").getComponent(cc.Label).string = Utils.formatNumber(itemData["bv"]);
                    item.getChildByName("Linebet").getComponent(cc.Label).string = itemData["lb"] === "" ? 0 : itemData["lb"].split(",").length;
                    item.getChildByName("Linewin").getComponent(cc.Label).string = itemData["lw"] === "" ? 0 : itemData["lw"].split(",").length;
                    item.getChildByName("Prize").getComponent(cc.Label).string = Utils.formatNumber(itemData["pz"]);
                    item.active = true;
                } else {
                    item.active = false;
                }
            }
        });
    }
}