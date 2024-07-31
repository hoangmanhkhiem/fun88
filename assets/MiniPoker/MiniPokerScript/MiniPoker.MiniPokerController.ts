import BundleControl from "../../Loading/src/BundleControl";
import Configs from "../../Loading/src/Configs";
import MiniGame from "../../Lobby/LobbyScript/MiniGame";
import App from "../../Lobby/LobbyScript/Script/common/App";
import BroadcastReceiver from "../../Lobby/LobbyScript/Script/common/BroadcastReceiver";
import Tween from "../../Lobby/LobbyScript/Script/common/Tween";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import MiniGameNetworkClient from "../../Lobby/LobbyScript/Script/networks/MiniGameNetworkClient";
import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import cmd from "./MiniPoker.Cmd";
import PopupHistory from "./MiniPoker.PopupHistory";
import PopupHonors from "./MiniPoker.PopupHonors";


const { ccclass, property } = cc._decorator;

@ccclass("ButtonBet")
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
export default class MiniPokerController extends MiniGame {
    @property(cc.SpriteAtlas)
    sprAtlasCards: cc.SpriteAtlas = null;
    @property(cc.Node)
    columns: cc.Node = null;
    @property(cc.Node)
    itemTemplate: cc.Node = null;
    @property(cc.Label)
    lblJackpot: cc.Label = null;
    @property([ButtonBet])
    buttonBets: ButtonBet[] = [];
    @property(cc.Label)
    lblToast: cc.Label = null;
    @property(cc.Animation)
    btnSpinAnim: cc.Animation = null;
    @property(cc.Button)
    btnSpin: cc.Button = null;
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(cc.Toggle)
    toggleAuto: cc.Toggle = null;
    @property(cc.Toggle)
    btnBoost: cc.Toggle = null;
    @property(sp.Skeleton)
    sprResult: sp.Skeleton = null;
    @property(cc.Node)
    lblWinCash: cc.Node = null;
    @property(cc.Node)
    popupContainer: cc.Node = null;

    @property([cc.Node])
    public popups: cc.Node[] = [];

