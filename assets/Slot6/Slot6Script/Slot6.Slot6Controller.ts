
import cmd from "./Slot6.Cmd";

import Configs from "../../Loading/src/Configs";
import PopupSelectLine from "./Slot6.PopupSelectLine";
import PopupBonus from "./Slot6.PopupBonus";
import TrialResults from "./Slot6.TrialResults";
import Slot6Item from "./Slot6.Item";
import App from "../../Lobby/LobbyScript/Script/common/App";
import BroadcastReceiver from "../../Lobby/LobbyScript/Script/common/BroadcastReceiver";
import Tween from "../../Lobby/LobbyScript/Script/common/Tween";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import SlotNetworkClient from "../../Lobby/LobbyScript/Script/networks/SlotNetworkClient";
import PopupJackpotHistory from "./Slot6.PopupJackpotHistory";
import BundleControl from "../../Loading/src/BundleControl";
import PopupHistory from "./Slot6.PopupHistory";

var TW = cc.tween;
const enum TYPE_WIN {
    MISS = 0,
    WIN = 1,
    BIGWIN = 2,
    JACKPOT = 3,
    SUPERWIN = 4,
    BONUS = 5
}


const { ccclass, property } = cc._decorator;

@ccclass
export default class Slot6Controller extends cc.Component {

    @property(cc.Node)
    nodeCoin: cc.Node = null;

    @property(cc.Prefab)
    preItem: cc.Prefab = null;

    @property(cc.Integer)
    mHeightItem: number = 180;

    @property(cc.Integer)
    mWidthItem: number = 180;
    @property(cc.Node)
    reels: cc.Node = null; // reel
    @property(cc.Node)
    effSpin: cc.Node = null; // reel
    // @property(cc.Node)
    // itemTemplate: cc.Node = null;
    @property(cc.Node)
    linesWin: cc.Node = null;
    @property(cc.Node)
    iconWildColumns: cc.Node = null; // mang cac item expand wild

    @property(cc.Label)
    lblJackpot: cc.Label = null;
    @property(cc.Label)
    lblBet: cc.Label = null;
    @property(cc.Label)
    lblLine: cc.Label = null;
    @property(cc.Label)
    lblTotalBet: cc.Label = null;
    @property(cc.Label)
    lblCoin: cc.Label = null;
    @property(cc.Label)
    lblWinNow: cc.Label = null;
    @property(cc.Label)
    lblFreeSpinCount: cc.Label = null;

    @property(cc.Toggle)
    toggleAuto: cc.Toggle = null;

    @property(cc.Toggle)
    toggleSound: cc.Toggle = null;

    @property(cc.Toggle)
    togglgeMusic: cc.Toggle = null;

    @property(cc.Toggle)
    toggleBoost: cc.Toggle = null;

    @property(cc.Button)
    btnSpin: cc.Button = null;
    @property(cc.Button)
    btnBack: cc.Button = null;
    @property(cc.Button)
    btnPlayTry: cc.Button = null;
    @property(cc.Button)
    btnPlayReal: cc.Button = null;
    @property(cc.Button)
    btnLine: cc.Button = null;

    @property(cc.Node)
    toast: cc.Node = null;

    @property(cc.Node)
    panelSetting: cc.Node = null;

    @property(cc.Node)
    effectWinCash: cc.Node = null;
    @property(cc.Node)
    effectBigWin: cc.Node = null;
    @property(cc.Node)
    effectJackpot: cc.Node = null;
    @property(cc.ParticleSystem)
    particleJackpt: cc.ParticleSystem = null;
    @property(cc.ParticleSystem)
    particleJackpt1: cc.ParticleSystem = null;
    @property(cc.ParticleSystem)
    particleBigWin: cc.ParticleSystem = null;
    @property(cc.ParticleSystem)
    particleBigWin1: cc.ParticleSystem = null;
    @property(cc.ParticleSystem)
    particleFreeSpin: cc.ParticleSystem = null;
    @property(cc.ParticleSystem)
    particleBonus: cc.ParticleSystem = null;
    @property(cc.Node)
    effectBonus: cc.Node = null;
    @property(cc.Node)
    effectFreeSpin: cc.Node = null;

    @property(PopupSelectLine)
    popupSelectLine: PopupSelectLine = null;
    @property(PopupBonus)
    popupBonus: PopupBonus = null;
    @property({ type: cc.AudioClip })
    soundSpinClick: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundSpinMis: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundSpinWin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundBigWin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundFreespin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundJackpot: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundBonus: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundClick: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundSpin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundWild: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundReelStop: cc.AudioClip = null;
    //end music setting

