import BundleControl from '../../Loading/src/BundleControl';
import Configs from "../../Loading/src/Configs";
import App from '../../Lobby/LobbyScript/Script/common/App';
import BroadcastReceiver from '../../Lobby/LobbyScript/Script/common/BroadcastReceiver';
import Dialog from '../../Lobby/LobbyScript/Script/common/Dialog';
import Tween from '../../Lobby/LobbyScript/Script/common/Tween';
import Utils from '../../Lobby/LobbyScript/Script/common/Utils';
import InPacket from '../../Lobby/LobbyScript/Script/networks/Network.InPacket';
import SlotNetworkClient from '../../Lobby/LobbyScript/Script/networks/SlotNetworkClient';
import cmd from './Slot1.Cmd';
import Slot1ItemSlot from './Slot1.ItemSlot';
import Slot1Lobby from "./Slot1.Lobby";
import Slot1PopupBonus from './Slot1.PopupBonus';
import PopupHistory from './Slot1.PopupHistory';
import PopupJackpotHistory from './Slot1.PopupJackpotHistory';
import PopupSelectLine from './Slot1.PopupSelectLine';
import Slot1TrialResult from './Slot1.TrialResults';



var MAX_CYCCLE_SPIN = 20;
var FAST_CYCCLE_SPIN = 10;
var ERROR_CYCCLE_SPIN = 50;
var ANIM_ICON = ["Jackpot", "wildmonkey", "bonus", "batgioi", "satang", "quadao", "vongkimco"];
var TW = cc.tween;
const { ccclass, property } = cc._decorator;

@ccclass
export default class Slot1Controller extends cc.Component {
    @property(cc.Node)
    nodeCoin: cc.Node = null;
    @property(cc.Button)
    btnBack: cc.Button = null;
    @property(cc.Button)
    btnPlayTry: cc.Button = null;
    @property(cc.Button)
    btnPlayReal: cc.Button = null;
    @property(cc.Button)
    btnLine: cc.Button = null;

    @property(Slot1PopupBonus)
    popupBonus: Slot1PopupBonus = null;

    @property(cc.Node)
    nodeBoxSetting: cc.Node = null;
    @property(cc.Button)
    toggleMusic: cc.Button = null;
    @property(cc.Button)
    toggleSound: cc.Button = null;

    @property(cc.Sprite)
    spriteSpin: cc.Sprite = null;
    @property(cc.Node)
    animSpin: cc.Node = null;
    @property(cc.SpriteFrame)
    sfSpinStart: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sfSpinStop: cc.SpriteFrame = null;
    @property(cc.Node)
    nodeDemo: cc.Node = null;
    @property(cc.Node)
    nodeWinJackpot: cc.Node = null;
    @property(cc.Label)
    txtWinJackpot: cc.Label = null;
    @property(cc.Node)
    nodeGamePlay: cc.Node = null;
    @property(Slot1Lobby)
    mSlotLobby: Slot1Lobby = null;
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
    @property(cc.Label)
    lblFreeSpinCount: cc.Label = null;
    //win
    @property(cc.Label)
    lblBet: cc.Label = null;
    @property(cc.Node)
    bigWinNode: cc.Node = null;
    @property(cc.Label)
    txtWinBigWin: cc.Label = null;
    @property(cc.Node)
    jackpotNode: cc.Node = null;
    @property(cc.Node)
    bonusNode: cc.Node = null;

    @property(cc.Node)
    iconWildColumns: cc.Node = null;
    //line win
    @property(cc.Node)
    lineWinParent: cc.Node = null;
    @property(cc.Node)
    collumParent: cc.Node = null;

    //show result
    @property(cc.Label)
    totalWinLabel: cc.Label = null;
    @property(cc.Label)
    totalBetLabel: cc.Label = null;



    @property({ type: cc.AudioClip })
    musicLobby: cc.AudioClip = null;
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
    soundtouchBonus: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundtouchBonusLose: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundSmumary: cc.AudioClip = null;
    @property([Slot1ItemSlot])
    arrRealItem: Slot1ItemSlot[] = [];

