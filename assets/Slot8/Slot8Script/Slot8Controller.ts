import cmd from './Slot8Cmd';

import Configs from "../../Loading/src/Configs";
import Slot4TrialResult from './Slot8TrialResult';

import Slot8Lobby from "./Slot8.Lobby";
import Slot8PopupBonus from "./Slot8.PopupBonus";
import Slot8Tutorial from "./Slot8.Tutorial";
import App from '../../Lobby/LobbyScript/Script/common/App';
import BroadcastReceiver from '../../Lobby/LobbyScript/Script/common/BroadcastReceiver';
import Tween from '../../Lobby/LobbyScript/Script/common/Tween';
import Utils from '../../Lobby/LobbyScript/Script/common/Utils';
import InPacket from '../../Lobby/LobbyScript/Script/networks/Network.InPacket';
import SlotNetworkClient from '../../Lobby/LobbyScript/Script/networks/SlotNetworkClient';
import UIItemIconSlot25 from '../../Lobby/LobbyScript/Script/BaseSlot25/ItemIconSlot25';
import Slot8ChooseLine from './Slot8ChooseLine';
import Slot8ItemSlot from './Slot8.ItemSlot';
import BundleControl from '../../Loading/src/BundleControl';
import Slot8History from './Slot8History';
import Slot8Glory from './Slot8Glory';
var MAX_CYCCLE_SPIN = 20;
var FAST_CYCCLE_SPIN = 10;
var ERROR_CYCCLE_SPIN = 50;

const { ccclass, property } = cc._decorator;

@ccclass
export default class Slot8Controller extends cc.Component {
    @property(cc.Button)
    btnBack: cc.Button = null;
    @property(cc.Node)
    nodeCoin: cc.Node = null;
    @property(cc.Node)
    initNodeCoin: cc.Node = null;
    @property(cc.Button)
    btnLine: cc.Button = null;
    @property(cc.Label)
    lblFreeSpinCount: cc.Label = null;
    @property(cc.Node)
    nodeBoxSetting: cc.Node = null;
    @property(cc.Node)
    popupContainer: cc.Node = null;
    @property(cc.Toggle)
    toggleMusic: cc.Toggle = null;
    @property(cc.Toggle)
    toggleSound: cc.Toggle = null;
    @property(Slot8PopupBonus)
    popupBonus: Slot8PopupBonus = null;
    @property(sp.Skeleton)
    skeSpin: sp.Skeleton = null;
    @property(cc.Node)
    nodeDemo: cc.Node = null;
    @property(cc.Node)
    nodeWinJackpot: cc.Node = null;
    @property(cc.Label)
    txtWinJackpot: cc.Label = null;
    @property(cc.Node)
    nodeGamePlay: cc.Node = null;
    @property(Slot8Lobby)
    mSlotLobby: Slot8Lobby = null;
    @property(cc.Label)
    jackpotLabel: cc.Label = null;

    @property(cc.Label)
    moneyLabel: cc.Label = null;


    @property(cc.Label)
    totalLineLabel: cc.Label = null;

    @property(cc.Button)
    btnSpin: cc.Button = null;
    @property(cc.Toggle)
    toggleFast: cc.Toggle = null;
    @property(cc.Toggle)
    toggleAuto: cc.Toggle = null;

    //win
    @property(cc.Node)
    winNormalBg: cc.Node = null;
    @property(cc.Node)
    bonusNode: cc.Node = null;
    @property(cc.Node)
    bigWinNode: cc.Node = null;
    @property(cc.Label)
    txtWinBigWin: cc.Label = null;
    @property(cc.Node)
    jackpotNode: cc.Node = null;
    @property(cc.Node)
    freespinNode: cc.Node = null;
    @property(cc.Label)
    winLabel: cc.Label = null;
    @property(cc.Label)
    lbCurrentRoom: cc.Label = null;
    @property(cc.Node)
    freespinCurrent: cc.Node = null;
    //line win
    @property(cc.Node)
    lineWinParent: cc.Node = null;

    @property(cc.Node)
    colParent: cc.Node = null;
    //show result
    @property(cc.Label)
    totalWinLabel: cc.Label = null;
    @property(cc.Label)
    totalBetLabel: cc.Label = null;

    //choose line
    @property(Slot8ChooseLine)
    popupChooseLine: Slot8ChooseLine = null;

    @property({ type: cc.AudioClip })
    musicLobby: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    musicGame: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    musicBonus: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    soundClick: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundStartSpin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundRepeatSpin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundEndSpin: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    soundSpinWin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundBigWin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundJackpot: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundBonus: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundFreeSpin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundtouchBonus: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundSmumary: cc.AudioClip = null;
    private listActiveItem: cc.Node[] = [];         //list 15 item nhin thay tren man hinh

