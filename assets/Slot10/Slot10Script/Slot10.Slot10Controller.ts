
import cmd from "./Slot10.Cmd";

import Configs from "../../Loading/src/Configs";
import PopupSelectLine from "./Slot10.PopupSelectLine";
import PopupBonus from "./Slot10.PopupBonus";
import TrialResults from "./Slot10.TrialResults";
import Slot10Lobby from "./Slot10.Lobby";
import Slot10Item from "./Slot10.Item";
import App from "../../Lobby/LobbyScript/Script/common/App";
import BroadcastReceiver from "../../Lobby/LobbyScript/Script/common/BroadcastReceiver";
import Tween from "../../Lobby/LobbyScript/Script/common/Tween";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import SlotNetworkClient from "../../Lobby/LobbyScript/Script/networks/SlotNetworkClient";
import UIItemIconSlot25 from "../../Lobby/LobbyScript/Script/BaseSlot25/ItemIconSlot25";
import Slot10ItemSlot from "./Slot10.Item";

const enum TYPE_WIN {
    MISS = 0,
    WIN = 1,
    BIGWIN = 2,
    JACKPOT = 3,
    SUPERWIN = 4,
    BONUS = 5
}
var MAX_CYCCLE_SPIN = 20;
var FAST_CYCCLE_SPIN = 10;
var ERROR_CYCCLE_SPIN = 50;
const { ccclass, property } = cc._decorator;

@ccclass
export default class Slot10Controller extends cc.Component {

    @property(Slot10Lobby)
    mSlotLobby: Slot10Lobby = null;


    @property(cc.Node)
    nodeCoin: cc.Node = null;


    @property(cc.Integer)
    mHeightItem: number = 180;

    @property(cc.Integer)
    mWidthItem: number = 180;

    @property(cc.Node)
    reels: cc.Node = null; // reel

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
    // @property(cc.Toggle)
    // toggleTrial: cc.Toggle = null;

    @property(cc.Button)
    btnSpin: cc.Button = null;
    @property(cc.Button)
    btnBack: cc.Button = null;
    @property(cc.Button)
    btnPlayTry: cc.Button = null;
    @property(cc.Button)
    btnPlayReal: cc.Button = null;
    // @property(cc.Button)
    // btnBetUp: cc.Button = null;
    // @property(cc.Button)
    // btnBetDown: cc.Button = null;
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
    @property(cc.Node)
    effectBonus: cc.Node = null;

    @property(PopupSelectLine)
    popupSelectLine: PopupSelectLine = null;
    @property(PopupBonus)
    popupBonus: PopupBonus = null;

    @property({ type: cc.AudioClip })
    soundSpinMis: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundSpinWin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundBigWin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundJackpot: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundBonus: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundClick: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundSpin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundEndSpin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundBg: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundBgBonus: cc.AudioClip = null;

    public dailyFreeSpin = 0;
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


    public mIsTrial = false;


    //new 

    private isFastCurrent = false;
    private isFast = false;

    @property([cc.Node])
    arrReel: cc.Node[] = [];

    @property
    distanceReel: number = 0;

    @property([cc.SpriteFrame])
    iconSpriteFrameBlurArr: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    iconSpriteFrameArr: cc.SpriteFrame[] = [];


    @property([Slot10ItemSlot])
    arrUIItemIcon: Slot10ItemSlot[] = [];
    @property([Slot10ItemSlot])
    arrRealItem: Slot10ItemSlot[] = [];

    @property([sp.SkeletonData])
    arrSkeletonIcon: sp.SkeletonData[] = [];


