import Configs from "../../Loading/src/Configs";
import { Global } from "../../Loading/src/Global";
import App from "../../Lobby/LobbyScript/Script/common/App";
import BroadcastReceiver from "../../Lobby/LobbyScript/Script/common/BroadcastReceiver";
import SPUtils from "../../Lobby/LobbyScript/Script/common/SPUtils";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import CardUtils from "./BaCay.CardUtil";
import cmd from "./BaCay.Cmd";
import BaCayNetworkClient from "./BaCay.NetworkClient";
import BacayRoom from "./BaCay.Room";

var TW = cc.tween
enum audio_clip {
    BG = 0,
    LOSE = 1,
    WIN = 2,
    CHIA_BAI = 3,
    CHIP = 4,
    CLOCK = 5,
    START_BET = 6
}
var configPlayer = [
    // {
    //     seatId: 0,
    //     playerId: -1,
    //     playerPos: -1,
    //     isViewer: true
    // }
];

// defaultPlayerPos[0 -> 7][0] = player_pos of me
let defaultPlayerPos = [
    [0, 1, 2, 3, 4, 5, 6, 7],
    [1, 2, 3, 4, 5, 6, 7, 0],
    [2, 3, 4, 5, 6, 7, 0, 1],
    [3, 4, 5, 6, 7, 0, 1, 2],
    [4, 5, 6, 7, 0, 1, 2, 3],
    [5, 6, 7, 0, 1, 2, 3, 4],
    [6, 7, 0, 1, 2, 3, 4, 5],
    [7, 0, 1, 2, 3, 4, 5, 6]
]

const { ccclass, property } = cc._decorator;
@ccclass("BaCay.Controller.NodeShowCard")
export class NodeShowCard {
    @property(cc.Node)
    cardHide1: cc.Node = null;

    @property(cc.Node)
    cardHide2: cc.Node = null;
    @property(cc.Node)
    cardShow: cc.Node = null;

    @property(cc.Node)
    userHand: cc.Node = null;

    @property(cc.Node)
    userFinger: cc.Node = null;

    @property(cc.Node)
    nodeThis: cc.Node = null;
    @property(sp.Skeleton)
    animHand: sp.Skeleton = null;

    setInfo() {
        this.nodeThis.on(cc.Node.EventType.TOUCH_MOVE, (touch: cc.Touch) => {
            this.animHand.node.active = false;
            let delta = touch.getDelta();
            if (delta.x > 0 && this.cardShow.angle > -30) {
                if (this.cardShow.angle < -12) {
                    this.cardHide2.angle -= delta.x / 40;
                }
                this.cardShow.angle -= delta.x / 20;
                this.userFinger.angle -= delta.x / 20;
            }

        })
        this.nodeThis.on(cc.Node.EventType.TOUCH_END, (touch: cc.Touch) => {
            if (this.cardShow.angle < -20) {
                this.hide();
                BaCayController.instance.showCardReal();
            }
        })
    }
    show(currentCard) {
        this.animHand.node.active = false;
        this.nodeThis.getChildByName("animHand").active = true;
        this.cardHide2.angle = -2;
        this.cardShow.angle = -5;
        this.userFinger.angle = 0;
        this.cardShow.getComponent("TienLen.Card").setCardData(currentCard[0])
        this.cardHide2.getComponent("TienLen.Card").setCardData(currentCard[1])
        this.cardHide1.getComponent("TienLen.Card").setCardData(currentCard[2])
        cc.Tween.stopAllByTarget(this.userHand);
        TW(this.userHand).set({ angle: 90 }).to(0.5, { angle: 0 }, { easing: cc.easing.sineOut }).call(() => {
            this.setInfo();
        }).start();
    }
    hide() {
        TW(this.userHand).to(0.5, { angle: 90 }, { easing: cc.easing.sineIn })
            .call(() => {
                this.nodeThis.active = false;
            })
            .start();

    }
}
@ccclass
export default class BaCayController extends cc.Component {

    public static instance: BaCayController = null;

    public isInitedUIRoom = false;
    @property(cc.Toggle)
    toggleMusic: cc.Toggle = null;
    @property(cc.Toggle)
    toggleSound: cc.Toggle = null;
    @property(cc.Node)
    nodeSetting: cc.Node = null;

    @property(cc.Node)
    bgChat: cc.Node = null;
    @property(cc.Node)
    contentChatNhanh: cc.Node = null;
    @property(cc.Node)
    boxSetting: cc.Node = null;

    // UI Playing
    @property(cc.Node)
    UI_Playing: cc.Node = null;
    @property(cc.Node)
    meCards: cc.Node = null;
    @property(cc.Node)
    groupPlayers: cc.Node = null;
    @property(cc.Node)
    matchPot: cc.Node = null;
    @property(cc.Label)
    labelMatchPot: cc.Label = null;
    @property(cc.Node)
    cardsDeal: cc.Node = null;
    @property(cc.Node)
    btnBet: cc.Node = null;
    @property(cc.Node)
    btnOpenCard: cc.Node = null;
    @property(cc.Button)
    btnLeaveRoom: cc.Button = null;
    @property(cc.Node)
    hubChips: cc.Node = null;
    @property(cc.Label)
    labelRoomId: cc.Label = null;
    @property(cc.Label)
    labelRoomBet: cc.Label = null;
    @property(cc.Node)
    actionBetting: cc.Node = null;
    @property(cc.Node)
    betChooseValue: cc.Node = null;
    @property(cc.Node)
    betChooseValueTarget: cc.Node = null;

    // Popup Match Result
    @property(cc.Node)
    popupMatchResult: cc.Node = null;
    @property(cc.Node)
    contentMatchResult: cc.Node = null;
    @property(cc.Prefab)
    prefabItemResult: cc.Prefab = null;
    @property(cc.ScrollView)
    scrollMatchResult: cc.ScrollView = null;

    // Notify
    @property(cc.Node)
    notifyTimeStart: cc.Node = null;
    @property(cc.Node)
    notifyTimeEnd: cc.Node = null;
    @property(cc.Node)
    notifyTimeBet: cc.Node = null;

    // UI Chat
    @property(cc.Node)
    UI_Chat: cc.Node = null;
    @property(cc.EditBox)
    edtChatInput: cc.EditBox = null;

    @property(cc.Node)
    popupGuide: cc.Node = null;

    soundManager = null;