    private TIME_DELAY_SHOW_LINE: number = 1;
    private dailyFreeSpin = 0;
    public betId = 0;
    private listBet = [100, 1000, 10000];
    private listBetString = ["100", "1K", "10K"];
    private arrLineSelected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    public isTrial: Boolean = false;
    private isSpining: Boolean = false;
    private mapLine = [
        [5, 6, 7, 8, 9],//1
        [0, 1, 2, 3, 4],//2
        [10, 11, 12, 13, 14],//3
        [5, 6, 2, 8, 9],//4
        [5, 6, 12, 8, 9],//5
        [0, 1, 7, 3, 4],//6
        [10, 11, 7, 13, 14],//7
        [0, 11, 2, 13, 4],//8
        [10, 1, 12, 3, 14],//9
        [5, 1, 12, 3, 9],//10
        [10, 6, 2, 8, 14],//11
        [0, 6, 12, 8, 4],//12
        [5, 11, 7, 3, 9],//13
        [5, 1, 7, 13, 9],//14
        [10, 6, 7, 8, 14],//15
        [0, 6, 7, 8, 4],//16
        [5, 11, 12, 13, 9],//17
        [5, 1, 2, 3, 9],//18
        [10, 11, 7, 3, 4],//19
        [0, 1, 7, 13, 14]//20
    ];

    //new 

    private isFastCurrent = false;
    private isFast = false;

    @property([cc.Node])
    arrReel: cc.Node[] = [];

    @property
    distanceReel: number = 0;

