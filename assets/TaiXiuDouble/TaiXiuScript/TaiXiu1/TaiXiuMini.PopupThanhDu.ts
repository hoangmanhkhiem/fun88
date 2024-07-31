
import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import App from "../../../Lobby/LobbyScript/Script/common/App";
import Dialog from "../../../Lobby/LobbyScript/Script/common/Dialog";
import Utils from "../../../Lobby/LobbyScript/Script/common/Utils";

const { ccclass, property } = cc._decorator;

namespace taixiumini {

    @ccclass
    export class PopupThanhDu extends Dialog {

        @property(cc.SpriteFrame)
        sprTabNormal: cc.SpriteFrame = null;
        @property(cc.SpriteFrame)
        sprTabActive: cc.SpriteFrame = null;
        @property(cc.Node)
        tabs: cc.Node = null;
        @property(cc.Node)
        childTabs: cc.Node = null;
        @property(cc.Node)
        itemTemplate: cc.Node = null;
        @property(cc.Label)
        lblDate: cc.Label = null;

        private selectedTab = 0;
        private selectedChildTab = 0;
        private date = new Date();

        private items = new Array<cc.Node>();

        start() {
            for (let i = 0; i < this.tabs.childrenCount; i++) {
                let tab = this.tabs.children[i];
                tab.on("click", () => {
                    this.selectedTab = i;
                    this.selectedChildTab = 0;
                    this.date = new Date();
                    this.updateTabSpriteFrame();
                    this.loadData();
                });
            }

            for (let i = 0; i < this.childTabs.childrenCount; i++) {
                let tab = this.childTabs.children[i];
                tab.on("click", () => {
                    this.selectedChildTab = i;
                    this.updateTabSpriteFrame();
                    this.loadData();
                });
            }
        }

        dismiss() {
            super.dismiss();
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].active = false;
            }
        }

        show() {
            super.show();
            App.instance.showBgMiniGame("TaiXiu");
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].active = false;
            }
            if (this.itemTemplate != null) this.itemTemplate.active = false;
        }

        _onShowed() {
            super._onShowed();
            this.selectedTab = 0;
            this.selectedChildTab = 0;
            this.updateTabSpriteFrame();
            this.loadData();
        }

        actNext() {
            if (this.selectedTab === 0) {
                this.date.setDate(this.date.getDate() + 1);
            } else {
                this.date.setMonth(this.date.getMonth() + 1);
            }
            this.loadData();
        }

        actPrev() {
            if (this.selectedTab === 0) {
                this.date.setDate(this.date.getDate() - 1);
            } else {
                this.date.setMonth(this.date.getMonth() - 1);
            }
            this.loadData();
        }

        private updateTabSpriteFrame() {
            for (let i = 0; i < this.tabs.childrenCount; i++) {
                let tab = this.tabs.children[i];
                tab.getComponent(cc.Sprite).spriteFrame = this.selectedTab == i ? this.sprTabActive : this.sprTabNormal;
            }
            for (let i = 0; i < this.childTabs.childrenCount; i++) {
                let tab = this.childTabs.children[i];
                tab.getComponent(cc.Sprite).spriteFrame = this.selectedChildTab == i ? this.sprTabActive : this.sprTabNormal;
            }
        }

        private loadData() {
            App.instance.showLoading(true);

            var typeTop = this.selectedChildTab === 0 ? 1 : 0;
            var date = this.selectedTab === 0 ? Utils.dateToYYYYMMdd(this.date) : Utils.dateToYYYYMM(this.date);
            this.lblDate.string = date;
            var params = this.selectedTab === 0 ? { "c": 103, "date": date, "type": typeTop, "txType": 1 } : { "c": 103, "month": date, "type": typeTop, "txType": 1 };
            Http.get(Configs.App.API, params, (err, res) => {
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

                for (let i = 0; i < this.items.length; i++) {
                    let item = this.items[i];
                    if (i < res["results"].length) {
                        let itemData = res["results"][i];
                        item.getChildByName("bg").opacity = i % 2 == 0 ? 10 : 0;
                        item.getChildByName("no").getComponent(cc.Label).string = (i + 1).toString();
                        item.getChildByName("account").getComponent(cc.Label).string = itemData["username"];
                        item.getChildByName("count").getComponent(cc.Label).string = Utils.formatNumber(itemData["number"]);
                        item.getChildByName("winlose").getComponent(cc.Label).string = Utils.formatNumber(itemData["totalMoney"]);
                        item.getChildByName("session").getComponent(cc.Label).string = "#" + itemData["referenceId"];
                        item.getChildByName("award").getComponent(cc.Label).string = itemData["prize"];
                        item.active = true;
                    } else {
                        item.active = false;
                    }
                }
            });
        }
    }
}
export default taixiumini.PopupThanhDu;
