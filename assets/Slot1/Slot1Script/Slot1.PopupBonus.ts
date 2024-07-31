
import Dialog from "../../Lobby/LobbyScript/Script/common/Dialog";
import Tween from "../../Lobby/LobbyScript/Script/common/Tween";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import Slot1Controller from "./Slot1.Slot1Controller";

const { ccclass, property } = cc._decorator;
const arr_animation = ["baoliendang", "binhtiendon", "kinhchieuyeu", "quatbatieu", "thap", "vongcankhon"];
@ccclass
export class PopupBonus extends Dialog {
    @property(cc.Node)
    items: cc.Node = null;
    @property(cc.Node)
    nodeBoxNotify: cc.Node = null;
    @property(cc.Label)
    txtNotify: cc.Label = null;
    @property(cc.Label)
    lblLeft: cc.Label = null;

    @property(cc.Label)
    lblHeso: cc.Label = null;
    @property(cc.Label)
    lblWin: cc.Label = null;
    @property([cc.SpriteFrame])
    sprBgItem: cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame])
    sprIcon: cc.SpriteFrame[] = [];
    @property(cc.SpriteFrame)
    sprLight: cc.SpriteFrame = null;
    listRandomIcon = [];
    private factor = 1;
    private left = 0;
    private betValue = 0;
    private onFinished: () => void = null;
    private onSpecialFinished: () => void = null;
    private dataBonus: Array<number> = [];
    private dataSpecial: number = -1;
    private heso: number = 0;
    private win: number = 0;
    private controller: Slot1Controller = null;
    onLoad() {
        this.node.y = cc.winSize.height;
        this.node.opacity = 0;
    }
    start() {
        this.initItem();
        for (let i = 0; i < this.items.childrenCount; i++) {
            let node = this.items.children[i];
            this.resetItem(node);
            node["btn"].node.on("click", () => {
                var value = this.dataBonus[this.dataBonus.length - this.left];
                //  cc.log("click:" + value + " : " + node["is_open"]);
                if (node["is_open"] == false && this.left > 0) {
                    node["is_open"] = true;
                    switch (value) {
                        case 0:
                            this.factor++;
                            node["ske"].spriteFrame = this.sprBgItem[1];
                            node['icon'].node.active = false;
                            node["btn"].node.active = false;
                            this.controller.onBtnSoundTouchBonus(false);
                            break;
                        case 1:
                            node["ske"].spriteFrame = this.sprBgItem[0];
                            node['icon'].spriteFrame = this.sprLight;
                            node["btn"].node.active = false;
                            node["label"].node.active = true;
                            node["label"].string = "0";
                            Tween.numberTo(node["label"], 4 * this.betValue, 0.3);
                            this.win += 4 * this.betValue;
                            Tween.numberTo(this.lblWin, this.win, 0.3);
                            this.controller.onBtnSoundTouchBonus(true);
                            cc.tween(node['label'].node).set({ opacity: 0, x: -100 }).to(0.5, { opacity: 255, x: 0 }, { easing: cc.easing.backOut }).start();
                            break;

                        case 2:
                            node["ske"].spriteFrame = this.sprBgItem[0];
                            node['icon'].spriteFrame = this.sprLight;
                            node["label"].node.active = true;
                            node["label"].string = "0";
                            Tween.numberTo(node["label"], 10 * this.betValue * this.factor, 0.3);
                            this.win += 10 * this.betValue * this.factor;
                            Tween.numberTo(this.lblWin, this.win, 0.3);
                            this.controller.onBtnSoundTouchBonus(true);
                            cc.tween(node['label'].node).set({ opacity: 0, x: -100 }).to(0.5, { opacity: 255, x: 0 }, { easing: cc.easing.backOut }).start();
                            break;
                        case 3:
                            node["ske"].spriteFrame = this.sprBgItem[0];
                            node['icon'].spriteFrame = this.sprLight;
                            node["label"].node.active = true;
                            node["label"].string = "0";
                            Tween.numberTo(node["label"], 15 * this.betValue * this.factor, 0.3);
                            this.win += 15 * this.betValue * this.factor;
                            Tween.numberTo(this.lblWin, this.win, 0.3);
                            this.controller.onBtnSoundTouchBonus(true);
                            cc.tween(node['label'].node).set({ opacity: 0, x: -100 }).to(0.5, { opacity: 255, x: 0 }, { easing: cc.easing.backOut }).start();
                            break;
                        case 4:
                            node["ske"].spriteFrame = this.sprBgItem[0];
                            node['icon'].spriteFrame = this.sprLight;
                            node["label"].node.active = true;
                            node["label"].string = "0";
                            this.win += 20 * this.betValue * this.factor;
                            Tween.numberTo(node["label"], 20 * this.betValue * this.factor, 0.3);
                            Tween.numberTo(this.lblWin, this.win, 0.3);
                            this.controller.onBtnSoundTouchBonus(true);
                            cc.tween(node['label'].node).set({ opacity: 0, x: -100 }).to(0.5, { opacity: 255, x: 0 }, { easing: cc.easing.backOut }).start();
                            break;


                    }
                    this.left--;
                    this.lblLeft.string = "" + this.left;
                    if (this.left <= 0) {
                        this.hidden();
                    }
                }
            });
            let ranIndex = Utils.randomRangeInt(0, this.sprIcon.length);
            node["icon"].spriteFrame = this.sprIcon[ranIndex];
        }
    }
    onDisable() {
    }
    resetItem(node) {
        node["btn"] = node.getChildByName("btn").getComponent(cc.Button);
        node["label"] = node.getChildByName("label").getComponent(cc.Label);
        node["ske"] = node.getChildByName("ske").getComponent(cc.Sprite);
        node["icon"] = node.getChildByName("icon").getComponent(cc.Sprite);
        node["is_open"] = false;
        node["btn"].node.active = true;
        node["icon"].node.active = true;
        node['label'].node.active = false;
        node['ske'].spriteFrame = this.sprBgItem[0];
        let ranIndex = Utils.randomRangeInt(0, this.sprIcon.length);
        node["icon"].spriteFrame = this.sprIcon[ranIndex];
    }
    initItem() {
        for (let i = 0; i < 15; i++) {
            let item = this.items.children[i];
            if (!item) {
                item = cc.instantiate(this.items.children[0]);
                item.parent = this.items;
            }
        }
    }
    showBonus(betValue: number, bonus: string, controller, onFinished: () => void) {
        // super.show();
        this.node.active = true;
        cc.tween(this.node).to(0.3, { y: 0, opacity: 255 }, { easing: cc.easing.sineIn }).start();
        this.controller = controller;
        this.win = 0;
        Tween.numberTo(this.lblWin, this.win, 0.3);
        for (let i = 0; i < this.items.childrenCount; i++) {
            let node = this.items.children[i];
            node["btn"] = node.getChildByName("btn").getComponent(cc.Button);
            node["label"] = node.getChildByName("label").getComponent(cc.Label);
            node["ske"] = node.getChildByName("ske").getComponent(cc.Sprite);
            node["ske"].node.active = true;
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
        this.lblLeft.string = "" + this.left;

        this.heso = this.dataBonus[0];
        this.lblHeso.string = "x" + this.heso;
    }


    hidden() {
        this.controller.onBtnSoundSumary();
        Tween.showPopup(this.nodeBoxNotify, this.nodeBoxNotify.parent);
        Tween.numberTo(this.txtNotify, this.win, 0.3);

    }

    onBtnExit() {
        cc.tween(this.node).to(0.3, { y: cc.winSize.height, opacity: 0 }, { easing: cc.easing.backIn }).call(() => {
            Tween.hidePopup(this.nodeBoxNotify, this.nodeBoxNotify.parent, false);
            for (let i = 0; i < this.items.childrenCount; i++) {
                //  cc.log("chay den i===" + i);
                this.resetItem(this.items.children[i]);
            }
            this.node.active = false;
            this.scheduleOnce(() => {
                this.onFinished();
            }, 1.5);
        }).start();

    }
}
export default PopupBonus;