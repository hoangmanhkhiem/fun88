import cmd from "./Slot3.Cmd";

import Configs from "../../Loading/src/Configs";
import PopupSelectLine from "./Slot3.PopupSelectLine";
import PopupBonus from "./Slot3.PopupBonus";
import TrialResults from "./Slot3.TrialResults";
import App from "../../Lobby/LobbyScript/Script/common/App";
import BroadcastReceiver from "../../Lobby/LobbyScript/Script/common/BroadcastReceiver";
import Tween from "../../Lobby/LobbyScript/Script/common/Tween";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import SlotNetworkClient from "../../Lobby/LobbyScript/Script/networks/SlotNetworkClient";
import BundleControl from "../../Loading/src/BundleControl";
import PopupGuide from "./Slot3.PopupGuide";
import PopupHistory from "./Slot3.PopupHistory";
import PopupJackpotHistory from "./Slot3.PopupJackpotHistory";
import lobbyCMD from "../../Lobby/LobbyScript/Lobby.Cmd";
var TW = cc.tween;
const { ccclass, property } = cc._decorator;

@ccclass
export default class Slot3Controller extends cc.Component {
    @property(cc.Node)
    nodeCoin: cc.Node = null;
    @property(cc.Toggle)
    toggleMusic: cc.Toggle = null;
    @property([cc.SpriteFrame])
    sprFrameItems: cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame])
    sprFrameItemsBlur: cc.SpriteFrame[] = [];

    @property(cc.Node)
    columns: cc.Node = null;
    @property(cc.Node)
    itemTemplate: cc.Node = null;
    @property(cc.Node)
    linesWin: cc.Node = null;
    @property(cc.Node)
    iconWildColumns: cc.Node = null;

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
    toggleBoost: cc.Toggle = null;
    @property(cc.Toggle)
    toggleTrial: cc.Toggle = null;

    @property(cc.Button)
    btnSpin: cc.Button = null;
    @property(cc.Button)
    btnBack: cc.Button = null;
    @property(cc.Button)
    btnBetUp: cc.Button = null;
    @property(cc.Button)
    btnBetDown: cc.Button = null;
    @property(cc.Button)
    btnLine: cc.Button = null;

    @property(cc.Node)
    toast: cc.Node = null;

    @property(cc.Node)
    effectWinCash: cc.Node = null;
    @property(cc.Node)
    effectBigWin: cc.Node = null;
    @property(cc.Node)
    effectJackpot: cc.Node = null;
    @property(cc.Node)
    effectBonus: cc.Node = null;
    @property(cc.Node)
    effectFreeSpin: cc.Node = null;

    @property(PopupSelectLine)
    popupSelectLine: PopupSelectLine = null;
    @property(PopupGuide)
    popupGuide: PopupGuide = null;
    @property(PopupJackpotHistory)
    popupJackpotHistory: PopupJackpotHistory = null;
    @property(PopupHistory)
    popupHistory: PopupHistory = null;
    @property(PopupBonus)
    popupBonus: PopupBonus = null;

    @property({ type: cc.AudioClip })
    soundBg: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundBgBonus: cc.AudioClip = null;


    @property({ type: cc.AudioClip })
    soundClick: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundBonusFail: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundFreeSpin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundGoldEarn: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundJackpot: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundSpinResult: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundSpinSpinning: cc.AudioClip = null;


    @property({ type: sp.SkeletonData })
    spineIcon: sp.SkeletonData = null;
    @property([sp.SkeletonData])
    spineIconList: sp.SkeletonData[] = [];
    public daiLyFreeSpin = 0;
    private rollStartItemCount = 15;
    private rollAddItemCount = 10;
    private spinDuration = 1.2;
    private addSpinDuration = 0.3;
    private itemHeight = 0;
    private betIdx = 0;
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
        [5, 1, 12, 3, 9],//23
        [5, 11, 2, 13, 9],//22
        [0, 11, 2, 13, 4],//24
        [10, 1, 12, 3, 14]//25
    ];
    private lastSpinRes: cmd.ReceivePlay = null;
    private columnsWild = [];
    private currentNumberFreeSpin = 0;
    private mutipleJpNode = null;
    start() {
        this.daiLyFreeSpin = 0;
        var musicSave = cc.sys.localStorage.getItem("music_Slot_3");

        if (musicSave != null) {
            this.musicSlotState = parseInt(musicSave);
        } else {
            this.musicSlotState = 1;
            cc.sys.localStorage.setItem("music_Slot_3", "1");
        }

        // soundSave :   0 == OFF , 1 == ON
        var soundSave = cc.sys.localStorage.getItem("music_Slot_3");
        if (soundSave != null) {
            this.soundSlotState = parseInt(soundSave);
        } else {
            this.soundSlotState = 1;
            cc.sys.localStorage.setItem("music_Slot_3", "1");
        }

        if (this.musicSlotState == 0) {
            this.toggleMusic.isChecked = true;
        } else {
            this.toggleMusic.isChecked = false;
        }

        if (this.musicSlotState == 1) {
            var musicId = this.randomBetween(0, 4);
            this.remoteMusicBackground = cc.audioEngine.playMusic(this.soundBg, true);
        }
        // cc.audioEngine.play(this.soundBg, true, 1);
        this.itemHeight = this.itemTemplate.height;
        for (let i = 0; i < this.columns.childrenCount; i++) {
            let column = this.columns.children[i];
            let count = this.rollStartItemCount + i * this.rollAddItemCount;
            for (let j = 0; j < count; j++) {
                let item = cc.instantiate(this.itemTemplate);
                item.getComponentInChildren(sp.Skeleton).node.active = false;
                item.parent = column;
                if (j >= 3) {
                    this.setItemSprite(item.children[0].getComponent(cc.Sprite), this.sprFrameItemsBlur[Utils.randomRangeInt(0, this.sprFrameItemsBlur.length)]);
                } else {
                    this.setItemSprite(item.children[0].getComponent(cc.Sprite), this.sprFrameItems[Utils.randomRangeInt(0, this.sprFrameItems.length)]);
                }
            }
        }
        this.itemTemplate.removeFromParent();
        this.itemTemplate = null;

        SlotNetworkClient.getInstance().addOnClose(() => {
            this.actBack();
        }, this);
        SlotNetworkClient.getInstance().send(new cmd.SendSubcribe(this.betIdx));
        SlotNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case lobbyCMD.Code.UPDATE_JACKPOT_SLOTS:
                    {
                        let res = new lobbyCMD.ResUpdateJackpotSlots(data);
                        let resJson = JSON.parse(res.pots);
                        // //  cc.log("UPDATE_JACKPOT_SLOTS:"+JSON.stringify(resJson));

                    }
                    break;
                case cmd.Code.FREE_DAI_LY:
                    {
                        if (!this.toggleTrial.isChecked) {
                            let res = new cmd.ReceiveFreeDaiLy(data);
                            this.daiLyFreeSpin = res.freeSpin;
                        }

                    }
                    break;
                case cmd.Code.DATE_X2:
                    {
                        let res = new cmd.ReceiveDateX2(data);

                        //  cc.log("DATE_X2:" + JSON.stringify(res));
                        this.currentNumberFreeSpin = res.freeSpin + this.daiLyFreeSpin;
                        if (res.freeSpin > 0) {
                            this.lblFreeSpinCount.node.parent.active = true;
                            this.lblFreeSpinCount.string = res.freeSpin.toString();
                        }
                        else {
                            this.lblFreeSpinCount.node.parent.active = false;
                        }
                    }
                    break;
                case cmd.Code.UPDATE_POT:
                    {
                        let res = new cmd.ReceiveUpdatePot(data);
                        Tween.numberTo(this.lblJackpot, res.jackpot, 0.3);
                    }
                    break;
                case cmd.Code.PLAY:
                    {
                        let res = new cmd.ReceivePlay(data);
                        // //  cc.log(res);
                        this.onSpinResult(res);
                    }
                    break;
            }
        }, this);


       
        this.stopShowLinesWin();
        this.changeItemToDark(false);
        this.toast.active = false;
        this.effectWinCash.active = false;
        this.effectJackpot.active = false;
        this.effectBigWin.active = false;
        this.lblTotalBet.string = Utils.formatMoney(this.arrLineSelect.length * this.listBet[this.betIdx]);


        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            Tween.numberTo(this.lblCoin, Configs.Login.Coin, 0.3);
        }, this);
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

        App.instance.showErrLoading("Đang kết nối tới server...");
        SlotNetworkClient.getInstance().checkConnect(() => {
            App.instance.showLoading(false);
        });
        cc.tween(this.btnSpin.node.getChildByName("ic_arrow")).by(1.0, { angle: -360 }).repeatForever().start();
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
                    this.mutipleJpNode.setInfo("THANTAI");
                }
            })
        }
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
        return Utils.formatMoney(money);
        // return money.toString();
    }

    private setEnabledAllButtons(enabled: boolean) {
        this.btnSpin.interactable = enabled;
        this.btnBack.interactable = enabled;
        this.btnBetUp.interactable = enabled;
        this.btnBetDown.interactable = enabled;
        this.btnLine.interactable = enabled;
        this.toggleTrial.interactable = enabled;
        if (enabled) {
            this.btnSpin.node.getChildByName("ic_arrow").active = true;
            cc.Tween.stopAllByTarget(this.btnSpin.node.getChildByName("ic_arrow"));
            cc.tween(this.btnSpin.node.getChildByName("ic_arrow")).by(1.0, { angle: -360 }).repeatForever().start();
        } else {
            this.btnSpin.node.getChildByName("ic_arrow").active = false;
        }

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
        for (let i = 0; i < this.columns.childrenCount; i++) {
            let col = this.columns.children[i];
            for (let j = 0; j < col.childrenCount; j++) {
                let item = col.children[j];
                item.stopAllActions();
                item.scale = 1;
            }
        }
    }

    private spin() {
        if (!this.isSpined) return;
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundSpinSpinning, false, 1);
        }


        if (!this.toggleTrial.isChecked) {


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
            this.changeItemToDark(false);
            this.stopAllEffects();
            this.stopShowLinesWin();
            this.setEnabledAllButtons(false);
            SlotNetworkClient.getInstance().send(new cmd.SendPlay(this.arrLineSelect.toString()));
        } else {
            this.isSpined = false;
            this.changeItemToDark(false);
            this.stopAllEffects();
            this.stopShowLinesWin();
            this.setEnabledAllButtons(false);
            var rIdx = Utils.randomRangeInt(0, TrialResults.results.length);
            this.onSpinResult(TrialResults.results[rIdx]);
        }
    }

    private stopSpin() {
        for (var i = 0; i < this.columns.childrenCount; i++) {
            var roll = this.columns.children[i];
            roll.stopAllActions();
            roll.setPosition(cc.v2(roll.getPosition().x, 0));
        }
    }

    private showLineWins() {
        this.isSpined = true;
        this.linesWin.zIndex = 2;
        this.columns.zIndex = 1;
        Tween.numberTo(this.lblWinNow, this.lastSpinRes.prize, 0.3);
        if (!this.toggleTrial.isChecked) BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
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
        let rolls = this.columns.children;
        let actions = [];
        for (let i = 0; i < linesWinChildren.length; i++) {
            linesWinChildren[i].active = linesWin.indexOf("" + (i + 1)) >= 0;;
        }
        if (this.lastSpinRes.prize > 0) {
            this.changeItemToDark(true);
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
                        this.linesWin.zIndex = 1;
                        this.columns.zIndex = 2;
                        // //  cc.log("================: " + lineIdx);
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
                            item.runAction(cc.repeatForever(cc.sequence(
                                cc.scaleTo(0.2, 1.1),
                                cc.scaleTo(0.2, 1)
                            )));
                            this.setDarkItem(item, false);
                        }
                        // //  cc.log("lineIdx: " + lineIdx + "fisrtItemId: " + fisrtItemId + " countItemWin: " + countItemWin);
                    }));
                    actions.push(cc.delayTime(1));
                    actions.push(cc.callFunc(() => {
                        line.active = false;
                        this.changeItemToDark(true);
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
            this.changeItemToDark(false);
            if (this.toggleBoost.isChecked || this.toggleAuto.isChecked) {
                this.spin();
            }
        }));
        this.linesWin.runAction(cc.sequence.apply(null, actions));
    }
    private showCoins(prize) {
        var number = prize / 20000;
        if (number <= 10) number = 10;
        else if (number >= 30) number = 30;
        //  cc.log("showCoins:" + number);
        App.instance.showCoins(number, this.effectWinCash, this.nodeCoin);
    }
    private showWinCash(cash: number) {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundGoldEarn, false, 1);
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

    private showEffectFreeSpin(cb: () => void) {
        this.effectFreeSpin.stopAllActions();
        this.effectFreeSpin.active = true;
        let spine = this.effectFreeSpin.getComponentInChildren(sp.Skeleton);
        spine.setAnimation(0, "animation", false);
        spine.setCompleteListener(() => {
            this.effectFreeSpin.active = false;
            if (cb != null) cb();
        });


        // this.effectFreeSpin.runAction(cc.sequence(
        //     cc.delayTime(1),
        //     cc.delayTime(3),
        //     cc.callFunc(() => {

        //     })
        // ));
    }

    private showEffectBigWin(cash: number, cb: () => void) {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundGoldEarn, false, 1);
        }
        this.effectBigWin.stopAllActions();
        this.effectBigWin.active = true;
        this.effectBigWin.getComponentInChildren(sp.Skeleton).setAnimation(0, "thang sieu lon2", true);
        let label = this.effectBigWin.getComponentInChildren(cc.Label);
        label.node.active = false;

        this.effectBigWin.runAction(cc.sequence(
            // cc.delayTime(1),
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
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundJackpot, false, 1);
        }
        this.effectJackpot.stopAllActions();
        this.effectJackpot.active = true;
        this.effectJackpot.getComponentInChildren(sp.Skeleton).setAnimation(0, "animation", true);
        let label = this.effectJackpot.getComponentInChildren(cc.Label);
        label.node.active = false;

        this.effectJackpot.runAction(cc.sequence(
            // cc.delayTime(1),
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

    private showEffectBonus(cb: () => void) {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundSpinResult, false, 1);
        }
        this.effectBonus.stopAllActions();
        this.effectBonus.active = true;
        // this.effectBonus.getComponentInChildren(sp.Skeleton).setAnimation(0, "animation", false);

        // this.effectBonus.runAction(cc.sequence(
        //     cc.delayTime(3),
        //     cc.callFunc(() => {
        // this.effectBonus.active = false;
        // if (cb != null) cb();
        //     })
        // ));
        cc.tween(this.effectBonus).call(() => {
            this.effectBonus.getComponentInChildren(sp.Skeleton).setAnimation(0, "animation", true);
        }).delay(3.0).call(() => {
            this.effectBonus.active = false;
            if (cb != null) cb();
        }).start();

    }

    private onSpinResult(res: cmd.ReceivePlay | any) {
        this.stopSpin();
        //  cc.log("onSpinResult:" + JSON.stringify(res));
        var successResult = [0, 1, 2, 3, 4, 5, 6];
        //res.result == 5 //bonus
        //res.result == 0 //khong an
        //res.result == 1 //thang thuong
        //res.result == 2 //thang lon
        //res.result == 3 //no hu
        //res.result == 6 //thang cuc lon
        // res = JSON.parse('{"_pos":136,"_data":{"0":1,"1":46,"2":225,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":16,"11":162,"12":2,"13":0,"14":30,"15":53,"16":44,"17":49,"18":48,"19":44,"20":56,"21":44,"22":51,"23":44,"24":54,"25":44,"26":53,"27":44,"28":54,"29":44,"30":52,"31":44,"32":51,"33":44,"34":52,"35":44,"36":52,"37":44,"38":50,"39":44,"40":50,"41":44,"42":52,"43":44,"44":52,"45":0,"46":65,"47":49,"48":44,"49":50,"50":44,"51":51,"52":44,"53":52,"54":44,"55":53,"56":44,"57":54,"58":44,"59":55,"60":44,"61":56,"62":44,"63":57,"64":44,"65":49,"66":48,"67":44,"68":49,"69":49,"70":44,"71":49,"72":50,"73":44,"74":49,"75":51,"76":44,"77":49,"78":52,"79":44,"80":49,"81":53,"82":44,"83":49,"84":54,"85":44,"86":49,"87":55,"88":44,"89":49,"90":56,"91":44,"92":49,"93":57,"94":44,"95":50,"96":48,"97":44,"98":50,"99":49,"100":44,"101":50,"102":50,"103":44,"104":50,"105":51,"106":44,"107":50,"108":52,"109":44,"110":50,"111":53,"112":0,"113":0,"114":0,"115":0,"116":0,"117":0,"118":0,"119":1,"120":1,"121":208,"122":0,"123":0,"124":0,"125":0,"126":2,"127":100,"128":111,"129":84,"130":0,"131":0,"132":0,"133":0,"134":0,"135":0},"_length":136,"_controllerId":1,"_cmdId":12001,"_error":0,"ref":4258,"result":2,"matrix":"5,10,8,3,6,5,6,4,3,4,4,2,2,4,4","linesWin":"1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25","haiSao":"","prize":66000,"currentMoney":40136532,"freeSpin":0,"isFree":false,"itemsWild":"","ratio":0,"currentNumberFreeSpin":0}');
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
        this.currentNumberFreeSpin = res.currentNumberFreeSpin;
        this.lastSpinRes = res;
        this.columnsWild.length = 0;

        if (!this.toggleTrial.isChecked) {
            Configs.Login.Coin = res.currentMoney;
        }

        let matrix = res.matrix.split(",");
        let timeScale = this.toggleBoost.isChecked ? 0.5 : 1;
        for (let i = 0; i < this.columns.childrenCount; i++) {
            let roll = this.columns.children[i];
            let step1Pos = this.itemHeight * 0.3;
            let step2Pos = -this.itemHeight * roll.childrenCount + this.itemHeight * 3 - this.itemHeight * 0.3;
            let step3Pos = -this.itemHeight * roll.childrenCount + this.itemHeight * 3;
            TW(roll).delay(0.2 * i * timeScale)
                .to(0.2 * timeScale, { x: roll.position.x, y: step1Pos }, { easing: cc.easing.quadOut })
                .to(this.spinDuration + this.addSpinDuration * i, { x: roll.position.x, y: step2Pos }, { easing: cc.easing.quadInOut })
                .to(0.2 * timeScale, { x: roll.x, y: step3Pos }, { easing: cc.easing.quadIn })
                .call(() => {
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
                            let children = this.columns.children[c].children;
                            for (let i = 0; i < 3; i++) {
                                let itemAnimIcon = children[i].getComponentInChildren(sp.Skeleton);
                                itemAnimIcon.node.active = false;
                                itemAnimIcon.skeletonData = this.spineIconList[0];
                                itemAnimIcon.setAnimation(0, "Jackpot", true); //thuc ra la wild.ba Fio de nham ten.
                                itemAnimIcon.node.y = -60;
                                this.setItemSprite(children[i].getComponentInChildren(cc.Sprite), this.sprFrameItems[2]);
                                children[i]['id'] = 3;
                                children[i]['animationName'] = "Jackpot";
                                // children[i].getComponentInChildren(cc.Sprite).node.active = false;
                            }
                            this.iconWildColumns.children[c].active = true;
                            this.iconWildColumns.children[c].getComponent(sp.Skeleton).animation = "wild dai";
                            this.iconWildColumns.children[c].getComponent(sp.Skeleton).loop = false;
                            if (this.soundSlotState == 1) {
                                cc.audioEngine.play(this.soundSpinResult, false, 1);
                            }
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
            TW(roll)
                .delay((0.47 + 0.2 * i) * timeScale)
                .call(() => {
                    var children = roll.children;
                    this.setItemSprite(children[2].children[0].getComponent(cc.Sprite), this.sprFrameItems[parseInt(matrix[i])]);
                    this.setItemSprite(children[1].children[0].getComponent(cc.Sprite), this.sprFrameItems[parseInt(matrix[5 + i])]);
                    this.setItemSprite(children[0].children[0].getComponent(cc.Sprite), this.sprFrameItems[parseInt(matrix[10 + i])]);

                    // children[2]['id'] = parseInt(matrix[10 + i]);
                    // children[1]['id'] = parseInt(matrix[5 + i]);
                    // children[0]['id'] = parseInt(matrix[10 + i]);

                    let item1 = children[children.length - 1];
                    let item2 = children[children.length - 2];
                    let item3 = children[children.length - 3];
                    item1['id'] = parseInt(matrix[i]);
                    item2['id'] = parseInt(matrix[5 + i]);
                    item3['id'] = parseInt(matrix[10 + i]);
                    this.setItemSprite(item1.children[0].getComponent(cc.Sprite), this.sprFrameItems[parseInt(matrix[i])]);
                    this.setItemSprite(item2.children[0].getComponent(cc.Sprite), this.sprFrameItems[parseInt(matrix[5 + i])]);
                    this.setItemSprite(item3.children[0].getComponent(cc.Sprite), this.sprFrameItems[parseInt(matrix[10 + i])]);
                    this.checkIconSpine(children[2], parseInt(matrix[i]));
                    this.checkIconSpine(children[1], parseInt(matrix[5 + i]));
                    this.checkIconSpine(children[0], parseInt(matrix[10 + i]));
                    this.checkIconSpine(item3, parseInt(matrix[10 + i]));
                    this.checkIconSpine(item2, parseInt(matrix[5 + i]));
                    this.checkIconSpine(item1, parseInt(matrix[i]));
                }).start();
        }
    }
    private checkIconSpine(item, idSprite) {
        idSprite = idSprite + 1;

        let spine = item.getComponentInChildren(sp.Skeleton);
        spine.skeletonData = this.spineIcon;
        let sprite = item.getComponentInChildren(cc.Sprite);
        spine.node.y = -66;
        // sprite.node.active = false;
        // spine.node.active = true;
        spine.node.scale = 0.6;
        let animName = "";
        switch (idSprite) {
            case 1: {
                spine.skeletonData = this.spineIconList[2];
                spine.node.scale = 0.65;
                animName = "Scatter2";
                // spine.setAnimation(0, "Scatter2", true);
                break;
            }
            case 2: {
                spine.node.scale = 0.65;
                // spine.setAnimation(0, "bonus", true);
                animName = "bonus";
                break;
            }
            case 3: {//wild
                spine.skeletonData = this.spineIconList[0];
                // spine.setAnimation(0, "Jackpot", true);
                animName = "Jackpot";
                spine.node.y = -60;
                break;
            }
            case 4: {//jackpot
                spine.skeletonData = this.spineIconList[1];
                spine.node.scale = 0.23;
                // spine.setAnimation(0, "animation", true);
                animName = "animation";
                spine.node.y = -122;
                break;
            }
            default: {
                spine.node.active = false;
                sprite.node.active = true;
                break;
            }
        }
        item['animationName'] = animName != "" ? animName : null;
    }
    private setItemSprite(spr, frame) {
        spr.spriteFrame = frame;
        spr.sizeMode = cc.Sprite.SizeMode.TRIMMED;
        spr.node.setContentSize(cc.size(spr.node.width / 1, spr.node.height / 1));
    }

    private spined() {
        this.currentNumberFreeSpin = this.lastSpinRes.currentNumberFreeSpin;
        if (this.lastSpinRes.currentNumberFreeSpin > 0) {
            this.lblFreeSpinCount.node.parent.active = true;
            this.lblFreeSpinCount.string = this.currentNumberFreeSpin.toString();
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
            var successResult = [0, 1, 3, 4, 5, 6];
            switch (this.lastSpinRes.result) {
                case 0://k an
                    this.showLineWins();
                    break;
                case 1:// thang thuong
                    this.showLineWins();
                    break;
                case 2:// thang lon
                    this.showEffectBigWin(this.lastSpinRes.prize, () => {
                        this.showLineWins();
                    });
                    break;
                case 3: case 4://jackpot
                    this.showEffectJackpot(this.lastSpinRes.prize, () => {
                        this.showLineWins();
                    });
                    break;
                case 6://thang sieu lon
                    this.showEffectBigWin(this.lastSpinRes.prize, () => {
                        this.showLineWins();
                    });
                    break;
                case 5://bonus
                    this.showEffectBonus(() => {
                        if (this.soundSlotState == 1) {
                            this.remoteMusicBackground = cc.audioEngine.playMusic(this.soundBgBonus, true);
                        }

                        this.actPopupBonus(() => {
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

    onBtnSoundSumary() {

    }

    onBtnSoundTouchBonus() {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
    }

    actBack() {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        SlotNetworkClient.getInstance().send(new cmd.SendUnSubcribe(this.betIdx));
        cc.audioEngine.stopAll();
        App.instance.loadScene("Lobby");
    }

    actHidden() {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        this.showToast(App.instance.getTextLang('txt_function_in_development'));
    }

    actBetUp() {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.toggleTrial.isChecked) {
            this.showToast(App.instance.getTextLang('txt_slot_error'));
            return;
        }
        if (this.betIdx < this.listBet.length - 1) {
            SlotNetworkClient.getInstance().send(new cmd.SendChangeRoom(this.betIdx, ++this.betIdx));
            this.lblBet.string = this.listBetLabel[this.betIdx];
            Tween.numberTo(this.lblTotalBet, this.arrLineSelect.length * this.listBet[this.betIdx], 0.3, (n) => {
                return this.moneyToK(n);
            });
        }
    }

    actBetDown() {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.toggleTrial.isChecked) {
            this.showToast(App.instance.getTextLang('txt_slot_error'));
            return;
        }
        if (this.betIdx > 0) {
            SlotNetworkClient.getInstance().send(new cmd.SendChangeRoom(this.betIdx, --this.betIdx));
            this.lblBet.string = this.listBetLabel[this.betIdx];
            Tween.numberTo(this.lblTotalBet, this.arrLineSelect.length * this.listBet[this.betIdx], 0.3, (n) => { return this.moneyToK(n) });
        }
    }

    randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    private musicSlotState = null;
    private soundSlotState = null;
    private remoteMusicBackground = null;
    settingMusic() {
        // this.toggleMusic.isChecked = !this.toggleMusic.isChecked;
        if (this.toggleMusic.isChecked) {
            cc.audioEngine.stop(this.remoteMusicBackground);
            this.musicSlotState = 0;
            this.soundSlotState = 0;
        } else {
            var musicId = this.randomBetween(0, 4);
            this.remoteMusicBackground = cc.audioEngine.playMusic(this.soundBg, true);
            this.musicSlotState = 1;
            this.soundSlotState = 1;
        }
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        cc.sys.localStorage.setItem("music_Slot_3", "" + this.musicSlotState);
        cc.sys.localStorage.setItem("sound_Slot_3", "" + this.soundSlotState);
    }
    actPopupBonus(cb) {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.popupBonus == null) {
            BundleControl.loadPrefabGame("Slot3", "res/thantai/prefabs/PopupBonus", (finish, total) => {
                App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
            }, prefab => {
                App.instance.showLoading(false);
                this.popupBonus = cc.instantiate(prefab).getComponent("Slot3.PopupBonus");
                this.popupBonus.node.active = true;
                this.popupBonus.node.parent = cc.director.getScene().getChildByName("Canvas");

                this.popupBonus.showBonus(this.toggleTrial.isChecked ? 100 : this.listBet[this.betIdx], this.lastSpinRes.haiSao, this, cb);
            });
        } else {
            this.popupBonus.node.active = true;
            this.popupBonus.showBonus(this.toggleTrial.isChecked ? 100 : this.listBet[this.betIdx], this.lastSpinRes.haiSao, this, cb);
        }
    }
    actLine() {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.toggleTrial.isChecked) {
            this.showToast(App.instance.getTextLang('txt_slot_error'));
            return;
        }
        if (this.popupSelectLine == null) {
            BundleControl.loadPrefabGame("Slot3", "res/thantai/prefabs/PopupSelectLine", (finish, total) => {
                App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
            }, prefab => {
                App.instance.showLoading(false);
                this.popupSelectLine = cc.instantiate(prefab).getComponent("Slot3.PopupSelectLine");
                this.popupSelectLine.node.parent = cc.director.getScene().getChildByName("Canvas");
                this.popupSelectLine.onSelectedChanged = (lines) => {
                    this.arrLineSelect = lines;
                    this.lblLine.string = this.arrLineSelect.length.toString();
                    this.lblTotalBet.string = Utils.formatMoney(this.arrLineSelect.length * this.listBet[this.betIdx]);
                }
                this.popupSelectLine.show();
            });
        } else {
            this.popupSelectLine.show();
        }

    }
    actGuide() {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.toggleTrial.isChecked) {
            this.showToast(App.instance.getTextLang('txt_slot_error'));
            return;
        }
        if (this.popupGuide == null) {
            BundleControl.loadPrefabGame("Slot3", "res/thantai/prefabs/PopupGuide", (finish, total) => {
                App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
            }, prefab => {
                App.instance.showLoading(false);
                this.popupGuide = cc.instantiate(prefab).getComponent("Slot3.PopupGuide");
                this.popupGuide.node.parent = cc.director.getScene().getChildByName("Canvas");
                this.popupGuide.show();
            });
        } else {
            this.popupGuide.show();
        }
    }
    actHistoryJackpot() {
        if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.toggleTrial.isChecked) {
            this.showToast(App.instance.getTextLang('txt_slot_error'));
            return;
        }
        if (this.popupJackpotHistory == null) {
            BundleControl.loadPrefabGame("Slot3", "res/thantai/prefabs/PopupJackpotHistory", (finish, total) => {
                App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
            }, prefab => {
                App.instance.showLoading(false);
                this.popupJackpotHistory = cc.instantiate(prefab).getComponent("Slot3.PopupJackpotHistory");
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
        if (this.toggleTrial.isChecked) {
            this.showToast(App.instance.getTextLang('txt_slot_error'));
            return;
        }
        if (this.popupHistory == null) {
            BundleControl.loadPrefabGame("Slot3", "res/thantai/prefabs/PopupHistory", (finish, total) => {
                App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
            }, prefab => {
                App.instance.showLoading(false);
                this.popupHistory = cc.instantiate(prefab).getComponent("Slot3.PopupHistory");
                this.popupHistory.node.parent = cc.director.getScene().getChildByName("Canvas");
                this.popupHistory.show();
            });
        } else {
            this.popupHistory.show();
        }
    }

    toggleTrialOnCheck() {
        if (this.toggleTrial.isChecked) {
            this.lblLine.string = "25";
            this.lblBet.string = "100";
            this.lblTotalBet.string = Utils.formatMoney(250000);

        } else {
            this.lblLine.string = this.arrLineSelect.length.toString();
            this.lblBet.string = this.listBetLabel[this.betIdx];
            this.lblTotalBet.string = Utils.formatMoney(this.arrLineSelect.length * this.listBet[this.betIdx]);
        }
    }

    toggleAutoOnCheck() {
        if (this.toggleAuto.isChecked && this.toggleTrial.isChecked) {
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
        if (this.toggleBoost.isChecked && this.toggleTrial.isChecked) {
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
    changeItemToDark(state) {
        for (let i = 0; i < this.columns.childrenCount; i++) {
            let col = this.columns.children[i];
            for (let j = 0; j < col.childrenCount; j++) {
                let item = col.children[j];
                let sprite = item.getComponentInChildren(cc.Sprite);
                let spine = item.getComponentInChildren(sp.Skeleton)
                sprite.node.color = state ? cc.Color.GRAY : cc.Color.WHITE;
                spine.node.color = state ? cc.Color.GRAY : cc.Color.WHITE;
                if (state) {
                    sprite.node.active = true;
                    spine.node.active = false;
                }
            }
        }
    }
    setDarkItem(item, state) {
        let spine = item.getComponentInChildren(sp.Skeleton);
        let sprite = item.getComponentInChildren(cc.Sprite);
        sprite.node.color = state ? cc.Color.GRAY : cc.Color.WHITE;
        spine.node.color = state ? cc.Color.GRAY : cc.Color.WHITE;
        if (!state) {
            if (item['id'] && item['id'] < 5 && item['animationName'] && item['animationName'] != "") {
                sprite.node.active = false;
                spine.node.active = true;
                spine.setAnimation(0, item['animationName'], true);
            } else {
                sprite.node.active = true;
                spine.node.active = false;
            }
        } else {
            sprite.node.active = true;
            spine.node.active = false;
        }
    }
}