    @property([cc.SpriteFrame])
    iconSFBlurArr100: cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame])
    iconSFArr100: cc.SpriteFrame[] = [];
    @property([sp.SkeletonData])
    arrSkeletonIcon100: sp.SkeletonData[] = [];

    @property([cc.SpriteFrame])
    iconSFBlurArr1K: cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame])
    iconSFArr1K: cc.SpriteFrame[] = [];
    @property([sp.SkeletonData])
    arrSkeletonIcon1K: sp.SkeletonData[] = [];

    @property([cc.SpriteFrame])
    iconSFBlurArr10K: cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame])
    iconSFArr10K: cc.SpriteFrame[] = [];
    @property([sp.SkeletonData])
    arrSkeletonIcon10K: sp.SkeletonData[] = [];

    @property([Slot8ItemSlot])
    arrUIItemIcon: Slot8ItemSlot[] = [];
    @property([Slot8ItemSlot])
    arrRealItem: Slot8ItemSlot[] = [];
    popupGuide = null;
    popupHistory: Slot8History = null;
    popupHonor: Slot8Glory = null;




    public numberSpinReel = null;
    public isHaveResultSpin = false;
    public dataResult = null;
    private isFirst = false;

    public isSound = false;
    public isMusic = true;
    mutipleJpNode = null;

    start() {
        this.dailyFreeSpin = 0;
        this.isSound = true;
        this.isMusic = true;
        this.totalWinLabel.string = "";
        var musicId = 0;
        SlotNetworkClient.getInstance().addOnClose(() => {
            this.mSlotLobby.onBtnBack();
        }, this);



        this.init();
        SlotNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            // //  cc.log(inpacket.getCmdId());
            switch (inpacket.getCmdId()) {
                case cmd.Code.UPDATE_JACKPOT_SLOTS:
                    this.mSlotLobby.onUpdateJackpot(data);
                    break;
                case cmd.Code.UPDATE_POT:
                    {

                        let res = new cmd.ReceiveUpdatePot(data);
                        // //  cc.log("update Jackpot:"+(this.betId == 0));
                        if (this.betId == -1) {
                            Tween.numberTo(this.jackpotLabel, res.valueRoom3, 0.3);
                        }
                        else if (this.betId == 0) {
                            Tween.numberTo(this.jackpotLabel, res.valueRoom1, 0.3);
                        }
                        else if (this.betId == 1) {
                            Tween.numberTo(this.jackpotLabel, res.valueRoom2, 0.3);
                        }
                        else if (this.betId == 2) {
                            Tween.numberTo(this.jackpotLabel, res.valueRoom3, 0.3);
                        }

                    }
                    break;
                case cmd.Code.UPDATE_RESULT:
                    {
                        let res = new cmd.ReceiveResult(data);
                        this.spinResult(res);
                    }
                    break;
                case cmd.Code.FREE_DAI_LY:
                    {
                        if (!this.isTrial) {
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

                    }
                    break;
                case cmd.Code.DATE_X2:
                    {
                        let res = new cmd.ReceiveDateX2(data);
                        if (this.isFirst == false) {
                            //vua vao lobby
                            this.hideGamePlay();
                            this.isFirst = true;
                        }
                        else {
                            this.mSlotLobby.node.active = false;
                            this.onJoinRoom(res);
                        }
                    }
                    break;
                case cmd.Code.CHANGE_ROOM:
                    {
                        //  cc.log("changeRoom:" + JSON.stringify(data));
                    }
                    break;
            }
        }, this);

        SlotNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeHallSlot());
        SlotNetworkClient.getInstance().send(new cmd.SendSubcribe(0));


        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            Tween.numberTo(this.moneyLabel, Configs.Login.Coin, 0.3);
        }, this);
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

        App.instance.showErrLoading("Đang kết nối tới server...");
        SlotNetworkClient.getInstance().checkConnect(() => {
            App.instance.showLoading(false);
        });




        this.mSlotLobby.init(this);

        //this.initMutipleJPNode();
    }
    onEnable() {
        this.changeAllItemToDark(false);
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
                    this.mutipleJpNode.setInfo("ANGRY");
                }
            })
        }
    }
    showAnimations() {
        var self = this;
        for (var i = 0; i < self.arrUIItemIcon.length; i++) {
            var nodeItem = self.arrUIItemIcon[i].nodeBox;
            var indexCol = i % 5;
            nodeItem.opacity = 0;
            nodeItem.position = cc.v3(0, self.distanceReel, 0);
            cc.tween(nodeItem)
                .delay(indexCol * 0.1)
                .to(1, { position: cc.v3(0, 0, 0), opacity: 255 }, { easing: "backOut" })
                .start();
        }
    }

    showGamePlay() {
        // if (this.isMusic) cc.audioEngine.playMusic(this.musicGame, true);
        this.randomIconList();
        this.nodeGamePlay.active = true;
        this.showAnimations();
    }

    hideGamePlay() {
        // if (this.isMusic) cc.audioEngine.playMusic(this.musicLobby, true);
        this.nodeGamePlay.active = false;
    }

    init() {
        this.totalWinLabel.string = "";
    }
    private showCoins(prize) {
        var number = prize / 20000;
        if (number <= 10) number = 10;
        else if (number >= 20) number = 20;
        App.instance.showCoins(number, this.initNodeCoin, this.nodeCoin);
    }
    public onJoinRoom(res = null) {
        var betIdTmp = this.betId;
        if (betIdTmp == -1) betIdTmp = 2;
        let totalbet = (this.arrLineSelected.length * this.listBet[betIdTmp]);
        Tween.numberTo(this.totalBetLabel, totalbet, 0.3);
        this.mSlotLobby.hide();
        this.nodeDemo.active = this.isTrial ? true : false;
        this.showGamePlay();
        this.setButtonEnable(true);

        if (res == null) {
            this.freespinCurrent.active = false;
        }
        else {
            if (res.freeSpin + this.dailyFreeSpin > 0) {
                this.freespinCurrent.active = true;
                this.freespinCurrent.getComponentInChildren(cc.Label).string = res.freeSpin + this.dailyFreeSpin;
            }
            else {
                this.freespinCurrent.active = false;
            }
        }

    }

    randomIconList() {
        var self = this;
        for (var i = 0; i < self.arrUIItemIcon.length; i++) {
            var index = i;
            var itemId = Math.floor(Math.random() * 7);
            self.arrUIItemIcon[i].init(itemId, index, self);
            self.arrUIItemIcon[i].changeSpineIcon(itemId);
        }
    }

    /**
     * random between, min, max included
     */
    randomBetween(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    spinClick() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }



        //hide effect

        // this.setButtonAuto(false);
        // this.setButtonFlash(false);
        if (!this.isTrial) {

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
                if (Configs.Login.Coin < this.listBet[this.betId] * this.arrLineSelected.length) {
                    App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_not_enough"));
                    return;
                }
            }
            this.hideWinEffect();
            this.hideLineWin(true);
            this.setButtonEnable(false);
            this.totalWinLabel.string = "";
            SlotNetworkClient.getInstance().send(new cmd.SendPlay(this.arrLineSelected.toString()));
        } else {
            this.hideWinEffect();
            this.hideLineWin(true);
            this.setButtonEnable(false);
            this.totalWinLabel.string = "";
            var rIdx = Utils.randomRangeInt(0, Slot4TrialResult.results.length);
            this.spinResult(Slot4TrialResult.results[rIdx]);
        }
    }

    onBtnSoundTouchBonus() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundtouchBonus, false, 1);
        }
    }

    onBtnSoundSumary() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundSmumary, false, 1);
        }
        if (this.isMusic) cc.audioEngine.playMusic(this.musicGame, true);
    }

    private audioIdRepeatSpin = 0;
    spinResult(res: cmd.ReceiveResult | any) {
        this.isSpining = true;
        //  cc.log("spinResult:" + JSON.stringify(res));


        let that = this;
        let successResult = [0, 1, 2, 3, 4, 5, 6];
        let result = res.result;
        if (successResult.indexOf(result) === -1) {
            //fail
            if (result === 102) {
                //khong du tien
                //  cc.log("so du khong du");
                App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_not_enough"));

            } else {
                //  cc.log("co loi xay ra");
            }
            return;
        }

        //set icon
        let matrix = res.matrix.split(",");
        this.numberSpinReel = new Array(this.arrReel.length);
        this.dataResult = res;
        this.isHaveResultSpin = true;

        if (this.isSound) {
            cc.audioEngine.play(this.soundStartSpin, false, 1);
        }
        if (this.isSound) {
            this.audioIdRepeatSpin = cc.audioEngine.play(this.soundRepeatSpin, false, 1);
        }
        for (var i = 0; i < this.arrReel.length; i++) {
            this.beginSpinReel(i);
        }

    }

    spinFinish(hasDelay: boolean) {
        this.isSpining = false;
        var that = this;
        this.changeAllItemToDark(false);
        this.node.runAction(
            cc.sequence(
                cc.delayTime(hasDelay ? 1 : 0),
                cc.callFunc(() => {
                    if (that.toggleFast.isChecked||this.toggleAuto.isChecked) {
                        that.spinClick();
                    } else {
                        that.setButtonEnable(true);
                        that.setButtonFlash(true);
                    }
                })
            )
        )

    }

    showWinEffect(prize: number, currentMoney: number, result: number) {
        var self = this;
        if (prize > 0) {
            this.lineWinParent.setSiblingIndex(1);
            this.colParent.setSiblingIndex(0);
            if (result == 5) {
                //bonus
                if (this.isSound) {
                    cc.audioEngine.play(this.soundBonus, false, 1);
                }
                this.bonusNode.active = true;
                let bonusSpine = this.bonusNode.getComponentInChildren(sp.Skeleton);
                bonusSpine.setAnimation(0, "bounus", true);
                this.node.runAction(
                    cc.sequence(
                        cc.delayTime(5),
                        cc.callFunc(() => {
                            this.bonusNode.active = false;
                            if (this.isMusic) cc.audioEngine.playMusic(this.musicBonus, true);
                            // this.popupBonus.showBonus(this.isTrial ? 100 : this.listBet[this.betId], this.dataResult.haiSao, this, () => {
                                // this.showLineWin(self.dataResult.linesWin.split(","));
                                // this.showCoins(prize);
                                // Tween.numberTo(this.winLabel, prize, 0.3);
                                // Tween.numberTo(this.totalWinLabel, prize, 0.3);
                                // Tween.numberTo(this.totalBetLabel, this.arrLineSelected.length * this.listBet[this.betId], 0.3);
                                // if (!this.isTrial) Tween.numberTo(this.moneyLabel, currentMoney, 0.3);
                                // if (this.toggleFast.isChecked) {
                                //     self.spinFinish(true);
                                // } else {
                                //     if (self.dataResult.linesWin !== "") self.showLineWin(self.dataResult.linesWin.split(","));
                                //     else self.spinFinish(false);
                                // }
                            // });
                            this.actShowBonus(this.isTrial ? 100 : this.listBet[this.betId], this.dataResult.haiSao,()=>{
                                this.showLineWin(self.dataResult.linesWin.split(","));
                                this.showCoins(prize);
                                Tween.numberTo(this.winLabel, prize, 0.3);
                                Tween.numberTo(this.totalWinLabel, prize, 0.3);
                                Tween.numberTo(this.totalBetLabel, this.arrLineSelected.length * this.listBet[this.betId], 0.3);
                                if (!this.isTrial) Tween.numberTo(this.moneyLabel, currentMoney, 0.3);
                                if (this.toggleFast.isChecked) {
                                    self.spinFinish(true);
                                } else {
                                    if (self.dataResult.linesWin !== "") self.showLineWin(self.dataResult.linesWin.split(","));
                                    else self.spinFinish(false);
                                }
                            })
                        })
                    )
                )

            } else if (result == 2 || result == 6) {
                //thang lon                
                if (this.isSound) {
                    cc.audioEngine.play(this.soundBigWin, false, 1);
                }
                this.bigWinNode.active = true;
                let bigwinSpine = this.bigWinNode.getComponentInChildren(sp.Skeleton);
                bigwinSpine.setAnimation(0, "thanglon", true);
                Tween.numberTo(this.txtWinBigWin, prize, 1.5);
                this.node.runAction(
                    cc.sequence(
                        cc.delayTime(5),
                        cc.callFunc(() => {
                            this.bigWinNode.active = false;
                            if (this.toggleFast.isChecked) {
                                self.spinFinish(true);
                            } else {
                                if (self.dataResult.linesWin !== "") self.showLineWin(self.dataResult.linesWin.split(","));
                                else self.spinFinish(false);
                            }
                        })
                    )
                )
                this.showCoins(prize);
                Tween.numberTo(this.winLabel, prize, 0.3);
                Tween.numberTo(this.totalWinLabel, prize, 0.3);
                Tween.numberTo(this.totalBetLabel, this.arrLineSelected.length * this.listBet[this.betId], 0.3);
                if (!this.isTrial) Tween.numberTo(this.moneyLabel, currentMoney, 0.3);

            } else if (result == 3 || result == 4) {
                //no hu
                if (this.isSound) {
                    var audioIdJackpot = cc.audioEngine.play(this.soundJackpot, false, 1);
                }
                if (this.isSound) {
                    var audioIdJackpot = cc.audioEngine.play(this.soundSmumary, false, 1);
                }
                this.jackpotNode.active = true;
                let jackpotSpine = this.jackpotNode.getComponentInChildren(sp.Skeleton);
                jackpotSpine.setAnimation(0, "jackport", true);
                this.showCoins(prize);
                cc.Tween.stopAllByTarget(this.nodeWinJackpot);
                Tween.numberTo(this.txtWinJackpot, prize, 0.3);
                this.nodeWinJackpot.position = cc.v3(0, -360, 0);
                this.nodeWinJackpot.active = true;
                cc.tween(this.nodeWinJackpot)
                    .to(1, { position: cc.v3(0, 0, 0) })
                    .delay(3)
                    .to(1, { position: cc.v3(0, -360, 0) })
                    .start();
                this.node.runAction(
                    cc.sequence(
                        cc.delayTime(5),
                        cc.callFunc(() => {
                            this.jackpotNode.active = false;
                            if (this.toggleFast.isChecked) {
                                self.spinFinish(true);
                            } else {
                                if (self.dataResult.linesWin !== "") self.showLineWin(self.dataResult.linesWin.split(","));
                                else self.spinFinish(false);
                            }
                            if (this.isSound) {
                                cc.audioEngine.stop(audioIdJackpot);
                            }
                        })
                    )
                )
                Tween.numberTo(this.winLabel, prize, 0.3);
                Tween.numberTo(this.totalWinLabel, prize, 0.3);
                Tween.numberTo(this.totalBetLabel, this.arrLineSelected.length * this.listBet[this.betId], 0.3);
                if (!this.isTrial) Tween.numberTo(this.moneyLabel, currentMoney, 0.3);

            } else {
                if (this.isSound) {
                    cc.audioEngine.play(this.soundSpinWin, false, 1);
                }
                this.winNormalBg.active = true;
                this.showCoins(prize);
                Tween.numberTo(this.winLabel, prize, 0.3);
                Tween.numberTo(this.totalWinLabel, prize, 0.3);
                Tween.numberTo(this.totalBetLabel, this.arrLineSelected.length * this.listBet[this.betId], 0.3);
                if (!this.isTrial) Tween.numberTo(this.moneyLabel, currentMoney, 0.3);
                if (this.toggleFast.isChecked) {
                    if (self.dataResult.linesWin !== "") self.showLineWin(self.dataResult.linesWin.split(","));
                    else self.spinFinish(false);
                } else {
                    if (self.dataResult.linesWin !== "") self.showLineWin(self.dataResult.linesWin.split(","));
                    else self.spinFinish(false);
                }
            }


        } else {

            Tween.numberTo(this.totalWinLabel, prize, 0.3);
            Tween.numberTo(this.totalBetLabel, this.arrLineSelected.length * this.listBet[this.betId], 0.3);
            if (!this.isTrial) Tween.numberTo(this.moneyLabel, currentMoney, 0.3);
            if (this.toggleFast.isChecked) {
                if (self.dataResult.linesWin !== "") self.showLineWin(self.dataResult.linesWin.split(","));
                else self.spinFinish(false);
            } else {
                if (self.dataResult.linesWin !== "") self.showLineWin(self.dataResult.linesWin.split(","));
                else self.spinFinish(false);
            }
        }


    }

    public beginSpinReel(indexReel) {
        var self = this;
        self.isFastCurrent = self.toggleFast.isChecked;
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

        var self = this;
        let speed = this.toggleFast.isChecked ? 0.04 : 0.07;
        cc.tween(self.arrReel[indexReel])
            .to(speed, { position: cc.v3(self.arrReel[indexReel].position.x, -self.distanceReel, 0) }, { easing: "linear" })
            .call(() => {
                self.processLoopSpinReel(indexReel);
            })
            .start();
    }

    processLoopSpinReel(indexReel) {
        var self = this;
        self.numberSpinReel[indexReel] += 1;
        for (var i = 4; i >= 0; i--) {
            var index = indexReel + (i * 5);

            var indexRow = Math.floor(index / 5);
            var itemIdTmp = 0;
            if (indexRow == 0) {
                itemIdTmp = Math.floor(Math.random() * 7);
            }
            else {
                itemIdTmp = self.arrUIItemIcon[index - 5].itemId;
            }
            self.arrUIItemIcon[index].changeSpriteBlurByItemId(itemIdTmp);
        }
        self.arrReel[indexReel].position = cc.v3(self.arrReel[indexReel].position.x, 0, 0);
        if (self.isHaveResultSpin) {
            if (self.isFastCurrent == false) {
                if (self.numberSpinReel[indexReel] >= MAX_CYCCLE_SPIN) {
                    self.endSpinReel(indexReel);
                }
                else {
                    self.loopSpinReel(indexReel);
                }
            }
            else {
                if (self.numberSpinReel[indexReel] >= FAST_CYCCLE_SPIN) {
                    self.endSpinReel(indexReel);
                }
                else {
                    self.loopSpinReel(indexReel);
                }
            }
        }
        else {
            if (self.numberSpinReel[indexReel] >= ERROR_CYCCLE_SPIN) {
                self.endSpinReel(indexReel);
            }
            else {
                self.loopSpinReel(indexReel);
            }
        }

    }

    endSpinReel(indexReel) {
        var self = this;
        if (self.dataResult == null) {
            for (var i = 3; i >= 1; i--) {
                var index = indexReel + (i * 5);
                var itemId = Math.floor(Math.random() * 7);
                self.arrUIItemIcon[index].changeSpineIcon(itemId);
            }
            return;
        }
        var matrix = self.dataResult.matrix.split(',');
        var roll = this.arrReel[indexReel];
        self.arrReel[indexReel].position = cc.v3(self.arrReel[indexReel].position.x, self.distanceReel, 0);
        for (var i = 3; i >= 1; i--) {
            var index = indexReel + (i * 5);
            self.arrUIItemIcon[index].changeSpineIcon(matrix[index - 5]);
        }
        let speed = this.toggleFast.isChecked ? 0.15 : 0.3;
        cc.tween(self.arrReel[indexReel])
            .to(speed, { position: cc.v3(self.arrReel[indexReel].position.x, 0, 0) }, { easing: "backOut" })
            .call(() => {
                if (self.isSound) {
                    cc.audioEngine.play(self.soundEndSpin, false, 1);
                }
                if (indexReel == 4) {
                    cc.audioEngine.stop(this.audioIdRepeatSpin);

                    Configs.Login.Coin = self.dataResult.currentMoney;
                    if (self.dataResult.currentNumberFreeSpin > 0) {
                        self.freespinCurrent.active = true;
                        self.freespinCurrent.getComponentInChildren(cc.Label).string = self.dataResult.currentNumberFreeSpin;
                    }
                    else {
                        self.freespinCurrent.active = false;
                    }
                    if (self.dataResult.isFreeSpin == 1) {
                        this.freespinNode.active = true;
                        let freeSpineSpine = this.freespinNode.getComponentInChildren(sp.Skeleton);
                        freeSpineSpine.setAnimation(0, "animation", true);
                        this.node.runAction(
                            cc.sequence(
                                cc.delayTime(5),
                                cc.callFunc(() => {
                                    this.freespinNode.active = false;
                                    if (self.dataResult.linesWin !== "") self.showLineWin(self.dataResult.linesWin.split(","));
                                    else self.spinFinish(false);
                                })
                            )
                        )
                    }
                    else {
                        self.showWinEffect(self.dataResult.prize, self.dataResult.currentMoney, self.dataResult.result);
                    }

                }

            })
            .start();
    }

    getSpriteFrameIconBlur(indexIcon) {
        var self = this;
        if (this.betId == -1)
            return self.iconSFBlurArr10K[indexIcon];
        else if (this.betId == 0)
            return self.iconSFBlurArr100[indexIcon];
        else if (this.betId == 1)
            return self.iconSFBlurArr1K[indexIcon];
        else if (this.betId == 2)
            return self.iconSFBlurArr10K[indexIcon];
    }

    getSpriteFrameIcon(indexIcon) {
        var self = this;
        if (this.betId == -1)
            return self.iconSFArr10K[indexIcon];
        else if (this.betId == 0)
            return self.iconSFArr100[indexIcon];
        else if (this.betId == 1)
            return self.iconSFArr1K[indexIcon];
        else if (this.betId == 2)
            return self.iconSFArr10K[indexIcon];
    }

    getSpineIcon(indexIcon) {
        var self = this;
        if (this.betId == -1)
            return self.arrSkeletonIcon10K[indexIcon];
        else if (this.betId == 0)
            return self.arrSkeletonIcon100[indexIcon];
        else if (this.betId == 1)
            return self.arrSkeletonIcon1K[indexIcon];
        else if (this.betId == 2)
            return self.arrSkeletonIcon10K[indexIcon];
    }

    hideWinEffect() {
        this.winNormalBg.active = false;
        this.winLabel.string = "0";
        this.bonusNode.active = false;
        this.bigWinNode.active = false;
        this.jackpotNode.active = false;
    }

    onBtnToggleMusic() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        this.isMusic = !this.isMusic;
        cc.audioEngine.setMusicVolume(this.isMusic ? 0.5 : 0);
    }

    onBtnToggleSound() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        this.isSound = !this.isSound;
    }

    onBtnHistory() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        this.onBtnHideSetting();
    }

    onBtnHistoryJackpot() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        this.onBtnHideSetting();
    }

    onBtnHideSetting() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        Tween.hidePopup(this.nodeBoxSetting, this.nodeBoxSetting.parent, false);
    }

    onBtnSoundClick() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
    }

    onBtnSetting() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        this.toggleMusic.isChecked = this.isMusic;
        this.toggleSound.isChecked = this.isSound;
        // Tween.showPopup(this.nodeBoxSetting, this.nodeBoxSetting.parent);
        this.nodeBoxSetting.active = !this.nodeBoxSetting.active;
    }
    showLineWin(lines: Array<number>) {
        //  cc.log("show line win");
        if (lines.length == 0) return;
        this.changeAllItemToDark(true);
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            //  cc.log("showLIneWin :" + i + " : " + line);
            let lineNode = this.lineWinParent.children[line - 1];
            lineNode.active = true;
        }
        let that = this;
        //hide all line
        this.lineWinParent.runAction(
            cc.sequence(
                cc.delayTime(1),
                cc.callFunc(() => {
                    that.hideLineWin(false);
                })
            )
        );
        if (this.toggleFast.isChecked) {
            this.lineWinParent.runAction(
                cc.sequence(
                    cc.delayTime(1.5),
                    cc.callFunc(() => {
                        this.spinFinish(false);
                    })));
        } else {
            this.lineWinParent.runAction(
                cc.sequence(
                    cc.delayTime(1.5),
                    cc.callFunc(() => {
                        this.winNormalBg.active=false;
                        this.lineWinParent.setSiblingIndex(0);
                        this.colParent.setSiblingIndex(1);
                        //active line one by one
                        for (let i = 0; i < lines.length; i++) {
                            let line = lines[i];
                            let lineNode = this.lineWinParent.children[line - 1];
                            this.lineWinParent.runAction(
                                cc.sequence(
                                    cc.delayTime(i * this.TIME_DELAY_SHOW_LINE),
                                    cc.callFunc(() => {
                                        lineNode.active = true;
                                        let arrItem = this.getItemWinInLine(line - 1);
                                        let arrIdOfItem = [];
                                        let idWin = -1;
                                        arrItem.forEach((item) => {
                                            arrIdOfItem.push(item.itemId);
                                        });
                                        arrItem.forEach((item) => {
                                            idWin = this.getItemIdWinInLine(arrIdOfItem);
                                            if (item.itemId == idWin) {
                                                item.checkShowSpriteOrSpine();
                                            }
                                        });
                                    }),
                                    cc.delayTime(this.TIME_DELAY_SHOW_LINE),
                                    cc.callFunc(() => {
                                        lineNode.active = false;
                                        if (i == lines.length - 1)
                                            that.spinFinish(false);
                                    })
                                )

                            );
                        }
                    })
                )
            );
        }


    }

    hideLineWin(stopAction: boolean) {
        if (stopAction) this.lineWinParent.stopAllActions();
        this.lineWinParent.children.forEach(element => {
            element.active = false;
        });
    }

    setButtonEnable(active: boolean) {
        this.btnSpin.interactable = active;
        this.btnBack.interactable = active;
        this.btnLine.interactable = active;
        if (active == true) {
            this.skeSpin.node.color = cc.Color.WHITE;
            this.skeSpin.setAnimation(0, "quay", true);
        }
        else {
            this.skeSpin.setAnimation(0, "quay2", true);
            this.skeSpin.node.color = cc.Color.GRAY;
        }
    }



    setButtonFlash(active: boolean) {
        this.toggleFast.interactable = active;
        this.toggleFast.node.children[0].color = active ? cc.Color.WHITE : cc.Color.GRAY;
    }

    //#region CHANGE BET
    changeBet() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }

        this.mSlotLobby.node.active = !this.mSlotLobby.node.active;
    }

    chooseBet(event, bet) {

        let oldIdx = this.betId;
        this.betId = parseInt(bet);
        this.dailyFreeSpin = 0;
        this.lblFreeSpinCount.node.parent.active = false;
        this.isTrial = bet == -1 ? true : false;
        this.betId = bet == -1 ? 2 : bet;
        if (this.betId >= this.listBet.length) {
            this.betId = 0;
            SlotNetworkClient.getInstance().send(new cmd.SendChangeRoom(oldIdx, this.betId));
        }
        else {
            SlotNetworkClient.getInstance().send(new cmd.SendChangeRoom(oldIdx, this.betId));
        }
        this.lbCurrentRoom.string = bet == "0" ? "100" : Utils.formatNumber(1000);
        if (bet == 2)
            this.lbCurrentRoom.string = Utils.formatNumber(10000)
    }


    showGuide() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        this.popupGuide.show(this);
    }

    closeGuide() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        this.popupGuide.hide();
    }

    showChooseLine() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
    }

    changeSpeed() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        this.isFastCurrent = this.toggleFast.isChecked;
        if (!this.toggleAuto.isChecked) {
            this.toggleAuto.check();
        }
        if (this.toggleFast.isChecked && !this.isSpining) {
            this.spinClick();
        }

    }

    setAutoSpin() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }

        if (!this.isSpining) {
            this.spinClick();
        }
    }


    actBack() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        this.lineWinParent.stopAllActions();
        SlotNetworkClient.getInstance().send(new cmd.SendUnSubcribe(this.betId));

        this.mSlotLobby.show();
        this.hideGamePlay();
    }
    changeAllItemToDark(state) {
        this.arrUIItemIcon.forEach((item) => {
            let sprite = item.getComponentInChildren(cc.Sprite);
            let spine = item.getComponentInChildren(sp.Skeleton);

            sprite.node.color = state ? cc.Color.GRAY : cc.Color.WHITE;
            sprite.node.active = true;
            spine.node.color = state ? cc.Color.GRAY : cc.Color.WHITE;
            spine.node.active = false;
            spine.node.scale = 0.65;
            sprite.node.scale = 1.0;
        })
    }
    getItemWinInLine(lineId) {
        let lineArr = this.mapLine[lineId];
        let arrItem = [];
        for (let i = 0; i < lineArr.length; i++) {
            arrItem.push(this.arrRealItem[lineArr[i]]);
        }
        return arrItem;
    }
    getItemIdWinInLine(arrId: Array<number>) {
        let count = 0;
        let idWin = -1;
        arrId.forEach((id) => {
            let size = arrId.filter(x => x == id).length;
            if (size >= count) {
                count = size;
                idWin = id;
            }
        })
        return idWin;
    }
    actGuide() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.popupGuide == null) {
            BundleControl.loadPrefabGame("Slot8", "thanbai/prefabs/PopupGuide", (finish, total) => {
                // App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
            }, prefab => {
                App.instance.showLoading(false);
                this.popupGuide = cc.instantiate(prefab).getComponent("Dialog");
                this.popupGuide.node.parent = this.popupContainer;
                this.popupGuide.show();
            });
        } else {
            this.popupGuide.show();
        }
    }
    actHistory() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.isTrial) {
            App.instance.showToast(App.instance.getTextLang('txt_slot_error'));
            return;
        }
        if (this.popupHistory == null) {
            BundleControl.loadPrefabGame("Slot8", "thanbai/prefabs/History", (finish, total) => {
                // App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
            }, prefab => {
                App.instance.showLoading(false);
                this.popupHistory = cc.instantiate(prefab).getComponent("Slot8History");
                this.popupHistory.node.parent = this.popupContainer;
                this.popupHistory.show();
            });
        } else {
            this.popupHistory.show();
        }
    }
    actHistoryJackpot() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.isTrial) {
            App.instance.showToast(App.instance.getTextLang('txt_slot_error'));
            return;
        }
        if (this.popupHonor == null) {
            BundleControl.loadPrefabGame("Slot8", "thanbai/prefabs/Glory", (finish, total) => {
                // App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
            }, prefab => {
                App.instance.showLoading(false);
                this.popupHonor = cc.instantiate(prefab).getComponent("Slot8Glory");
                this.popupHonor.node.parent = this.popupContainer;
                this.popupHonor.show();
            });
        } else {
            this.popupHonor.show();
        }
    }
    actChooseLine() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.isTrial) {
            App.instance.showToast(App.instance.getTextLang('txt_slot_error'));
            return;
        }
        if (this.popupChooseLine == null) {
            BundleControl.loadPrefabGame("Slot8", "thanbai/prefabs/ChooseLine", (finish, total) => {
                // App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
            }, prefab => {
                App.instance.showLoading(false);
                this.popupChooseLine = cc.instantiate(prefab).getComponent("Slot8ChooseLine");
                this.popupChooseLine.node.parent = this.popupContainer;
                this.popupChooseLine.showPopup(this.arrLineSelected);
                this.popupChooseLine.onSelectedChanged = (lines) => {
                    this.arrLineSelected = lines;
                    this.totalLineLabel.string = lines.length.toString();
                    Tween.numberTo(this.totalBetLabel, lines.length * this.listBet[this.betId], 0.3);
                }
            });
        } else {
            this.popupChooseLine.showPopup(this.arrLineSelected);
        }
    }
    actShowBonus(isTrial, dataHaiSao, cb) {
        if (this.isSound) {
            cc.audioEngine.play(this.soundBonus, false, 1);
        }
        if (this.popupBonus == null) {
            BundleControl.loadPrefabGame("Slot8", "thanbai/prefabs/PopupBonus", (finish, total) => {
                // App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
            }, prefab => {
                App.instance.showLoading(false);
                this.popupBonus = cc.instantiate(prefab).getComponent("Slot8.PopupBonus");
                this.popupBonus.node.parent = this.popupContainer;
                this.popupBonus.showBonus(isTrial, dataHaiSao, this, cb);
            });
        } else {
            this.popupBonus.showBonus(isTrial, dataHaiSao, this, cb);
        }
    }
}