    private readonly rollStartItemCount = 15;
    private readonly rollAddItemCount = 10;
    private readonly spinDuration = 1.2;
    private readonly addSpinDuration = 0.3;
    private readonly listBet = [100, 1000, 10000];
    private readonly defaultCards = [0, 1, 2, 3, 4];
    private itemHeight = 0;
    private betIdx = 0;
    private isBoost = false;
    private isCanChangeBet = true;
    private isSpined = true;
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
                if (j >= 1) {
                    item.children[0].getComponent(cc.Sprite).spriteFrame = this.sprAtlasCards.getSpriteFrame("cardBlur_" + Utils.randomRangeInt(1, 15));
                } else {
                    item.children[0].getComponent(cc.Sprite).spriteFrame = this.sprAtlasCards.getSpriteFrame("card" + this.defaultCards[i]);
                }
            }
        }
        this.itemTemplate.removeFromParent();
        this.itemTemplate = null;

        for (let i = 0; i < this.buttonBets.length; i++) {
            var btn = this.buttonBets[i];
            btn.setActive(i == this.betIdx);
            btn.button.node.on("click", () => {
                App.instance.showBgMiniGame("MiniPoker");
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

        this.toggleAuto.node.on("click", () => {
            App.instance.showBgMiniGame("MiniPoker");
            if (this.toggleAuto.isChecked) {
                if (this.isSpined) this.actSpin();
                this.btnBoost.interactable = false;
            } else {
                this.btnBoost.interactable = true;
                if (this.isSpined) {
                    this.setEnableAllButtons(true);
                }
            }
        });

        this.btnBoost.node.on("click", () => {
            App.instance.showBgMiniGame("MiniPoker");
            this.isBoost = !this.isBoost;
            if (this.isBoost) {
                if (this.isSpined) this.actSpin();
                this.toggleAuto.interactable = false;
                this.btnBoost.isChecked = true;
            } else {
                this.toggleAuto.interactable = true;
                this.btnBoost.isChecked = false;
                if (this.isSpined) {
                    this.setEnableAllButtons(true);
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
        App.instance.showBgMiniGame("MiniPoker");
        super.show();

        this.lblToast.node.parent.active = false;
        this.sprResult.node.active = false;
        this.lblWinCash.active = false;

        this.isSpined = true;
        this.isCanChangeBet = true;
        this.betIdx = 0;
        for (let i = 0; i < this.buttonBets.length; i++) {
            this.buttonBets[i].setActive(i == this.betIdx);
        }
        MiniGameNetworkClient.getInstance().send(new cmd.SendScribe(this.betIdx));
    }

    actSpin() {
        // cc.log("actSpin");
        //App.instance.showBgMiniGame("MiniPoker");
        if (!this.isSpined) {
            this.showToast(App.instance.getTextLang('txt_notify_fast_action'));
            return;
        }
        this.btnSpinAnim.play("spin", 0);
        this.isSpined = false;
        this.setEnableAllButtons(false);
        for (var i = 0; i < this.buttonBets.length; i++) {
            this.buttonBets[i].button.interactable = false;
        }
        MiniGameNetworkClient.getInstance().send(new cmd.SendSpin(this.listBet[this.betIdx]));
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

    private setEnableAllButtons(isEnable: boolean) {
        this.btnSpin.interactable = isEnable;
        this.btnClose.interactable = isEnable;
    }

    private onSpinResult(data: cmd.ReceiveSpin) {
        // cc.log(data);
        this.lastSpinRes = data;

        var resultSuccess = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        if (resultSuccess.indexOf(data.result) < 0) {
            this.scheduleOnce(function () {
                this.isSpined = true;
            }, 1);
            this.setEnableAllButtons(true);
            for (var i = 0; i < this.buttonBets.length; i++) {
                this.buttonBets[i].button.interactable = true;
            }

            this.toggleAuto.isChecked = false;
            this.toggleAuto.interactable = true;

            this.isBoost = false;
            this.btnBoost.interactable = true;
            this.btnBoost.isChecked = false;

            switch (data.result) {
                case 102:
                    this.showToast(App.instance.getTextLang('txt_not_enough'));
                    break;
                default:
                    this.showToast(App.instance.getTextLang('txt_unknown_error1'));
                    break;
            }
            return;
        }

        Configs.Login.Coin -= this.listBet[this.betIdx];
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
        Configs.Login.Coin = data.currentMoney;

        let result = [data.card1, data.card2, data.card3, data.card4, data.card5];
        //currentMoney: 3392748
        // prize: 0
        // result: 10 = khong an
        // result: 9 = doi J+
        // result: 8 = hai doi
        // result: 7 = sam
        let timeScale = this.isBoost ? 0.5 : 1;
        for (let i = 0; i < this.columns.childrenCount; i++) {
            let roll = this.columns.children[i];
            let step1Pos = this.itemHeight * 0.2;
            let step2Pos = -this.itemHeight * roll.childrenCount + this.itemHeight - this.itemHeight * 0.2;
            let step3Pos = -this.itemHeight * roll.childrenCount + this.itemHeight;
            roll.runAction(cc.sequence(
                cc.delayTime(0.2 * i * timeScale),
                cc.moveTo(0.2 * timeScale, cc.v2(roll.getPosition().x, step1Pos)).easing(cc.easeQuadraticActionOut()),
                cc.moveTo((this.spinDuration + this.addSpinDuration * i) * timeScale, cc.v2(roll.getPosition().x, step2Pos)).easing(cc.easeQuadraticActionInOut()),
                cc.moveTo(0.2 * timeScale, cc.v2(roll.getPosition().x, step3Pos)).easing(cc.easeQuadraticActionIn()),
                cc.callFunc(() => {
                    roll.setPosition(cc.v2(roll.getPosition().x, 0));
                    if (i === this.columns.childrenCount - 1) {
                        this.spined();
                    }
                })
            ));
            roll.runAction(cc.sequence(
                cc.delayTime((0.45 + 0.2 * i) * timeScale),
                cc.callFunc(() => {
                    let children = roll.children;
                    let bottomSprite = children[0].children[0].getComponent(cc.Sprite);
                    let topSprite = children[children.length - 1].children[0].getComponent(cc.Sprite);
                    bottomSprite.spriteFrame = topSprite.spriteFrame = this.sprAtlasCards.getSpriteFrame("card" + result[i]);
                })
            ));
        }
    }

    private spined() {
        // cc.log("vao day chu ha:" + JSON.stringify(this.lastSpinRes));
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
        this.setEnableAllButtons(true);
        if (this.lastSpinRes.prize > 0) {
            // this.lastSpinRes.result = 9;
            switch (this.lastSpinRes.result) {
                case 1:
                    this.sprResult.animation = "jackport";
                    this.sprResult.loop = false;
                    // this.sprResult.getComponent(cc.Sprite).spriteFrame = this.sfTxtNoHu;
                    break;
                case 2:
                    this.sprResult.animation = "thùng phá sảnh2";
                    // this.sprResult.getComponent(cc.Sprite).spriteFrame = this.sfTxtThungPhaSanh;
                    break;
                case 3:
                    this.sprResult.animation = "tu quy";
                    // this.sprResult.getComponent(cc.Sprite).spriteFrame = this.sfTxtTuQuy;
                    break;
                case 4:
                    this.sprResult.animation = "cù lũ";
                    // this.sprResult.getComponent(cc.Sprite).spriteFrame = this.sfTxtThung;
                    break;
                case 5:
                    this.sprResult.animation = "thùng";
                    // this.sprResult.getComponent(cc.Sprite).spriteFrame = this.sfTxtCuLu;
                    break;
                case 6:
                    this.sprResult.animation = "sanh";
                    // this.sprResult.getComponent(cc.Sprite).spriteFrame = this.sfTxtSanh;
                    break;
                case 7:
                    this.sprResult.animation = "sám cô";
                    // this.sprResult.getComponent(cc.Sprite).spriteFrame = this.sfTxtSamCo;
                    break;
                case 8:
                    this.sprResult.animation = "hai đôi";
                    // this.sprResult.getComponent(cc.Sprite).spriteFrame = this.sfTxtHaiDoi;
                    break;
                case 9:
                    this.sprResult.animation = "đôi J+";
                    // this.sprResult.getComponent(cc.Sprite).spriteFrame = this.sfTxtDoiJ;
                    break;
            }
            this.sprResult.node.active = true;
            this.sprResult.node.setScale(1);

            this.lblWinCash.active = true;
            this.lblWinCash.getComponent(cc.Label).string = "+" + this.lastSpinRes.prize;
            this.lblWinCash.setPosition(0, 42);
            this.lblWinCash.runAction(cc.sequence(
                cc.delayTime(0.5),
                cc.moveBy(1, cc.v2(0, 140)),
                cc.delayTime(1),
                cc.callFunc(() => {
                    this.sprResult.node.active = false;
                    this.lblWinCash.active = false;
                    this.scheduleOnce(() => {
                        this.isSpined = true;
                        if (this.toggleAuto.isChecked || this.isBoost) {
                            this.actSpin();
                        } else {
                            for (var i = 0; i < this.buttonBets.length; i++) {
                                this.buttonBets[i].button.interactable = true;
                            }
                        }
                    }, 0.2);
                })
            ));
        } else {
            this.scheduleOnce(() => {
                this.isSpined = true;
                if (this.toggleAuto.isChecked || this.isBoost) {
                    this.actSpin();
                } else {
                    for (var i = 0; i < this.buttonBets.length; i++) {
                        this.buttonBets[i].button.interactable = true;
                    }
                }
            }, 0.4);
        }
    }

    dismiss() {
        super.dismiss();
        for (let i = 0; i < this.popups.length; i++) {
            this.popups[i].active = false;
        }
        App.instance.hideGameMini("MiniPoker");
        MiniGameNetworkClient.getInstance().send(new cmd.SendUnScribe(this.betIdx));
    }
    actPopupGuide() {
        if (this.popupGuide == null) {
            BundleControl.loadPrefabGame("MiniPoker", "res/prefabs/PopupGuide", (finish, total) => {
                // App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
            }, prefab => {
                App.instance.showLoading(false);
                this.popupGuide = cc.instantiate(prefab).getComponent("Dialog");
                this.popupGuide.node.parent = this.popupContainer;
                this.popupGuide.show();
                this.popups.push(this.popupGuide.node);
            });
        } else {
            this.popupGuide.show();
        }
    }
    actPopupHistory() {
        if (this.popupHistory == null) {
            BundleControl.loadPrefabGame("MiniPoker", "res/prefabs/PopupHistory", (finish, total) => {
                // App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
            }, prefab => {
                App.instance.showLoading(false);
                this.popupHistory = cc.instantiate(prefab).getComponent("MiniPoker.PopupHistory");
                this.popupHistory.node.parent = this.popupContainer;
                this.popupHistory.show();
                this.popups.push(this.popupHistory.node);
            });
        } else {
            this.popupHistory.show();
        }
    }
    actPopupHonor() {
        if (this.popupHonor == null) {
            BundleControl.loadPrefabGame("MiniPoker", "res/prefabs/PopupHonors", (finish, total) => {
                // App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
            }, prefab => {
                App.instance.showLoading(false);
                this.popupHonor = cc.instantiate(prefab).getComponent("MiniPoker.PopupHonors");
                this.popupHonor.node.parent = this.popupContainer;
                this.popupHonor.show();
                this.popups.push(this.popupHonor.node);
            });
        } else {
            this.popupHonor.show();
        }
    }
    public reOrder() {
        super.reOrder();
    }
}
