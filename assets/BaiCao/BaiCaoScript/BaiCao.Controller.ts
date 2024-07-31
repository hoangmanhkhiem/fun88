import BroadcastReceiver from "../../Lobby/LobbyScript/Script/common/BroadcastReceiver";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";

import App from "../../Lobby/LobbyScript/Script/common/App";
import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import cmdNetwork from "../../Lobby/LobbyScript/Script/networks/Network.Cmd";
import Configs from "../../Loading/src/Configs";
import cmd from "./BaiCao.Cmd";

import BaiCaoNetworkClient from "./BaiCao.NetworkClient";
import CardUtils from "./BaiCao.CardUtil";
import Card from "./BaiCao.Card";

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

@ccclass
export default class BaiCaoController extends cc.Component {

    public static instance: BaiCaoController = null;

    // UI Rooms
    @property(cc.Node)
    UI_ChooseRoom: cc.Node = null;
    @property(cc.Label)
    labelNickName: cc.Label = null;
    @property(cc.Label)
    labelCoin: cc.Label = null;
    @property(cc.Node)
    contentListRooms: cc.Node = null;
    @property(cc.Prefab)
    prefabItemRoom: cc.Prefab = null;
    @property(cc.ScrollView)
    scrollListRoom: cc.ScrollView = null;
    @property(cc.EditBox)
    edtFindRoom: cc.EditBox = null;
    @property(cc.Toggle)
    btnHideRoomFull: cc.Toggle = null;

    public isInitedUIRoom = false;

    // UI Playing
    @property(cc.Node)
    UI_Playing: cc.Node = null;
    @property(cc.Node)
    meCards: cc.Node = null;
    @property(cc.Node)
    groupPlayers: cc.Node = null;
    @property(cc.SpriteFrame)
    spriteCards: cc.SpriteFrame[] = [];
    @property(cc.SpriteFrame)
    spriteCardBack: cc.SpriteFrame = null;
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

    // Popup
    @property(cc.Node)
    popupNodity: cc.Node = null;
    @property(cc.Label)
    labelNotifyContent: cc.Label = null;

    @property(cc.Node)
    popupGuide: cc.Node = null;

    private seatOwner = null;
    private currentRoomBet = null;

    private gameState = null;

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
    private arrBetPos = [-157.5, -52.5, 52.5, 157.5];
    private currentBetSelectedIndex = 0;

    private currentMatchPotValue = 0;

    private timeoutEndGame = null;
    private timeoutChiaBaiDone = null;

    private arrPosDanhBien = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        BaiCaoController.instance = this;

        this.seatOwner = -1;