    @property({ type: cc.AudioClip })
    soundBg: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundBgBonus: cc.AudioClip = null;
    private currentNumberFreeSpin = 0;
    private daiLyFreeSpin = 0;
    private rollStartItemCount = 15;
    private rollAddItemCount = 10;
    private spinDuration = 1.2;
    private addSpinDuration = 0.3;
    //private itemHeight = 0;
    public betIdx = -1;
    private listBet = [100, 1000, 10000];
    private listBetLabel = ["100", "1.000", "10.000"];
    private arrLineSelect = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
    private isSpined = true;
    private readonly wildItemId = 2;
    private readonly mapLine = [
        [5, 6, 7, 8, 9],//1
        [0, 1, 2, 3, 4],//2
        [10, 11, 12, 13, 14],//3
        [10, 6, 2, 8, 14],//4
        [0, 6, 12, 8, 4],//5
        [5, 1, 2, 3, 9],//6
        [5, 11, 12, 13, 9],//7
        [0, 1, 7, 13, 14],//8
        [10, 11, 7, 3, 4],//9
        [5, 11, 7, 3, 9],//10
        [5, 1, 7, 13, 9],//11
        [0, 6, 7, 8, 4],//12
        [10, 6, 7, 8, 14],//13
        [0, 6, 2, 8, 4],//14
        [10, 6, 12, 8, 14],//15
        [5, 6, 2, 8, 9],//16
        [5, 6, 12, 8, 9],//17
        [0, 1, 12, 3, 4],//18
        [10, 11, 2, 13, 14],//19
        [0, 11, 12, 13, 4],//20
        [10, 1, 2, 3, 14],//21
        [5, 1, 12, 3, 9],//22
        [5, 11, 2, 13, 9],//23
        [0, 11, 2, 13, 4],//24
        [10, 1, 12, 3, 14]//25
    ];
    private lastSpinRes: cmd.ReceivePlay = null;
    private columnsWild = [];

    private musicSlotState = null;
    public soundSlotState = null;
    private remoteMusicBackground = null;
    private mIsTrial = false;

    private popupJackpotHistory: PopupJackpotHistory = null;
    private popupHistory: PopupHistory = null;
    private mutipleJpNode=null;


    public onBtnBack() {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        SlotNetworkClient.getInstance().send(new cmd.SendUnSubcribe(this.betIdx));
        cc.audioEngine.stopAll();
        App.instance.loadScene("Lobby");
    }


