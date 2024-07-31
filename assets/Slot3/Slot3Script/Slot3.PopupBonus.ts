import Dialog from "../../Lobby/LobbyScript/Script/common/Dialog";
import Tween from "../../Lobby/LobbyScript/Script/common/Tween";
import Slot4Controller from "../../Slot4/Slot4Script/Slot4Controller";


const { ccclass, property } = cc._decorator;

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
    @property([cc.Node])
    listItem: cc.Node[] = [];
    private factor = 1;
    private left = 0;
    private betValue = 0;
    private onFinished: () => void = null;
    private onSpecialFinished: () => void = null;
    private dataBonus: Array<number> = [];
    private dataSpecial: number = -1;
    private heso: number = 0;
    private win: number = 0;
    private controller: Slot4Controller = null;
    start() {

        // for (let i = 0; i < this.items.childrenCount; i++) {
        for (let i = 0; i < this.listItem.length; i++) {
            // let node = this.items.children[i];
            let node = this.listItem[i];
            node["btn"] = node.getChildByName("btn").getComponent(cc.Button);
            node["label"] = node.getChildByName("label").getComponent(cc.Label);
            node["shadow"] = node.getChildByName("shadow");
            node["icon"] = node.getChildByName("icon");
            node["factor"] = node.getChildByName("factor");
            node["btn"].node.on("click", () => {
                this.controller.onBtnSoundTouchBonus();
                var value = this.dataBonus[this.dataBonus.length - this.left];
                //  cc.log("click:" + value + " : " + node["is_open"]);
                if (node["is_open"] == false && this.left > 0) {
                    node["is_open"] = true;
                    switch (value) {
                        case 0:
                            this.factor++;
                            node["btn"].node.active = false;
                            node["factor"].active = true;
                            break;
                        case 1:
                            node["btn"].node.active = false;
                            node["icon"].active = true;
                            node["label"].node.active = true
                            node["shadow"].active = true
                            node["label"].string = "0";
                            Tween.numberTo(node["label"], 4 * this.betValue, 0.3);
                            this.win += 4 * this.betValue;
                            Tween.numberTo(this.lblWin, this.win, 0.3);
                            break;

                        case 2:
                            node["btn"].node.active = false;
                            node["icon"].active = true;
                            node["label"].node.active = true
                            node["shadow"].active = true
                            node["label"].string = "0";
                            Tween.numberTo(node["label"], 10 * this.betValue * this.factor, 0.3);
                            this.win += 10 * this.betValue * this.factor;
                            Tween.numberTo(this.lblWin, this.win, 0.3);
                            break;
                        case 3:
                            node["btn"].node.active = false;
                            node["icon"].active = true;
                            node["label"].node.active = true
                            node["shadow"].active = true
                            node["label"].string = "0";
                            Tween.numberTo(node["label"], 15 * this.betValue * this.factor, 0.3);
                            this.win += 15 * this.betValue * this.factor;
                            Tween.numberTo(this.lblWin, this.win, 0.3);
                            break;
                        case 4:
                            node["btn"].node.active = false;
                            node["icon"].active = true;
                            node["label"].node.active = true
                            node["shadow"].active = true
                            node["label"].string = "0";
                            this.win += 20 * this.betValue * this.factor;
                            Tween.numberTo(node["label"], 20 * this.betValue * this.factor, 0.3);
                            Tween.numberTo(this.lblWin, this.win, 0.3);
                            break;


                    }
                    this.left--;
                    this.lblLeft.string = "" + this.left;
                    if (this.left <= 0) {
                        this.hidden();
                    }
                }
            });
        }


    }

    showBonus(betValue: number, bonus: string, controller, onFinished: () => void) {
        // super.show();
        this.node.active = true;
        cc.tween(this.node).set({ y: cc.winSize.height }).to(0.5, { y: 0 }, { easing: cc.easing.sineIn }).start();
        this.controller = controller;
        this.win = 0;
        Tween.numberTo(this.lblWin, this.win, 0.3);
        // for (let i = 0; i < this.items.childrenCount; i++) {
        for (let i = 0; i < this.listItem.length; i++) {
            let node = this.listItem[i];
            node["btn"] = node.getChildByName("btn").getComponent(cc.Button);
            node["icon"] = node.getChildByName("icon");
            node["factor"] = node.getChildByName("factor");
            node["icon"].active = false;
            node["factor"].active = false;
            node["is_open"] = false;
        }
        for (let i = 0; i < this.listItem.length; i++) {
            let node = this.listItem[i];
            let btn = node.getChildByName("btn").getComponent(cc.Button);
            btn.node.active = true;
            btn.interactable = true;
            node.getChildByName("label").active = false;
            node.getChildByName("shadow").active = false;
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
        this.lblHeso.string = this.heso + "";
    }


    hidden() {
        this.controller.onBtnSoundSumary();
        Tween.showPopup(this.nodeBoxNotify, this.nodeBoxNotify.parent);
        Tween.numberTo(this.txtNotify, this.win, 0.3);

    }
    onClickAutoOpen() {
        let randomList = [];
        for (let i = 0; i < this.listItem.length; i++) {
            randomList.push(i);
        }
        randomList.sort(() => Math.random() - 0.5);
        for (let i = 0; i < this.listItem.length; i++) {
            let node = this.listItem[randomList[i]];
            if (this.left > 0) {
                cc.tween(node).delay(0.1 * i).call(() => {
                    node.getChildByName("btn").emit("click");
                }).start();
            }
            // this.controller.onBtnSoundTouchBonus();
            // var value = this.dataBonus[this.dataBonus.length - this.left];
            // if (this.left > 0)
            //     switch (value) {
            //         case 0:
            //             this.factor++;
            //             break;
            //         case 1:
            //             this.win += 4 * this.betValue;
            //             break;
            //         case 2:
            //             this.win += 10 * this.betValue * this.factor;
            //             break;
            //         case 3:
            //             this.win += 15 * this.betValue * this.factor;
            //             break;
            //         case 4:
            //             this.win += 20 * this.betValue * this.factor;
            //             break;
            //     }
            // this.left--;
        }
    }
    onBtnExit() {
        Tween.hidePopup(this.nodeBoxNotify, this.nodeBoxNotify.parent, false);
        this.scheduleOnce(() => {
            // this.dismiss();
            cc.tween(this.node).to(0.5, { y: cc.winSize.height }, { easing: cc.easing.backIn }).call(() => {
                this.node.active = false;
            }).start();
            this.onFinished();
        }, 1.5);
    }
}
export default PopupBonus;