        this.initConfigPlayer();
    }

    start() {
        this.showUIRooms();

        App.instance.showErrLoading("Đang kết nối tới server...");
        BaiCaoNetworkClient.getInstance().addOnOpen(() => {
            App.instance.showErrLoading("Đang đang đăng nhập...");
            BaiCaoNetworkClient.getInstance().send(new cmdNetwork.SendLogin(Configs.Login.Nickname, Configs.Login.AccessToken));
        }, this);
        BaiCaoNetworkClient.getInstance().addOnClose(() => {
            App.instance.loadScene("Lobby");
        }, this);
        BaiCaoNetworkClient.getInstance().connect();
    }

    // Request UI Room
    joinRoom(info) {
     //   cc.log("BaiCao joinRoom roomInfo : ", info);
        App.instance.showLoading(true);
        BaiCaoNetworkClient.getInstance().send(new cmd.SendJoinRoomById(info["id"]));
    }

    refeshListRoom() {
        this.contentListRooms.removeAllChildren(true);
        BaiCaoNetworkClient.getInstance().send(new cmd.SendGetListRoom());
    }

    findRoomId() {
      //  cc.log("BaiCao findRoomId id : ", this.edtFindRoom.string);
        let text = this.edtFindRoom.string.trim();
        if (text.length > 0) {
            let idFind = parseInt(text);
            for (let index = 0; index < this.contentListRooms.childrenCount; index++) {
                let roomItem = this.contentListRooms.children[index].getComponent("BaiCao.ItemRoom");
                if (roomItem.roomInfo["id"] != idFind) {
                    this.contentListRooms.children[index].active = false;
                }
            }
        } else {
            for (let index = 0; index < this.contentListRooms.childrenCount; index++) {
                this.contentListRooms.children[index].active = true;
            }
        }
    }

    hideRoomFull() {
        if (this.btnHideRoomFull.isChecked) {
            for (let index = 0; index < this.contentListRooms.childrenCount; index++) {
                let roomItem = this.contentListRooms.children[index].getComponent("BaiCao.ItemRoom");
                if (roomItem.roomInfo["userCount"] == roomItem.roomInfo["maxUserPerRoom"]) {
                    this.contentListRooms.children[index].active = false;
                }
            }
        } else {
            for (let index = 0; index < this.contentListRooms.childrenCount; index++) {
                this.contentListRooms.children[index].active = true;
            }
        }
    }

    showUIRooms() {
        this.UI_ChooseRoom.active = true;
        if (this.isInitedUIRoom) {
            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
        } else {
            this.isInitedUIRoom = true;
            this.labelNickName.string = Configs.Login.Nickname;
            BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
                this.labelCoin.string = Utils.formatNumber(Configs.Login.Coin);
            }, this);
            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

            this.setupListener();
        }
    }

    closeUIRoom() {
        this.UI_ChooseRoom.active = false;
    }

    createRoom() {
        //  cc.log("BaiCao createRoom");
    }

    playingNow() {
        //  cc.log("BaiCao playingNow");
        let arrRoomOkMoney = [];
        for (let index = 0; index < this.contentListRooms.childrenCount; index++) {
            let roomItem = this.contentListRooms.children[index].getComponent("BaiCao.ItemRoom");
            if (roomItem.roomInfo["requiredMoney"] < Configs.Login.Coin) {
                arrRoomOkMoney.push(index);
            }
        }

        //  cc.log("BaiCao playingNow arrRoomOkMoney : ", arrRoomOkMoney);

        if (arrRoomOkMoney.length > 0) {
            let roomCrowed = arrRoomOkMoney[0];
            //  cc.log("BaiCao playingNow roomCrowed start : ", roomCrowed);
            for (let index = 0; index < arrRoomOkMoney.length; index++) {
                let roomItem = this.contentListRooms.children[arrRoomOkMoney[index]].getComponent("BaiCao.ItemRoom");
                let roomItemCrowed = this.contentListRooms.children[roomCrowed].getComponent("BaiCao.ItemRoom");
                //  cc.log("BaiCao playingNow ------------------------------------------");
                //  cc.log("BaiCao playingNow roomItem : ", roomItem.roomInfo["userCount"]);
                //  cc.log("BaiCao playingNow roomItemCrowed : ", roomItemCrowed.roomInfo["userCount"]);
                if (roomItem.roomInfo["userCount"] > roomItemCrowed.roomInfo["userCount"]) {
                    roomCrowed = arrRoomOkMoney[index];
                    //  cc.log("BaiCao playingNow roomCrowed update : ", roomCrowed);
                }
            }
            //  cc.log("BaiCao playingNow roomCrowed end : ", roomCrowed);
            let roomChoosed = this.contentListRooms.children[roomCrowed].getComponent("BaiCao.ItemRoom");
            //  cc.log("BaiCao playingNow roomCrowed end roomInfo : ", roomChoosed.roomInfo);
            this.joinRoom(roomChoosed.roomInfo);
        } else {
            App.instance.alertDialog.showMsg("Không đủ tiền tham gia\nbất kỳ phòng nào !");
        }
    }

    // Chat
    showUIChat() {
        this.UI_Chat.active = true;
        this.UI_Chat.runAction(
            cc.moveTo(0.5, 420, 0)
        );
    }

    closeUIChat() {
        this.UI_Chat.runAction(
            cc.moveTo(0.5, 1000, 0)
        );
    }

    chatEmotion(event, id) {
        //  cc.log("BaiCao chatEmotion id : ", id);
        BaiCaoNetworkClient.getInstance().send(new cmd.SendChatRoom(1, id));
        this.closeUIChat();
    }

    chatMsg() {
        if (this.edtChatInput.string.trim().length > 0) {
            BaiCaoNetworkClient.getInstance().send(new cmd.SendChatRoom(0, this.edtChatInput.string));
            this.edtChatInput.string = "";
            this.closeUIChat();
        }
    }

    showPopupGuide() {
        this.popupGuide.active = true;
    }

    closePopupGuide() {
        this.popupGuide.active = false;
    }

    backToLobby() {
        BaiCaoNetworkClient.getInstance().close();
        App.instance.loadScene("Lobby");
    }

    // Playing
    showUIPlaying() {
        this.UI_Playing.active = true;
    }

    closeUIPlaying() {
        this.actionLeaveRoom();
    }

    setupMatch(data: cmd.ReceivedJoinRoomSucceed) {
        this.showUIPlaying();
        this.closePopupMatchResult();
        this.closeUIChat();
        for (let index = 1; index < 8; index++) {
            this.getPlayerHouse(index).showPopupBet(false);
            this.getPlayerHouse(index).closePopupRequestDanhBien();
        }

        //  cc.log("BaiCao setupMatch data : ", data);

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

        this.labelRoomId.string = "BÀI CÀO - PHÒNG: " + roomId;
        this.labelRoomBet.string = "MỨC CƯỢC: " + Utils.formatNumber(moneyBet) + "$";

        this.currentRoomBet = moneyBet;

        this.gameState = gameAction;
        configPlayer[0].playerId = Configs.Login.Nickname;
        configPlayer[0].playerPos = myChair;
        //  cc.log("BaiCao setupMatch configPlayer Me : ", configPlayer[0]);
        //  cc.log("BaiCao setupMatch configPlayer  : ", configPlayer);

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
        //  cc.log("BaiCao numPlayers : ", numPlayers);

        this.resetHubChips();

        // setup configPlayer
        for (let a = 0; a < configPlayer.length; a++) {
            configPlayer[a].playerPos = defaultPlayerPos[myChair][a];
        }

        // set State of Seat : Yes | No exist Player
        for (let index = 0; index < configPlayer.length; index++) {
            let findPos = arrPlayerPosExist.indexOf(configPlayer[index].playerPos);

            var seatId = configPlayer[index].seatId;
            this.getPlayerHouse(seatId).resetPlayerInfo();

            if (findPos > -1) {
                // Exist player -> Set Player Info
                if (arrPlayerStatus[findPos] == cmd.Code.PLAYER_STATUS_SITTING || arrPlayerStatus[findPos] == cmd.Code.PLAYER_STATUS_PLAYING) {
                    configPlayer[index].isViewer = false;
                    this.getPlayerHouse(seatId).setIsViewer(false);
                } else {
                    configPlayer[index].isViewer = true;
                    this.getPlayerHouse(seatId).setIsViewer(true);
                }
                this.setupSeatPlayer(seatId, arrPlayerInfo[findPos]);
            } else {
                // Not Exist player  -> Active Btn Add player
                this.getPlayerHouse(seatId).showBtnInvite(true);
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

        //  cc.log("BaiCao setupMatch configPlayer : ", configPlayer);

        let msg = "";
        switch (this.gameState) {
            case 1://bat dau van moi
                msg = "Bắt đầu ván mới";
                break;
            case 2://bat dau dat cua
                {
                    msg = "Bắt đầu đặt cửa";

                }
                break;
            case 3://bat dau ban cua
                {

                }
                break;
            case 4://nha cai can tien, hoan tien
                msg = "Nhà cái cân tiền, hoàn tiền";
                break;
            case 5://bat dau hoan tien
                msg = "Bắt đầu hoàn tiền";
                break;
            case 6://bat dau tra thuong
                msg = "Bắt đầu trả thưởng";
                break;
        }
        if (msg != "") {

        }
    }


    // Time Start
    startWaittingCountDown(timeWait) {
        this.timeAutoStart = timeWait;
        this.setTimeWaittingCountDown();
        this.notifyTimeStart.active = true;
        this.unschedule(this.intervalWaitting);
        this.schedule(this.intervalWaitting = () => {
            this.timeAutoStart--;
            this.setTimeWaittingCountDown();
            if (this.timeAutoStart < 1) {
                this.unschedule(this.intervalWaitting);
                this.notifyTimeStart.active = false;
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
        this.notifyTimeEnd.active = true;
        this.unschedule(this.intervalEnd);
        this.schedule(this.intervalEnd = () => {
            this.timeEnd--;
            this.setTimeEndCountDown();
            if (this.timeEnd < 1) {
                this.unschedule(this.intervalEnd);
                this.notifyTimeEnd.active = false;
            }
        }, 1)
    }

    setTimeEndCountDown() {
        this.seconds = Math.floor(this.timeEnd % 60);
        this.notifyTimeEnd.getComponent(cc.Label).string = " Kết thúc sau : " + this.seconds + "s ";
    }

    // Time Bet
    startBettingCountDown(turnTime) {
        //  cc.log("BaiCao startBettingCountDown turnTime : ", turnTime);
        this.timeBet = turnTime;
        this.actionBetting.active = true;
        this.processBetting(1);
        this.unschedule(this.intervalBetting);
        this.schedule(this.intervalBetting = () => {
            this.timeBet--;
            var rate = (this.timeBet / turnTime).toFixed(1);
            this.processBetting(rate);
            if (this.timeBet < 1) {
                this.unschedule(this.intervalBetting);
                this.actionBetting.active = false;
            }
        }, 1);
    }

    processBetting(rate) {
        //  cc.log("BaiCao processBetting rate : ", rate);
        //  cc.log("BaiCao processBetting fillRange : ", this.actionBetting.children[0].getComponent(cc.Sprite).fillRange);
        this.actionBetting.children[0].getComponent(cc.Sprite).fillRange = rate;
    }

    getCardsScore(arrCards) {
        let score = 0;
        //  cc.log("BaiCao getCardsScore -------------------------------------");
        //  cc.log("BaiCao getCardsScore arrCards : ", arrCards);
        for (let a = 0; a < 3; a++) {
            score += CardUtils.getDiemById(arrCards[a]);
            //  cc.log("BaiCao getCardsScore ------------------------------------- : ", a);
            //  cc.log("BaiCao getCardsScore getSoById : ", CardUtils.getSoById(arrCards[a]));
            //  cc.log("BaiCao getCardsScore getDiemById : ", CardUtils.getDiemById(arrCards[a]));
        }
        score = score % 10;
        return score;
    }

    // Open Me Card
    openMeCard(event, itemId) {
        // Open Me cards
        let cardPos = parseInt(itemId);
        //  cc.log("BaiCao openMeCard cardPos : ", cardPos);
        //  cc.log("BaiCao openMeCard currentCard : ", this.currentCard);

        this.getPlayerHouse(0).prepareCardReal(cardPos);
        let spriteCardId = CardUtils.getNormalId(this.currentCard[cardPos]);
        this.getPlayerHouse(0).transformToCardReal(cardPos, this.spriteCards[spriteCardId]);

        this.numCardOpened += 1;
        if (this.numCardOpened == 3) {
            this.btnOpenCard.active = true;
            this.btnBet.active = false;

            this.getPlayerHouse(0).showCardName(this.getCardsScore(this.currentCard) + " Điểm");

            setTimeout(() => {
                this.getPlayerHouse(0).resetCardReady();
            }, 200);
        }
    }

    moveChipsToHubNow(index) {
        this.hubChips.children[2 * index].position = cc.v2(25, 80);
        this.hubChips.children[2 * index].scale = 0;
        this.hubChips.children[(2 * index) + 1].position = cc.v2(25, 80);
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
            this.hubChips.children[2 * index].position = cc.v2(arrFromX[index], arrFromY[index]);
            this.hubChips.children[(2 * index) + 1].position = cc.v2(arrFromX[index], arrFromY[index]);
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
            item.getComponent("BaiCao.ItemResult").initItem(data[index]);
            this.contentMatchResult.addChild(item);
        }
        this.scrollMatchResult.scrollToTop(0.2);
    }

    closePopupMatchResult() {
        this.popupMatchResult.active = false;
    }

    // addListener
    setupListener() {
        BaiCaoNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.LOGIN:
                    App.instance.showLoading(false);
                    this.refeshListRoom();
                    BaiCaoNetworkClient.getInstance().send(new cmd.CmdReconnectRoom());
                    break;
                case cmd.Code.TOPSERVER:
                    {
                        App.instance.showLoading(false);
                        //  cc.log("BaiCao TOPSERVER");
                    }
                    break;
                case cmd.Code.CMD_PINGPONG:
                    {
                        App.instance.showLoading(false);
                        //  cc.log("BaiCao CMD_PINGPONG");
                    }
                    break;
                case cmd.Code.CMD_JOIN_ROOM:
                    {
                        App.instance.showLoading(false);
                        //  cc.log("BaiCao CMD_JOIN_ROOM");
                    }
                    break;
                case cmd.Code.CMD_RECONNECT_ROOM:
                    {
                        App.instance.showLoading(false);
                        //  cc.log("BaiCao CMD_RECONNECT_ROOM");
                    }
                    break;
                case cmd.Code.CMD_RECONNECT_ROOM:
                    {
                        App.instance.showLoading(false);
                        //  cc.log("BaiCao CMD_RECONNECT_ROOM");
                    }
                    break;
                case cmd.Code.MONEY_BET_CONFIG:
                    {
                        App.instance.showLoading(false);
                        //  cc.log("BaiCao MONEY_BET_CONFIG");
                    }
                    break;
                case cmd.Code.JOIN_ROOM_FAIL:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedJoinRoomFail(data);
                        //  cc.log("BaiCao JOIN_ROOM_FAIL res : ", JSON.stringify(res));
                        let msg = "Lỗi " + res.getError() + ", không xác định.";
                        switch (res.getError()) {
                            case 1:
                                msg = "Lỗi kiểm tra thông tin!";
                                break;
                            case 2:
                                msg = "Không tìm được phòng thích hợp. Vui lòng thử lại sau!";
                                break;
                            case 3:
                                msg = "Bạn không đủ tiền vào phòng chơi này!";
                                break;
                            case 4:
                                msg = "Không tìm được phòng thích hợp. Vui lòng thử lại sau!";
                                break;
                            case 5:
                                msg = "Mỗi lần vào phòng phải cách nhau 10 giây!";
                                break;
                            case 6:
                                msg = "Hệ thống bảo trì!";
                                break;
                            case 7:
                                msg = "Không tìm thấy phòng chơi!";
                                break;
                            case 8:
                                msg = "Mật khẩu phòng chơi không đúng!";
                                break;
                            case 9:
                                msg = "Phòng chơi đã đủ người!";
                                break;
                            case 10:
                                msg = "Bạn bị chủ phòng không cho vào bàn!"
                        }
                        App.instance.alertDialog.showMsg(msg);
                    }
                    break;
                case cmd.Code.GET_LIST_ROOM:
                    {
                        let res = new cmd.ReceivedGetListRoom(data);
                        //  cc.log(res);
                        for (let i = 0; i < res.list.length; i++) {
                            let itemData = res.list[i];
                            let item = cc.instantiate(this.prefabItemRoom);
                            item.getComponent("BaiCao.ItemRoom").initItem(itemData);
                            this.contentListRooms.addChild(item);
                        }
                        this.scrollListRoom.scrollToTop(0.2);
                    }
                    break;
                case cmd.Code.JOIN_GAME_ROOM_BY_ID:
                    {
                        App.instance.showLoading(false);
                        //  cc.log("BaiCao JOIN_GAME_ROOM_BY_ID");
                    }
                    break;

                // ------------------------ Game ---------------------------     
                case cmd.Code.MO_BAI:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedMoBai(data);
                        //  cc.log("BaiCao ReceivedMoBai res : ", JSON.stringify(res));
                        // {
                        // "chairMoBai": 0,
                        // "cardSize": 3,
                        // "cards": [
                        //   19,
                        //   17,
                        //   32
                        // ]
                        // }

                        let chairMoBai = res["chairMoBai"];
                        let cards = res["cards"];

                        let seatId = this.findPlayerSeatByPos(chairMoBai);
                        if (seatId != -1 && seatId != 0) {
                            this.getPlayerHouse(seatId).prepareToTransform();

                            for (let a = 0; a < 3; a++) {
                                let spriteCardId = CardUtils.getNormalId(cards[a]);
                                this.getPlayerHouse(seatId).transformToCardReal(a, this.spriteCards[spriteCardId]);
                            }
                            this.getPlayerHouse(seatId).showCardName(this.getCardsScore(cards) + " Điểm");
                        }

                    }
                    break;
                case cmd.Code.BAT_DAU:
                    {
                        App.instance.showLoading(false);
                        //  cc.log("BaiCao BAT_DAU");
                        let res = new cmd.ReceivedFirstTurnDecision(data);
                        //  cc.log("BaiCao ReceivedFirstTurnDecision res : ", JSON.stringify(res));

                        this.resetHubChips();

                        this.closePopupMatchResult();
                    }
                    break;
                case cmd.Code.KET_THUC:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedEndGame(data);
                        //  cc.log("BaiCao ReceivedEndGame res : ", JSON.stringify(res));

                        // {
                        //     "statusList": [3, 3, 0, 0, 0, 0, 0, 0],
                        //     "cardList": [
                        //         [6, 23, 21],
                        //         [11, 25, 28],
                        //         [],
                        //         [],
                        //         [],
                        //         [],
                        //         [],
                        //         []
                        //     ],
                        //     "tienThangChuong": -20000,
                        //     "tienThangGa": 0,
                        //     "keCuaMoneyList": [0, 0, 0, 0, 0, 0, 0, 0],
                        //     "danhBienMoneyList": [0, 0, 0, 0, 0, 0, 0, 0],
                        //     "tongTienCuoiVan": -20000,
                        //     "tongTienCuocList": [-20000, 20000, 0, 0, 0, 0, 0, 0],
                        //     "tongDanhBienList": [0, 0, 0, 0, 0, 0, 0, 0],
                        //     "tongKeCuaList": [0, 0, 0, 0, 0, 0, 0, 0],
                        //     "tongCuocGaList": [0, 0, 0, 0, 0, 0, 0, 0],
                        //     "tongCuoiVanList": [-20000, 19600, 0, 0, 0, 0, 0, 0],
                        //     "currentMoneyList": [4643704, 411662, 0, 0, 0, 0, 0, 0],
                        //     "timeEndGame": 12
                        // }

                        this.unschedule(this.intervalEnd);
                        this.notifyTimeEnd.active = false;

                        // // Mo het cac la bai neu no chua dc mo
                        // if (!this.isBtnOpenCardShowed && !configPlayer[0].isViewer) {
                        //     let cardReady = this.getPlayerHouse(0).node.children[2].children[0];
                        //     for (let index = 0; index < 3; index++) {
                        //         if (cardReady.children[index].scale == 1) {
                        //             let spriteCardId = CardUtils.getNormalId(this.currentCard[index]);
                        //             this.getPlayerHouse(0).transformToCardReal(index, this.spriteCards[spriteCardId]);
                        //         }
                        //     }
                        // }



                        // 
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
                        //  cc.log("BaiCao ReceivedEndGame posPlaying : ", posPlaying);

                        let result = [];
                        for (let index = 0; index < 8; index++) {
                            let findId = posPlaying.indexOf(configPlayer[index].playerPos);
                            if (findId !== -1) {
                                //  cc.log("--------------------------------");
                                //  cc.log("playerId : ", configPlayer[index].playerId);
                                //  cc.log("bet : ", tongTienCuocList[posPlaying[findId]]);
                                //  cc.log("bien : ", tongDanhBienList[posPlaying[findId]]);
                                //  cc.log("ke : ", tongKeCuaList[posPlaying[findId]]);
                                //  cc.log("ga : ", tongCuocGaList[posPlaying[findId]]);
                                //  cc.log("total : ", tongCuoiVanList[posPlaying[findId]]);
                                //  cc.log("money : ", currentMoneyList[posPlaying[findId]]);

                                let cards = cardList[posPlaying[findId]];
                                let cardReady = this.getPlayerHouse(index).node.children[2].children[0];

                                for (let a = 0; a < 3; a++) {
                                    if (cardReady.children[a].scale == 1) {
                                        let spriteCardId = CardUtils.getNormalId(cards[a]);
                                        this.getPlayerHouse(index).transformToCardReal(a, this.spriteCards[spriteCardId]);
                                    }
                                }

                                this.getPlayerHouse(index).showCardName(this.getCardsScore(cards) + " Điểm");

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
                                    this.getPlayerHouse(index).fxWin(info);
                                } else {
                                    // Lose
                                    this.getPlayerHouse(index).fxLose(info);
                                }
                            }
                        }

                        if (result.length > 0) {
                            setTimeout(() => {
                                this.showPopupMatchResult(result);
                            }, 4000);
                        }

                    }
                    break;
                case cmd.Code.YEU_CAU_DANH_BIEN:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedYeuCauDanhBien(data);
                        //  cc.log("BaiCao ReceivedYeuCauDanhBien res : ", JSON.stringify(res));
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
                        //  cc.log("BaiCao ReceivedChiaBai res : ", JSON.stringify(res));
                        // {
                        //     "cardSize": 3,
                        //     "cards": [
                        //       17,
                        //       28,
                        //       33
                        //     ],
                        //     "gameId": 1567389,
                        //     "timeChiaBai": 20
                        //   }

                        this.btnBet.active = false;
                        this.btnOpenCard.active = false;

                        for (let index = 1; index < 8; index++) {
                            this.getPlayerHouse(index).showPopupBet(false);
                            this.getPlayerHouse(index).closePopupRequestDanhBien();
                        }

                        this.matchPot.getComponent(cc.Button).interactable = false;
                        this.matchPot.children[0].color = cc.Color.GRAY;

                        let cards = res["cards"];
                        let timeChiaBai = res["timeChiaBai"];

                        clearTimeout(this.timeoutEndGame);
                        this.timeoutEndGame = setTimeout(() => {
                            this.startEndCountDown(timeChiaBai);
                        }, 2000);

                        this.currentCard = cards;
                        //  cc.log("BaiCao ReceivedChiaBai currentCard : ", this.currentCard);

                        var arrSeatExist = this.getNumPlayers();
                        let numPlayer = arrSeatExist.length;

                        // Open | Hide cards not use
                        for (let index = 0; index < 8 * 3; index++) { // 8 players * 3 cards
                            this.cardsDeal.children[index].active = index >= numPlayer * 3 ? false : true;
                            this.cardsDeal.children[index].position = cc.v2(0, 0);
                        }

                        let timeShip = 0.1; // 0.15
                        // Move Cards used to each player joined
                        for (let a = 0; a < 3; a++) { // players x 3 cards
                            for (let b = 0; b < numPlayer; b++) {
                                let seatId = arrSeatExist[b];
                                if (seatId !== -1) {
                                    let card4Me = this.cardsDeal.children[(a * numPlayer) + b];
                                    let rawPlayerPos = this.groupPlayers.children[seatId].position;
                                    //  cc.log("BaiCao CHIA_BAI delayTime : ", ((a * numPlayer) + b) * timeShip);
                                    card4Me.runAction(
                                        cc.sequence(
                                            cc.delayTime(((a * numPlayer) + b) * timeShip),
                                            cc.moveTo(0.2, rawPlayerPos)
                                        )
                                    );
                                }
                            }
                        }

                        let delayOver2Under = 0.2;
                        var maxDelay = ((2 * numPlayer) + (numPlayer - 1)) * timeShip; // ((a * numPlayer) + b) * timeShip
                        let timeUnderLayer = (maxDelay + 0.2 + delayOver2Under) * 1000;
                        //  cc.log("CHIA_BAI timeUnderLayer : ", timeUnderLayer);
                        clearTimeout(this.timeoutChiaBaiDone);
                        this.timeoutChiaBaiDone = setTimeout(() => {
                            for (let index = 0; index < 8 * 3; index++) { // 8 players * 3 cards
                                //  cc.log("CHIA_BAI cardsDeal index : ", index);
                                this.cardsDeal.children[index].active = false;
                            }

                            for (let index = 0; index < numPlayer; index++) {
                                let seatId = arrSeatExist[index];
                                if (seatId !== -1) {
                                    // Drop layer
                                    if (seatId == 0) {
                                        this.getPlayerHouse(seatId).resetCardReady();
                                    }
                                    this.getPlayerHouse(seatId).showCardReady(true);
                                    this.getPlayerHouse(seatId).showCardReal(false);
                                }
                            }
                        }, timeUnderLayer);
                    }
                    break;
                case cmd.Code.KE_CUA:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedKeCua(data);
                        //  cc.log("BaiCao ReceivedKeCua res : ", JSON.stringify(res));
                        // {
                        //     "chairKeCuaFrom": 5,
                        //     "chairKeCuaTo": 0,
                        //     "level": 2
                        //   }

                        let chairKeCuaFrom = res["chairKeCuaFrom"];
                        let chairKeCuaTo = res["chairKeCuaTo"];
                        let level = res["level"];
                    }
                    break;
                case cmd.Code.TU_DONG_BAT_DAU:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedAutoStart(data);
                        //  cc.log("BaiCao ReceiveAutoStart res : ", JSON.stringify(res));
                        // {
                        //     "isAutoStart": true,
                        //     "timeAutoStart": 5
                        // }
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
                        //  cc.log("BaiCao ReceivedChapNhanDanhBien res : ", JSON.stringify(res));
                        let danhBienChair = res["danhBienChair"];
                        let level = res["level"];
                        this.arrPosDanhBien.push(danhBienChair);
                        let seatId = this.findPlayerSeatByPos(danhBienChair);
                        if (seatId != -1) {
                            //  cc.log("BaiCao ReceivedChapNhanDanhBien Me seatId : 0");
                            //  cc.log("BaiCao ReceivedChapNhanDanhBien Bien seatId : ", seatId);
                            this.getPlayerHouse(seatId).disableDanhBien(level);
                            this.getPlayerHouse(seatId).playFxDanhBien();
                        }
                    }
                    break;
                case cmd.Code.DAT_CUOC:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedDatCuoc(data);
                        //  cc.log("BaiCao ReceivedDatCuoc res : ", JSON.stringify(res));
                        // {
                        //     "chairDatCuoc": 1,
                        //     "level": 2
                        //   }

                        let chairDatCuoc = res["chairDatCuoc"];
                        let level = res["level"];

                        let seatId = this.findPlayerSeatByPos(chairDatCuoc);
                        if (seatId != -1) {
                            this.getPlayerHouse(seatId).setBet(this.arrBetValue[level - 1]);
                            this.getPlayerHouse(seatId).addChips();
                        }
                    }
                    break;
                case cmd.Code.THONG_TIN_BAN_CHOI:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedGameInfo(data);
                        //  cc.log("BaiCao ReceivedGameInfo res : ", JSON.stringify(res));

                        // case Reconnect
                        // user dang o trong 1 phong nao do
                        // neu req join room nhan dc cai nay thi -> dua vao phong dang choi

                        // {
                        //     "myChair": 3,
                        //     "chuongChair": 4,
                        //     "cards": [22, 34, 32],
                        //     "cuocDanhBienList": [0, 0, 0, 0, 0, 0, 0, 0],
                        //     "cuocKeCuaList": [0, 0, 0, 0, 0, 0, 0, 0],
                        //     "gameServerState": 1,
                        //     "isAutoStart": true,
                        //     "gameAction": 2,
                        //     "countDownTime": 13,
                        //     "moneyType": 1,
                        //     "moneyBet": 100,
                        //     "gameId": 1828082,
                        //     "roomId": 98,
                        //     "hasInfo": [true, true, true, true, true, false, false, false],
                        //     "players": [[], [], [], [], [], [], [], []]
                        // }

                        this.closeUIRoom();
                        this.showUIPlaying();
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

                        this.labelRoomId.string = "BÀI CÀO - PHÒNG: " + roomId;
                        this.labelRoomBet.string = "MỨC CƯỢC: " + Utils.formatNumber(moneyBet) + "$";

                        this.currentRoomBet = moneyBet;
                        this.gameState = gameAction;

                        this.currentCard = cards;

                        configPlayer[0].playerId = Configs.Login.Nickname;
                        configPlayer[0].playerPos = myChair;
                        //  cc.log("BaiCao setupMatch configPlayer Me : ", configPlayer[0]);
                        //  cc.log("BaiCao setupMatch configPlayer  : ", configPlayer);

                        var numPlayers = 0;
                        var arrPlayerPosExist = [];

                        for (let index = 0; index < hasInfo.length; index++) {
                            if (hasInfo[index]) {
                                numPlayers += 1;
                                arrPlayerPosExist.push(index);
                            }
                        }
                        //  cc.log("BaiCao numPlayers : ", numPlayers);

                        // setup configPlayer
                        for (let a = 0; a < configPlayer.length; a++) {
                            configPlayer[a].playerPos = defaultPlayerPos[myChair][a];
                        }

                        // set State of Seat : Yes | No exist Player
                        for (let index = 0; index < configPlayer.length; index++) {
                            let findPos = arrPlayerPosExist.indexOf(configPlayer[index].playerPos);

                            var seatId = configPlayer[index].seatId;
                            this.getPlayerHouse(seatId).resetPlayerInfo();

                            if (findPos > -1) {
                                // Exist player -> Set Player Info

                                // dang thieu thong tin -> se k hien dc UserInfo

                                // if (arrPlayerStatus[findPos] == cmd.Code.PLAYER_STATUS_READY) {
                                //     configPlayer[index].isViewer = false;
                                //     this.getPlayerHouse(seatId).setIsViewer(false);
                                // } else {
                                //     configPlayer[index].isViewer = true;
                                //     this.getPlayerHouse(seatId).setIsViewer(true);
                                // }

                                this.getPlayerHouse(seatId).setIsViewer(false);
                                this.setupSeatPlayer(seatId, {
                                    nickName: "",
                                    avatar: Utils.randomRange(1, 9),
                                    money: ""
                                });
                            } else {
                                // Not Exist player  -> Active Btn Add player
                                this.getPlayerHouse(seatId).showBtnInvite(true);
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
                    }
                    break;
                case cmd.Code.DANG_KY_THOAT_PHONG:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedNotifyRegOutRoom(data);
                        //  cc.log("BaiCao ReceivedNotifyRegOutRoom res : ", JSON.stringify(res));
                        // {
                        //     "outChair": 1,
                        //     "isOutRoom": true
                        //   }

                        let outChair = res["outChair"];
                        let isOutRoom = res["isOutRoom"];

                        let seatId = this.findPlayerSeatByPos(outChair);
                        if (seatId !== -1) {
                            if (isOutRoom) {
                                this.getPlayerHouse(seatId).showNotify("Sắp rời bàn !");
                            } else {
                                this.getPlayerHouse(seatId).showNotify("Khô Máu !");
                            }
                        }
                    }
                    break;
                case cmd.Code.VAO_GA:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedVaoGa(data);
                        //  cc.log("BaiCao ReceivedVaoGa res : ", JSON.stringify(res));
                        // {
                        //     "chair": 3,
                        //     "chicKenBet": 300
                        //   }

                        let chair = res["chair"];
                        let chicKenBet = res["chicKenBet"];

                        let seatId = this.findPlayerSeatByPos(chair);
                        if (seatId != -1) {
                            this.hubChips.children[2 * seatId].active = true;
                            this.hubChips.children[(2 * seatId) + 1].active = true;
                            this.fxMoveChips(this.hubChips.children[2 * seatId], 0.1, this.matchPot.x, this.matchPot.y);
                            this.fxMoveChips(this.hubChips.children[(2 * seatId) + 1], 0.2, this.matchPot.x, this.matchPot.y);

                            // Can cong luy ke len
                            this.currentMatchPotValue += chicKenBet;
                            this.labelMatchPot.string = Utils.formatNumber(this.currentMatchPotValue);
                            this.getPlayerHouse(seatId).playFxVaoGa();
                        }
                    }
                    break;
                case cmd.Code.DOI_CHUONG:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedDoiChuong(data);
                        //  cc.log("BaiCao ReceivedDoiChuong res : ", JSON.stringify(res));
                        // {
                        //     "chuongChair": 2
                        //   }


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
                        //  cc.log("BaiCao ReceivedMoiDatCuoc res : ", JSON.stringify(res));
                        // {
                        //     "timeDatCuoc": 20
                        //   }
                        this.startBettingCountDown(res.timeDatCuoc);
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

                        // {
                        //     seatId: 0,
                        //     playerId: -1,
                        //     playerPos: -1,
                        //     isViewer: true
                        // }

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



                            //  cc.log("BaiCao MOI_DAT_CUOC this.arrBetValue : ", this.arrBetValue);
                        }

                        this.numCardOpened = 0;
                    }
                    break;
                case cmd.Code.CHEAT_CARDS:
                    {
                        App.instance.showLoading(false);
                        //  cc.log("BaiCao CHEAT_CARDS");
                    }
                    break;
                case cmd.Code.DANG_KY_CHOI_TIEP:
                    {
                        App.instance.showLoading(false);
                        //  cc.log("BaiCao DANG_KY_CHOI_TIEP");
                    }
                    break;
                case cmd.Code.UPDATE_OWNER_ROOM:
                    {
                        App.instance.showLoading(false);
                        //  cc.log("BaiCao UPDATE_OWNER_ROOM");
                    }
                    break;
                case cmd.Code.JOIN_ROOM_SUCCESS:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedJoinRoomSucceed(data);
                        this.closeUIRoom();
                        this.setupMatch(res);
                    }
                    break;
                case cmd.Code.LEAVE_GAME:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedUserLeaveRoom(data);
                        //  cc.log("BaiCao ReceivedUserLeaveRoom res : ", JSON.stringify(res));

                        // {
                        //     "chair": 1,
                        //     "nickName": "chaoae99"
                        //   }

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
                            this.getPlayerHouse(seatId).resetPlayerInfo();
                            this.getPlayerHouse(seatId).showBtnInvite(true);

                            let arrSeatExistLast = this.getNumPlayers();
                            if (arrSeatExistLast.length == 1) {
                                this.resetPlayersPlaying();
                                this.matchPot.active = false;
                            }

                            if (seatId == 0) {
                                // Me leave
                                // Change UI
                                this.UI_Playing.active = false;
                                this.UI_ChooseRoom.active = true;
                                this.refeshListRoom();
                            }
                        }
                    }
                    break;
                case cmd.Code.NOTIFY_KICK_FROM_ROOM:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedKickOff(data);
                        //  cc.log("BaiCao ReceivedKickOff res : ", JSON.stringify(res));
                    }
                    break;
                case cmd.Code.NEW_USER_JOIN:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedUserJoinRoom(data);
                        //  cc.log("BaiCao ReceivedUserJoinRoom res : ", JSON.stringify(res));
                        // {
                        //     "info": {
                        //       "nickName": "Ahoang88",
                        //       "avatar": "7",
                        //       "money": 10230080
                        //     },
                        //     "uChair": 5,
                        //     "uStatus": 1
                        //   }

                        let info = res["info"];
                        let uChair = res["uChair"];
                        let uStatus = res["uStatus"];

                        // set State of Seat : Yes | No exist Player
                        for (let index = 0; index < configPlayer.length; index++) {
                            if (configPlayer[index].playerPos == uChair) {
                                // Exist player -> Set Player Info
                                var seatId = configPlayer[index].seatId;
                                this.getPlayerHouse(seatId).resetPlayerInfo();
                                var customPlayerInfo = {
                                    "avatar": info["avatar"],
                                    "nickName": info["nickName"],
                                    "money": info["money"],
                                }

                                this.setupSeatPlayer(seatId, customPlayerInfo);

                                if (uStatus == cmd.Code.PLAYER_STATUS_VIEWER) {
                                    this.getPlayerHouse(seatId).setIsViewer(true);
                                    // this.getPlayerHouse(seatId).playFxViewer();
                                    configPlayer[seatId].isViewer = true;
                                } else {
                                    configPlayer[seatId].isViewer = false;
                                    this.getPlayerHouse(seatId).setIsViewer(false);
                                }
                            }
                        }
                    }
                    break;
                case cmd.Code.NOTIFY_USER_GET_JACKPOT:
                    {
                        App.instance.showLoading(false);
                        //  cc.log("BaiCao NOTIFY_USER_GET_JACKPOT");
                    }
                    break;
                case cmd.Code.UPDATE_MATCH:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedUpdateMatch(data);
                        //  cc.log("BaiCao ReceivedUpdateMatch res : ", JSON.stringify(res));
                        // {
                        //     "myChair": 2,
                        //     "hasInfo": [
                        //       true,
                        //       true,
                        //       true,
                        //       true,
                        //       false,
                        //       true,
                        //       false,
                        //       false
                        //     ],
                        //     "infos": [
                        //       {
                        //         "nickName": "nestle103",
                        //         "avatar": "7",
                        //         "money": 5560860,
                        //         "status": 2
                        //       },
                        //       {
                        //         "nickName": "imeldda",
                        //         "avatar": "2",
                        //         "money": 3852854,
                        //         "status": 2
                        //       },
                        //       {
                        //         "nickName": "VN_Star1",
                        //         "avatar": "2",
                        //         "money": 5703572,
                        //         "status": 2
                        //       },
                        //       {
                        //         "nickName": "gvngvn4567",
                        //         "avatar": "2",
                        //         "money": 2749687,
                        //         "status": 2
                        //       },
                        //       {},
                        //       {
                        //         "nickName": "skypenon",
                        //         "avatar": "5",
                        //         "money": 5051363,
                        //         "status": 2
                        //       },
                        //       {},
                        //       {}
                        //     ]
                        //   }

                        let myChair = res["myChair"];
                        let hasInfo = res["hasInfo"];
                        let infos = res["infos"];

                        //  cc.log("BaiCao setupMatch configPlayer : ", configPlayer);
                        // theo Pos khong phai SeatId
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
                                }
                                this.setupSeatPlayer(index, infos[pos]);
                            } else {
                                configPlayer[index]["playerId"] = -1;
                                configPlayer[index]["isViewer"] = true;
                            }
                        }
                        //  cc.log("BaiCao setupMatch configPlayer : ", configPlayer);
                    }
                    break;
                case cmd.Code.CHAT_ROOM:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedChatRoom(data);
                        //  cc.log("BaiCao CHAT_ROOM res : ", JSON.stringify(res));

                        // {
                        //     "chair": 0,
                        //     "isIcon": true,
                        //     "content": "6",
                        //     "nickname": "chaoae99"
                        //   }

                        // {
                        //     "chair": 0,
                        //     "isIcon": false,
                        //     "content": "lalal",
                        //     "nickname": "chaoae99"
                        //   }

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
                    //  cc.log("--inpacket.getCmdId(): " + inpacket.getCmdId());
                    break;
            }
        }, this);
    }

    // request
    actionLeaveRoom() {
        BaiCaoNetworkClient.getInstance().send(new cmd.CmdSendRequestLeaveGame());
    }

    actionOpenCard() {
        BaiCaoNetworkClient.getInstance().send(new cmd.CmdSendMoBai());
        this.btnOpenCard.active = false;
    }

    actionSendVaoGa() {
        //  cc.log("BaiCao actionSendVaoGa");
        BaiCaoNetworkClient.getInstance().send(new cmd.SendVaoGa());
        this.matchPot.children[0].color = cc.Color.WHITE;
        this.matchPot.getComponent(cc.Button).interactable = false;
    }

    actionAcceptDanhBien(event, seatId) {
        //  cc.log("BaiCao actionAcceptDanhBien seatId : ", seatId);
        //  cc.log("BaiCao actionAcceptDanhBien playerPos : ", configPlayer[seatId].playerPos);
        BaiCaoNetworkClient.getInstance().send(new cmd.CmdSendAcceptDanhBien(configPlayer[seatId].playerPos));
        this.getPlayerHouse(seatId).closePopupRequestDanhBien(false);
    }

    increaseBetValue() {
        if (this.currentBetSelectedIndex == (this.arrBetValue.length - 1)) {

        } else {
            this.currentBetSelectedIndex += 1;
        }

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
        //  cc.log("BaiCao actionBet betted : ", this.arrBetValue[this.currentBetSelectedIndex]);
        BaiCaoNetworkClient.getInstance().send(new cmd.CmdSendDatCuoc(this.currentBetSelectedIndex + 1));
        this.btnBet.active = false;
        // set bet default
        for (let index = 0; index < configPlayer.length; index++) {
            if (index !== this.seatOwner
                && !configPlayer[index].isViewer
                && configPlayer[index].playerId !== -1) {
                //  cc.log("BaiCao ReceivedMoiDatCuoc index : ", index);
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
        //  cc.log("BaiCao actionDanhBien id : ", id);
        let seatId = parseInt(id.substring(0, 1));
        let level = parseInt(id.substring(1, 2));
        //  cc.log("BaiCao actionDanhBien seatId : ", seatId);
        //  cc.log("BaiCao actionDanhBien level : ", level);
        let pos = this.findPlayerPosBySeat(seatId);
        //  cc.log("BaiCao actionDanhBien pos : ", pos);
        if (pos != -1) {
            //  cc.log("BaiCao actionDanhBien ------------");
            //  cc.log("BaiCao actionDanhBien seatId : ", seatId);
            //  cc.log("BaiCao actionDanhBien pos : ", pos);

            //  cc.log("BaiCao actionDanhBien seatId : 0");
            //  cc.log("BaiCao actionDanhBien me : ", configPlayer[0].playerPos);
            //  cc.log("BaiCao actionDanhBien ------------");
            this.getPlayerHouse(seatId).disableDanhBien(level);
            this.getPlayerHouse(seatId).showNotify("Đánh biên");
            BaiCaoNetworkClient.getInstance().send(new cmd.CmdSendDanhBien(pos, level));
        }
    }

    actionKeCua(event, id) {
        //  cc.log("BaiCao actionKeCua id : ", id);
        let seatId = parseInt(id.substring(0, 1));
        let level = parseInt(id.substring(1, 2)) - 2;
        //  cc.log("BaiCao actionKeCua seatId : ", seatId);
        //  cc.log("BaiCao actionKeCua level : ", level);
        let pos = this.findPlayerPosBySeat(seatId);
        //  cc.log("BaiCao actionKeCua pos : ", pos);
        if (pos != -1) {
            this.getPlayerHouse(seatId).disableKeCua(level);
            BaiCaoNetworkClient.getInstance().send(new cmd.CmdSendKeCua(pos, level));
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
        //  cc.log("BaiCao configPlayer : ", configPlayer);
    }

    resetPlayersPlaying() {
        for (let index = 0; index < 8; index++) {
            this.getPlayerHouse(index).resetMatchHistory();
        }
    }

    // handle Game Players
    setupSeatPlayer(seatId, playerInfo) {
        //  cc.log("BaiCao setupSeatPlayer playerInfo : ", playerInfo);
        configPlayer[seatId].playerId = playerInfo.nickName;
        this.getPlayerHouse(seatId).setAvatar(playerInfo.avatar);
        this.getPlayerHouse(seatId).setName(playerInfo.nickName);
        this.getPlayerHouse(seatId).setGold(playerInfo.money);
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
        return this.groupPlayers.children[seatId].getComponent("BaiCao.Player");
    }

    getNumPlayers() {
        //  cc.log("playerPosEntry configPlayer : ", configPlayer);
        var playerPosEntry = [];
        for (let index = 0; index < configPlayer.length; index++) {
            //  cc.log("playerPosEntry playerId : ", configPlayer[index].playerId);
            //  cc.log("playerPosEntry isViewer : ", configPlayer[index].isViewer);
            //  cc.log("-------------------------------------");
            if (configPlayer[index].playerId !== -1 && !configPlayer[index].isViewer) {
                playerPosEntry.push(configPlayer[index].seatId);
                //  cc.log("playerPosEntry seatId : ", configPlayer[index].seatId);
            }
        }
        //  cc.log("playerPosEntry : ", playerPosEntry);
        return playerPosEntry;
    }

    update(dt) {

    }
}