    popupJackpotHistory: PopupJackpotHistory = null;
    popupHistory: PopupHistory = null;
    popupGuide: Dialog = null;
    popupSelectLine: PopupSelectLine = null;
    bonusGameView: cc.Node = null;
    private dailyFreeSpin = 0;
    private listActiveItem: cc.Node[] = [];         //list 15 item nhin thay tren man hinh
    private columnsWild = [];
    private TIME_DELAY_SHOW_LINE: number = 1;
    private readonly wildItemId = 1;
    public betId = 0;
    private listBet = [100, 1000, 10000];
    private listBetString = ["100", "1K", "10K"];
    private arrLineSelected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    public isTrial: Boolean = false;
    private isSpining: Boolean = false;
    private autoSpin = false;
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
    mutipleJpNode = null;
    private isFast = false;

    @property([cc.Node])
    arrReel: cc.Node[] = [];

    @property
    distanceReel: number = 0;

    @property([Slot1ItemSlot])
    arrUIItemIcon: Slot1ItemSlot[] = [];




    public numberSpinReel = null;
    public isHaveResultSpin = false;
    public dataResult = null;
    private isFirst = false;

    public isSound = false;
    public isMusic = true;


    start() {
        // Configs.Login.Coin = 0;
        this.dailyFreeSpin = 0;
        this.isSound = true;
        this.isMusic = true;
        this.totalWinLabel.string = "";
        SlotNetworkClient.getInstance().addOnClose(() => {
            this.mSlotLobby.onBtnBack();
        }, this);
        this.iconWildColumns.zIndex = 3;
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
                        // //  cc.log("update Jackpot:" + (this.betId == 0));
                        if (this.betId == -1) {
                            Tween.numberTo(this.jackpotLabel, res.valueRoom3, 4.0);
                        }
                        else if (this.betId == 0) {
                            Tween.numberTo(this.jackpotLabel, res.valueRoom1, 4.0);
                        }
                        else if (this.betId == 1) {
                            Tween.numberTo(this.jackpotLabel, res.valueRoom2, 4.0);
                        }
                        else if (this.betId == 2) {
                            Tween.numberTo(this.jackpotLabel, res.valueRoom4, 4.0);
                        }

                    }
                    break;
                case cmd.Code.UPDATE_RESULT:
                    {
                        let res = new cmd.ReceiveResult(data);
                        //dataBonusFake res = JSON.parse('{"_pos":99,"_data":{"0":1,"1":7,"2":209,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":10,"11":173,"12":5,"13":0,"14":29,"15":50,"16":44,"17":50,"18":44,"19":54,"20":44,"21":53,"22":44,"23":53,"24":44,"25":54,"26":44,"27":52,"28":44,"29":50,"30":44,"31":53,"32":44,"33":51,"34":44,"35":53,"36":44,"37":51,"38":44,"39":53,"40":44,"41":49,"42":44,"43":53,"44":0,"45":14,"46":51,"47":44,"48":54,"49":44,"50":57,"51":44,"52":49,"53":52,"54":44,"55":49,"56":55,"57":44,"58":50,"59":48,"60":0,"61":21,"62":52,"63":44,"64":49,"65":44,"66":49,"67":44,"68":49,"69":44,"70":50,"71":44,"72":49,"73":44,"74":49,"75":44,"76":49,"77":44,"78":52,"79":44,"80":49,"81":44,"82":49,"83":0,"84":0,"85":0,"86":0,"87":0,"88":40,"89":150,"90":160,"91":0,"92":0,"93":0,"94":0,"95":1,"96":126,"97":50,"98":160},"_length":99,"_controllerId":1,"_cmdId":2001,"_error":0,"ref":2733,"result":5,"matrix":"2,2,6,5,5,6,4,2,5,3,5,3,5,1,5","linesWin":"3,6,9,14,17,20","haiSao":"4,1,0,1,2,1,0,1,4,1,1","prize":2660000,"currentMoney":25047712}');
                        this.spinResult(res);
                    }
                    break;
                case cmd.Code.FREE_DAI_LY:
                    {
                        if (!this.isTrial) {
                            let res = new cmd.ReceiveFreeDaiLy(data);
                            //  cc.log("init Slot1 FreeSpin:" + JSON.stringify(res));
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
            Tween.numberTo(this.moneyLabel, Configs.Login.Coin, 1.0);
        }, this);
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