    @property(NodeShowCard)
    nodeShowCard: NodeShowCard = null;

    private seatOwner = null;
    private currentRoomBet = null;

    private gameState = null;//0-waiting,1-cuoc,2-Chia Bai

    private minutes = null;
    private seconds = null;


    private timeAutoStart = null;
    private timeEnd = null;
    private timeBet = null;
    private intervalWaitting = null;
    private intervalEnd = null;
    private intervalBetting = null;

    private currentCard = null;
    private numCardOpened = 0;

    // bet
    private arrBetValue = [];
    private listDataRoom = [];
    private listFullRoom = [];
    private arrBetPos = [-157.5, -52.5, 52.5, 157.5];
    private currentBetSelectedIndex = 0;

    private currentMatchPotValue = 0;

    private timeoutEndGame = null;
    private timeoutChiaBaiDone = null;

    private arrPosDanhBien = [];
    private timeInBg = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        BaCayController.instance = this;
        // this.UI_Playing.active = false;
        this.soundManager = BacayRoom.instance.soundManager;
        this.seatOwner = -1;

        this.initConfigPlayer();

    }


    showSetting() {
        this.toggleMusic.isChecked = SPUtils.getMusicVolumn() > 0;
        this.toggleSound.isChecked = SPUtils.getSoundVolumn() > 0;
        this.nodeSetting.active = true;
    }

    hideSetting() {
        this.nodeSetting.active = false;
    }

    onBtnToggleMusic() {
        SPUtils.setMusicVolumn(this.toggleMusic.isChecked ? 1 : 0);
        BroadcastReceiver.send(BroadcastReceiver.ON_AUDIO_CHANGED);
    }

    onBtnToggleSound() {
        SPUtils.setSoundVolumn(this.toggleSound.isChecked ? 1 : 0);
        BroadcastReceiver.send(BroadcastReceiver.ON_AUDIO_CHANGED);
    }

    onBtnSetting() {
        this.boxSetting.active = !this.boxSetting.active;
    }

    onBtnClickBgChat() {
        this.UI_Chat.opacity = 100;
        this.bgChat.active = false;
    }

    onBtnClickBoxChat() {
        this.UI_Chat.opacity = 255;
        this.bgChat.active = true;
    }

    start() {
        // this.showUIRooms();
        this.setupTimeRunInBg();
        this.bgChat.active = false;
        var self = this;
        for (var i = 0; i < this.contentChatNhanh.childrenCount; i++) {
            let node = this.contentChatNhanh.children[i];
            node.on('click', function () {
                self.chatNhanhMsg(node.children[0].getComponent(cc.Label).string);
            })
        }
        this.setupListener();
        this.unschedule(this.intervalBetting);
        this.soundManager.stopAudioEffect();
    }
    setupTimeRunInBg() {
        cc.game.on(cc.game.EVENT_HIDE, () => {
            this.timeInBg = cc.sys.now()
        })

        cc.game.on(cc.game.EVENT_SHOW, () => {
            let timeNow = cc.sys.now()
            let timeHide = this.timeInBg;
            cc.director.getActionManager().update((timeNow - timeHide) / 1000);
            cc.Tween.stopAllByTag(1);
            if ((timeNow - timeHide) / 1000 > 15) {
                this.node.active = false;
                // this.UI_ChooseRoom.active = true;
                BacayRoom.instance.node.active = true;
                this.refeshListRoom();
                App.instance.showToast(App.instance.getTextLang('txt_out_game'));
            }
        })

    };
    genCardDeal() {
        if (this.cardsDeal.childrenCount == 1) {
            for (let i = 1; i < 24; i++) {
                this.cardsDeal.addChild(cc.instantiate(this.cardsDeal.children[0]));
            }
        }

    }
    // Request UI Room
    joinRoom(info) {
        if (Configs.Login.Coin < info.requiredMoney) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_not_enough_money"));
            return;
        }
        App.instance.showLoading(true);
        BaCayNetworkClient.getInstance().send(new cmd.SendJoinRoomById(info["id"]));
    }

    refeshListRoom() {
        // this.contentListRooms.removeAllChildren(true);
        BaCayNetworkClient.getInstance().send(new cmd.SendGetListRoom());
    }
    toggleUIChat() {
        if (this.UI_Chat.active == false) {
            this.showUIChat();
        }
        else {
            this.closeUIChat();
        }
    }

    // Chat
    showUIChat() {
        this.onBtnClickBoxChat();
        this.UI_Chat.active = true;
        // this.UI_Chat.runAction(
        //     cc.moveTo(0.5, 420, 0)
        // );
        this.UI_Chat.active = true;
        cc.tween(this.UI_Chat).to(0.3, { x: cc.winSize.width / 2 - this.UI_Chat.width / 2 }, { easing: cc.easing.sineOut }).start();
    }

    closeUIChat() {
        // this.UI_Chat.runAction(
        //     cc.moveTo(0.5, 1000, 0)
        // );
        this.onBtnClickBgChat();
        cc.tween(this.UI_Chat).to(0.3, { x: cc.winSize.width / 2 + this.UI_Chat.width / 2 }, { easing: cc.easing.sineIn }).call(() => {
            this.UI_Chat.active = false;
        }).start();
    }

    chatEmotion(event, id) {
     //   cc.log("BaCay chatEmotion id : ", id);
        BaCayNetworkClient.getInstance().send(new cmd.SendChatRoom(1, id));
        this.closeUIChat();
    }

    chatMsg() {
        if (this.edtChatInput.string.trim().length > 0) {
            BaCayNetworkClient.getInstance().send(new cmd.SendChatRoom(0, this.edtChatInput.string));
            this.edtChatInput.string = "";
            this.closeUIChat();
        }
    }

    chatNhanhMsg(msg) {
        if (msg.trim().length > 0) {
            BaCayNetworkClient.getInstance().send(new cmd.SendChatRoom(0, msg));
            this.closeUIChat();
        }
    }

    showPopupGuide() {
        this.popupGuide.active = true;
    }

    closePopupGuide() {
        this.popupGuide.active = false;
    }




    closeUIPlaying() {
        this.actionLeaveRoom();
    }

    setupMatch(data: cmd.ReceivedJoinRoomSucceed) {
        this.closePopupMatchResult();
        this.closeUIChat();
        for (let index = 1; index < 8; index++) {
            let player = this.getPlayerHouse(index)
            player.showPopupBet(false);
            player.closePopupRequestDanhBien();
        }

      //  cc.log("BaCay setupMatch data : ", data);

        let chuongChair = data["chuongChair"];
        let countDownTime = data["countDownTime"];
        let gameAction = data["gameAction"];
        let gameId = data["gameId"];
        let moneyBet = data["moneyBet"];
        let moneyType = data["moneyType"];
        let myChair = data["myChair"];
        let playerInfos = data["playerInfos"];
        let playerSize = data["playerSize"];
        let playerStatus = data["playerStatus"];
        let roomId = data["roomId"];
        let rule = data["rule"];

        this.labelRoomId.string = roomId + "";
        this.labelRoomBet.string = Utils.formatNumber(moneyBet);

        this.currentRoomBet = moneyBet;

        this.gameState = gameAction;

        configPlayer[0].playerId = Configs.Login.Nickname;
        configPlayer[0].playerPos = myChair;


        var numPlayers = 0;
        var arrPlayerPosExist = [];
        var arrPlayerInfo = [];
        var arrPlayerStatus = [];

        for (let index = 0; index < playerInfos.length; index++) {
            if (playerInfos[index].nickName !== "") {
                numPlayers += 1;
                arrPlayerPosExist.push(index);
                arrPlayerInfo.push(playerInfos[index]);
                arrPlayerStatus.push(playerStatus[index]);
            }
        }
        this.resetHubChips();
        for (let a = 0; a < configPlayer.length; a++) {
            configPlayer[a].playerPos = defaultPlayerPos[myChair][a];
        }

        // set State of Seat : Yes | No exist Player
        for (let index = 0; index < configPlayer.length; index++) {
            let findPos = arrPlayerPosExist.indexOf(configPlayer[index].playerPos);

            var seatId = configPlayer[index].seatId;
            let player = this.getPlayerHouse(seatId);
            player.resetPlayerInfo();
            if (findPos > -1) {
                if (arrPlayerStatus[findPos] == cmd.Code.PLAYER_STATUS_SITTING || arrPlayerStatus[findPos] == cmd.Code.PLAYER_STATUS_PLAYING) {
                    configPlayer[index].isViewer = false;
                    player.setIsViewer(false);
                } else {
                    configPlayer[index].isViewer = true;
                    player.setIsViewer(true);
                    player.playFxViewer();
                }
                this.setupSeatPlayer(seatId, arrPlayerInfo[findPos]);
            } else {
                // Not Exist player  -> Active Btn Add player
                player.showBtnInvite(true);
                configPlayer[index].isViewer = true;
            }
        }

        for (let index = 0; index < 8; index++) {
            let player = this.getPlayerHouse(index);
            player.setOwner(false);
        }
        let seatOwner = this.findPlayerSeatByPos(chuongChair);
        let playerOwner = this.getPlayerHouse(seatOwner)
        if (seatOwner !== -1) {
            playerOwner.setOwner(true);
            this.seatOwner = seatOwner;
        }
        if (countDownTime > 0) {
            if (this.gameState == 1)
                this.startBettingCountDown(countDownTime);
            else if (this.getNumPlayers().length < 0) {
                this.startEndCountDown(countDownTime);
            }
        }
    }


    // Time Start
    startWaittingCountDown(timeWait) {
        this.timeAutoStart = timeWait;
        this.setTimeWaittingCountDown();
        this.notifyTimeStart.active = true;
        this.notifyTimeStart.parent.active = true;
        this.unschedule(this.intervalWaitting);
        this.unschedule(this.intervalEnd);
        this.schedule(this.intervalWaitting = () => {
            this.timeAutoStart--;
            this.setTimeWaittingCountDown();
            if (this.timeAutoStart < 1) {
                this.unschedule(this.intervalWaitting);
                this.notifyTimeStart.active = false;
                this.notifyTimeStart.parent.active = false;
            }
        }, 1)
    }

    setTimeWaittingCountDown() {
        this.seconds = Math.floor(this.timeAutoStart % 60);
        this.notifyTimeStart.getComponent(cc.Label).string = " Bắt đầu sau : " + this.seconds + "s ";
    }

    // Time End
    startEndCountDown(timeWait) {
        this.timeEnd = timeWait;
        this.setTimeEndCountDown();
        // this.notifyTimeEnd.active = true;
        // this.notifyTimeEnd.parent.active = true;

        this.notifyTimeStart.active = true;
        this.notifyTimeStart.parent.active = true;
        this.unschedule(this.intervalEnd);
        this.unschedule(this.intervalWaitting);
        this.schedule(this.intervalEnd = () => {
            this.timeEnd--;
            this.setTimeEndCountDown();
            if (this.timeEnd < 1) {
                this.unschedule(this.intervalEnd);
                this.notifyTimeEnd.active = false;
                this.notifyTimeEnd.parent.active = false;
            }
        }, 1)
    }

    setTimeEndCountDown() {
        this.seconds = Math.floor(this.timeEnd % 60);
        this.notifyTimeStart.getComponent(cc.Label).string = App.instance.getTextLang('txt_end_after') + " " + this.seconds + "s ";
    }

    // Time Bet
    startBettingCountDown(turnTime) {
        this.timeBet = turnTime;
        this.actionBetting.active = true;
        this.processBetting(1);
        this.unschedule(this.intervalBetting);
        this.soundManager.stopAudioEffect();

        let deltaTime = turnTime / 200;
        let deltaFill = 1 / 200;
        let fullRange = 1;
        cc.Tween.stopAllByTarget(this.actionBetting);
        cc.tween(this.actionBetting).repeat(200, cc.tween().delay(deltaTime).call(() => {
            fullRange -= deltaFill;
            this.timeBet -= deltaTime;
            this.processBetting(fullRange);
            if (this.timeBet < 0) {
                this.actionBetting.active = false;
            }
        })).start();

        this.intervalBetting = this.schedule(() => {
            this.soundManager.playAudioEffect(audio_clip.CLOCK);
        }, 1, turnTime);
    }
    stopBettingCountDown() {
        cc.Tween.stopAllByTarget(this.actionBetting);
        this.unschedule(this.intervalBetting);
        this.actionBetting.active = false;
    }
    processBetting(rate) {
        this.actionBetting.getChildByName("Step").getComponent(cc.Sprite).fillRange = rate;
    }

    // Open Me Card
    openMeCard(event, itemId) {
        // Open Me cards
        if (this.getPlayerHouse(0).isShowCard == false) {
            this.nodeShowCard.nodeThis.active = true;
            let currenCardId = []
            this.currentCard.forEach(element => {
                currenCardId.push(CardUtils.getNormalId(element));
            });
            this.nodeShowCard.show(currenCardId);
        }

    }

    getCardsScore(arrCards) {
        let score = 0;
        for (let a = 0; a < 3; a++) {
            score += CardUtils.getDiemById(arrCards[a]);
        }
        score = score % 10;
        if (score == 0) {
            score = 10;
        }

        return score;
    }

    moveChipsToHubNow(index) {
        this.hubChips.children[2 * index].setPosition(25, 80);
        this.hubChips.children[2 * index].scale = 0;
        this.hubChips.children[(2 * index) + 1].setPosition(25, 80);
        this.hubChips.children[(2 * index) + 1].scale = 0;
    }

    fxMoveChips(chips, delay, toX, toY) {
        chips.runAction(
            cc.sequence(
                cc.delayTime(delay),
                cc.scaleTo(0, 1, 1),
                cc.spawn(
                    cc.moveTo(0.8, toX, toY),
                    cc.scaleTo(0.8, 0, 0)
                )
            )
        );
    }

    resetHubChips() {
        var arrFromX = [70, 280, 280, 260, 100, -260, -375, -360];
        var arrFromY = [-195, -150, -55, 70, 90, 85, -30, -155];

        for (let index = 0; index < 8; index++) {
            this.hubChips.children[2 * index].setPosition(arrFromX[index], arrFromY[index]);
            this.hubChips.children[(2 * index) + 1].setPosition(arrFromX[index], arrFromY[index]);
        }

        for (let index = 0; index < 16; index++) {
            this.hubChips.children[index].active = false;
        }
    }

    setupBet() {
        // arrBetValue
        this.currentBetSelectedIndex = 0;
        this.betChooseValueTarget.y = this.arrBetPos[this.currentBetSelectedIndex];
    }

    // match result
    showPopupMatchResult(data) {
        this.popupMatchResult.active = true;
        this.contentMatchResult.removeAllChildren(true);
        for (let index = 0; index < data.length; index++) {
            let item = cc.instantiate(this.prefabItemResult);
            item.getComponent("BaCay.ItemResult").initItem(data[index]);
            this.contentMatchResult.addChild(item);
        }
        this.scrollMatchResult.scrollToTop(0.2);
    }

    closePopupMatchResult() {
        this.popupMatchResult.active = false;
    }

    // addListener
    setupListener() {
        BaCayNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.LOGIN:
                    App.instance.showLoading(false);
                    this.refeshListRoom();
                    BaCayNetworkClient.getInstance().send(new cmd.CmdReconnectRoom());
                    break;
                case cmd.Code.TOPSERVER:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedTopServer(data);
                        let rankType = res["rankType"];
                        let topDay_money = res["topDay_money"];
                        let topWeek_money = res["topWeek_money"];
                        let topMonth_money = res["topMonth_money"];


                    }
                    break;
                case cmd.Code.CMD_PINGPONG:
                    {
                        App.instance.showLoading(false);
                    }
                    break;
                case cmd.Code.CMD_JOIN_ROOM:
                    {
                        App.instance.showLoading(false);
                    }
                    break;
                case cmd.Code.CMD_RECONNECT_ROOM:
                    {
                        App.instance.showLoading(false);
                    }
                    break;
                case cmd.Code.MONEY_BET_CONFIG:
                    {
                        App.instance.showLoading(false);
                    }
                    break;
                case cmd.Code.MO_BAI:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedMoBai(data);
                        let chairMoBai = res["chairMoBai"];
                        let cards = res["cards"];
                        let seatId = this.findPlayerSeatByPos(chairMoBai);
                        let player = this.getPlayerHouse(seatId);
                        if (seatId != -1 && seatId != 0 && !player.isShowCard) {
                            for (let a = 0; a < 3; a++) {
                                let spriteCardId = CardUtils.getNormalId(cards[a]);
                                player.transformToCardReal(a, spriteCardId, a);
                                player.showCardReal(true);
                            }
                            player.showCardName(this.getCardsScore(cards) + " Điểm");
                        }
                    }
                    break;
                case cmd.Code.BAT_DAU:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedFirstTurnDecision(data);
                        this.resetHubChips();
                        this.closePopupMatchResult();
                    }
                    break;
                case cmd.Code.KET_THUC:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedEndGame(data);
                        this.unschedule(this.intervalEnd);
                        this.notifyTimeEnd.active = false;
                        this.notifyTimeEnd.parent.active = false;

                        // // Mo het cac la bai neu no chua dc mo

                        let cardList = res["cardList"];
                        let tienThangChuong = res["tienThangChuong"];
                        let tienThangGa = res["tienThangGa"];
                        let keCuaMoneyList = res["keCuaMoneyList"];
                        let danhBienMoneyList = res["danhBienMoneyList"];
                        let tongTienCuoiVan = res["tongTienCuoiVan"];
                        let tongTienCuocList = res["tongTienCuocList"];
                        let tongDanhBienList = res["tongDanhBienList"];
                        let tongKeCuaList = res["tongKeCuaList"];
                        let tongCuocGaList = res["tongCuocGaList"];
                        let tongCuoiVanList = res["tongCuoiVanList"];
                        let currentMoneyList = res["currentMoneyList"];
                        let timeEndGame = res["timeEndGame"];

                        let posPlaying = [];
                        for (let index = 0; index < 8; index++) {
                            if (cardList[index].length > 0) {
                                posPlaying.push(index);
                            }
                        }
                        let result = [];
                        for (let index = 0; index < 8; index++) {
                            let findId = posPlaying.indexOf(configPlayer[index].playerPos);
                            let player = this.getPlayerHouse(index);
                            if (findId !== -1) {
                                let cards = cardList[posPlaying[findId]];
                                let cardReady = player.node.children[2].children[0];
                                if (!player.isShowCard) {
                                    for (let a = 0; a < 3; a++) {
                                        if (cardReady.children[a].scale == 1) {
                                            let spriteCardId = CardUtils.getNormalId(cards[a]);
                                            player.transformToCardReal(a, spriteCardId);
                                        }
                                    }
                                    player.showCardName(this.getCardsScore(cards) + " Điểm");
                                }
                                result.push({
                                    userName: configPlayer[index].playerId,
                                    bet: tongTienCuocList[posPlaying[findId]],
                                    bien: tongDanhBienList[posPlaying[findId]],
                                    ke: tongKeCuaList[posPlaying[findId]],
                                    ga: tongCuocGaList[posPlaying[findId]],
                                    total: tongCuoiVanList[posPlaying[findId]]
                                });
                                let info = {
                                    moneyChange: tongCuoiVanList[posPlaying[findId]],
                                    money: currentMoneyList[posPlaying[findId]],
                                    ga: tongCuocGaList[posPlaying[findId]],
                                }
                                if (index == 0) {
                                    Configs.Login.Coin = info.money;
                                    BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                                }

                                if (info.moneyChange >= 0) {
                                    // Win
                                    if (index == 0) {
                                        this.soundManager.playAudioEffect(audio_clip.WIN)
                                    }
                                    player.fxWin(info);
                                } else {
                                    // Lose
                                    if (index == 0) {
                                        this.soundManager.playAudioEffect(audio_clip.LOSE)
                                    }
                                    player.fxLose(info);

                                }
                            }
                        }

                        if (result.length > 0) {
                            setTimeout(() => {
                                this.labelMatchPot.string = "0";
                            }, 4000);
                        }
                        this.nodeShowCard.hide();
                        this.stopBettingCountDown();
                    }
                    break;
                case cmd.Code.YEU_CAU_DANH_BIEN:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedYeuCauDanhBien(data);
                        let danhBienChair = res["danhBienChair"];
                        let level = res["level"];

                        let isExist = this.arrPosDanhBien.indexOf(danhBienChair);
                        if (isExist > -1) {
                            // Da chap nhan danh bien cua A thi k dc gui yeu cau danh bien lai
                            // Vi se bi hien lai popup request chu' A lai k thay : hoi loi~
                        } else {
                            let value = this.currentRoomBet * level;
                            let seatId = this.findPlayerSeatByPos(danhBienChair);
                            if (seatId != -1) {
                                this.getPlayerHouse(seatId).showPopupRequestDanhBien(value);
                            }
                        }
                    }
                    break;
                case cmd.Code.CHIA_BAI:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedChiaBai(data);
                        this.stopBettingCountDown();
                        this.btnBet.active = false;
                        this.btnOpenCard.active = false;

                        for (let index = 1; index < 8; index++) {
                            let player = this.getPlayerHouse(index);
                            player.showPopupBet(false);
                            player.closePopupRequestDanhBien();
                            player.isShowCard = false;

                        }
                        this.getPlayerHouse(0).isShowCard = false;
                        this.matchPot.getComponent(cc.Button).interactable = false;
                        this.matchPot.children[0].color = cc.Color.GRAY;

                        let cards = res["cards"];
                        let timeChiaBai = res["timeChiaBai"];

                        clearTimeout(this.timeoutEndGame);
                        this.timeoutEndGame = setTimeout(() => {
                            this.startEndCountDown(timeChiaBai);
                        }, 2000);

                        this.currentCard = cards;

                        var arrSeatExist = this.getNumPlayers();
                        let numPlayer = arrSeatExist.length;

                        // Open | Hide cards not use
                        this.genCardDeal();
                        for (let index = 0; index < 8 * 3; index++) { // 8 players * 3 cards
                            this.cardsDeal.children[index].active = index >= numPlayer * 3 ? false : true;
                            this.cardsDeal.children[index].setPosition(0, 0);
                            this.cardsDeal.children[index].angle = 0;
                        }

                        let timeShip = 0.1; // 0.15
                        // Move Cards used to each player joined
                        for (let a = 0; a < 3; a++) { // players x 3 cards
                            for (let b = 0; b < numPlayer; b++) {
                                let seatId = arrSeatExist[b];
                                if (seatId !== -1) {
                                    let card4Me = this.cardsDeal.children[(a * numPlayer) + b];
                                    card4Me.active = true;
                                    let rawPlayerPos = new cc.Vec2(this.groupPlayers.children[seatId].position.x, this.groupPlayers.children[seatId].position.y);
                                    cc.tween(card4Me).delay(((a * numPlayer) + b) * timeShip)
                                        .parallel(cc.tween().call(() => {
                                            this.soundManager.playAudioEffect(audio_clip.CHIA_BAI);
                                        }), cc.tween().to(0.2, { position: rawPlayerPos }, { easing: cc.easing.sineIn }), cc.tween().by(0.2, { angle: 360 }, { easing: cc.easing.sineIn })).start();
                                }
                            }
                        }

                        let delayOver2Under = 0.2;
                        var maxDelay = ((2 * numPlayer) + (numPlayer - 1)) * timeShip; // ((a * numPlayer) + b) * timeShip
                        let timeUnderLayer = (maxDelay + 0.2 + delayOver2Under) * 1000;
                        clearTimeout(this.timeoutChiaBaiDone);
                        this.timeoutChiaBaiDone = setTimeout(() => {
                            for (let index = 0; index < 8 * 3; index++) { // 8 players * 3 cards
                                this.cardsDeal.children[index].active = false;
                            }

                            for (let index = 0; index < numPlayer; index++) {
                                let seatId = arrSeatExist[index];
                                if (seatId !== -1) {
                                    // Drop layer
                                    if (seatId == 0) {
                                        this.getPlayerHouse(seatId).resetCardReady();
                                    }
                                    this.getPlayerHouse(seatId).showCardReal(true);
                                }
                            }
                        }, timeUnderLayer);
                    }
                    break;
                case cmd.Code.KE_CUA:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedKeCua(data);
                        let chairKeCuaFrom = res["chairKeCuaFrom"];
                        let chairKeCuaTo = res["chairKeCuaTo"];
                        let level = res["level"];
                    }
                    break;
                case cmd.Code.TU_DONG_BAT_DAU:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedAutoStart(data);

                        if (res.isAutoStart) {
                            this.resetHubChips();
                            this.startWaittingCountDown(res.timeAutoStart);
                            this.btnBet.active = false;
                            this.btnOpenCard.active = false;

                            this.matchPot.active = false;
                            this.matchPot.getComponent(cc.Button).interactable = true;
                            this.matchPot.children[0].color = cc.Color.WHITE;

                            this.resetPlayersPlaying();
                            this.arrPosDanhBien = [];
                        }
                        this.closePopupMatchResult();
                    }
                    break;
                case cmd.Code.DONG_Y_DANH_BIEN:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedChapNhanDanhBien(data);
                        let danhBienChair = res["danhBienChair"];
                        let level = res["level"];
                        this.arrPosDanhBien.push(danhBienChair);
                        let seatId = this.findPlayerSeatByPos(danhBienChair);
                        if (seatId != -1) {
                            this.getPlayerHouse(seatId).disableDanhBien(level);
                            this.getPlayerHouse(seatId).playFxDanhBien();
                        }
                    }
                    break;
                case cmd.Code.DAT_CUOC:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedDatCuoc(data);
                        let chairDatCuoc = res["chairDatCuoc"];
                        let level = res["level"];

                        let seatId = this.findPlayerSeatByPos(chairDatCuoc);
                        let player = this.getPlayerHouse(seatId);
                        if (seatId != -1) {
                            player.setBet(this.arrBetValue[level - 1]);
                            player.addChips();
                        }
                        this.soundManager.playAudioEffect(audio_clip.CHIP);
                    }
                    break;
                case cmd.Code.DANG_KY_THOAT_PHONG:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedNotifyRegOutRoom(data);

                        let outChair = res["outChair"];
                        let isOutRoom = res["isOutRoom"];

                        let seatId = this.findPlayerSeatByPos(outChair);
                        if (seatId == 0) {
                            if (isOutRoom)
                                App.instance.showToast(App.instance.getTextLang('txt_room_leave'));
                            else App.instance.showToast(App.instance.getTextLang('txt_room_cancel_leave'));
                        }
                        if (seatId !== -1) {
                            this.getPlayerHouse(seatId).showLeaveRoom(isOutRoom);
                        }
                    }
                    break;
                case cmd.Code.VAO_GA:
                    {
                        this.soundManager.playAudioEffect(audio_clip.CHIP);
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedVaoGa(data);

                        let chair = res["chair"];
                        let chicKenBet = res["chicKenBet"];

                        let seatId = this.findPlayerSeatByPos(chair);
                        let player = this.getPlayerHouse(seatId);
                        if (seatId != -1) {
                            this.hubChips.children[2 * seatId].active = true;
                            this.hubChips.children[(2 * seatId) + 1].active = true;
                            this.fxMoveChips(this.hubChips.children[2 * seatId], 0.1, this.matchPot.x, this.matchPot.y);
                            this.fxMoveChips(this.hubChips.children[(2 * seatId) + 1], 0.2, this.matchPot.x, this.matchPot.y);

                            // Can cong luy ke len
                            this.currentMatchPotValue += chicKenBet;
                            this.labelMatchPot.string = Utils.formatNumber(this.currentMatchPotValue);

                            player.playFxVaoGa();
                        }
                    }
                    break;
                case cmd.Code.DOI_CHUONG:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedDoiChuong(data);

                        for (let index = 0; index < 8; index++) {
                            this.getPlayerHouse(index).setOwner(false);
                        }

                        let seatId = this.findPlayerSeatByPos(res["chuongChair"]);
                        if (seatId != -1) {
                            this.getPlayerHouse(seatId).setOwner(true);
                            this.seatOwner = seatId;
                        }
                    }
                    break;
                case cmd.Code.MOI_DAT_CUOC:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedMoiDatCuoc(data);
                        this.startBettingCountDown(res.timeDatCuoc);

                        this.showSliderBet();
                        this.numCardOpened = 0;
                        this.soundManager.playAudioEffect(audio_clip.START_BET);
                    }
                    break;
                case cmd.Code.CHEAT_CARDS:
                    {
                        App.instance.showLoading(false);
                    }
                    break;
                case cmd.Code.DANG_KY_CHOI_TIEP:
                    {
                        App.instance.showLoading(false);
                    }
                    break;
                case cmd.Code.UPDATE_OWNER_ROOM:
                    {
                        App.instance.showLoading(false);
                    }
                    break;
                case cmd.Code.LEAVE_GAME:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedUserLeaveRoom(data);
                        let chair = res["chair"];
                        let seatId = this.findPlayerSeatByPos(chair);
                        if (seatId !== -1) {
                            // Need clear configPlayer
                            for (let index = 0; index < configPlayer.length; index++) {
                                if (configPlayer[index].seatId == seatId) {
                                    configPlayer[index].playerId = -1;
                                    configPlayer[index].isViewer = true;
                                }
                            }

                            // Change UI
                            let player = this.getPlayerHouse(seatId)
                            player.resetPlayerInfo();
                            player.showBtnInvite(true);

                            let arrSeatExistLast = this.getNumPlayers();
                            if (arrSeatExistLast.length == 1) {
                                this.resetPlayersPlaying();
                                this.matchPot.active = false;
                            }

                            if (seatId == 0) {
                                // Me leave
                                // Change UI
                                this.node.active = false;
                                BacayRoom.instance.node.active = true;
                                this.refeshListRoom();
                            }
                        }
                    }
                    break;
                case cmd.Code.NOTIFY_KICK_FROM_ROOM:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedKickOff(data);
                    }
                    break;
                case cmd.Code.NEW_USER_JOIN:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedUserJoinRoom(data);
                        let info = res["info"];
                        let uChair = res["uChair"];
                        let uStatus = res["uStatus"];

                        // set State of Seat : Yes | No exist Player
                        for (let index = 0; index < configPlayer.length; index++) {
                            var seatId = configPlayer[index].seatId;
                            let player = this.getPlayerHouse(seatId);
                            if (configPlayer[index].playerPos == uChair) {
                                // Exist player -> Set Player Info

                                player.resetPlayerInfo();
                                var customPlayerInfo = {
                                    "avatar": info["avatar"],
                                    "nickName": info["nickName"],
                                    "money": info["money"],
                                }

                                this.setupSeatPlayer(seatId, customPlayerInfo);

                                if (uStatus == cmd.Code.PLAYER_STATUS_VIEWER) {
                                    configPlayer[seatId].isViewer = true;
                                    player.setIsViewer(true);
                                    player.playFxViewer();
                                } else {
                                    configPlayer[seatId].isViewer = false;
                                    player.setIsViewer(false);
                                }
                            }
                        }
                    }
                    break;
                case cmd.Code.NOTIFY_USER_GET_JACKPOT:
                    {
                        App.instance.showLoading(false);
                    }
                    break;
                case cmd.Code.UPDATE_MATCH:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedUpdateMatch(data);
                        let myChair = res["myChair"];
                        let hasInfo = res["hasInfo"];
                        let infos = res["infos"];
                        for (let index = 0; index < hasInfo.length; index++) {
                            let pos = configPlayer[index]["playerPos"];
                            if (hasInfo[pos]) {
                                // setGold se inactive isViewer nen dat no len dau de ben duoi config lai
                                this.getPlayerHouse(index).setGold(infos[pos]["money"]);
                                configPlayer[index]["playerId"] = infos[pos]["nickName"];
                                if (infos[pos]["status"] == cmd.Code.PLAYER_STATUS_SITTING || infos[pos]["status"] == cmd.Code.PLAYER_STATUS_PLAYING) {
                                    configPlayer[index]["isViewer"] = false;
                                    this.getPlayerHouse(index).setIsViewer(false);
                                } else {
                                    configPlayer[index]["isViewer"] = true;
                                    this.getPlayerHouse(index).setIsViewer(true);
                                    this.getPlayerHouse(index).playFxViewer();
                                }
                                this.setupSeatPlayer(index, infos[pos]);
                            } else {
                                configPlayer[index]["playerId"] = -1;
                                configPlayer[index]["isViewer"] = true;
                            }
                        }
                    }
                    break;
                case cmd.Code.CHAT_ROOM:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedChatRoom(data);
                        let chair = res["chair"];
                        let isIcon = res["isIcon"];
                        let content = res["content"];
                        if (isIcon) {
                            // Chat Icon
                            let seatId = this.findPlayerSeatByPos(chair);
                            if (seatId != -1) {
                                this.getPlayerHouse(seatId).showChatEmotion(content);
                            }
                        } else {
                            // Chat Msg
                            let seatId = this.findPlayerSeatByPos(chair);
                            if (seatId != -1) {
                                this.getPlayerHouse(seatId).showChatMsg(content);
                            }
                        }
                    }
                    break;
                default:
         //           cc.log("--inpacket.getCmdId(): " + inpacket.getCmdId());
                    break;
            }
        }, this);
    }

    // request
    actReJoinRoom(res) {
        this.closePopupMatchResult();
        this.closeUIChat();
        let myChair = res["myChair"];
        let chuongChair = res["chuongChair"];
        let cards = res["cards"];
        let cuocDanhBienList = res["cuocDanhBienList"];
        let cuocKeCuaList = res["cuocKeCuaList"];
        let gameServerState = res["gameServerState"];
        let isAutoStart = res["isAutoStart"];
        let gameAction = res["gameAction"];
        let countDownTime = res["countDownTime"];
        let moneyType = res["moneyType"];
        let moneyBet = res["moneyBet"];
        let gameId = res["gameId"];
        let roomId = res["roomId"];
        let hasInfo = res["hasInfo"];
        let players = res["players"];

        this.labelRoomId.string = roomId;
        this.labelRoomBet.string = Utils.formatNumber(moneyBet);

        this.currentRoomBet = moneyBet;
        this.gameState = gameAction;

        this.currentCard = cards;

        configPlayer[0].playerId = Configs.Login.Nickname;
        configPlayer[0].playerPos = myChair;

        var numPlayers = 0;
        var arrPlayerPosExist = [];
        var arrPlayerInfo = [];
        for (let index = 0; index < hasInfo.length; index++) {
            if (hasInfo[index]) {
                numPlayers += 1;
                arrPlayerPosExist.push(index);
                arrPlayerInfo.push(players[index]);
            }
        }
        // setup configPlayer
        for (let a = 0; a < configPlayer.length; a++) {
            configPlayer[a].playerPos = defaultPlayerPos[myChair][a];
        }
        // set State of Seat : Yes | No exist Player
        for (let index = 0; index < configPlayer.length; index++) {
            let findPos = arrPlayerPosExist.indexOf(configPlayer[index].playerPos);
            var seatId = configPlayer[index].seatId;
            let player = this.getPlayerHouse(seatId);

            player.resetPlayerInfo();
            let playerInfo = arrPlayerInfo[findPos];
            if (findPos > -1) {
                configPlayer[index].isViewer = false;
                player.setIsViewer(false);
                this.setupSeatPlayer(seatId, playerInfo);
                player.setBet(playerInfo.cuocChuong * moneyBet);
                player.addChips();
                if (playerInfo.nickName == Configs.Login.Nickname && playerInfo.cuocChuong == 0 && this.gameState == 1) {
                    this.showSliderBet();
                }
                if (playerInfo.cuocGa != 0) {
                    this.currentMatchPotValue += moneyBet * 3;
                    this.labelMatchPot.string = Utils.formatNumber(this.currentMatchPotValue);
                    player.playFxVaoGa();
                }
                if (this.gameState == 1) {//chua chia bai.
                    player.resetCardReal();
                }
            } else {
                // Not Exist player  -> Active Btn Add player
                player.showBtnInvite(true);
                configPlayer[index].isViewer = true;
            }
        }


        for (let index = 0; index < 8; index++) {
            this.getPlayerHouse(index).setOwner(false);
        }
        let seatOwner = this.findPlayerSeatByPos(chuongChair);
        if (seatOwner !== -1) {
            this.getPlayerHouse(seatOwner).setOwner(true);
            this.seatOwner = seatOwner;
        }

        this.resetHubChips();
        if (this.currentCard.length > 0) {
            BaCayController.instance.showCardReal();
        }
        if (countDownTime > 0) {
            if (this.gameState == 1) {
                this.matchPot.active = true;
                this.startBettingCountDown(countDownTime)
            }
            else {
                this.startEndCountDown(countDownTime);
            }

        }

    }
    showSliderBet() {
    //    cc.log("showSliderBet")
        this.arrBetValue = [];
        this.matchPot.active = true;
        this.currentMatchPotValue = 0;
        this.labelMatchPot.string = "0";

        for (let index = 0; index < 4; index++) {
            this.arrBetValue.push(this.currentRoomBet * (index + 1));
            let raw = this.currentRoomBet * (4 - index);
            if (raw == 1500) {
                this.betChooseValue.children[index].children[0].getComponent(cc.Label).string = "1.5K";
            } else {
                this.betChooseValue.children[index].children[0].getComponent(cc.Label).string = Utils.formatNumberMin(raw);
            }
        }
        if (!this.getPlayerHouse(0).isViewing) {
            if (this.seatOwner == 0) { // Me la Chuong -> K dc bet va k dc vao ga
                this.btnOpenCard.active = false;
                this.btnBet.active = false;
                this.matchPot.getComponent(cc.Button).interactable = false;
                this.matchPot.children[0].color = cc.Color.GRAY;
            } else {
                this.btnBet.active = true;
                this.btnOpenCard.active = false;
                this.matchPot.getComponent(cc.Button).interactable = true;
                this.matchPot.children[0].color = cc.Color.WHITE;
                this.setupBet();
            }
        }

    }
    actionLeaveRoom() {
        BaCayNetworkClient.getInstance().send(new cmd.CmdSendRequestLeaveGame());
        this.soundManager.effSound.stop();
    }

    actionOpenCard() {
        BaCayNetworkClient.getInstance().send(new cmd.CmdSendMoBai());
        this.btnOpenCard.active = false;
    }

    actionSendVaoGa() {
        BaCayNetworkClient.getInstance().send(new cmd.SendVaoGa());
        this.matchPot.children[0].color = cc.Color.WHITE;
        this.matchPot.getComponent(cc.Button).interactable = false;
    }

    actionAcceptDanhBien(event, seatId) {
        BaCayNetworkClient.getInstance().send(new cmd.CmdSendAcceptDanhBien(configPlayer[seatId].playerPos));
        this.getPlayerHouse(seatId).closePopupRequestDanhBien(false);
    }

    increaseBetValue() {
        if (this.currentBetSelectedIndex == (this.arrBetValue.length - 1)) {

        } else {
            this.currentBetSelectedIndex += 1;
        }

        this.betChooseValueTarget.y = this.arrBetPos[this.currentBetSelectedIndex];
    }
    actClickBetValue(even, data) {
        data = parseInt(data);
        this.currentBetSelectedIndex = data;
        this.betChooseValueTarget.y = this.arrBetPos[this.currentBetSelectedIndex];
    }
    decreaseBetValue() {
        if (this.currentBetSelectedIndex == 0) {

        } else {
            this.currentBetSelectedIndex -= 1;
        }

        this.betChooseValueTarget.y = this.arrBetPos[this.currentBetSelectedIndex];
    }

    actionBet() {
        BaCayNetworkClient.getInstance().send(new cmd.CmdSendDatCuoc(this.currentBetSelectedIndex + 1));
        this.btnBet.active = false;
        // set bet default
        for (let index = 0; index < configPlayer.length; index++) {
            if (index !== this.seatOwner
                && !configPlayer[index].isViewer
                && configPlayer[index].playerId !== -1) {
                this.getPlayerHouse(index).setBet(this.currentRoomBet);
                this.getPlayerHouse(index).addChips();
                if (index != 0) { // k ke cua, danh bien duoc len chinh minh
                    this.getPlayerHouse(index).showPopupBet(true);
                    this.getPlayerHouse(index).setupBetValue(this.currentRoomBet);
                }
            }
        }
    }

    actionDanhBien(event, id) {
        let seatId = parseInt(id.substring(0, 1));
        let level = parseInt(id.substring(1, 2));
        let pos = this.findPlayerPosBySeat(seatId);
        if (pos != -1) {
            this.getPlayerHouse(seatId).disableDanhBien(level);
            this.getPlayerHouse(seatId).showChatMsg("Đánh biên");
            BaCayNetworkClient.getInstance().send(new cmd.CmdSendDanhBien(pos, level));
        }
    }

    actionKeCua(event, id) {
        let seatId = parseInt(id.substring(0, 1));
        let level = parseInt(id.substring(1, 2)) - 2;
        let pos = this.findPlayerPosBySeat(seatId);
        if (pos != -1) {
            this.getPlayerHouse(seatId).disableKeCua(level);
            BaCayNetworkClient.getInstance().send(new cmd.CmdSendKeCua(pos, level));
        }
    }

    // State
    initConfigPlayer() {
        configPlayer = [];
        for (let index = 0; index < 8; index++) {
            configPlayer.push({
                seatId: index,
                playerId: -1,
                playerPos: -1,
                isViewer: true
            });
        }
    }

    resetPlayersPlaying() {
        for (let index = 0; index < 8; index++) {
            this.getPlayerHouse(index).resetMatchHistory();
        }
    }

    // handle Game Players
    setupSeatPlayer(seatId, playerInfo) {
        configPlayer[seatId].playerId = playerInfo.nickName;
        let player = this.getPlayerHouse(seatId);
        player.setAvatar(playerInfo.avatar);
        player.setName(playerInfo.nickName);
        player.setGold(playerInfo.money);
        if (this.gameState > 0 && !player.isViewing) {
            player.showCardReal(true);
        }
    }

    findPlayerSeatByUid(uid) {
        let seat = -1;
        for (let index = 0; index < configPlayer.length; index++) {
            if (configPlayer[index].playerId === uid) {
                seat = configPlayer[index].seatId;
            }
        }
        return seat;
    }

    findPlayerPosBySeat(seat) {
        return configPlayer[seat].playerPos;
    }

    findPlayerSeatByPos(pos) {
        if (pos == -1) {
            return -1;
        }

        let seat = -1;
        for (let index = 0; index < configPlayer.length; index++) {
            if (configPlayer[index].playerPos === pos) {
                seat = configPlayer[index].seatId;
            }
        }
        return seat;
    }

    getPlayerHouse(seatId) {
        return this.groupPlayers.children[seatId].getComponent("BaCay.Player");
    }

    getNumPlayers() {
        var playerPosEntry = [];
        for (let index = 0; index < configPlayer.length; index++) {
            if (configPlayer[index].playerId !== -1 && !configPlayer[index].isViewer) {
                playerPosEntry.push(configPlayer[index].seatId);
            }
        }
        return playerPosEntry;
    }
    showCardReal() {
        this.getPlayerHouse(0).isShowCard = true;
        let arrCardReal = this.getPlayerHouse(0).cardReal;
        for (let i = 0; i < 3; i++) {
            arrCardReal.children[i].children[0].getComponent("TienLen.Card").setCardData(CardUtils.getNormalId(this.currentCard[i]));
        }
    }
}
