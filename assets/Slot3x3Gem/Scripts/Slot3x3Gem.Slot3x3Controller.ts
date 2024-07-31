import cmd from "./Slot3x3Gem.Cmd";
import PopupSelectLine from "./Slot3x3Gem.PopupSelectLine";

import Configs from "../../Loading/src/Configs";
import MiniGame from "../../Lobby/LobbyScript/MiniGame";
import BroadcastReceiver from "../../Lobby/LobbyScript/Script/common/BroadcastReceiver";
import Tween from "../../Lobby/LobbyScript/Script/common/Tween";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import MiniGameNetworkClient from "../../Lobby/LobbyScript/Script/networks/MiniGameNetworkClient";
import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import App from "../../Lobby/LobbyScript/Script/common/App";
import PopupHistory from "./Slot3x3Gem.PopupHistory";
import PopupHonors from "./Slot3x3Gem.PopupHonors";

const { ccclass, property } = cc._decorator;

@ccclass("Slot3x3Gem.ButtonBet")
export class ButtonBet {
    @property(cc.Button)
    button: cc.Button = null;
    @property(cc.SpriteFrame)
    sfNormal: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sfActive: cc.SpriteFrame = null;

    _isActive = false;

    setActive(isActive: boolean) {
        this._isActive = isActive;
        this.button.getComponent(cc.Sprite).spriteFrame = isActive ? this.sfActive : this.sfNormal;
        this.button.interactable = !isActive;
    }
}

@ccclass
export default class Slot3x3GemController extends MiniGame {

    @property(cc.Node)
    itemTemplate: cc.Node = null;
    @property(cc.Node)
    popupContainer: cc.Node = null;
    @property([ButtonBet])
    buttonBets: ButtonBet[] = [];
    @property(cc.Node)
    columns: cc.Node = null;
    @property(cc.Node)
    linesWin: cc.Node = null;
    @property(cc.Button)
    btnSpin: cc.Button = null;
    @property(cc.Button)
    btnLine: cc.Button = null;
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(cc.Button)
    btnAuto: cc.Button = null;
    @property(cc.SpriteFrame)
    sfAuto0: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sfAuto1: cc.SpriteFrame = null;
    @property(cc.Button)
    btnBoost: cc.Button = null;
    @property(cc.SpriteFrame)
    sfBoost0: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sfBoost1: cc.SpriteFrame = null;
    @property(cc.Label)
    lblJackpot: cc.Label = null;
    @property(cc.Node)
    lblWinCash: cc.Node = null;
    @property(cc.Label)
    lblToast: cc.Label = null;
    @property(cc.Node)
    effectJackpot: cc.Node = null;
    @property(cc.Node)
    effectBigWin: cc.Node = null;
    @property(cc.Label)
    lbTotalLine: cc.Label = null;
    @property(PopupSelectLine)
    popupSelectLine: PopupSelectLine = null;
    @property([cc.Node])
    public popups: cc.Node[] = [];