        App.instance.showErrLoading("Đang kết nối tới server...");
        SlotNetworkClient.getInstance().checkConnect(() => {
            App.instance.showLoading(false);
        });

        this.mSlotLobby.init(this);
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
                    this.mutipleJpNode.setInfo("DUAXE");
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
        this.randomIconList();
        this.nodeGamePlay.active = true;
        this.showAnimations();
    }

    hideGamePlay() {
        this.nodeGamePlay.active = false;
    }

    init() {
        this.totalWinLabel.string = "";
    }

    public onJoinRoom(res = null) {
        //  cc.log("onJoinRoom:" + this.betId);
        this.lblBet.string = this.listBetString[this.betId];
        var betIdTmp = this.betId;
        if (betIdTmp == -1) betIdTmp = 2;
        let totalbet = (this.arrLineSelected.length * this.listBet[betIdTmp]);
        this.totalBetLabel.string = Utils.formatNumberMin(totalbet);
        this.mSlotLobby.hide();
        this.nodeDemo.active = this.isTrial ? true : false;
        this.showGamePlay();
        this.setButtonEnable(true);



    }

    randomIconList() {
        var self = this;
        for (var i = 0; i < self.arrUIItemIcon.length; i++) {
            var index = i;
            var itemId = Math.floor(Math.random() * 7);
            self.arrUIItemIcon[i].init(itemId, index, self);
            self.arrUIItemIcon[i].changeSpineIcon(itemId);
            // self.arrUIItemIcon[i].spriteIcon.node.active = false;
            // self.arrUIItemIcon[i].spineIcon.node.active = true;
            // self.arrUIItemIcon[i].spineIcon.animation = ANIM_ICON[itemId];
            self.arrUIItemIcon[i].spineIcon.loop = true;
        }
    }

    /**
     * random between, min, max included
     */
    randomBetween(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    onClickChangeRoom() {
        if (this.isTrial) {
            App.instance.showToast(App.instance.getTextLang('txt_slot_error'));
            return;
        }
        this.actBack();
    }

    spinClick() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }


        for (var i = 0; i < this.iconWildColumns.childrenCount; i++) {
            this.iconWildColumns.children[i].active = false;
        }

        //hide effect

        // this.setButtonAuto(false);
        // this.setButtonFlash(false);
        //  cc.log("spinClick:" + this.isTrial);
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
            //  cc.log("total line==", this.arrLineSelected + "==list bet--" + this.listBet[this.betId]);
            SlotNetworkClient.getInstance().send(new cmd.SendPlay(this.listBet[this.betId], this.arrLineSelected.toString()));
        } else {
            this.hideWinEffect();
            this.hideLineWin(true);
            this.setButtonEnable(false);
            this.totalWinLabel.string = "";
            var rIdx = Utils.randomRangeInt(0, Slot1TrialResult.results.length);
            //  cc.log("random index=" + rIdx)
            this.spinResult(Slot1TrialResult.results[rIdx]);
        }
    }



    private audioIdRepeatSpin = 0;
    spinResult(res: cmd.ReceiveResult | any) {
        this.isSpining = true;
        //  cc.log("spinResult:" + JSON.stringify(res));
        // res = JSON.parse('{"_pos":80,"_data":{"0":1,"1":7,"2":209,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":18,"11":117,"12":1,"13":0,"14":29,"15":52,"16":44,"17":52,"18":44,"19":54,"20":44,"21":54,"22":44,"23":52,"24":44,"25":51,"26":44,"27":54,"28":44,"29":53,"30":44,"31":52,"32":44,"33":53,"34":44,"35":51,"36":44,"37":51,"38":44,"39":52,"40":44,"41":51,"42":44,"43":54,"44":0,"45":16,"46":50,"47":44,"48":51,"49":44,"50":54,"51":44,"52":55,"53":44,"54":49,"55":50,"56":44,"57":49,"58":54,"59":44,"60":49,"61":55,"62":0,"63":0,"64":0,"65":0,"66":0,"67":0,"68":0,"69":3,"70":13,"71":64,"72":0,"73":0,"74":0,"75":0,"76":2,"77":43,"78":233,"79":204},"_length":80,"_controllerId":1,"_cmdId":2001,"_error":0,"ref":4725,"result":1,"matrix":"4,4,6,6,4,3,6,5,4,5,3,3,4,3,6","linesWin":"2,3,6,7,12,16,17","haiSao":"","prize":200000,"currentMoney":36432332}');
        let successResult = [0, 1, 2, 3, 4, 5, 6];
        let result = res.result;
        if (successResult.indexOf(result) === -1) {
            //fail
            if (result === 102) {
                //khong du tien
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
        this.columnsWild.length = 0;
        if (this.isSound) {
            cc.audioEngine.play(this.soundStartSpin, false, 1);
        }
        if (this.isSound) {
            this.audioIdRepeatSpin = cc.audioEngine.play(this.soundRepeatSpin, true, 1);
        }
        for (var i = 0; i < this.arrReel.length; i++) {
            this.beginSpinReel(i);
        }
    }

    spinFinish(hasDelay: boolean) {
        //  cc.log("spin finish");
        this.changeAllItemToDark(false);
        this.isSpining = false;
        var that = this;
        this.node.runAction(
            cc.sequence(
                cc.delayTime(hasDelay ? 1 : 0),
                cc.callFunc(() => {
                    if (this.autoSpin) {
                        that.spinClick();
                    } else {
                        that.setButtonEnable(true);
                        that.setButtonFlash(true);
                    }
                })
            )
        )

    }

    private showCoins(prize) {
        var number = prize / 20000;
        if (number <= 10) number = 10;
        else if (number >= 30) number = 30;
        App.instance.showCoins(number, this.totalWinLabel.node, this.nodeCoin);
    }

    showWinEffect(prize: number, currentMoney: number, result: number) {
        var self = this;
        this.btnBack.interactable = true;
        if (prize > 0) {
            this.lineWinParent.zIndex = 1;
            this.collumParent.zIndex = 0;
            this.changeAllItemToDark(true);
            if (result == 5) {
                //bonus
                if (this.isMusic) {
                    cc.audioEngine.playMusic(this.musicBonus, true);
                }
                this.bonusNode.active = true;
                let bonusSpine = this.bonusNode.getComponentInChildren(sp.Skeleton);
                bonusSpine.animation = "bounus fx";
                bonusSpine.loop = true;
                this.node.runAction(
                    cc.sequence(
                        cc.delayTime(3),
                        cc.callFunc(() => {
                            this.bonusNode.active = false;
                            this.actShowBonus(this.isTrial ? 100 : this.listBet[this.betId], this.dataResult.haiSao, () => {
                                this.showLineWin(self.dataResult.linesWin.split(","));
                                this.showCoins(prize);
                                Tween.numberTo(this.totalWinLabel, prize, 1.0);
                                if (!this.isTrial) Tween.numberTo(this.moneyLabel, currentMoney, 1.0);
                                if (this.toggleFast.isChecked) {
                                    self.spinFinish(true);
                                } else {
                                    if (self.dataResult.linesWin !== "") self.showLineWin(self.dataResult.linesWin.split(","));
                                    else self.spinFinish(false);
                                }
                            });
                        })
                    )
                )

            }
            else if (result == 2 || result == 6) {
                //thang lon                
                if (this.isSound) {
                    cc.audioEngine.play(this.soundBigWin, false, 1);
                }
                this.bigWinNode.active = true;
                let bigwinSpine = this.bigWinNode.getComponentInChildren(sp.Skeleton);
                bigwinSpine.animation = "thanglon";
                bigwinSpine.loop = true;
                Tween.numberTo(this.txtWinBigWin, prize, 1.0);
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
                Tween.numberTo(this.totalWinLabel, prize, 1.0);
                if (!this.isTrial) Tween.numberTo(this.moneyLabel, currentMoney, 1.0);

            } else if (result == 3 || result == 4) {
                //no hu
                if (this.isSound) {
                    var audioIdJackpot = cc.audioEngine.play(this.soundJackpot, false, 1);
                }

                this.jackpotNode.active = true;
                let jackpotSpine = this.jackpotNode.getComponentInChildren(sp.Skeleton);
                jackpotSpine.animation = "animation6";
                jackpotSpine.loop = true;

                cc.Tween.stopAllByTarget(this.nodeWinJackpot);
                this.txtWinJackpot.string = "0";
                Tween.numberTo(this.txtWinJackpot, prize, 3.0);
                // this.nodeWinJackpot.position = cc.v3(0, -360, 0);
                this.nodeWinJackpot.active = true;
                cc.tween(this.nodeWinJackpot)
                    .to(1, { position: cc.v3(0, 0, 0) })
                    .delay(3)
                    .to(1, { position: cc.v3(0, 0, 0) })
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
                this.showCoins(prize);
                Tween.numberTo(this.totalWinLabel, prize, 1.0);
                if (!this.isTrial) Tween.numberTo(this.moneyLabel, currentMoney, 1.0);

            } else {
                if (this.isSound) {
                    cc.audioEngine.play(this.soundSpinWin, false, 1);
                }
                this.showCoins(prize);
                Tween.numberTo(this.totalWinLabel, prize, 1.0);

                if (!this.isTrial) Tween.numberTo(this.moneyLabel, currentMoney, 1.0);
                if (this.toggleFast.isChecked) {
                    if (self.dataResult.linesWin !== "") self.showLineWin(self.dataResult.linesWin.split(","));
                    else self.spinFinish(false);
                } else {
                    if (self.dataResult.linesWin !== "") self.showLineWin(self.dataResult.linesWin.split(","));
                    else self.spinFinish(false);
                }
            }


        } else {
            // App.instance.showCoins(10,this.totalWinLabel.node,this.nodeCoin);
            Tween.numberTo(this.totalWinLabel, prize, 1.0);
            if (!this.isTrial) Tween.numberTo(this.moneyLabel, currentMoney, 1.0);
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
        let timeDelay = this.toggleFast.isChecked ? 0.1 : 0.2;
        cc.tween(self.arrReel[indexReel])
            .delay(indexReel * timeDelay)
            .to(0.1, { position: cc.v3(self.arrReel[indexReel].position.x, 70, 0) }, { easing: "linear" })
            .call(() => {
                self.loopSpinReel(indexReel);
            })
            .start();
    }

    loopSpinReel(indexReel) {

        var self = this;
        cc.tween(self.arrReel[indexReel])
            .to(0.06, { position: cc.v3(self.arrReel[indexReel].position.x, -self.distanceReel, 0) }, { easing: "linear" })
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
                itemIdTmp = Math.floor(Math.random() * 6);
            }
            else {
                itemIdTmp = self.arrUIItemIcon[index - 5].itemId;
            }
            self.arrUIItemIcon[index].changeSpriteBlurByItemId(itemIdTmp);
            // if (self.arrUIItemIcon[index].spriteIcon.node.active == false) {
            //     self.arrUIItemIcon[index].spriteIcon.node.active = true;
            //     self.arrUIItemIcon[index].spineIcon.node.active = false;
            // }
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
                self.arrUIItemIcon[index].spineIcon.loop = true;
            }
            return;
        }
        var matrix = self.dataResult.matrix.split(',');
        var roll = this.arrReel[indexReel];
        self.arrReel[indexReel].position = cc.v3(self.arrReel[indexReel].position.x, self.distanceReel, 0);
        let arrReal = [];
        for (var i = 3; i >= 1; i--) {
            var index = indexReel + (i * 5);
            var id = matrix[index - 5];
            self.arrUIItemIcon[index].changeSpineIcon(id);
            self.arrUIItemIcon[index].spineIcon.loop = true;
            arrReal.unshift(self.arrUIItemIcon[index]);
        }
        let timeStop = this.toggleFast.isChecked ? 0.2 : 0.3;
        cc.tween(self.arrReel[indexReel])
            .to(timeStop, { position: cc.v3(self.arrReel[indexReel].position.x, 0, 0) }, { easing: cc.easing.backOut })
            .call(() => {
                if (self.isSound) {
                    cc.audioEngine.play(self.soundEndSpin, false, 1);
                }
                if (indexReel == 4) {
                    cc.audioEngine.stop(this.audioIdRepeatSpin);
                    for (var i = 0; i < 5; i++) {
                        var itemId = Math.floor(Math.random() * 7);
                        self.arrUIItemIcon[i].changeSpineIcon(itemId);
                        self.arrUIItemIcon[i].spineIcon.loop = true;
                    }
                    for (var i = 20; i < 25; i++) {
                        var itemId = Math.floor(Math.random() * 7);
                        self.arrUIItemIcon[i].changeSpineIcon(itemId);

                        self.arrUIItemIcon[i].spineIcon.loop = true;
                    }
                    Configs.Login.Coin = self.dataResult.currentMoney;
                    self.showWinEffect(self.dataResult.prize, self.dataResult.currentMoney, self.dataResult.result);
                }
            })
            .start();
    }

    onBtnSoundTouchBonus(isWin) {
        if (this.isSound) {
            if (isWin) {
                cc.audioEngine.play(this.soundtouchBonus, false, 1);
            }
            else {
                cc.audioEngine.play(this.soundtouchBonusLose, false, 1);
            }
        }
    }

    onBtnSoundSumary() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundSmumary, false, 1);
        }
    }
    getSpriteFrameIcon(indexIcon) {
        var self = this;
        return null;

    }


    hideWinEffect() {
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
        if (this.nodeBoxSetting.active == false) {
            //  cc.log("clmmm");
            this.nodeBoxSetting.active = true;
        } else {
            this.nodeBoxSetting.active = false;
        }

    }
    showLineWin(lines: Array<number>) {
        if (lines.length == 0) return;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            let lineNode = this.lineWinParent.children[line - 1];
            lineNode.active = true;
        }

        let that = this;
        //hide all line
        let acHideAllLine = cc.sequence(
            cc.delayTime(1),
            cc.callFunc(() => {
                this.lineWinParent.zIndex = 0;
                this.collumParent.zIndex = 1;
                that.hideLineWin(false);
            })
        );
        let acShowOneByOne = cc.callFunc(() => {
            //active line one by one
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                let lineNode = this.lineWinParent.children[line - 1];
                TW(lineNode)
                    .delay(i * this.TIME_DELAY_SHOW_LINE)
                    .call(() => {
                        lineNode.active = true;
                        let arrItem = this.getItemWinInLine(line - 1);
                        let arrIdOfItem = [];
                        let idWin = -1;
                        arrItem.forEach((item) => {
                            arrIdOfItem.push(item.itemId);
                        });
                        arrItem.forEach((item) => {
                            idWin = this.getItemIdWinInLine(arrIdOfItem);
                            if (item.itemId == idWin || (item.itemId == 1 && idWin != 0 && idWin != 2)) {
                                item.checkShowSpriteOrSpine();
                            }
                        });

                    })
                    .delay(this.TIME_DELAY_SHOW_LINE)
                    .call(() => {
                        // this.changeAllItemToDark(true);
                        lineNode.active = false;
                        if (i == lines.length - 1)
                            that.spinFinish(false);
                    })
                    .start();
            }
        });
        if (this.toggleFast.isChecked) {
            let timeDelay = this.toggleFast.isChecked ? 0 : 1.0;
            this.lineWinParent.runAction(cc.sequence(acHideAllLine, cc.delayTime(timeDelay), cc.callFunc(() => {
                this.spinFinish(false);
            })));
        } else {
            let duration = acHideAllLine.getDuration();
            this.lineWinParent.runAction(cc.sequence(acHideAllLine, cc.delayTime(duration), acShowOneByOne));
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
        this.btnPlayTry.interactable = active;
        this.btnPlayReal.interactable = active;
        if (active == true) {
            // this.spriteSpin.spriteFrame = this.sfSpinStart;
            this.spriteSpin.node.active = false;
            this.animSpin.active = true;
        }
        else {
            this.spriteSpin.spriteFrame = this.sfSpinStop;
            this.spriteSpin.node.active = true;
            this.animSpin.active = false;
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
            this.onJoinRoom();
        }
    }
    changeSpeed() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        this.isFastCurrent = this.toggleFast.isChecked;
        if (this.toggleFast.isChecked && !this.isSpining) {
            this.spinClick();
        }
    }

    setAutoSpin() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        this.autoSpin = !this.autoSpin;
        if (!this.isSpining) {
            this.spinClick();
        }
    }


    actBack() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        SlotNetworkClient.getInstance().send(new cmd.SendUnSubcribe(this.betId));

        this.mSlotLobby.show();
        this.hideGamePlay();
    }
    actHistoryJackpot() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.isTrial) {
            App.instance.showToast(App.instance.getTextLang('txt_slot_error'));
            return;
        }
        if (this.popupJackpotHistory == null) {
            BundleControl.loadPrefabGame("Slot1", "duaxe/prefabs/PopupJackpotHistory", (finish, total) => {
                // App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
            }, prefab => {
                App.instance.showLoading(false);
                this.popupJackpotHistory = cc.instantiate(prefab).getComponent("Slot1.PopupJackpotHistory");
                this.popupJackpotHistory.node.parent = cc.director.getScene().getChildByName("Canvas");
                this.popupJackpotHistory.show();
            });
        } else {
            this.popupJackpotHistory.show();
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
            BundleControl.loadPrefabGame("Slot1", "duaxe/prefabs/PopupHistory", (finish, total) => {
                // App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
            }, prefab => {
                App.instance.showLoading(false);
                this.popupJackpotHistory = cc.instantiate(prefab).getComponent("Slot1.PopupHistory");
                this.popupJackpotHistory.node.parent = cc.director.getScene().getChildByName("Canvas");
                this.popupJackpotHistory.show();
            });
        } else {
            this.popupHistory.show();
        }
    }
    actGuide() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.popupGuide == null) {
            BundleControl.loadPrefabGame("Slot1", "duaxe/prefabs/PopupGuide", (finish, total) => {
                // App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
            }, prefab => {
                App.instance.showLoading(false);
                this.popupGuide = cc.instantiate(prefab).getComponent("Slot1.PopupGuide");
                this.popupGuide.node.parent = cc.director.getScene().getChildByName("Canvas");
                this.popupGuide.show();
            });
        } else {
            this.popupGuide.show();
        }
    }
    actSelectLine() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        if (this.isTrial) {
            App.instance.showToast(App.instance.getTextLang('txt_slot_error'));
            return;
        }
        if (this.popupSelectLine == null) {
            BundleControl.loadPrefabGame("Slot1", "duaxe/prefabs/PopupSelectLine", (finish, total) => {
                // App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
            }, prefab => {
                App.instance.showLoading(false);
                this.popupSelectLine = cc.instantiate(prefab).getComponent("Slot1.PopupSelectLine");
                this.popupSelectLine.node.parent = cc.director.getScene().getChildByName("Canvas");
                this.popupSelectLine.onSelectedChanged = (lines) => {
                    this.arrLineSelected = lines;
                    this.totalLineLabel.string = lines.length.toString();
                    this.totalBetLabel.string = Utils.formatNumberMin(lines.length * this.listBet[this.betId]);
                }
                this.popupSelectLine.show();
            });
        } else {
            this.popupSelectLine.show();
        }
    }
    // this.actShowBonus(this.isTrial ? 100 : this.listBet[this.betId], this.dataResult.haiSao, this, () => {
    actShowBonus(isTrial, dataHaiSao, cb) {
        if (this.isSound) {
            cc.audioEngine.play(this.soundBonus, false, 1);
        }
        if (this.popupBonus == null) {
            BundleControl.loadPrefabGame("Slot1", "duaxe/prefabs/PopupBonus", (finish, total) => {
                // App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
            }, prefab => {
                App.instance.showLoading(false);
                this.popupBonus = cc.instantiate(prefab).getComponent("Slot1.PopupBonus");
                this.popupBonus.node.parent = cc.director.getScene().getChildByName("Canvas");
                this.popupBonus.showBonus(isTrial, dataHaiSao, this, cb);
            });
        } else {
            this.popupBonus.showBonus(isTrial, dataHaiSao, this, cb);
        }
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
            sprite.node.scale = 0.8;
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
            let size = arrId.filter(x => x == id && x != 1).length;
            if (size >= count) {
                count = size;
                idWin = id;
            }
        })
        return idWin;
    }

}
