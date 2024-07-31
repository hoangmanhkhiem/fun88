
import Dialog from "../../Lobby/LobbyScript/Script/common/Dialog";
import Tween from "../../Lobby/LobbyScript/Script/common/Tween";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import Slot11Controller from "./Slot11.Slot11Controller";

const { ccclass, property } = cc._decorator;

@ccclass
export class PopupBonus extends cc.Component {
    @property(cc.Node)
    nodeGame1: cc.Node = null;
    @property(cc.Node)
    nodeGame2: cc.Node = null;
    @property(cc.Node)
    nodeNotify: cc.Node = null;
    @property(cc.Node)
    items: cc.Node = null;
    @property(cc.Node)
    itemSpecial: cc.Node = null;
    @property(cc.Node)
    nodeBoxNotify: cc.Node = null;
    @property(cc.Label)
    txtNotify: cc.Label = null;
    @property(cc.Label)
    lblLeft: cc.Label = null;
    @property(cc.Label)
    lblFactor: cc.Label = null;
    @property(cc.Label)
    lblHeso: cc.Label = null;
    @property(cc.Label)
    lblWin: cc.Label = null;
    @property(cc.Node)
    itemTemplate: cc.Node = null;
    @property(cc.Node)
    itemContainer: cc.Node = null;
    @property([cc.SpriteFrame])
    sprItemBg: cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame])
    sprItemBg2: cc.SpriteFrame[] = [];
    private factor = 1;
    private left = 0;
    private betValue = 0;
    private onFinished: () => void = null;
    private onSpecialFinished: () => void = null;
    private dataBonus: Array<number> = [];
    private dataSpecial: number = -1;
    private heso: number = 0;
    private win: number = 0;
    private listFactor = [];
    private controller: Slot11Controller = null;
    private isChooseFactor = false;
    start() {
        cc.log("chay vao start");
        for (let i = 0; i < this.items.childrenCount; i++) {
            let node = this.items.children[i];
            node["btn"] = node.getChildByName("btn").getComponent(cc.Button);
            node["label"] = node.getChildByName("label").getComponent(cc.Label);
            node["ske"] = node.getChildByName("ske").getComponent(cc.Sprite);
            node["btn"].node.active = true;
            node["btn"].node.on("click", () => {
                this.controller.onBtnSoundTouchBonus();
                var value = this.dataBonus[this.dataBonus.length - this.left];
                cc.log("click:" + value + " : " + node["is_open"]);
                if (node["is_open"] == false && this.left > 0) {
                    node["is_open"] = true;
                    switch (value) {
                        case 0:
                            this.factor++;
                            // this.lblFactor.string = this.factor + "";
                            node['ske'].spriteFrame = this.sprItemBg[1];
                            break;
                        case 1:
                            node['ske'].spriteFrame = this.sprItemBg[0];
                            node['lbShadow'].active = true;
                            node["btn"].node.active = false;
                            node["label"].node.active = true;
                            node["label"].string = "0";
                            Tween.numberTo(node["label"], 4 * this.betValue, 0.3);
                            this.win += 4 * this.betValue;
                            Tween.numberTo(this.lblWin, this.win, 0.3);
                            break;

                        case 2:
                            node['ske'].spriteFrame = this.sprItemBg[0];
                            node['lbShadow'].active = true;
                            node["label"].node.active = true;
                            node["label"].string = "0";
                            Tween.numberTo(node["label"], 10 * this.betValue * this.factor, 0.3);
                            this.win += 10 * this.betValue * this.factor;
                            Tween.numberTo(this.lblWin, this.win, 0.3);
                            break;
                        case 3:
                            node['ske'].spriteFrame = this.sprItemBg[0];
                            node['lbShadow'].active = true;
                            node["label"].node.active = true;
                            node["label"].string = "0";
                            Tween.numberTo(node["label"], 15 * this.betValue * this.factor, 0.3);
                            this.win += 15 * this.betValue * this.factor;
                            Tween.numberTo(this.lblWin, this.win, 0.3);
                            break;
                        case 4:
                            node['ske'].spriteFrame = this.sprItemBg[0];
                            node['lbShadow'].active = true;
                            node["label"].node.active = true;
                            node["label"].string = "0";
                            this.win += 20 * this.betValue * this.factor;
                            Tween.numberTo(node["label"], 20 * this.betValue * this.factor, 0.3);
                            Tween.numberTo(this.lblWin, this.win, 0.3);
                            break;


                    }
                    this.left--;
                    this.lblLeft.string = "Lượt: " + this.left;
                    if (this.left <= 0) {
                        this.showResult();
                    }
                }
            });
        }


    }
    initItem() {
        if (this.items.childrenCount < 15) {
            for (let i = 0; i < 14; i++) {
                let item = cc.instantiate(this.itemTemplate);
                item.parent = this.itemContainer;
            }
        }

    }

    showBonus(betValue: number, bonus: string, controller, onFinished: () => void, numberIcon) {
        cc.log("chay vao showbonus");
        this.node.active = true;
        this.nodeGame2.active = true;
        this.nodeGame2.scale = 1.0;
        this.nodeGame2.opacity = 255;
        this.nodeGame1.active = false;
        this.nodeBoxNotify.active = false;
        this.isChooseFactor = false;
        this.initItem();
        this.controller = controller;
        this.win = 0;
        Tween.numberTo(this.lblWin, this.win, 0.3);
        for (let i = 0; i < this.items.childrenCount; i++) {
            let node = this.items.children[i];
            node["btn"] = node.getChildByName("btn").getComponent(cc.Button);
            node["label"] = node.getChildByName("label").getComponent(cc.Label);
            node["ske"] = node.getChildByName("ske").getComponent(cc.Sprite);
            node['ske'].spriteFrame = this.sprItemBg[2];
            node['lbShadow'] = node.getChildByName("shadow_win");
            node['lbShadow'].active = false;
            node["btn"].node.active = true;
            node["label"].node.active = false;
            node["is_open"] = false;
        }
        for (let i = 0; i < this.items.childrenCount; i++) {
            let node = this.items.children[i];
            let btn = node.getChildByName("btn").getComponent(cc.Button);
            btn.node.active = true;
            btn.interactable = true;
            node.getChildByName("label").active = false;
        }
        this.betValue = betValue;
        this.onFinished = onFinished;
        let arrBonus = bonus.split(",");
        this.dataBonus = [];
        for (let i = 0; i < arrBonus.length; i++) {
            this.dataBonus.push(Number(arrBonus[i]));
        }
        this.left = this.dataBonus.length - 1;
        this.factor = 1;
        this.lblLeft.string = "Lượt: " + this.left;
        // this.lblFactor.string = this.factor + "";
        this.heso = this.dataBonus[0];
        this.lblHeso.string = "Hệ số:" + "x" + this.heso;
        switch (numberIcon) {
            case 3:
                this.listFactor = [1, 2, 3];
                break;
            case 4:
                this.listFactor = [2, 3, 4];
                break;
            case 5:
                this.listFactor = [3, 4, 5];
                break;
        }

        this.listFactor.sort(() => Math.random() - 0.5);
        for (let i = 0; i < this.itemSpecial.childrenCount; i++) {
            let itemSpec = this.itemSpecial.children[i];
            itemSpec['is_open'] = false;
            itemSpec.scale = 1.0;
            itemSpec['sprFactor'] = itemSpec.getChildByName("sprFactor").getComponent(cc.Sprite);
            itemSpec['bg'] = itemSpec.getChildByName("ske").getComponent(cc.Sprite);
            itemSpec['bg'].spriteFrame = this.sprItemBg2[0];
            itemSpec['sprFactor'].node.active = false;
            itemSpec['sprFactor'].node.color = cc.Color.WHITE;
        }
        cc.tween(this.node).set({ y: cc.winSize.height }).to(0.5, { y: 0 }, { easing: cc.easing.sineIn }).start();
    }
    onClickFactor(even, data) {
        let btn = even.target;
        let itemParent = btn.parent;
        if (this.isChooseFactor) {
            return;
        }
        this.isChooseFactor = true;

        let cb1 = () => {
            itemParent['is_open'] = true;
            itemParent['sprFactor'].spriteFrame = this.sprItemBg2[this.heso];
            itemParent['bg'].spriteFrame = this.sprItemBg2[6];
            itemParent['sprFactor'].node.active = true;
            for (let i = 0; i < 3; i++) {
                if (this.heso == this.listFactor[i]) {
                    this.listFactor.splice(i, 1);
                    break;
                }
            }
        }
        this.effOpenGift(itemParent, cb1, 1.2);
        this.scheduleOnce(() => {
            let count = 0;
            for (let i = 0; i < this.itemSpecial.childrenCount; i++) {
                let itemSpec = this.itemSpecial.children[i];
                if (!itemSpec['is_open']) {
                    let cb = (() => {
                        itemSpec['bg'].spriteFrame = this.sprItemBg2[6];
                        itemSpec['sprFactor'].spriteFrame = this.sprItemBg2[this.listFactor[count]];
                        itemSpec['sprFactor'].node.active = true;
                        itemSpec['sprFactor'].node.color = cc.Color.GRAY;
                        count++;
                    })
                    this.effOpenGift(itemSpec, cb);
                }

            }
        }, 1.0);
        this.scheduleOnce(() => {
            cc.tween(this.nodeGame2).to(0.3, { scale: 0.8, opacity: 150 }, { easing: cc.easing.backIn }).call(() => {
                this.nodeGame2.active = false;
                this.nodeGame1.active = true;
            }).start();
        }, 4.0)



    }
    effOpenGift(item, cb, scale = 1.0) {
        cc.tween(item)
            .to(0.5, { scale: 0.9 })
            .to(0.5, { scale: scale }, { easing: cc.easing.backOut })
            .start();
        cc.tween(item).delay(0.65).call(() => {
            cb();
        }).start();
    }
    showResult() {
        let lbWin = this.nodeBoxNotify.getChildByName("lbResult").getComponent(cc.Label);
        lbWin.string = this.heso + " x " + Utils.formatNumber(this.win) + " = " + (Utils.formatNumber(this.win*this.heso));
        this.nodeBoxNotify.active = true;
        cc.tween(this.nodeBoxNotify)
            .set({ scale: 0.8, opacity: 150 })
            .to(0.3, { scale: 1.0, opacity: 255 }, { easing: cc.easing.backOut })
            .delay(3.0)
            .call(() => {
                this.hidden();
            })
            .start();
    }
    hidden() {
        cc.tween(this.node).to(0.3, { y: cc.winSize.height }, { easing: cc.easing.sineIn }).call(() => {
            this.node.active = false;
            this.onFinished();
        }).start()
    }

    onBtnExit() {
        Tween.hidePopup(this.nodeBoxNotify, this.nodeBoxNotify.parent, false);
        this.scheduleOnce(() => {
            this.onFinished();
        }, 1.5);
    }
}
export default PopupBonus;