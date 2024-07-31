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
        @property([cc.SpriteFrame])
        sprRank: cc.SpriteFrame[] = [];
        private items = new Array<cc.Node>();
        @property(ScrollViewControl)
        scrView: ScrollViewControl = null;
        private dataList = [];
        @property([cc.SpriteFrame])
        sprTopReward: cc.SpriteFrame[] = [];
        @property([cc.SpriteFrame])
        sprTick: cc.SpriteFrame[] = [];

        show() {
            super.show();
            App.instance.showBgMiniGame("TaiXiu");
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
            var sefl = this;
            Http.get(Configs.App.API, { "c": 101, "mt": Configs.App.MONEY_TYPE, "txType": 1 }, (err, res) => {
                App.instance.showLoading(false);
                if (err != null) return;
                if (res["success"]) {
                    //  cc.log("VINH DANH TAI XIU:", res);
                    sefl.dataList = res["topTX"].slice();
                    // if (this.items.length == 0) {
                    //     for (var i = 0; i < 20; i++) {
                    //         let item = cc.instantiate(this.itemTemplate);
                    //         item.parent = this.itemTemplate.parent;
                    //         this.items.push(item);
                    //     }
                    //     this.itemTemplate.destroy();
                    //     this.itemTemplate = null;
                    // }
                    let cb = (item, itemData) => {
                        //item.getChildByName("bg").opacity = item['itemID'] % 2 == 0 ? 255 : 0;

                        item.getChildByName("lblRank").getComponent(cc.Label).string = (item['itemID'] + 1).toString();
                        item.getChildByName("lblAccount").getComponent(cc.Label).string = itemData["username"];
                        item.getChildByName("lblWin").getComponent(cc.Label).string = Utils.formatNumber(itemData["money"]);
                        if (item['itemID'] == 0) {
                            item.getChildByName("lbltongcuoc").getComponent(cc.Label).string = "4 tỷ";
                            item.getChildByName("thuong").getComponent(cc.Sprite).spriteFrame = sefl.sprTopReward[0];
                        } else if (item['itemID'] == 1) {
                            item.getChildByName("lbltongcuoc").getComponent(cc.Label).string = "3.5 tỷ";
                            item.getChildByName("lblthuong").getComponent(cc.Label).string = "120.000.000";
                            item.getChildByName("thuong").getComponent(cc.Sprite).spriteFrame = sefl.sprTopReward[1];
                        } else if (item['itemID'] == 2) {
                            item.getChildByName("lbltongcuoc").getComponent(cc.Label).string = "3 tỷ";
                            item.getChildByName("lblthuong").getComponent(cc.Label).string = "80.000.000";
                            item.getChildByName("thuong").getComponent(cc.Sprite).spriteFrame = sefl.sprTopReward[2];
                        } else if (item['itemID'] == 3) {
                            item.getChildByName("lbltongcuoc").getComponent(cc.Label).string = "2.5 tỷ";
                            item.getChildByName("lblthuong").getComponent(cc.Label).string = "50.000.000";
                            item.getChildByName("thuong").getComponent(cc.Sprite).spriteFrame = sefl.sprTopReward[3];
                        }                          
                        else if (item['itemID'] == 4) {
                            item.getChildByName("lbltongcuoc").getComponent(cc.Label).string = "2 tỷ";
                            item.getChildByName("lblthuong").getComponent(cc.Label).string = "30.000.000";
                            item.getChildByName("thuong").setScale(0.9);
                            item.getChildByName("thuong").getComponent(cc.Sprite).spriteFrame = sefl.sprTopReward[4];
                            item.getChildByName("tongcuoc").getComponent(cc.Sprite).spriteFrame = sefl.sprTick[1];                        
                            item.getChildByName("lblthuong").opacity = 128;
                            item.getChildByName("thuong").opacity = 128;
                        }
                        else if (item['itemID'] < 7) {
                            item.getChildByName("lbltongcuoc").getComponent(cc.Label).string = "1.7 tỷ";
                            item.getChildByName("lblthuong").getComponent(cc.Label).string = "20.000.000";
                            item.getChildByName("thuong").getComponent(cc.Sprite).spriteFrame = sefl.sprTopReward[5];
                            item.getChildByName("thuong").setScale(0.8);
                            if (item['itemID'] === 5) {
                                item.getChildByName("tongcuoc").getComponent(cc.Sprite).spriteFrame = sefl.sprTick[1];
                                item.getChildByName("lblthuong").opacity = 128;
                                item.getChildByName("thuong").opacity = 128;
                            } else {
                                item.getChildByName("tongcuoc").getComponent(cc.Sprite).spriteFrame = sefl.sprTick[0];
                            }
                           
                        }
                        else if (item['itemID'] < 9) {
                            item.getChildByName("lbltongcuoc").getComponent(cc.Label).string = "1.7 tỷ";
                            item.getChildByName("lblthuong").getComponent(cc.Label).string = "15.000.000";
                            item.getChildByName("thuong").getComponent(cc.Sprite).spriteFrame = sefl.sprTopReward[6];
                            item.getChildByName("thuong").setScale(0.8);
                        }
                        else if (item['itemID'] < 13) {
                            item.getChildByName("lbltongcuoc").getComponent(cc.Label).string = "1.5 tỷ";
                            item.getChildByName("lblthuong").getComponent(cc.Label).string = "10.000.000";
                            item.getChildByName("thuong").getComponent(cc.Sprite).spriteFrame = sefl.sprTopReward[7];
                            item.getChildByName("thuong").setScale(0.8);
                            if (item['itemID'] === 11) {
                                item.getChildByName("tongcuoc").getComponent(cc.Sprite).spriteFrame = sefl.sprTick[1];
                                item.getChildByName("lblthuong").opacity = 128;
                                item.getChildByName("thuong").opacity = 128;
                            }
                        }
                        else if (item['itemID'] < 15){
                            item.getChildByName("lbltongcuoc").getComponent(cc.Label).string = "1.5 tỷ";
                            item.getChildByName("lblthuong").getComponent(cc.Label).string = "8.000.000";
                            item.getChildByName("thuong").getComponent(cc.Sprite).spriteFrame = sefl.sprTopReward[8];
                            item.getChildByName("thuong").setScale(0.8);
                            if (item['itemID'] === 14) {
                                item.getChildByName("tongcuoc").getComponent(cc.Sprite).spriteFrame = sefl.sprTick[1];
                                item.getChildByName("lblthuong").opacity = 128;
                                item.getChildByName("thuong").opacity = 128;
                            }
                        } else {
                            if (item['itemID'] === 15) {
                                item.getChildByName("tongcuoc").getComponent(cc.Sprite).spriteFrame = sefl.sprTick[1];
                                item.getChildByName("lblthuong").opacity = 128;
                                item.getChildByName("thuong").opacity = 128;
                            }
                            item.getChildByName("lbltongcuoc").getComponent(cc.Label).string = "1.2 tỷ";
                            item.getChildByName("lblthuong").getComponent(cc.Label).string = "8.000.000";
                            item.getChildByName("thuong").getComponent(cc.Sprite).spriteFrame = sefl.sprTopReward[9];
                            item.getChildByName("thuong").setScale(0.8);
                        }                        
                            
                        if (item['itemID'] < 3) {
                            item.getChildByName("ic_rank").active = true;
                            item.getChildByName("lblRank").active = false;
                            item.getChildByName("ic_rank").getComponent(cc.Sprite).spriteFrame = sefl.sprRank[itemData['index']];
                        } else {
                            item.getChildByName("ic_rank").active = false;
                            item.getChildByName("lblRank").active = true;
                        }
                        item.active = true;
                    };
                    sefl.scrView.setDataList(cb, sefl.dataList);
                    // for (let i = 0; i < this.items.length; i++) {
                    //     let item = this.items[i];
                    //     if (i < res["topTX"].length) {
                    //         let itemData = res["topTX"][i];
                    //         item.getChildByName("bg").opacity = i % 2 == 0 ? 255 : 0;
                    //         item.getChildByName("lblRank").getComponent(cc.Label).string = (i + 1).toString();
                    //         item.getChildByName("lblAccount").getComponent(cc.Label).string = itemData["username"];
                    //         item.getChildByName("lblWin").getComponent(cc.Label).string = Utils.formatNumber(itemData["money"]);
                    //         if (i < 3) {
                    //             item.getChildByName("ic_rank").active = true;
                    //             item.getChildByName("lblRank").active = false;
                    //             item.getChildByName("ic_rank").getComponent(cc.Sprite).spriteFrame = this.sprRank[i];
                    //         } else {
                    //             item.getChildByName("ic_rank").active = false;
                    //             item.getChildByName("lblRank").active = true;
                    //         }
                    //         item.active = true;
                    //     } else {
                    //         item.active = false;
                    //     }
                    // }
                }
            });
        }
    }

}

export default taixiumini.PopupHonors;