    public numberSpinReel = null;
    public isHaveResultSpin = false;
    public dataResult = null;
    public musicSlotState = null;
    public soundSlotState = null;
    public remoteMusicBackground = null;
    mutipleJpNode =null;
    start() {
        this.dailyFreeSpin = 0;
        this.soundInit();
        this.randomIconList();
        //dang ky khi mat ket noi tu dong back
        SlotNetworkClient.getInstance().addOnClose(() => {
            //this.actBack();
            this.mSlotLobby.onBtnBack();
        }, this);
        this.iconWildColumns.zIndex = 3;
        //listenner client - server
        SlotNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.FREE_DAI_LY:
                    {
                        if (!this.mIsTrial) {
                            let res = new cmd.ReceiveFreeDaiLy(data);
                            this.dailyFreeSpin = res.freeSpin;
                            if (this.dailyFreeSpin > 0) {
                                this.lblFreeSpinCount.node.parent.active = true;
                                this.lblFreeSpinCount.string = this.dailyFreeSpin + "";
                            }
                            else {
                                this.lblFreeSpinCount.node.parent.active = false;
                            }
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
                    this.mSlotLobby.onUpdateJackpot(data);
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
        this.popupSelectLine.onSelectedChanged = (lines) => {
            this.arrLineSelect = lines;
            this.lblLine.string = this.arrLineSelect.length.toString();
            Tween.numberTo(this.lblTotalBet, this.arrLineSelect.length * this.listBet[this.betIdx], 0.3, (n) => { return this.moneyToK(n) });
        }
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

        this.mSlotLobby.init(this);
        this.mSlotLobby.node.active = true;
        this.btnPlayReal.node.active = false;
        this.btnPlayTry.node.active = true;
        //this.initMutipleJPNode();
    }
     initMutipleJPNode() {
        if (!this.mutipleJpNode) {
            cc.assetManager.getBundle("Lobby").load("prefabs/MutipleJackpotPr", cc.Prefab, function (finish, total, item) {
            }, (err1, prefab: cc.Prefab) => {
                if (err1 != null) {
                    //  cc.log("errr load game TIENLEN:", err1);
                } else {
                    this.mutipleJpNode = cc.instantiate(prefab).getComponent("MutipleJackpot");
                    this.mutipleJpNode.node.parent = cc.director.getScene().getChildByName("Canvas")
                    this.mutipleJpNode.setInfo("THETHAO");
                }
            })
        }
    }
    onBtnSoundTouchBonus() {

    }

    onBtnSoundSumary() {

    }


    getSpriteFrameIconBlur(indexIcon) {
        var self = this;

        return self.iconSpriteFrameBlurArr[indexIcon];
    }

    getSpriteFrameIcon(indexIcon) {
        var self = this;

        return self.iconSpriteFrameArr[indexIcon];
    }

    getSpineIcon(indexIcon) {
        var self = this;

        return self.arrSkeletonIcon[indexIcon];
    }

    randomIconList() {
        var self = this;
        for (var i = 0; i < self.arrUIItemIcon.length; i++) {
            var index = i;
            var itemId = Math.floor(Math.random() * (self.iconSpriteFrameArr.length));
            self.arrUIItemIcon[i].init(itemId, index, self);
            this.arrUIItemIcon[index].changeSpineIcon(itemId)

        }
    }

    public onJoinRoom() {
        this.lblBet.string = this.listBetLabel[this.betIdx];
        let totalbet = (this.arrLineSelect.length * this.listBet[this.betIdx]);
        Tween.numberTo(this.lblTotalBet, totalbet, 0.3);

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
        this.btnSpin.node.children[0].active = enabled;
        this.btnBack.interactable = enabled;
        // this.btnBetUp.interactable = enabled;
        // this.btnBetDown.interactable = enabled;
        this.btnLine.interactable = enabled;
        this.btnPlayTry.interactable = enabled;
        this.btnPlayReal.interactable = enabled;
        //this.toggleTrial.interactable = enabled;
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
        for (var i = 0; i < this.iconWildColumns.childrenCount; i++) {
            this.iconWildColumns.children[i].active = false;
        }
        this.stopAllItemEffect();
    }

    private stopAllItemEffect() {
        for (let i = 0; i < this.reels.childrenCount; i++) {
            for (let i = 0; i < this.reels.childrenCount; i++) {
                let children = this.reels.children[i].children; // ???
                for (let j = 0; j < children.length; j++) {
                    cc.Tween.stopAllByTarget(children[j]);
                    children[j].scale = 1;
                }
            }
        }
    }

    private spin() {
        //  cc.log("spin cai coi");
        if (!this.isSpined) return;
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundSpin, false, 1);
        }
        this.changeAllItemToDark(false);
        let isTrail = this.mIsTrial;
        if (!isTrail) {

            if (this.dailyFreeSpin > 0) {
                this.dailyFreeSpin--;
                if (this.dailyFreeSpin > 0) {
                    this.lblFreeSpinCount.node.parent.active = true;
                    this.lblFreeSpinCount.string = this.dailyFreeSpin + "";
                }
                else {
                    this.lblFreeSpinCount.node.parent.active = false;
                }
            }
            else {
                if (Configs.Login.Coin < this.listBet[this.betIdx] * this.arrLineSelect.length) {
                    App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_not_enough"));
                    return;
                }
            }
            this.isSpined = false;
            this.stopAllEffects();
            this.stopShowLinesWin();
            this.setEnabledAllButtons(false);
            var data = new cmd.SendPlay(this.arrLineSelect.toString());
            SlotNetworkClient.getInstance().send(data);
        } else {
            this.isSpined = false;
            this.stopAllEffects();
            this.stopShowLinesWin();
            this.setEnabledAllButtons(false);
            var rIdx = Utils.randomRangeInt(0, TrialResults.results.length);
            this.onSpinResult(TrialResults.results[rIdx]);
        }
    }