    start() {
        this.soundInit();
        this.currentNumberFreeSpin = 0;
        this.lblWinNow.string = "0";
        this.iconWildColumns.zIndex = 3;
        //this.itemHeight = this.itemTemplate.height;
        for (let i = 0; i < this.reels.childrenCount; i++) {
            let reel = this.reels.children[i];
            let count = this.rollStartItemCount + i * this.rollAddItemCount;
            for (let j = 0; j < count; j++) {
                //let item = cc.instantiate(this.itemTemplate);
                let itemNode = cc.instantiate(this.preItem);
                itemNode.height = this.mHeightItem;
                itemNode.width = this.mWidthItem;
                let item: Slot6Item = itemNode.getComponent(Slot6Item);
                itemNode.parent = reel;
                // if (j >= 3) {
                //     item.children[0].getComponent(cc.Sprite).spriteFrame = this.sprFrameItemsBlur[Utils.randomRangeInt(0, this.sprFrameItemsBlur.length)];
                // } else {
                //     item.children[0].getComponent(cc.Sprite).spriteFrame = this.sprFrameItems[Utils.randomRangeInt(0, this.sprFrameItems.length)];
                // }
                let id = Utils.randomRangeInt(0, 10);
                item.setId(id);
                //item.children[0].width=this.itemTemplate.children[0].width;
                //item.children[0].height=this.itemTemplate.children[0].height;
            }
        }
        // this.itemTemplate.removeFromParent();
        // this.itemTemplate = null;

        //dang ky khi mat ket noi tu dong back
        SlotNetworkClient.getInstance().addOnClose(() => {
            //this.actBack();
            this.onBtnBack();
        }, this);

        //listenner client - server
        SlotNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.FREE_DAI_LY:
                    {
                        if (!this.mIsTrial) {
                            let res = new cmd.ReceiveFreeDaiLy(data);
                            //  cc.log("init info Slot6:" + JSON.stringify(res));
                            this.daiLyFreeSpin = res.freeSpin;
                        }

                    }
                    break;
                case cmd.Code.DATE_X2:
                    {
                        let res = new cmd.ReceiveDateX2(data);
                        //  cc.log("init info Slot6:" + JSON.stringify(res));
                        this.currentNumberFreeSpin = res.freeSpin + this.daiLyFreeSpin;
                        if (this.currentNumberFreeSpin > 0) {
                            this.lblFreeSpinCount.node.parent.active = true;
                            this.lblFreeSpinCount.string = this.currentNumberFreeSpin + "";
                        }
                        else {
                            this.lblFreeSpinCount.node.parent.active = false;
                        }
                    }
                    break;
                case cmd.Code.UPDATE_POT:
                    let res = new cmd.ReceiveUpdatePot(data);
                    Tween.numberTo(this.lblJackpot, res.jackpot, 0.3);

                    break;
                case cmd.Code.UPDATE_JACKPOT_SLOTS:
                    break;
                case cmd.Code.PLAY:
                    {
                        let res = new cmd.ReceivePlay(data);
                        // //  cc.log(res);
                        this.onSpinResult(res);
                    }
                    break;
                default:
                    break;
            }
        }, this);
        SlotNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeHallSlot());

        ////  cc.log("Slot3Controller started");

        //SlotNetworkClient.getInstance().send(new cmd.SendSubcribe(this.betIdx));
        this.stopShowLinesWin();

        this.toast.active = false;
        this.effectWinCash.active = false;
        this.effectJackpot.active = false;
        this.effectBigWin.active = false;
        this.panelSetting.active = false;

        this.lblTotalBet.string = (this.arrLineSelect.length * this.listBet[this.betIdx]).toString();


        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            Tween.numberTo(this.lblCoin, Configs.Login.Coin, 0.3);
        }, this);
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

        App.instance.showErrLoading("Đang kết nối tới server...");
        SlotNetworkClient.getInstance().checkConnect(() => {
            App.instance.showLoading(false);
        });
        ////  cc.log("Slot3Controller started");

        this.btnPlayReal.node.active = false;
        this.btnPlayTry.node.active = true;
        this.betIdx = 0;

        SlotNetworkClient.getInstance().send(new cmd.SendSubcribe(this.betIdx));
        this.onJoinRoom();
        //this.initMutipleJPNode();
    }
    private initMutipleJPNode() {
        if (!this.mutipleJpNode) {
            cc.assetManager.getBundle("Lobby").load("prefabs/MutipleJackpotPr", cc.Prefab, function (finish, total, item) {
            }, (err1, prefab: cc.Prefab) => {
                if (err1 != null) {
                    //  cc.log("errr load game TIENLEN:", err1);
                } else {
                    this.mutipleJpNode = cc.instantiate(prefab).getComponent("MutipleJackpot");
                    this.mutipleJpNode.node.parent = cc.director.getScene().getChildByName("Canvas")
                    this.mutipleJpNode.setInfo("CHIEMTINH");
                }
            })
        }
    }

    private onBtnSub() {
        SlotNetworkClient.getInstance().send(new cmd.SendUnSubcribe(this.betIdx));
        this.betIdx--;
        if (this.betIdx <= 0) {
            this.betIdx = 0;
        }

        SlotNetworkClient.getInstance().send(new cmd.SendSubcribe(this.betIdx));
        this.onJoinRoom();
    }

    private onBtnAdd() {
        SlotNetworkClient.getInstance().send(new cmd.SendUnSubcribe(this.betIdx));
        this.betIdx++;
        if (this.betIdx >= 2) {
            this.betIdx = 2;
        }
        SlotNetworkClient.getInstance().send(new cmd.SendSubcribe(this.betIdx));
        this.onJoinRoom();
    }

    private showCoins(prize) {
        var number = prize / 20000;
        if (number <= 10) number = 10;
        else if (number >= 30) number = 30;
        App.instance.showCoins(number, this.lblWinNow.node, this.nodeCoin);
    }


    public onJoinRoom() {
        this.lblBet.string = this.listBetLabel[this.betIdx];
        let totalbet = (this.arrLineSelect.length * this.listBet[this.betIdx]);
        Tween.numberTo(this.lblTotalBet, totalbet, 0.3);

        // this.skeSpin.animation = "iat";
        // this.skeSpin.loop = true;
    }

    private showToast(msg: string) {
        this.toast.getComponentInChildren(cc.Label).string = msg;
        this.toast.stopAllActions();
        this.toast.active = true;
        this.toast.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(() => {
            this.toast.active = false;
        })));
    }

    private moneyToK(money: number): string {
        // if (money < 10000) {
        //     return money.toString();
        // }
        // money = parseInt((money / 1000).toString());
        return money.toString();
    }

    private setEnabledAllButtons(enabled: boolean) {
        this.btnSpin.interactable = enabled;
        this.btnBack.interactable = enabled;
        // this.btnBetUp.interactable = enabled;
        // this.btnBetDown.interactable = enabled;
        this.btnLine.interactable = enabled;
        this.btnPlayTry.interactable = enabled;
        this.btnPlayReal.interactable = enabled;

        this.effSpin.active = enabled;
        //this.toggleTrial.interactable = enabled;
    }

    private stopAllEffects() {
        this.effectJackpot.stopAllActions();
        this.effectJackpot.active = false;
        this.effectBigWin.stopAllActions();
        this.effectBigWin.active = false;
        this.effectFreeSpin.stopAllActions();
        this.effectFreeSpin.active = false;
    }

    private stopShowLinesWin() {
        this.linesWin.stopAllActions();
        for (var i = 0; i < this.linesWin.childrenCount; i++) {
            this.linesWin.children[i].active = false;
        }
        for (var i = 0; i < this.iconWildColumns.childrenCount; i++) {
            this.iconWildColumns.children[i].active = false;
        }
        this.stopAllItemEffect();
    }

    private stopAllItemEffect() {
        for (let i = 0; i < this.reels.childrenCount; i++) {
            let children = this.reels.children[i].children; // ???
            for (let j = 0; j < children.length; j++) {
                cc.Tween.stopAllByTarget(children[j]);
                children[j].scale = 1;
            }
        }
    }

    private spin() {
        if (!this.isSpined) return;


        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundSpinClick, false, 1);
        }
        let isTrail = this.mIsTrial;
        if (!isTrail) {

            if (this.currentNumberFreeSpin <= 0) {
                if (Configs.Login.Coin < this.listBet[this.betIdx] * this.arrLineSelect.length) {
                    App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_not_enough"));
                    return;
                }
                let curMoney = Configs.Login.Coin - this.arrLineSelect.length * this.listBet[this.betIdx];
                Tween.numberTo(this.lblCoin, curMoney, 0.3);
            }
            else {
                this.currentNumberFreeSpin--;
                this.lblFreeSpinCount.string = this.currentNumberFreeSpin + "";
                if (this.currentNumberFreeSpin <= 0) {
                    this.currentNumberFreeSpin = 0;
                    this.lblFreeSpinCount.node.parent.active = false;
                }
            }

            this.isSpined = false;
            this.stopAllEffects();
            this.stopShowLinesWin();
            this.changeAllItemToDark(false);
            this.setEnabledAllButtons(false);
            // this.skeSpin.animation = "at";
            // this.skeSpin.loop = true;
            SlotNetworkClient.getInstance().send(new cmd.SendPlay(this.arrLineSelect.toString()));
        } else {
            this.changeAllItemToDark(false);
            this.isSpined = false;
            this.stopAllEffects();
            this.stopShowLinesWin();
            this.setEnabledAllButtons(false);
            // this.skeSpin.animation = "at";
            // this.skeSpin.loop = true;
            var rIdx = Utils.randomRangeInt(0, TrialResults.results.length);
            this.onSpinResult(TrialResults.results[rIdx]);
        }
    }

    private stopSpin() {
        for (var i = 0; i < this.reels.childrenCount; i++) {
            var roll = this.reels.children[i];
            cc.Tween.stopAllByTarget(roll);
            roll.setPosition(cc.v2(roll.getPosition().x, 0));
        }
    }

    private showLineWins() {
        this.isSpined = true;
        Tween.numberTo(this.lblWinNow, this.lastSpinRes.prize, 0.3);
        let isTrail = this.mIsTrial;
        if (!isTrail) BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
        if (!this.toggleAuto.isChecked && !this.toggleBoost.isChecked) this.setEnabledAllButtons(true);

        this.linesWin.stopAllActions();
        let linesWin = this.lastSpinRes.linesWin.split(",");
        linesWin = Utils.removeDups(linesWin);
        for (let i = 0; i < linesWin.length; i++) {
            if (linesWin[i] == "0") {
                linesWin.splice(i, 1);
                i--;
            }
        }
        let matrix = this.lastSpinRes.matrix.split(",");
        let linesWinChildren = this.linesWin.children;
        let rolls = this.reels.children;
        let actions = [];
        for (let i = 0; i < linesWinChildren.length; i++) {
            linesWinChildren[i].active = linesWin.indexOf("" + (i + 1)) >= 0;;
        }
        if (this.lastSpinRes.prize > 0) {
            this.changeAllItemToDark(true);
            this.linesWin.zIndex = 1;
            this.reels.parent.zIndex = 0;
            this.showWinCash(this.lastSpinRes.prize);
            actions.push(cc.delayTime(1.5));
            actions.push(cc.callFunc(function () {
                for (let i = 0; i < linesWinChildren.length; i++) {
                    linesWinChildren[i].active = false;
                }
            }));
            actions.push(cc.delayTime(0.3));
            if (!this.toggleBoost.isChecked) {
                for (let i = 0; i < linesWin.length; i++) {
                    let lineIdx = parseInt(linesWin[i]) - 1;
                    let line = linesWinChildren[lineIdx];
                    actions.push(cc.callFunc(() => {
                        // //  cc.log("================: " + lineIdx);
                        this.linesWin.zIndex = 0;
                        this.reels.parent.zIndex = 1;
                        line.active = true;
                        let mLine = this.mapLine[lineIdx];
                        let countItemWin = 0;
                        let fisrtItemId = matrix[mLine[0]];
                        for (let j = 0; j < mLine.length; j++) {
                            let itemId = matrix[mLine[j]];
                            if (fisrtItemId == itemId || parseInt(itemId) == this.wildItemId || this.columnsWild.indexOf(j) >= 0) {
                                // //  cc.log("==" + itemId + " j:" + j);
                                countItemWin++;
                            } else {
                                break;
                            }
                        }
                        for (let j = 0; j < countItemWin; j++) {
                            let itemRow = parseInt((mLine[j] / 5).toString());
                            let item = rolls[j].children[2 - itemRow];
                            item.stopAllActions();
                            cc.Tween.stopAllByTarget(item);
                            // TW(item).repeatForever(TW().to(0.2, { scale: 1.1 }).to(0.2, { scale: 1.0 })).start();
                            item.getComponent(Slot6Item).showItemAnim();
                            TW(item).delay(0.9).call(() => {
                                item.getComponent(Slot6Item).offItemAnim();
                            }).start();
                            // item.runAction(cc.repeatForever(cc.sequence(
                            //     cc.scaleTo(0.2, 1.1),
                            //     cc.scaleTo(0.2, 1)
                            // )));
                        }
                        // //  cc.log("lineIdx: " + lineIdx + "fisrtItemId: " + fisrtItemId + " countItemWin: " + countItemWin);
                    }));
                    actions.push(cc.delayTime(1));
                    actions.push(cc.callFunc(() => {
                        line.active = false;
                        this.stopAllItemEffect();
                    }));
                    actions.push(cc.delayTime(0.1));
                }
            }
        }
        if (actions.length == 0) {
            actions.push(cc.callFunc(() => {
                //fixed call cc.sequence.apply
            }))
        }
        actions.push(cc.callFunc(() => {
            this.changeAllItemToDark(false);
            if (this.toggleBoost.isChecked || this.toggleAuto.isChecked) {
                this.spin();
            }
        }));
        this.linesWin.runAction(cc.sequence.apply(null, actions));
    }

    private showWinCash(cash: number) {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundSpinWin, false, 1);
        }
        this.showCoins(cash);
        this.effectWinCash.stopAllActions();
        this.effectWinCash.active = true;
        let label = this.effectWinCash.getComponentInChildren(cc.Label);
        label.string = "0";
        this.effectWinCash.opacity = 0;
        this.effectWinCash.runAction(cc.sequence(
            cc.fadeIn(0.3),
            cc.callFunc(() => {
                Tween.numberTo(label, cash, 0.5);
            }),
            cc.delayTime(1.5),
            cc.fadeOut(0.3),
            cc.callFunc(() => {
                this.effectWinCash.active = false;
            })
        ));
    }

    private showEffectBigWin(cash: number, cb: () => void) {
        this.effectBigWin.stopAllActions();
        this.effectBigWin.active = true;
        this.effectBigWin.getComponentInChildren(sp.Skeleton).setAnimation(0, "thang sieu lon fx", true);
        let label = this.effectBigWin.getComponentInChildren(cc.Label);
        label.node.active = false;
        this.particleBigWin.resetSystem();
        this.particleBigWin1.resetSystem();
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

    private showEffectFreeSpin(cb: () => void) {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundFreespin, false, 1);
        }
        this.effectFreeSpin.stopAllActions();
        this.effectFreeSpin.active = true;
        this.effectFreeSpin.getComponentInChildren(sp.Skeleton).setAnimation(0, "freespin fx", true);

        this.particleFreeSpin.resetSystem();
        this.effectFreeSpin.runAction(cc.sequence(
            cc.delayTime(1),
            cc.delayTime(3),
            cc.callFunc(() => {
                this.effectFreeSpin.active = false;
                if (cb != null) cb();
            })
        ));
    }

    private showEffectJackpot(cash: number, cb: () => void = null) {
        var animName = ["jackpot fx"];
        var index = parseInt(Math.random() + "");
        this.effectJackpot.stopAllActions();
        this.effectJackpot.active = true;
        this.effectJackpot.getComponentInChildren(sp.Skeleton).setAnimation(0, animName[index], true);
        let label = this.effectJackpot.getComponentInChildren(cc.Label);
        label.node.active = false;

        this.effectJackpot.runAction(cc.sequence(
            cc.delayTime(0.4),
            cc.callFunc(() => {
                this.particleJackpt.resetSystem();
                this.particleJackpt1.resetSystem();
            }),
            cc.delayTime(0.6),
            cc.callFunc(() => {
                label.string = "";
                label.node.active = true;
                Tween.numberTo(label, cash, 1);
            }),
            cc.delayTime(6),
            cc.callFunc(() => {
                this.effectJackpot.active = false;
                if (cb != null) cb();
            })
        ));
    }

    private showEffectBonus(cb: () => void) {
        this.effectBonus.stopAllActions();
        this.effectBonus.active = true;
        this.effectBonus.getComponentInChildren(sp.Skeleton).setAnimation(0, "bonus fx", true);
        this.particleBonus.resetSystem();
        this.effectBonus.runAction(cc.sequence(
            cc.delayTime(3),
            cc.callFunc(() => {
                this.effectBonus.active = false;
                if (cb != null) cb();
            })
        ));
    }

    private onSpinResult(res: cmd.ReceivePlay | any) {
        this.stopSpin();
        //  cc.log("onSpinResult:" + JSON.stringify(res));
        // res=JSON.parse('{"_pos":85,"_data":{"0":1,"1":23,"2":113,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":6,"11":73,"12":1,"13":0,"14":30,"15":52,"16":44,"17":52,"18":44,"19":52,"20":44,"21":53,"22":44,"23":57,"24":44,"25":52,"26":44,"27":56,"28":44,"29":52,"30":44,"31":57,"32":44,"33":53,"34":44,"35":53,"36":44,"37":49,"38":48,"39":44,"40":50,"41":44,"42":53,"43":44,"44":52,"45":0,"46":14,"47":50,"48":44,"49":54,"50":44,"51":56,"52":44,"53":49,"54":49,"55":44,"56":49,"57":56,"58":44,"59":50,"60":50,"61":0,"62":0,"63":0,"64":0,"65":0,"66":0,"67":0,"68":0,"69":35,"70":40,"71":0,"72":0,"73":0,"74":0,"75":2,"76":63,"77":114,"78":248,"79":0,"80":0,"81":0,"82":0,"83":0,"84":0},"_length":85,"_controllerId":1,"_cmdId":6001,"_error":0,"ref":1609,"result":1,"matrix":"4,4,4,5,9,4,8,4,9,5,5,10,2,5,4","linesWin":"2,6,8,11,18,22","haiSao":"","prize":9000,"currentMoney":37712632,"freeSpin":0,"isFree":false,"itemsWild":"","ratio":0,"currentNumberFreeSpin":0}')
        var successResult = [0, 1, 2, 3, 4, 5, 6];

        if (successResult.indexOf(res.result) === -1) {
            this.isSpined = true;

            this.toggleAuto.isChecked = false;
            this.toggleAuto.interactable = true;
            this.toggleBoost.isChecked = false;
            this.toggleBoost.interactable = true;


            this.setEnabledAllButtons(true);
            switch (res.result) {
                case 102:
                    this.showToast(App.instance.getTextLang('txt_slot_error'));
                    break;
                default:
                    this.showToast(App.instance.getTextLang('txt_unknown_error1'));
                    break;
            }
            return;
        }
        this.currentNumberFreeSpin = res.currentNumberFreeSpin;
        this.lastSpinRes = res;
        this.columnsWild.length = 0;

        let isTrail = this.mIsTrial;
        if (!isTrail && !this.lastSpinRes.isFree) {
            Configs.Login.Coin = res.currentMoney;
        }

        let matrix = res.matrix.split(",");
        let timeScale = this.toggleBoost.isChecked ? 0.5 : 1;
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundSpin, false, 1);
        }
        for (let i = 0; i < this.reels.childrenCount; i++) {
            let roll = this.reels.children[i];
            let step1Pos = this.mHeightItem * 0.3;
            let step2Pos = -this.mHeightItem * roll.childrenCount + this.mHeightItem * 3 - this.mHeightItem * 0.3;
            let step3Pos = -this.mHeightItem * roll.childrenCount + this.mHeightItem * 3;
            TW(roll)
                .delay(0.2 * i * timeScale)
                .to(0.2 * timeScale, { position: cc.v3(roll.position.x, step1Pos) }, { easing: cc.easing.quadOut })
                .to((this.spinDuration + this.addSpinDuration * i) * timeScale, { position: cc.v3(roll.position.x, step2Pos) }, { easing: cc.easing.quadInOut })
                .to(0.2 * timeScale, { position: cc.v3(roll.position.x, step3Pos) }, { easing: cc.easing.quadIn })
                .call(() => {
                    if (this.soundSlotState == 1) {
                        cc.audioEngine.play(this.soundReelStop, false, 1);
                    }
                    roll.setPosition(cc.v2(roll.position.x, 0));
                    if (i == 4) {
                        //find columns wild
                        for (let j = 0; j < matrix.length; j++) {
                            if (parseInt(matrix[j]) == this.wildItemId) {
                                let c = j % 5;
                                if (this.columnsWild.indexOf(c) == -1) this.columnsWild.push(c);
                            }
                        }
                        //replace wild items in columns
                        for (let j = 0; j < this.columnsWild.length; j++) {
                            let c = this.columnsWild[j];
                            let children = this.reels.children[c].children;
                            children[2].getComponent(Slot6Item).setId(this.wildItemId, true);
                            children[1].getComponent(Slot6Item).setId(this.wildItemId, true);
                            children[0].getComponent(Slot6Item).setId(this.wildItemId, true);
                            this.iconWildColumns.children[c].active = true;
                            this.iconWildColumns.children[c].scale = 0;
                            cc.Tween.stopAllByTarget(this.iconWildColumns.children[c]);
                            if (this.soundSlotState == 1) {
                                cc.audioEngine.play(this.soundWild, false, 1);
                            }
                            cc.tween(this.iconWildColumns.children[c])
                                .to(0.4, { scale: 1 }, { easing: "backOut" })
                                .start();
                            this.iconWildColumns.children[c].getComponent(sp.Skeleton).animation = "animation";
                            this.iconWildColumns.children[c].getComponent(sp.Skeleton).loop = true;
                        }
                        if (this.columnsWild.length > 0) {
                            roll.runAction(cc.sequence(
                                cc.delayTime(2.6),
                                cc.callFunc(() => {
                                    for (let i = 0; i < this.iconWildColumns.childrenCount; i++) {
                                        this.iconWildColumns.children[i].active = false;
                                    }
                                }),
                                cc.delayTime(0.1),
                                cc.callFunc(() => {
                                    this.spined();
                                })
                            ));
                        } else {
                            this.spined();
                        }
                    }
                }).start();
            //rool = reel
            TW(roll)
                .delay((0.2 * i * timeScale) + (0.4 * timeScale))
                .call(() => {
                    for (let m = 0; m < roll.childrenCount; m++) {
                        let item = roll.children[m];
                        item.getComponent(Slot6Item).setIdBlur(Utils.randomRangeInt(0, 11));
                    }
                })
                .start();
            TW(roll)
                .delay((0.47 + 0.2 * i) * timeScale)
                .call(() => {
                    let listItemNode = roll.children;
                    listItemNode[2].getComponent(Slot6Item).setId(parseInt(matrix[i]), true);
                    listItemNode[1].getComponent(Slot6Item).setId(parseInt(matrix[5 + i]), true);
                    listItemNode[0].getComponent(Slot6Item).setId(parseInt(matrix[10 + i]), true);
                    listItemNode[listItemNode.length - 1].getComponent(Slot6Item).setId(parseInt(matrix[i]), true);
                    listItemNode[listItemNode.length - 2].getComponent(Slot6Item).setId(parseInt(matrix[5 + i]), true);
                    listItemNode[listItemNode.length - 3].getComponent(Slot6Item).setId(parseInt(matrix[10 + i]), true);
                })
                .start();
        }
    }

    private spined() {
        // this.skeSpin.animation = "iat";
        // this.skeSpin.loop = true;
        this.currentNumberFreeSpin = this.lastSpinRes.currentNumberFreeSpin;
        if (this.lastSpinRes.currentNumberFreeSpin > 0) {
            this.lblFreeSpinCount.node.parent.active = true;
            this.lblFreeSpinCount.string = this.currentNumberFreeSpin + "";
        }
        else {
            this.lblFreeSpinCount.node.parent.active = false;
        }
        if (this.lastSpinRes.freeSpin == 1) {
            this.showEffectFreeSpin(() => {
                this.showLineWins();
            });
        }
        else {
            var successResult = [0, 1, 3, 5, 6];
            //  cc.log("lastSpineRes:" + this.lastSpinRes.result);
            switch (this.lastSpinRes.result) {

                case TYPE_WIN.MISS://k an
                    if (this.soundSlotState == 1) {
                        cc.audioEngine.play(this.soundSpinMis, false, 1);
                    }
                    this.showLineWins();
                    break;
                case TYPE_WIN.WIN:// thang thuong

                    this.showLineWins();
                    break;
                case TYPE_WIN.BIGWIN:// thang lon
                    if (this.soundSlotState == 1) {
                        cc.audioEngine.play(this.soundBigWin, false, 1);
                    }
                    this.showEffectBigWin(this.lastSpinRes.prize, () => {
                        this.showLineWins();
                    });
                    break;
                case TYPE_WIN.JACKPOT: case TYPE_WIN.SUPERWIN://jackpot
                    if (this.soundSlotState == 1) {
                        cc.audioEngine.play(this.soundJackpot, false, 1);
                    }
                    this.showEffectJackpot(this.lastSpinRes.prize, () => {
                        this.showLineWins();
                    });
                    break;
                case 6://thang sieu lon
                    if (this.soundSlotState == 1) {
                        cc.audioEngine.play(this.soundBigWin, false, 1);
                    }
                    this.showEffectBigWin(this.lastSpinRes.prize, () => {
                        this.showLineWins();
                    });
                    break;
                case TYPE_WIN.BONUS://bonus
                    if (this.soundSlotState == 1) {
                        cc.audioEngine.play(this.soundBonus, false, 1);
                    }
                    this.showEffectBonus(() => {
                        if (this.soundSlotState == 1) {
                            this.remoteMusicBackground = cc.audioEngine.playMusic(this.soundBgBonus, true);
                        }

                        // this.popupBonus.showBonus(this.mIsTrial ? 100 : this.listBet[this.betIdx], this.lastSpinRes.haiSao, this, () => {
                        //     if (this.soundSlotState == 1) {
                        //         this.remoteMusicBackground = cc.audioEngine.playMusic(this.soundBg, true);
                        //     }
                        //     this.showLineWins();
                        // });
                        this.actShowBonus(this.mIsTrial ? 100 : this.listBet[this.betIdx], this.lastSpinRes.haiSao, () => {
                            if (this.soundSlotState == 1) {
                                this.remoteMusicBackground = cc.audioEngine.playMusic(this.soundBg, true);
                            }
                            this.showLineWins();
                        });
                    });
                    break;
            }
        }

    }
    onBtnSoundTouchBonus() {

    }

    onBtnSoundSumary() {

    }
    actBack() {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        SlotNetworkClient.getInstance().send(new cmd.SendUnSubcribe(this.betIdx));
        // cc.audioEngine.stopAll();
        // App.instance.loadScene("Lobby");

    }

    actHidden() {
        this.showToast(App.instance.getTextLang('txt_function_in_development'));
    }

    actBetUp() {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }

        let isTrail = this.mIsTrial;
        if (isTrail) {
            this.showToast(App.instance.getTextLang('txt_slot_error'));
            return;
        }
        if (this.betIdx < this.listBet.length - 1) {
            this.daiLyFreeSpin = 0;
            this.lblFreeSpinCount.node.parent.active = false;
            SlotNetworkClient.getInstance().send(new cmd.SendChangeRoom(this.betIdx, ++this.betIdx));
            this.lblBet.string = this.listBetLabel[this.betIdx];
            Tween.numberTo(this.lblTotalBet, this.arrLineSelect.length * this.listBet[this.betIdx], 0.3, (n) => { return this.moneyToK(n) });
        }
    }

    actBetDown() {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }

        let isTrail = this.mIsTrial;
        if (isTrail) {
            this.showToast(App.instance.getTextLang('txt_slot_error'));
            return;
        }
        if (this.betIdx > 0) {
            this.daiLyFreeSpin = 0;
            this.lblFreeSpinCount.node.parent.active = false;
            SlotNetworkClient.getInstance().send(new cmd.SendChangeRoom(this.betIdx, --this.betIdx));
            this.lblBet.string = this.listBetLabel[this.betIdx];
            Tween.numberTo(this.lblTotalBet, this.arrLineSelect.length * this.listBet[this.betIdx], 0.3, (n) => { return this.moneyToK(n) });
        }
    }

    actLine() {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }

        let isTrail = this.mIsTrial;
        if (isTrail) {
            this.showToast(App.instance.getTextLang('txt_slot_error'));
            return;
        }
        this.popupSelectLine.show();
    }

    actSetting() {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        this.panelSetting.active = !this.panelSetting.active;
    }

    toggleTrialOnCheck() {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }

        this.mIsTrial = !this.mIsTrial;
        let isTrail = this.mIsTrial;
        if (isTrail) {
            this.btnPlayReal.node.active = true;
            this.btnPlayTry.node.active = false;
            this.lblLine.string = "25";
            this.lblBet.string = "100";
            Tween.numberTo(this.lblTotalBet, 2500, 0.3, (n) => this.moneyToK(n));
        } else {
            this.btnPlayReal.node.active = false;
            this.btnPlayTry.node.active = true;
            this.lblLine.string = this.arrLineSelect.length.toString();
            this.lblBet.string = this.listBetLabel[this.betIdx];
            Tween.numberTo(this.lblTotalBet, this.arrLineSelect.length * this.listBet[this.betIdx], 0.3, (n) => this.moneyToK(n));
        }
    }

    toggleAutoOnCheck() {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }

        let isTrail = this.mIsTrial;
        if (this.toggleAuto.isChecked && isTrail) {
            this.toggleAuto.isChecked = false;
            this.showToast(App.instance.getTextLang('txt_slot_error'));
            return;
        }
        if (this.toggleAuto.isChecked) {
            this.spin();
            this.toggleBoost.interactable = false;
        } else {
            this.toggleBoost.interactable = true;
            if (this.isSpined) {
                this.setEnabledAllButtons(true);
            }
        }
    }

    toggleBoostOnCheck() {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }

        let isTrail = this.mIsTrial;
        if (this.toggleBoost.isChecked && isTrail) {
            this.toggleBoost.isChecked = false;
            this.showToast(App.instance.getTextLang('txt_slot_error'));
            return;
        }
        if (this.toggleBoost.isChecked) {
            this.spin();
            this.toggleAuto.interactable = false;
        } else {
            this.toggleAuto.interactable = true;
            if (this.isSpined) {
                this.setEnabledAllButtons(true);
            }
        }
    }

    //music setting

    private soundInit() {
        // musicSave :   0 == OFF , 1 == ON
        var musicSave = cc.sys.localStorage.getItem("music_Slot_7");
        if (musicSave != null) {
            this.musicSlotState = parseInt(musicSave);
        } else {
            this.musicSlotState = 1;
            cc.sys.localStorage.setItem("music_Slot_7", "1");
        }

        // soundSave :   0 == OFF , 1 == ON
        var soundSave = cc.sys.localStorage.getItem("sound_Slot_7");
        if (soundSave != null) {
            this.soundSlotState = parseInt(soundSave);
        } else {
            this.soundSlotState = 1;
            cc.sys.localStorage.setItem("sound_Slot_7", "1");
        }

        if (this.musicSlotState == 0) {
            //this.musicOff.active = true;
        } else {
            //this.musicOff.active = false;
        }

        if (this.soundSlotState == 0) {
            //this.soundOff.active = true;
        } else {
            //this.soundOff.active = false;
        }

        if (this.musicSlotState == 1) {

            this.remoteMusicBackground = cc.audioEngine.playMusic(this.soundBg, true);
        }
    }
    settingMusic() {
        //this.musicOff.active = !this.musicOff.active;
        if (!this.togglgeMusic.isChecked) {
            cc.audioEngine.stop(this.remoteMusicBackground);
            this.musicSlotState = 0;
        } else {
            this.remoteMusicBackground = cc.audioEngine.playMusic(this.soundBg, true);
            this.musicSlotState = 1;
        }

        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }

        cc.sys.localStorage.setItem("music_Slot_7", "" + this.musicSlotState);
    }
    settingSound() {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }

        if (!this.toggleSound.isChecked) {
            this.soundSlotState = 0;
        } else {

            this.soundSlotState = 1;
        }

        cc.sys.localStorage.setItem("music_Slot_7", "" + this.soundSlotState);
    }
    changeAllItemToDark(state) {
        for (let i = 0; i < this.reels.childrenCount; i++) {
            let col = this.reels.children[i];
            for (let j = 0; j < col.childrenCount; j++) {
                let item = col.children[j];
                let sprite = item.getComponentInChildren(cc.Sprite);
                let spine = item.getComponentInChildren(sp.Skeleton);
                spine.node.color = state ? cc.Color.GRAY : cc.Color.WHITE;
                sprite.node.color = state ? cc.Color.GRAY : cc.Color.WHITE;
                spine.node.active = false;
                sprite.node.active = true;

            }
        }
    }
    actHistoryJackpot() {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.mIsTrial) {
            App.instance.showToast(App.instance.getTextLang('txt_slot_error'));
            return;
        }
        if (this.popupJackpotHistory == null) {
            BundleControl.loadPrefabGame("Slot6", "prefabs/PopupJackpotHistory", (finish, total) => {
                // App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
            }, prefab => {
                App.instance.showLoading(false);
                this.popupJackpotHistory = cc.instantiate(prefab).getComponent("Slot6.PopupJackpotHistory");
                this.popupJackpotHistory.node.parent = cc.director.getScene().getChildByName("Canvas");
                this.popupJackpotHistory.show();
            });
        } else {
            this.popupJackpotHistory.show();
        }
    }
    actHistory() {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.mIsTrial) {
            App.instance.showToast(App.instance.getTextLang('txt_slot_error'));
            return;
        }
        if (this.popupHistory == null) {
            BundleControl.loadPrefabGame("Slot6", "prefabs/PopupHistory", (finish, total) => {
                // App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
            }, prefab => {
                App.instance.showLoading(false);
                this.popupHistory = cc.instantiate(prefab).getComponent(PopupHistory);
                this.popupHistory.node.parent = cc.director.getScene().getChildByName("Canvas");
                this.popupHistory.show();
            });
        } else {
            this.popupHistory.show();
        }
    }
    actSelectline() {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.mIsTrial) {
            App.instance.showToast(App.instance.getTextLang('txt_slot_error'));
            return;
        }
        if (this.popupSelectLine == null) {
            BundleControl.loadPrefabGame("Slot6", "prefabs/PopupSelectLine", (finish, total) => {
                // App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
            }, prefab => {
                App.instance.showLoading(false);
                this.popupSelectLine = cc.instantiate(prefab).getComponent(PopupSelectLine);
                this.popupSelectLine.node.parent = cc.director.getScene().getChildByName("Canvas");
                this.popupSelectLine.show();
                this.popupSelectLine.onSelectedChanged = (lines) => {
                    this.arrLineSelect = lines;
                    this.lblLine.string = this.arrLineSelect.length.toString();
                    Tween.numberTo(this.lblTotalBet, this.arrLineSelect.length * this.listBet[this.betIdx], 0.3, (n) => { return this.moneyToK(n) });
                }
            });
        } else {
            this.popupSelectLine.show();
        }
    }
    actShowBonus(isTrial, dataHaiSao, cb) {
        if (this.popupBonus == null) {
            BundleControl.loadPrefabGame("Slot6", "prefabs/PopupBonus", (finish, total) => {
                // App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
            }, prefab => {
                App.instance.showLoading(false);
                this.popupBonus = cc.instantiate(prefab).getComponent(PopupBonus);
                this.popupBonus.node.parent = cc.director.getScene().getChildByName("Canvas");
                this.popupBonus.showBonus(isTrial, dataHaiSao, this, cb);
            })
        } else {
            this.popupBonus.showBonus(isTrial, dataHaiSao, this, cb);
        }
    }
}
