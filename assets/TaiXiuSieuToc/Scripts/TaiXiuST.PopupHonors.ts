import App from "../../Lobby/LobbyScript/Script/common/App";
import Dialog from "../../Lobby/LobbyScript/Script/common/Dialog";
import ScrollViewControl from "../../Lobby/LobbyScript/Script/common/ScrollViewControl";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import TaiXiuSTNetworkClient from "../../Lobby/LobbyScript/Script/networks/TaiXiuSieuToc.NetworkClient";




const { ccclass, property } = cc._decorator;

namespace TaiXiuSieuToc {
    @ccclass
    export class PopupHonors extends Dialog {
        @property(cc.Node)
        itemTemplate: cc.Node = null;
        @property([cc.SpriteFrame])
        sprRank: cc.SpriteFrame[] = [];
        private items = new Array<cc.Node>();
        @property(ScrollViewControl)
        scrView: ScrollViewControl = null;
        private dataList = [];

        show() {
            super.show();
            App.instance.showBgMiniGame("TaiXiuSieuToc");
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
            TaiXiuSTNetworkClient.getInstance().getTopHonor();
        }
        initData(data) {
            this.dataList = data.slice();
            let cb = (item, itemData) => {
                item.getChildByName("bg").opacity = item['itemID'] % 2 == 0 ? 255 : 0;

                item.getChildByName("lblRank").getComponent(cc.Label).string = (item['itemID'] + 1).toString();
                item.getChildByName("lblAccount").getComponent(cc.Label).string = itemData["loginname"];
                item.getChildByName("lblWin").getComponent(cc.Label).string = Utils.formatNumber(itemData["amount"]);
                if (item['itemID'] < 3) {
                    item.getChildByName("ic_rank").active = true;
                    item.getChildByName("lblRank").active = false;
                    item.getChildByName("ic_rank").getComponent(cc.Sprite).spriteFrame = this.sprRank[itemData['index']];
                    if (itemData['index'] == 2) {
                        item.getChildByName("ic_rank").x = -235.622
                    } else {
                        item.getChildByName("ic_rank").x = -239.622
                    }
                } else {
                    item.getChildByName("ic_rank").active = false;
                    item.getChildByName("lblRank").active = true;
                }
                item.active = true;
            };
            this.scrView.setDataList(cb, this.dataList);
        }
    }


}

export default TaiXiuSieuToc.PopupHonors;