    private stopSpin() {

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
            this.linesWin.zIndex = 2;
            this.reels.zIndex = 1;
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
                        this.linesWin.zIndex = 1;
                        this.reels.zIndex = 2;
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
                        let arrItem = this.getItemWinInLine(lineIdx);
                        let arrIdOfItem = [];
                        let idWin = -1;
                        arrItem.forEach((item) => {
                            arrIdOfItem.push(item.itemId);
                        });
                        arrItem.forEach((item) => {
                            idWin = this.getItemIdWinInLine(arrIdOfItem);
                            if (item.itemId == idWin) {
                                cc.Tween.stopAllByTarget(item.node);
                                cc.tween(item.node).repeatForever(cc.tween().to(0.2, { scale: item.node.scale + 0.1 }).to(0.2, { scale: item.node.scale })).start();
                                item.checkShowSpriteOrSpine();
                            }
                        });
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

    private showCoins(prize){
        var number = prize/20000;
        if(number <= 10) number = 10;
        else if(number >= 30) number = 30;
        App.instance.showCoins(number,this.lblWinNow.node,this.nodeCoin);
    }

    private showWinCash(cash: number) {
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
        this.effectBigWin.getComponentInChildren(sp.Skeleton).setAnimation(0, "animation", false);
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
        this.effectJackpot.getComponentInChildren(sp.Skeleton).setAnimation(0, "animation", false);
        let label = this.effectJackpot.getComponentInChildren(cc.Label);
        label.node.active = false;

        this.effectJackpot.runAction(cc.sequence(
            cc.delayTime(1),
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
        this.effectBonus.getComponentInChildren(sp.Skeleton).setAnimation(0, "animation", false);

        this.effectBonus.runAction(cc.sequence(
            cc.delayTime(3),
            cc.callFunc(() => {
                this.effectBonus.active = false;
                if (cb != null) cb();
            })
        ));
    }

    private actClick() {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundEndSpin, false, 1);
        }
    }

    public beginSpinReel(indexReel) {
        var self = this;
        self.isFastCurrent = self.toggleBoost.isChecked;
        self.numberSpinReel[indexReel] = 0;

        cc.Tween.stopAllByTarget(self.arrReel[indexReel]);
        cc.tween(self.arrReel[indexReel])
            .delay(indexReel * 0.2)
            .to(0.1, { position: cc.v3(self.arrReel[indexReel].position.x, 70, 0) }, { easing: "linear" })
            .call(() => {
                self.loopSpinReel(indexReel);
            })
            .start();
    }

    loopSpinReel(indexReel) {

        cc.tween(this.arrReel[indexReel])
            .to(0.06, { position: cc.v3(this.arrReel[indexReel].position.x, -this.distanceReel, 0) }, { easing: "linear" })
            .call(() => {
                this.processLoopSpinReel(indexReel);
            })
            .start();
    }

    processLoopSpinReel(indexReel) {
        this.numberSpinReel[indexReel] += 1;
        for (var i = 4; i >= 0; i--) {
            var index = indexReel + (i * 5);

            var indexRow = Math.floor(index / 5);
            var itemIdTmp = 0;
            if (indexRow == 0) {
                itemIdTmp = Math.floor(Math.random() * this.iconSpriteFrameBlurArr.length);
            }
            else {
                itemIdTmp = this.arrUIItemIcon[index - 5].itemId;
            }
            let item = this.arrUIItemIcon[index];
            item.changeSpriteBlurByItemId(itemIdTmp);
        }
        this.arrReel[indexReel].position = cc.v3(this.arrReel[indexReel].position.x, 0, 0);
        if (this.isHaveResultSpin) {
            if (this.isFastCurrent == false) {
                if (this.numberSpinReel[indexReel] >= MAX_CYCCLE_SPIN) {
                    this.endSpinReel(indexReel);
                }
                else {
                    this.loopSpinReel(indexReel);
                }
            }
            else {
                if (this.numberSpinReel[indexReel] >= FAST_CYCCLE_SPIN) {
                    this.endSpinReel(indexReel);
                }
                else {
                    this.loopSpinReel(indexReel);
                }
            }
        }
        else {
            if (this.numberSpinReel[indexReel] >= ERROR_CYCCLE_SPIN) {
                this.endSpinReel(indexReel);
            }
            else {
                this.loopSpinReel(indexReel);
            }
        }

    }
    showWildBig() {
        var self = this;
        if (self.iconWildColumns.children.length <= 0) return;
        if (self.dataResult == null) return;
        var slotDatas = self.dataResult.matrix.split(',');
        var isWild = false;
        for (var i = 0; i < slotDatas.length; i++) {
            if (slotDatas[i] == self.wildItemId) {
                if (isWild == false) {
                    isWild = true;
                }
                var indexRow = Math.floor(i % 5);
                self.iconWildColumns.children[indexRow].scale = 0;
                cc.Tween.stopAllByTarget(self.iconWildColumns.children[indexRow]);
                cc.tween(self.iconWildColumns.children[indexRow])
                    .to(0.5, { scale: 1 }, { easing: "backOut" })
                    .start();
                self.iconWildColumns.children[indexRow].active = true;
                self.iconWildColumns.children[indexRow].getComponent("sp.Skeleton").setAnimation(0, "animation", false);
            }
        }
    }

    endSpinReel(indexReel) {
        if (this.dataResult == null) {
            for (var i = 3; i >= 1; i--) {
                var index = indexReel + (i * 5);
                var itemId = Math.floor(Math.random() * (this.iconSpriteFrameArr.length));
                this.arrUIItemIcon[index].changeSpineIcon(itemId)
            }
            return;
        }
        var matrix = this.dataResult.matrix.split(',');
        var roll = this.reels.children[indexReel];
        this.arrReel[indexReel].position = cc.v3(this.arrReel[indexReel].position.x, this.distanceReel, 0);
        for (var i = 3; i >= 1; i--) {
            var index = indexReel + (i * 5);
            this.arrUIItemIcon[index].changeSpineIcon(matrix[index - 5])
        }
        cc.tween(this.arrReel[indexReel])
            .to(0.3, { position: cc.v3(this.arrReel[indexReel].position.x, 0, 0) }, { easing: "backOut" })
            .call(() => {
                if (this.soundSlotState == 1) {
                    cc.audioEngine.play(this.soundEndSpin, false, 1);
                }
                if (indexReel == 4) {
                    // this.showWildBig();
                    this.spined();
                }
            })
            .start();
    }



    private spined() {

        if (this.lastSpinRes.freeSpin) {
            this.lblFreeSpinCount.string = this.lastSpinRes.freeSpin.toString();
        }

        var successResult = [0, 1, 3, 5, 6];
        switch (this.lastSpinRes.result) {
            case TYPE_WIN.MISS://k an
                if (this.soundSlotState == 1) {
                    cc.audioEngine.play(this.soundSpinMis, false, 1);
                }
                this.showLineWins();
                break;
            case TYPE_WIN.WIN:// thang thuong
                if (this.soundSlotState == 1) {
                    cc.audioEngine.play(this.soundSpinWin, false, 1);
                }
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
                    if (this.musicSlotState == 1) {

                        this.remoteMusicBackground = cc.audioEngine.playMusic(this.soundBgBonus, true);
                    }
                    this.popupBonus.showBonus(this.mIsTrial ? 100 : this.listBet[this.betIdx], this.dataResult.haiSao, this, () => {
                        this.showLineWins();
                    });
                });
                break;
        }
    }


    public onSpinResult(res: cmd.ReceivePlay | any) {

        this.stopSpin();
        //  cc.log("onSpinResult:" + JSON.stringify(res));
        // res = JSON.parse('{"_pos":78,"_data":{"0":1,"1":11,"2":185,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":6,"11":126,"12":1,"13":0,"14":29,"15":52,"16":44,"17":49,"18":44,"19":55,"20":44,"21":51,"22":44,"23":48,"24":44,"25":56,"26":44,"27":53,"28":44,"29":51,"30":44,"31":52,"32":44,"33":50,"34":44,"35":51,"36":44,"37":51,"38":44,"39":54,"40":44,"41":51,"42":44,"43":55,"44":0,"45":9,"46":51,"47":44,"48":57,"49":44,"50":49,"51":48,"52":44,"53":49,"54":57,"55":0,"56":0,"57":0,"58":0,"59":0,"60":0,"61":0,"62":0,"63":15,"64":60,"65":0,"66":0,"67":0,"68":0,"69":2,"70":78,"71":76,"72":36},"_length":73,"_controllerId":1,"_cmdId":3001,"_error":0,"ref":1662,"result":1,"matrix":"4,1,7,3,0,8,5,3,4,2,3,3,6,3,7","linesWin":"3,9,10,19","haiSao":"","prize":3900,"currentMoney":38685732,"isFree":false,"itemsWild":""}');
        var successResult = [0, 1, 2, 3, 4, 5, 6];
        //res.result == 5 //bonus
        //res.result == 0 //khong an
        //res.result == 1 //thang thuong
        //res.result == 2 //thang lon
        //res.result == 3 //no hu
        //res.result == 6 //thang cuc lon
        if (successResult.indexOf(res.result) === -1) {
            this.isSpined = true;

            this.toggleAuto.isChecked = false;
            this.toggleAuto.interactable = true;
            this.toggleBoost.isChecked = false;
            this.toggleBoost.interactable = true;


            this.setEnabledAllButtons(true);
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
        this.lastSpinRes = res;
        this.columnsWild.length = 0;

        let isTrail = this.mIsTrial;
        if (!isTrail && !this.lastSpinRes.isFree) {
            let curMoney = Configs.Login.Coin - this.arrLineSelect.length * this.listBet[this.betIdx];
            Tween.numberTo(this.lblCoin, curMoney, 0.3);
            Configs.Login.Coin = res.currentMoney;
        }


        this.numberSpinReel = new Array(this.arrReel.length);
        this.dataResult = res;
        this.isHaveResultSpin = true;

        for (var i = 0; i < this.arrReel.length; i++) {
            this.beginSpinReel(i);
        }

        return;
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
            roll.runAction(cc.sequence(
                cc.delayTime(0.2 * i * timeScale),
                cc.moveTo(0.2 * timeScale, cc.v2(roll.position.x, step1Pos)).easing(cc.easeQuadraticActionOut()),
                cc.moveTo((this.spinDuration + this.addSpinDuration * i) * timeScale, cc.v2(roll.position.x, step2Pos)).easing(cc.easeQuadraticActionInOut()),
                cc.moveTo(0.2 * timeScale, cc.v2(roll.position.x, step3Pos)).easing(cc.easeQuadraticActionIn()),
                cc.callFunc(() => {
                    roll.setPosition(cc.v2(roll.position.x, 0));
                    if (this.soundSlotState == 1) {
                        cc.audioEngine.play(this.soundEndSpin, false, 1);
                    }
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
                            children[2].getComponent(Slot10Item).setId(this.wildItemId);
                            children[1].getComponent(Slot10Item).setId(this.wildItemId);
                            children[0].getComponent(Slot10Item).setId(this.wildItemId);

                            // children[2].children[0].getComponent(cc.Sprite).spriteFrame = this.sprFrameItems[this.wildItemId];
                            // children[1].children[0].getComponent(cc.Sprite).spriteFrame = this.sprFrameItems[this.wildItemId];
                            // children[0].children[0].getComponent(cc.Sprite).spriteFrame = this.sprFrameItems[this.wildItemId];
                            this.iconWildColumns.children[c].active = true;
                            if (this.soundSlotState == 1) {
                                cc.audioEngine.play(this.soundSpinWin, false, 1);
                            }
                            this.iconWildColumns.children[c].getComponent("sp.Skeleton").setAnimation(0, "animation", false);
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
                })
            ));

            //rool = reel
            roll.runAction(cc.sequence(
                cc.delayTime((0.47 + 0.2 * i) * timeScale),
                cc.callFunc(() => {
                    let listItemNode = roll.children;
                    // listItem[2].children[0].getComponent(cc.Sprite).spriteFrame = this.sprFrameItems[parseInt(matrix[i])];
                    // listItem[1].children[0].getComponent(cc.Sprite).spriteFrame = this.sprFrameItems[parseInt(matrix[5 + i])];
                    // listItem[0].children[0].getComponent(cc.Sprite).spriteFrame = this.sprFrameItems[parseInt(matrix[10 + i])];
                    // listItem[listItem.length - 1].children[0].getComponent(cc.Sprite).spriteFrame = this.sprFrameItems[parseInt(matrix[i])];
                    // listItem[listItem.length - 2].children[0].getComponent(cc.Sprite).spriteFrame = this.sprFrameItems[parseInt(matrix[5 + i])];
                    // listItem[listItem.length - 3].children[0].getComponent(cc.Sprite).spriteFrame = this.sprFrameItems[parseInt(matrix[10 + i])];

                    listItemNode[2].getComponent(Slot10Item).setId(parseInt(matrix[i]));
                    listItemNode[1].getComponent(Slot10Item).setId(parseInt(matrix[5 + i]));
                    listItemNode[0].getComponent(Slot10Item).setId(parseInt(matrix[10 + i]));
                    listItemNode[listItemNode.length - 1].getComponent(Slot10Item).setId(parseInt(matrix[i]));
                    listItemNode[listItemNode.length - 2].getComponent(Slot10Item).setId(parseInt(matrix[5 + i]));
                    listItemNode[listItemNode.length - 3].getComponent(Slot10Item).setId(parseInt(matrix[10 + i]));
                })
            ));
        }
    }



    actBack() {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        SlotNetworkClient.getInstance().send(new cmd.SendUnSubcribe(this.betIdx));


        this.mSlotLobby.node.active = true;
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
            this.dailyFreeSpin = 0;
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
            this.dailyFreeSpin = 0;
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
    getItemWinInLine(lineId) {
        let lineArr = this.mapLine[lineId];
        let arrItem = [];
        this.arrRealItem = [];
        for (let i = 0; i < 15; i++) {
            this.arrRealItem.push(this.arrUIItemIcon[i + 5]);
        }
        for (let i = 0; i < lineArr.length; i++) {
            arrItem.push(this.arrRealItem[lineArr[i]]);
        }
        return arrItem;
    }
    getItemIdWinInLine(arrId: Array<number>) {
        let count = 0;
        let idWin = -1;
        arrId.forEach((id) => {
            let size = arrId.filter(x => x == id && x != 1).length;
            if (size >= count) {
                count = size;
                idWin = id;
            }
        })
        return idWin;
    }
}