    private rollStartItemCount = 15;
    private rollAddItemCount = 10;
    private spinDuration = 1.2;
    private addSpinDuration = 0.3;
    private itemHeight = 0;
    private betIdx = 0;
    private listBet = [100, 1000, 10000];
    private arrLineSelect = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    private isSpined = true;
    private isBoost = false;
    private isAuto = false;
    private isCanChangeBet = true;
    private lastSpinRes: cmd.ReceiveSpin = null;
    private popupGuide = null;
    private popupHistory: PopupHistory = null;
    private popupHonor: PopupHonors = null;
    start() {
        this.itemHeight = this.itemTemplate.height;
        for (let i = 0; i < this.columns.childrenCount; i++) {
            let column = this.columns.children[i];
            let count = this.rollStartItemCount + i * this.rollAddItemCount;
            for (let j = 0; j < count; j++) {
                let item = cc.instantiate(this.itemTemplate);
                item.parent = column;
                if (j >= 3) {
                    item.getComponent('Slot3x3Gem.ItemSlot').id = Utils.randomRangeInt(0, 6);
                    item.getComponent('Slot3x3Gem.ItemSlot').setBlur();
                } else {
                    item.getComponent('Slot3x3Gem.ItemSlot').setId(Utils.randomRangeInt(0, 6));
                }
            }
        }
        this.itemTemplate.removeFromParent();
        this.itemTemplate = null;

        for (let i = 0; i < this.buttonBets.length; i++) {
            var btn = this.buttonBets[i];
            btn.setActive(i == this.betIdx);
            btn.button.node.on("click", () => {
                App.instance.showBgMiniGame("Slot3x3Gem");
                if (!this.isCanChangeBet) {
                    this.showToast(App.instance.getTextLang('txt_notify_fast_action'));
                    return;
                }
                let oldIdx = this.betIdx;
                this.betIdx = i;
                for (let i = 0; i < this.buttonBets.length; i++) {
                    this.buttonBets[i].setActive(i == this.betIdx);
                }
                this.isCanChangeBet = false;
                this.scheduleOnce(() => {
                    this.isCanChangeBet = true;
                }, 1);
                MiniGameNetworkClient.getInstance().send(new cmd.SendChangeRoom(oldIdx, this.betIdx));
            });
        }

        this.btnAuto.node.on("click", () => {
            this.isAuto = !this.isAuto;
            App.instance.showBgMiniGame("Slot3x3Gem");
            if (this.isAuto) {
                if (this.isSpined) this.actSpin();
                this.btnBoost.interactable = false;
                this.btnAuto.getComponent(cc.Sprite).spriteFrame = this.sfAuto1;
            } else {
                this.btnBoost.interactable = true;
                this.btnAuto.getComponent(cc.Sprite).spriteFrame = this.sfAuto0;
                if (this.isSpined) {
                    this.setEnabledAllButtons(true);
                }
            }
        });

        this.btnBoost.node.on("click", () => {
            this.isBoost = !this.isBoost;
            App.instance.showBgMiniGame("Slot3x3Gem");
            if (this.isBoost) {
                if (this.isSpined) this.actSpin();
                this.btnAuto.interactable = false;
                this.btnBoost.getComponent(cc.Sprite).spriteFrame = this.sfBoost1;
            } else {
                this.btnAuto.interactable = true;
                this.btnBoost.getComponent(cc.Sprite).spriteFrame = this.sfBoost0;
                if (this.isSpined) {
                    this.setEnabledAllButtons(true);
                }
            }
        });



        BroadcastReceiver.register(BroadcastReceiver.USER_LOGOUT, () => {
            if (!this.node.active) return;
            this.dismiss();
        }, this);

        MiniGameNetworkClient.getInstance().addOnClose(() => {
            if (!this.node.active) return;
            this.dismiss();
        }, this);

        MiniGameNetworkClient.getInstance().addListener((data: Uint8Array) => {
            if (!this.node.active) return;
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.UPDATE_JACKPOT: {
                    let res = new cmd.ReceiveUpdateJackpot(data);
                    Tween.numberTo(this.lblJackpot, res.value, 0.3);
                    break;
                }
                case cmd.Code.SPIN: {
                    let res = new cmd.ReceiveSpin(data);
                    this.onSpinResult(res);
                    break;
                }
            }
        }, this);
    }

    show() {
        if (this.node.active) {
            this.reOrder();
            return;
        }
        App.instance.showBgMiniGame("Slot3x3Gem");
        super.show();
        this.lblToast.node.parent.active = false;
        this.lblWinCash.parent.active = false;

        for (let i = 0; i < this.linesWin.childrenCount; i++) {
            this.linesWin.children[i].active = false;
        }

        this.isSpined = true;
        this.isCanChangeBet = true;
        this.betIdx = 0;
        for (let i = 0; i < this.buttonBets.length; i++) {
            this.buttonBets[i].setActive(i == this.betIdx);
        }

        MiniGameNetworkClient.getInstance().send(new cmd.SendScribe(this.betIdx));
    }

    dismiss() {
        super.dismiss();
        for (let i = 0; i < this.popups.length; i++) {
            this.popups[i].active = false;
        }
        App.instance.hideGameMini("Slot3x3Gem");
        MiniGameNetworkClient.getInstance().send(new cmd.SendUnScribe(this.betIdx));
    }

    public reOrder() {
        super.reOrder();

    }

    actSpin(even=null) {
        if (!this.isSpined) {
            this.showToast(App.instance.getTextLang('txt_notify_fast_action'));
            return;
        }
        if(even!=null){
            App.instance.showBgMiniGame("Slot3x3Gem");
        }
        this.isSpined = false;
        this.stopAllEffects();
        this.stopShowLinesWin();
        this.setEnabledAllButtons(false);
        for (var i = 0; i < this.buttonBets.length; i++) {
            this.buttonBets[i].button.interactable = false;
        }
        MiniGameNetworkClient.getInstance().send(new cmd.SendSpin(this.listBet[this.betIdx], this.arrLineSelect.toString()));
    }

    private setEnabledAllButtons(isEnabled: boolean) {
        this.btnSpin.interactable = isEnabled;
        this.btnClose.interactable = isEnabled;
        this.btnLine.interactable = isEnabled;
        this.btnSpin.node.getComponentInChildren(sp.Skeleton).node.active = isEnabled;
    }

    private showToast(message: string) {
        this.lblToast.string = message;
        let parent = this.lblToast.node.parent;
        parent.stopAllActions();
        parent.active = true;
        parent.opacity = 0;
        parent.runAction(cc.sequence(cc.fadeIn(0.1), cc.delayTime(2), cc.fadeOut(0.2), cc.callFunc(() => {
            parent.active = false;
        })));
    }

    private onSpinResult(res: cmd.ReceiveSpin) {
        //  cc.log(res);
        var _this = this;

        var resultSuccess = [0, 1, 2, 3, 4, 5, 6];
        if (resultSuccess.indexOf(res.result) < 0) {
            this.scheduleOnce(function () {
                this.isSpined = true;
            }, 1);
            this.setEnabledAllButtons(true);
            for (var i = 0; i < this.buttonBets.length; i++) {
                this.buttonBets[i].button.interactable = true;
            }

            this.isAuto = false;
            this.btnAuto.interactable = true;
            this.btnAuto.getComponent(cc.Sprite).spriteFrame = this.sfAuto0;

            this.isBoost = false;
            this.btnBoost.interactable = true;
            this.btnBoost.getComponent(cc.Sprite).spriteFrame = this.sfBoost0;

            switch (res.result) {
                case 102:
                    this.showToast(App.instance.getTextLang('txt_not_enough'));
                    break;
                default:
                    this.showToast(App.instance.getTextLang('txt_unknown_error1'));
                    break;
            }
            return;
        }

        Configs.Login.Coin -= this.listBet[this.betIdx] * this.arrLineSelect.length;
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
        Configs.Login.Coin = res.currentMoney;
        // this.node.scale=0.2;
        this.lastSpinRes = res;
        let matrix = res.matrix.split(",");
        let timeScale = this.isBoost ? 0.5 : 1;
        for (let i = 0; i < this.columns.childrenCount; i++) {
            let roll = this.columns.children[i];
            let step1Pos = this.itemHeight * 0.3;
            let step2Pos = -this.itemHeight * roll.childrenCount + this.itemHeight * 3 - this.itemHeight * 0.3;
            let step3Pos = -this.itemHeight * roll.childrenCount + this.itemHeight * 3;
            roll.runAction(cc.sequence(
                cc.delayTime(0.2 * i * timeScale),
                cc.moveTo(0.2 * timeScale, cc.v2(roll.getPosition().x, step1Pos)).easing(cc.easeQuadraticActionOut()),
                cc.moveTo((this.spinDuration + this.addSpinDuration * i) * timeScale, cc.v2(roll.getPosition().x, step2Pos)).easing(cc.easeQuadraticActionInOut()),
                cc.moveTo(0.2 * timeScale, cc.v2(roll.getPosition().x, step3Pos)).easing(cc.easeQuadraticActionIn()),
                cc.callFunc(() => {
                    roll.setPosition(cc.v2(roll.getPosition().x, 0));
                    if (i === this.columns.childrenCount - 1) {
                        _this.spined();
                    }
                })
            ));
            roll.runAction(cc.sequence(
                cc.delayTime((0.7 + 0.2 * i) * timeScale),
                cc.callFunc(() => {
                    let children = roll.children;
                    children[2].getComponent("Slot3x3Gem.ItemSlot").setId(parseInt(matrix[i]));
                    children[1].getComponent("Slot3x3Gem.ItemSlot").setId(parseInt(matrix[3 + i]));
                    children[0].getComponent("Slot3x3Gem.ItemSlot").setId(parseInt(matrix[6 + i]));
                    let itemBlur1 = children[children.length - 1].getComponent("Slot3x3Gem.ItemSlot");
                    let itemBlur2 = children[children.length - 2].getComponent("Slot3x3Gem.ItemSlot");
                    let itemBlur3 = children[children.length - 3].getComponent("Slot3x3Gem.ItemSlot")

                    itemBlur1.setId(parseInt(matrix[i]));
                    itemBlur2.setId(parseInt(matrix[3 + i]));
                    itemBlur3.setId(parseInt(matrix[6 + i]));

                })
            ));
        }
    }

    private spined() {
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
        this.isSpined = true;
        if (!this.isAuto && !this.isBoost) this.setEnabledAllButtons(true);
        switch (this.lastSpinRes.result) {
            case 0://k an
                this.showLineWins();
                break;
            case 1:// thang thuong
                this.showLineWins();
                break;
            case 2:// thang lon
                this.showEffectBigWin(this.lastSpinRes.prize, () => this.showLineWins());
                break;
            case 3://jackpot
            case 4:
                this.showEffectJackpot(this.lastSpinRes.prize, () => this.showLineWins());
                break;
            case 6://thang sieu lon
                this.showEffectBigWin(this.lastSpinRes.prize, () => this.showLineWins());
                break;
        }
    }

    private showEffectBigWin(cash: number, cb: () => void) {
        this.effectBigWin.stopAllActions();
        this.effectBigWin.active = true;
        let label = this.effectBigWin.getComponentInChildren(cc.Label);
        label.node.active = false;

        this.effectBigWin.runAction(cc.sequence(
            cc.delayTime(1),
            cc.callFunc(() => {
                label.string = "";
                label.node.active = true;
                Tween.numberTo(label, cash, 1);
            }),
            cc.delayTime(3),
            cc.callFunc(() => {
                this.effectBigWin.active = false;
                if (cb != null) cb();
            })
        ));
    }

    private showEffectJackpot(cash: number, cb: () => void = null) {
        this.effectJackpot.stopAllActions();
        this.effectJackpot.active = true;
        let label = this.effectJackpot.getComponentInChildren(cc.Label);
        label.node.active = false;

        this.effectJackpot.runAction(cc.sequence(
            cc.delayTime(1),
            cc.callFunc(() => {
                label.string = "";
                label.node.active = true;
                Tween.numberTo(label, cash, 1);
            }),
            cc.delayTime(3),
            cc.callFunc(() => {
                this.effectJackpot.active = false;
                if (cb != null) cb();
            })
        ));
    }

    private showWinCash(coin: number) {
        let parent = this.lblWinCash.parent;
        let label = this.lblWinCash.getComponent(cc.Label);
        parent.stopAllActions();
        parent.active = true;
        label.string = "0";
        parent.opacity = 0;
        parent.runAction(cc.sequence(
            cc.fadeIn(0.3),
            cc.callFunc(() => {
                Tween.numberTo(label, coin, 0.5);
            }),
            cc.delayTime(1.5),
            cc.fadeOut(0.3),
            cc.callFunc(() => {
                parent.active = false;
            })
        ));
    }

    private stopAllEffects() {
        this.effectJackpot.stopAllActions();
        this.effectJackpot.active = false;
        this.effectBigWin.stopAllActions();
        this.effectBigWin.active = false;
    }

    private stopShowLinesWin() {
        this.linesWin.stopAllActions();
        for (var i = 0; i < this.linesWin.childrenCount; i++) {
            this.linesWin.children[i].active = false;
        }
        this.stopAllItemEffect();
    }

    private stopAllItemEffect() {
        for (var i = 0; i < this.columns.childrenCount; i++) {
            var children = this.columns.children[i].children;
            children[0].stopAllActions();
            children[1].stopAllActions();
            children[2].stopAllActions();

            children[0].runAction(cc.scaleTo(0.1, 1));
            children[1].runAction(cc.scaleTo(0.1, 1));
            children[2].runAction(cc.scaleTo(0.1, 1));
        }
    }

    private showLineWins() {
        this.linesWin.stopAllActions();
        var linesWin = this.lastSpinRes.linesWin.split(",");
        var linesWinChildren = this.linesWin.children;
        for (var i = 0; i < linesWinChildren.length; i++) {
            linesWinChildren[i].active = linesWin.indexOf("" + (i + 1)) >= 0;
        }
        var actions = [];
        if (this.lastSpinRes.prize > 0) {
            this.showWinCash(this.lastSpinRes.prize);
            actions.push(cc.delayTime(1.5));
            actions.push(cc.callFunc(function () {
                for (var i = 0; i < linesWinChildren.length; i++) {
                    linesWinChildren[i].active = false;
                }
            }));
        }
        actions.push(cc.delayTime(0.5));
        actions.push(cc.callFunc(() => {
            this.isSpined = true;
            if (this.isBoost || this.isAuto) {
                this.actSpin();
            } else {
                this.setEnabledAllButtons(true);
                for (var i = 0; i < this.buttonBets.length; i++) {
                    this.buttonBets[i].button.interactable = true;
                }
            }
        }));
        this.linesWin.runAction(cc.sequence.apply(null, actions));
    }
    actGuide() {
        if (this.popupGuide == null) {
            cc.assetManager.getBundle("Slot3x3Gem").load("Prefabs/PopupGuide", cc.Prefab, function (finish, total, item) {

            }, (err1, prefab: cc.Prefab) => {
                this.popupGuide = cc.instantiate(prefab).getComponent("Dialog");
                this.popupGuide.node.parent = this.popupContainer;
                this.popupGuide.show();
                this.popups.push(this.popupGuide.node);
                App.instance.showLoading(false);
            })
        }
        else {
            this.popupGuide.show();
        }
    }
    actHistory() {
        if (this.popupHistory == null) {
            cc.assetManager.getBundle("Slot3x3Gem").load("Prefabs/PopupHistory", cc.Prefab, function (finish, total, item) {

            }, (err1, prefab: cc.Prefab) => {
                this.popupHistory = cc.instantiate(prefab).getComponent(PopupHistory);
                this.popupHistory.node.parent = this.popupContainer;
                this.popupHistory.show();
                this.popups.push(this.popupHistory.node);
                App.instance.showLoading(false);
            })
        }
        else {
            this.popupHistory.show();
        }
    }
    actHonor() {
        if (this.popupHonor == null) {
            cc.assetManager.getBundle("Slot3x3Gem").load("Prefabs/PopupHonors", cc.Prefab, function (finish, total, item) {

            }, (err1, prefab: cc.Prefab) => {
                this.popupHonor = cc.instantiate(prefab).getComponent(PopupHonors);
                this.popupHonor.node.parent = this.popupContainer;
                this.popupHonor.show();
                this.popups.push(this.popupHonor.node);
                App.instance.showLoading(false);
            })
        }
        else {
            this.popupHonor.show();
        }
    }
    actSelectLine() {
        if (this.popupSelectLine == null) {
            cc.assetManager.getBundle("Slot3x3Gem").load("Prefabs/PopupSelectLine", cc.Prefab, function (finish, total, item) {

            }, (err1, prefab: cc.Prefab) => {
                this.popupSelectLine = cc.instantiate(prefab).getComponent(PopupSelectLine);
                this.popupSelectLine.node.parent = this.popupContainer;
                this.popupSelectLine.show();
                this.popups.push(this.popupSelectLine.node);
                App.instance.showLoading(false);
                this.popupSelectLine.onSelectedChanged = (lines) => {
                    this.arrLineSelect = lines;
                    //  cc.log("lines=", lines);
                    this.lbTotalLine.string = lines.length + "";
                }
            })
        }
        else {
            this.popupSelectLine.show();
        }
    }
}
