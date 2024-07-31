
import Configs from "../../Loading/src/Configs";
import Cmd from "./MauBinh.Cmd";

import MauBinhNetworkClient from "./MauBinh.NetworkClient";
import CardUtils from "./MauBinh.CardUtil"

import DetectPlayerCards from './MauBinh.DetectPlayerCards';
import App from "../../Lobby/LobbyScript/Script/common/App";
import BroadcastReceiver from "../../Lobby/LobbyScript/Script/common/BroadcastReceiver";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import cmdNetwork from "../../Lobby/LobbyScript/Script/networks/Network.Cmd";
var configPlayer = [
    // {
    //     seatId: 0,
    //     playerId: -1,
    //     playerPos: -1,
    //     isViewer: true
    // }
];

// defaultPlayerPos[0 -> 3][0] = player_pos of me
let defaultPlayerPos = [
    [0, 1, 2, 3],
    [1, 2, 3, 0],
    [2, 3, 0, 1],
    [3, 0, 1, 2]
]

const { ccclass, property } = cc._decorator;

@ccclass
export default class MauBinhController extends cc.Component {

    public static instance: MauBinhController = null;

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
    cardsDeal: cc.Node = null;
    @property(cc.Button)
    btnLeaveRoom: cc.Button = null;
    @property(cc.Label)
    labelRoomId: cc.Label = null;
    @property(cc.Label)
    labelRoomBet: cc.Label = null;
    @property(cc.Node)
    actionBetting: cc.Node = null;
    @property(cc.Node)
    cardMove: cc.Node = null;
    @property(cc.Node)
    suggestTarget: cc.Node = null;
    @property(cc.Node)
    btnSoChi: cc.Node = null;
    @property(cc.Node)
    btnCombining: cc.Node = null;
    @property(cc.Node)
    tableCurrentChi: cc.Node = null;

    // Notify
    @property(cc.Node)
    notifyTimeStart: cc.Node = null;
    @property(cc.Node)
    notifyTimeEnd: cc.Node = null;
    @property(cc.Node)
    notifyTimeBet: cc.Node = null;
    @property(cc.Node)
    fxSoChiTotal: cc.Node = null;
    @property(cc.SpriteFrame)
    spriteSoChiTotal: cc.SpriteFrame[] = [];

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

    @property(cc.SpriteFrame)
    spriteGroupCard: cc.SpriteFrame[] = [];


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

    private timeoutChiaBaiDone = null;
    private timeoutBetting = null;

    cardMoveId: -1;
    cardMoveValue: "";

    isTinhAce = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        MauBinhController.instance = this;

        this.seatOwner = -1;

        this.initConfigPlayer();
    }

    start() {
        this.showUIRooms();

        App.instance.showErrLoading("Đang kết nối tới server...");
        MauBinhNetworkClient.getInstance().addOnOpen(() => {
            App.instance.showErrLoading("Đang đăng nhập...");
            MauBinhNetworkClient.getInstance().send(new cmdNetwork.SendLogin(Configs.Login.Nickname, Configs.Login.AccessToken));
        }, this);
        MauBinhNetworkClient.getInstance().addOnClose(() => {
            App.instance.loadScene("Lobby");
        }, this);
        MauBinhNetworkClient.getInstance().connect();
    }

    // Request UI Room
    joinRoom(info) {
        //  cc.log("MauBinh joinRoom roomInfo : ", info);
        App.instance.showLoading(true);
        MauBinhNetworkClient.getInstance().send(new Cmd.SendJoinRoomById(info["id"]));
    }

    refeshListRoom() {
        this.contentListRooms.removeAllChildren(true);
        MauBinhNetworkClient.getInstance().send(new Cmd.SendGetListRoom());
    }

    findRoomId() {
        //  cc.log("MauBinh findRoomId id : ", this.edtFindRoom.string);
        let text = this.edtFindRoom.string.trim();
        if (text.length > 0) {
            let idFind = parseInt(text);
            for (let index = 0; index < this.contentListRooms.childrenCount; index++) {
                let roomItem = this.contentListRooms.children[index].getComponent("MauBinh.ItemRoom");
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
                let roomItem = this.contentListRooms.children[index].getComponent("MauBinh.ItemRoom");
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
        //  cc.log("MauBinh createRoom");
        // MauBinhNetworkClient.getInstance().send(new Cmd.SendGetTopServer(1));
    }

    playingNow() {
        //  cc.log("MauBinh playingNow");
        let arrRoomOkMoney = [];
        for (let index = 0; index < this.contentListRooms.childrenCount; index++) {
            let roomItem = this.contentListRooms.children[index].getComponent("MauBinh.ItemRoom");
            if (roomItem.roomInfo["requiredMoney"] < Configs.Login.Coin) {
                arrRoomOkMoney.push(index);
            }
        }

        //  cc.log("MauBinh playingNow arrRoomOkMoney : ", arrRoomOkMoney);

        if (arrRoomOkMoney.length > 0) {
            let roomCrowed = arrRoomOkMoney[0];
            //  cc.log("MauBinh playingNow roomCrowed start : ", roomCrowed);
            for (let index = 0; index < arrRoomOkMoney.length; index++) {
                let roomItem = this.contentListRooms.children[arrRoomOkMoney[index]].getComponent("MauBinh.ItemRoom");
                let roomItemCrowed = this.contentListRooms.children[roomCrowed].getComponent("MauBinh.ItemRoom");
                //  cc.log("MauBinh playingNow ------------------------------------------");
                //  cc.log("MauBinh playingNow roomItem : ", roomItem.roomInfo["userCount"]);
                //  cc.log("MauBinh playingNow roomItemCrowed : ", roomItemCrowed.roomInfo["userCount"]);
                if (roomItem.roomInfo["userCount"] > roomItemCrowed.roomInfo["userCount"]) {
                    roomCrowed = arrRoomOkMoney[index];
                    //  cc.log("MauBinh playingNow roomCrowed update : ", roomCrowed);
                }
            }
            //  cc.log("MauBinh playingNow roomCrowed end : ", roomCrowed);
            let roomChoosed = this.contentListRooms.children[roomCrowed].getComponent("MauBinh.ItemRoom");
            //  cc.log("MauBinh playingNow roomCrowed end roomInfo : ", roomChoosed.roomInfo);
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
        //  cc.log("MauBinh chatEmotion id : ", id);
        MauBinhNetworkClient.getInstance().send(new Cmd.SendChatRoom(1, id));
        this.closeUIChat();
    }

    chatMsg() {
        if (this.edtChatInput.string.trim().length > 0) {
            MauBinhNetworkClient.getInstance().send(new Cmd.SendChatRoom(0, this.edtChatInput.string));
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
        MauBinhNetworkClient.getInstance().close();
        App.instance.loadScene("Lobby");
    }

    // Playing
    showUIPlaying() {
        this.UI_Playing.active = true;
    }

    closeUIPlaying() {
        this.actionLeaveRoom();
    }

    setupMatch(data: Cmd.ReceivedJoinRoomSucceed) {
        this.showUIPlaying();
        this.closeUIChat();

        //  cc.log("MauBinh setupMatch data : ", data);
        //  cc.log("MauBinh setupMatch data !0 : ", !0);
        //  cc.log("MauBinh setupMatch data !1 : ", !1);



        let myChair = data["myChair"];
        let moneyBet = data["moneyBet"];
        let roomId = data["roomId"];
        let gameId = data["gameId"];
        let moneyType = data["moneyType"];
        let rule = data["rule"];
        let playerSize = data["playerSize"];
        let playerStatus = data["playerStatus"];
        let playerInfos = data["playerInfos"];
        let gameState = data["gameState"];
        let gameAction = data["gameAction"];
        let countDownTime = data["countDownTime"];

        this.labelRoomId.string = "MẬU BINH - PHÒNG: " + roomId;
        this.labelRoomBet.string = "MỨC CƯỢC: " + Utils.formatNumber(moneyBet) + "$";

        this.isTinhAce = rule == 1 ? true : false;
        this.currentRoomBet = moneyBet;

        if (gameState == Cmd.Code.STATE_PLAYING) {
            this.startBettingCountDown(countDownTime);
        }

        configPlayer[0].playerId = Configs.Login.Nickname;
        configPlayer[0].playerPos = myChair;
        //  cc.log("MauBinh setupMatch configPlayer Me : ", configPlayer[0]);

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
        //  cc.log("MauBinh numPlayers : ", numPlayers);

        // setup configPlayer
        for (let a = 0; a < configPlayer.length; a++) {
            configPlayer[a].playerPos = defaultPlayerPos[myChair][a];
        }

        //  cc.log("MauBinh setupMatch configPlayer  : ", JSON.stringify(configPlayer));
        //  cc.log("MauBinh setupMatch arrPlayerPosExist  : ", JSON.stringify(arrPlayerPosExist));
        //  cc.log("MauBinh setupMatch arrPlayerInfo  : ", JSON.stringify(arrPlayerInfo));
        //  cc.log("MauBinh setupMatch arrPlayerStatus  : ", JSON.stringify(arrPlayerStatus));

        // set State of Seat : Yes | No exist Player
        for (let index = 0; index < configPlayer.length; index++) {
            let findPos = arrPlayerPosExist.indexOf(configPlayer[index].playerPos);

            //  cc.log("MauBinh setupMatch find -------------- ");
            //  cc.log("MauBinh setupMatch find " + index + " : " + configPlayer[index].playerPos);
            var seatId = configPlayer[index].seatId;
            //  cc.log("MauBinh setupMatch find seatId ", seatId);
            this.getPlayerHouse(seatId).resetPlayerInfo(seatId);

            //  cc.log("MauBinh setupMatch find findPos ", findPos);
            if (findPos > -1) {
                // Exist player -> Set Player Info
                //  cc.log("MauBinh setupMatch find arrPlayerStatus[findPos] : ", arrPlayerStatus[findPos]);
                if (arrPlayerStatus[findPos] == Cmd.Code.PLAYER_STATUS_SITTING || arrPlayerStatus[findPos] == Cmd.Code.PLAYER_STATUS_PLAYING) {
                    configPlayer[index].isViewer = false;
                    this.getPlayerHouse(seatId).setIsViewer(false);
                    if (seatId != 0) {
                        if (gameState == Cmd.Code.STATE_PLAYING) {
                            this.getPlayerHouse(seatId).playFxDangXep();
                            this.getPlayerHouse(seatId).showCardReal(true);
                            this.getPlayerHouse(seatId).showCardReady(false);
                        }
                    }
                } else {
                    configPlayer[index].isViewer = true;
                    this.getPlayerHouse(seatId).setIsViewer(true);
                    this.getPlayerHouse(seatId).playFxViewer();
                }

                this.setupSeatPlayer(seatId, arrPlayerInfo[findPos]);
            } else {
                // Not Exist player  -> Active Btn Add player
                this.getPlayerHouse(seatId).showBtnInvite(true);
                configPlayer[index].isViewer = true;
            }
        }
        //  cc.log("MauBinh setupMatch configPlayer : ", configPlayer);
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
        //  cc.log("MauBinh startBettingCountDown turnTime : ", turnTime);
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
        //  cc.log("MauBinh processBetting rate : ", rate);
        //  cc.log("MauBinh processBetting fillRange : ", this.actionBetting.children[0].getComponent(cc.Sprite).fillRange);
        this.actionBetting.children[0].getComponent(cc.Sprite).fillRange = rate;
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

    // addListener
    setupListener() {
        MauBinhNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case Cmd.Code.LOGIN:
                    App.instance.showLoading(false);
                    this.refeshListRoom();
                    MauBinhNetworkClient.getInstance().send(new Cmd.CmdReconnectRoom());
                    break;
                case Cmd.Code.TOPSERVER:
                    {
                        App.instance.showLoading(false);
                        let res = new Cmd.ReceivedTopServer(data);
                        //  cc.log("MauBinh TOPSERVER res : ", JSON.stringify(res));

                        let rankType = res["rankType"];
                        let topDay_money = res["topDay_money"];
                        let topWeek_money = res["topWeek_money"];
                        let topMonth_money = res["topMonth_money"];
                    }
                    break;
                case Cmd.Code.CMD_PINGPONG:
                    {
                        App.instance.showLoading(false);
                        //  cc.log("MauBinh CMD_PINGPONG");
                    }
                    break;
                case Cmd.Code.CMD_JOIN_ROOM:
                    {
                        App.instance.showLoading(false);
                        //  cc.log("MauBinh CMD_JOIN_ROOM");
                    }
                    break;
                case Cmd.Code.CMD_RECONNECT_ROOM:
                    {
                        App.instance.showLoading(false);
                        //  cc.log("MauBinh CMD_RECONNECT_ROOM");
                    }
                    break;
                case Cmd.Code.MONEY_BET_CONFIG:
                    {
                        App.instance.showLoading(false);
                        //  cc.log("MauBinh MONEY_BET_CONFIG");
                    }
                    break;
                case Cmd.Code.JOIN_ROOM_FAIL:
                    {
                        App.instance.showLoading(false);
                        let res = new Cmd.ReceivedJoinRoomFail(data);
                        //  cc.log("MauBinh JOIN_ROOM_FAIL res : ", JSON.stringify(res));
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
                                break;
                        }
                        App.instance.alertDialog.showMsg(msg);
                    }
                    break;
                case Cmd.Code.GET_LIST_ROOM:
                    {
                        let res = new Cmd.ReceivedGetListRoom(data);
                        //  cc.log(res);
                        for (let i = 0; i < res.list.length; i++) {
                            let itemData = res.list[i];
                            let item = cc.instantiate(this.prefabItemRoom);
                            item.getComponent("MauBinh.ItemRoom").initItem(itemData);
                            this.contentListRooms.addChild(item);
                        }
                        this.scrollListRoom.scrollToTop(0.2);
                    }
                    break;
                case Cmd.Code.JOIN_GAME_ROOM_BY_ID:
                    {
                        App.instance.showLoading(false);
                        //  cc.log("MauBinh JOIN_GAME_ROOM_BY_ID");
                    }
                    break;

                // ------------------------ Game ---------------------------     

                case Cmd.Code.BINH_SO_CHI:
                    {
                        App.instance.showLoading(false);
                        let res = new Cmd.ReceivedBinhSoChi(data);
                        //  cc.log("MauBinh ReceivedBinhSoChi res : ", JSON.stringify(res));

                        let chair = res["chair"];
                        let seatId = this.findPlayerSeatByPos(chair);
                        if (seatId != -1) {
                            if (seatId == 0) {
                                this.btnCombining.active = true;
                                this.btnSoChi.active = false;
                                this.getPlayerHouse(0).scaleCardReal(0.45);
                                for (let index = 0; index < 13; index++) {
                                    this.meCards.children[index].getComponent('MauBinh.MeCard').offDrag();
                                }
                            } else {
                                this.getPlayerHouse(seatId).playFxXepXong();
                            }
                        }
                    }
                    break;
                case Cmd.Code.XEP_LAI:
                    {
                        App.instance.showLoading(false);
                        let res = new Cmd.ReceivedXepLai(data);
                        //  cc.log("MauBinh ReceivedXepLai res : ", JSON.stringify(res));

                        let chair = res["chair"];
                        let seatId = this.findPlayerSeatByPos(chair);
                        if (seatId != -1) {
                            if (seatId == 0) {
                                this.btnCombining.active = false;
                                this.btnSoChi.active = true;
                                this.getPlayerHouse(0).scaleCardReal(1);
                                for (let index = 0; index < 13; index++) {
                                    this.meCards.children[index].getComponent('MauBinh.MeCard').activeDrag();
                                }
                            } else {
                                this.getPlayerHouse(seatId).playFxDangXep();
                            }
                        }
                    }
                    break;
                case Cmd.Code.KET_THUC:
                    {
                        App.instance.showLoading(false);
                        let res = new Cmd.ReceivedEndGame(data);
                        //  cc.log("MauBinh ReceivedEndGame res : ", JSON.stringify(res));

                        this.actionHoldRoom();

                        this.unschedule(this.timeoutBetting);
                        this.actionBetting.active = false;

                        this.btnSoChi.active = false;
                        this.btnCombining.active = false;
                        this.tableCurrentChi.active = false;

                        for (let index = 0; index < 13; index++) {
                            this.meCards.children[index].getComponent('MauBinh.MeCard').offDrag();
                            this.meCards.children[index].getComponent('MauBinh.MeCard').resetState();
                        }

                        // {
                        //     "playerResultList": [
                        //         {
                        //             "chairIndex": 0,
                        //             "maubinhType": 7,
                        //             "chi1": [50, 49, 47, 45, 38],
                        //             "chi2": [35, 34, 33, 27, 23],
                        //             "chi3": [21, 15, 5],
                        //             "moneyInChi": [0, 0, 0],
                        //             "moneyAt": 0,
                        //             "moneyCommon": -120000,
                        //             "moneySap": 0,
                        //             "currentMoney": 18063610
                        //         },
                        //         {
                        //             "chairIndex": 1,
                        //             "maubinhType": 6,
                        //             "chi1": [39, 37, 36, 51, 41],
                        //             "chi2": [22, 20, 32, 29, 24],
                        //             "chi3": [16, 12, 4],
                        //             "moneyInChi": [0, 0, 0],
                        //             "moneyAt": 0,
                        //             "moneyCommon": 117600,
                        //             "moneySap": 0,
                        //             "currentMoney": 0
                        //         }
                        //     ],
                        //     "timeEndGame": 5
                        // }

                        let playerResultList = res["playerResultList"];
                        let timeEndGame = res["timeEndGame"];

                        this.unschedule(this.intervalBetting);
                        this.actionBetting.active = false;

                        // show Me cards
                        for (let index = 0; index < playerResultList.length; index++) {
                            let result = playerResultList[index];
                            let seatId = this.findPlayerSeatByPos(result.chairIndex);
                            if (seatId != -1 && seatId == 0) {
                                let totalCards = [
                                    result.chi3[0], result.chi3[1], result.chi3[2],
                                    result.chi2[0], result.chi2[1], result.chi2[2], result.chi2[3], result.chi2[4],
                                    result.chi1[0], result.chi1[1], result.chi1[2], result.chi1[3], result.chi1[4]
                                ];

                                for (let a = 0; a < 13; a++) {
                                    let spriteCardId = CardUtils.getNormalId(totalCards[a]);
                                    this.meCards.children[a].children[1].getComponent(cc.Sprite).spriteFrame = this.spriteCards[spriteCardId];
                                }
                                Configs.Login.Coin = result.currentMoney;
                                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            }
                        }

                        for (let index = 0; index < Cmd.Code.MAX_PLAYER; index++) {
                            this.getPlayerHouse(index).resetResultGame();
                            this.getPlayerHouse(index).prepareFxAction();
                        }

                        this.getPlayerHouse(0).scaleCardReal(0.45);
                        this.soChi(1, playerResultList);
                    }
                    break;
                case Cmd.Code.CHIA_BAI:
                    {
                        App.instance.showLoading(false);
                        let res = new Cmd.ReceivedChiaBai(data);
                        //  cc.log("MauBinh ReceivedChiaBai res : ", JSON.stringify(res));

                        // {
                        //     "cardList": [46, 42, 41, 35, 33, 31, 30, 23, 22, 15, 9, 5, 2],
                        //     "mauBinh": 6,
                        //     "gameId": 9859882,
                        //     "countdown": 60
                        // }

                        this.btnSoChi.active = false;
                        this.btnCombining.active = false;

                        let cardList = res["cardList"];
                        let mauBinh = res["mauBinh"];
                        let gameId = res["gameId"];
                        let countdown = res["countdown"];

                        clearTimeout(this.timeoutBetting);
                        this.timeoutBetting = setTimeout(() => {
                            this.startBettingCountDown(countdown);
                        }, 3000); // 2000

                        this.currentCard = cardList;
                        //  cc.log("MauBinh ReceivedChiaBai currentCard : ", this.currentCard);

                        let arrChiCuoi = [this.currentCard[0], this.currentCard[1], this.currentCard[2]];
                        let arrChiGiua = [this.currentCard[3], this.currentCard[4], this.currentCard[5], this.currentCard[6], this.currentCard[7]];
                        let arrChiDau = [this.currentCard[8], this.currentCard[9], this.currentCard[10], this.currentCard[11], this.currentCard[12]];
                        //  cc.log("Check currentCard ====================================== ");
                        this.logCard(this.currentCard);
                        this.logCard(arrChiCuoi);
                        this.logCard(arrChiGiua);
                        this.logCard(arrChiDau);

                        var arrSeatExist = this.getNumPlayers();
                        let numPlayer = arrSeatExist.length;

                        let cardDeal = 4;
                        // Open | Hide cards not use -> Mau binh nhieu la bai qua nen chi chia 4 la tuong trung
                        for (let index = 0; index < Cmd.Code.MAX_PLAYER * cardDeal; index++) { // 4 players * 4 cards
                            this.cardsDeal.children[index].active = index >= numPlayer * cardDeal ? false : true;
                            this.cardsDeal.children[index].setPosition(0, 0);
                        }

                        let timeShip = 0.1; // 0.15
                        // Move Cards used to each player joined
                        for (let a = 0; a < cardDeal; a++) { // players x 4 cards
                            for (let b = 0; b < numPlayer; b++) {
                                let seatId = arrSeatExist[b];
                                if (seatId !== -1) {
                                    let card4Me = this.cardsDeal.children[(a * numPlayer) + b];
                                    let rawPlayerPos = new cc.Vec2(this.groupPlayers.children[seatId].position.x,this.groupPlayers.children[seatId].position.y);
                                    //  cc.log("MauBinh CHIA_BAI delayTime : ", ((a * numPlayer) + b) * timeShip);
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
                        var maxDelay = (((cardDeal - 1) * numPlayer) + (numPlayer - 1)) * timeShip; // ((a * numPlayer) + b) * timeShip
                        let timeUnderLayer = (maxDelay + 0.2 + delayOver2Under) * 1000;
                        //  cc.log("CHIA_BAI timeUnderLayer : ", timeUnderLayer);
                        clearTimeout(this.timeoutChiaBaiDone);
                        this.timeoutChiaBaiDone = setTimeout(() => {
                            for (let index = 0; index < Cmd.Code.MAX_PLAYER * cardDeal; index++) { // 4 players * 3 cards
                                //  cc.log("CHIA_BAI cardsDeal index : ", index);
                                this.cardsDeal.children[index].active = false;
                            }

                            for (let index = 0; index < numPlayer; index++) {
                                let seatId = arrSeatExist[index];
                                if (seatId !== -1) {
                                    // Drop layer
                                    if (seatId == 0) {
                                        this.getPlayerHouse(seatId).resetCardReady(seatId);
                                        this.getPlayerHouse(seatId).showCardReal(false);
                                        this.getPlayerHouse(seatId).showCardReady(true);
                                        // Open Me cards
                                        this.getPlayerHouse(0).prepareToTransform();
                                        for (let a = 0; a < 13; a++) {
                                            //  cc.log("MauBinh cardId : ", cardList[a]);
                                            let spriteCardId = CardUtils.getNormalId(cardList[a]);
                                            let cardOpen = this.meCards.children[a];
                                            cardOpen.active = true;
                                            cardOpen.getComponent("MauBinh.MeCard").setupCard({
                                                pos: a,
                                                is_Upper: false,
                                                card: cardList[a]
                                            }, this.spriteCards[spriteCardId]);
                                            this.getPlayerHouse(0).transformToCardReal(a, this.spriteCards[spriteCardId], 0);
                                        }


                                        this.actionAutoBinhSoChi();
                                        this.btnSoChi.active = true;
                                        let isGood = mauBinh == Cmd.Code.TYPE_BINH_LUNG ? false : true;
                                        let typeName = this.getBinhName(mauBinh);
                                        this.getPlayerHouse(0).resetResultGame();
                                        if (mauBinh != Cmd.Code.TYPE_BINH_THUONG) {
                                            this.getPlayerHouse(0).playFxResultGeneral(0, isGood, typeName, 0);
                                        }
                                        for (let index = 0; index < numPlayer; index++) {
                                            if (arrSeatExist[index] != 0) {
                                                this.getPlayerHouse(arrSeatExist[index]).playFxDangXep();
                                            }
                                        }

                                        let x = new DetectPlayerCards();
                                        x.initCard(this.currentCard);
                                        let result = x.getPlayerCardsInfo(this.isTinhAce); // isTinhAce
                                        //  cc.log("completeMoveCard result : ", result);

                                        let arrChiCuoi = [this.currentCard[0], this.currentCard[1], this.currentCard[2]];
                                        let arrChiGiua = [this.currentCard[3], this.currentCard[4], this.currentCard[5], this.currentCard[6], this.currentCard[7]];
                                        let arrChiDau = [this.currentCard[8], this.currentCard[9], this.currentCard[10], this.currentCard[11], this.currentCard[12]];

                                        this.highLightCards(3, result.chiCuoi, arrChiCuoi);
                                        this.highLightCards(2, result.chiGiua, arrChiGiua);
                                        this.highLightCards(1, result.chiDau, arrChiDau);

                                        this.tableCurrentChi.active = true;
                                        this.tableCurrentChi.children[1].getComponent(cc.Label).string = "1. " + this.getChiName(result.chiDau);
                                        this.tableCurrentChi.children[2].getComponent(cc.Label).string = "2. " + this.getChiName(result.chiGiua);
                                        this.tableCurrentChi.children[3].getComponent(cc.Label).string = "3. " + this.getChiName(result.chiCuoi);

                                    } else {
                                        this.getPlayerHouse(seatId).showCardReal(true);
                                        this.getPlayerHouse(seatId).showCardReady(false);
                                    }
                                }
                            }
                        }, timeUnderLayer);
                    }
                    break;
                case Cmd.Code.TU_DONG_BAT_DAU:
                    {
                        App.instance.showLoading(false);
                        let res = new Cmd.ReceivedAutoStart(data);
                        //  cc.log("MauBinh ReceiveAutoStart res : ", JSON.stringify(res));
                        // {
                        //     "isAutoStart": true,
                        //     "timeAutoStart": 5
                        // }

                        if (res.isAutoStart) {
                            this.startWaittingCountDown(res.timeAutoStart);
                            this.btnSoChi.active = false;
                            this.btnCombining.active = false;
                            this.tableCurrentChi.active = false;
                            this.resetPlayersPlaying();
                            for (let index = 0; index < Cmd.Code.MAX_PLAYER; index++) {
                                this.getPlayerHouse(index).resetResultGame();
                            }
                            this.fxSoChiTotal.stopAllActions();
                            this.fxSoChiTotal.active = false;
                        }
                    }
                    break;
                case Cmd.Code.THONG_TIN_BAN_CHOI:
                    {
                        App.instance.showLoading(false);
                        let res = new Cmd.ReceivedGameInfo(data);
                        //  cc.log("MauBinh ReceivedGameInfo res : ", JSON.stringify(res));

                        // Reconnect
                        this.closeUIRoom();
                        this.showUIPlaying();
                        this.closeUIChat();

                        // {
                        //     "myChair": 3,
                        //     "gameState": 1,
                        //     "gameAction": 2,
                        //     "countdownTime": 46,
                        //     "moneyBet": 500,
                        //     "moneyType": 1,
                        //     "gameId": 5556609,
                        //     "roomId": 94,
                        //     "rule": 0,
                        //     "hasInfo": [true, true, true, true],
                        //     "players": [
                        //         {
                        //             "sochi": false,
                        //             "status": 3,
                        //             "avatar": "3",
                        //             "userId": 114,
                        //             "nickName": "toichangcogi",
                        //             "currentMoney": 6223085
                        //         },
                        //         {
                        //             "sochi": false,
                        //             "status": 3,
                        //             "avatar": "4",
                        //             "userId": 403,
                        //             "nickName": "traulucxc",
                        //             "currentMoney": 863887
                        //         },
                        //         {
                        //             "sochi": false,
                        //             "status": 3,
                        //             "avatar": "1",
                        //             "userId": 6789589,
                        //             "nickName": "Napgame",
                        //             "currentMoney": 1025000
                        //         },
                        //         {
                        //             "cardList": [21, 20, 1, 0, 19, 27, 24, 42, 39, 28, 45, 44, 49],
                        //             "sochi": false,
                        //             "status": 3,
                        //             "avatar": "6",
                        //             "userId": 6790894,
                        //             "nickName": "vn_star",
                        //             "currentMoney": 1000000
                        //         }
                        //     ]
                        // }

                        let myChair = res["myChair"];
                        let gameState = res["gameState"];
                        let gameAction = res["gameAction"];
                        let countDownTime = res["countDownTime"];
                        let moneyBet = res["moneyBet"];
                        let moneyType = res["moneyType"];
                        let gameId = res["gameId"];
                        let roomId = res["roomId"];
                        let rule = res["rule"];
                        let hasInfo = res["hasInfo"];
                        let players = res["players"];

                        this.labelRoomId.string = "MẬU BINH - PHÒNG: " + roomId;
                        this.labelRoomBet.string = "MỨC CƯỢC: " + Utils.formatNumber(moneyBet) + "$";

                        this.currentRoomBet = moneyBet;

                        this.isTinhAce = rule == 1 ? true : false;

                        this.currentCard = players[myChair].cardList;

                        configPlayer[0].playerId = Configs.Login.Nickname;
                        configPlayer[0].playerPos = myChair;
                        //  cc.log("MauBinh setupMatch configPlayer Me : ", configPlayer[0]);
                        //  cc.log("MauBinh setupMatch configPlayer  : ", configPlayer);

                        var numPlayers = 0;
                        var arrPlayerPosExist = [];

                        for (let index = 0; index < hasInfo.length; index++) {
                            if (hasInfo[index]) {
                                numPlayers += 1;
                                arrPlayerPosExist.push(index);
                            }
                        }
                        //  cc.log("MauBinh numPlayers : ", numPlayers);

                        // setup configPlayer
                        for (let a = 0; a < configPlayer.length; a++) {
                            configPlayer[a].playerPos = defaultPlayerPos[myChair][a];
                        }

                        // set State of Seat : Yes | No exist Player
                        for (let index = 0; index < configPlayer.length; index++) {
                            let findPos = arrPlayerPosExist.indexOf(configPlayer[index].playerPos);

                            var seatId = configPlayer[index].seatId;
                            this.getPlayerHouse(seatId).resetPlayerInfo(seatId);

                            if (findPos > -1) {
                                // Exist player -> Set Player Info
                                this.setupSeatPlayer(seatId, {
                                    nickName: players[findPos].nickName,
                                    avatar: parseInt(players[findPos].avatar),
                                    money: players[findPos].currentMoney
                                });

                                if (players[findPos].status == Cmd.Code.PLAYER_STATUS_VIEWER) {
                                    configPlayer[seatId].isViewer = true;
                                    this.getPlayerHouse(seatId).setIsViewer(true);
                                    this.getPlayerHouse(seatId).playFxViewer();
                                } else {
                                    configPlayer[seatId].isViewer = false;
                                    this.getPlayerHouse(seatId).setIsViewer(false);
                                    if (seatId != 0) {
                                        this.getPlayerHouse(seatId).showCardReady(false);
                                        this.getPlayerHouse(seatId).showCardReal(true);
                                        if (players[findPos].sochi) {
                                            this.getPlayerHouse(seatId).playFxXepXong();
                                        } else {
                                            this.getPlayerHouse(seatId).playFxDangXep();
                                        }
                                    } else {
                                        this.btnSoChi.active = !players[findPos].sochi;
                                        this.btnCombining.active = players[findPos].sochi;
                                    }
                                }
                            } else {
                                // Not Exist player  -> Active Btn Add player
                                this.getPlayerHouse(seatId).showBtnInvite(true);
                                configPlayer[index].isViewer = true;
                            }
                        }

                        // Open Me cards
                        if (this.currentCard.length > 0) {
                            this.getPlayerHouse(0).showCardReady(false);
                            this.getPlayerHouse(0).prepareToTransform();
                            for (let a = 0; a < this.currentCard.length; a++) {
                                //  cc.log("Poker cardId : ", this.currentCard[a]);
                                let spriteCardId = CardUtils.getNormalId(this.currentCard[a]);
                                this.getPlayerHouse(0).transformToCardReal(a, this.spriteCards[spriteCardId], 0);
                            }
                        }

                        if (gameState == Cmd.Code.STATE_PLAYING) {
                            this.startBettingCountDown(countDownTime);
                        }
                    }
                    break;
                case Cmd.Code.DANG_KY_THOAT_PHONG:
                    {
                        App.instance.showLoading(false);
                        let res = new Cmd.ReceivedNotifyRegOutRoom(data);
                        //  cc.log("MauBinh ReceivedNotifyRegOutRoom res : ", JSON.stringify(res));
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
                case Cmd.Code.MOI_DAT_CUOC:
                    {
                        App.instance.showLoading(false);
                        let res = new Cmd.ReceivedMoiDatCuoc(data);
                        //  cc.log("MauBinh ReceivedMoiDatCuoc res : ", JSON.stringify(res));
                        // {
                        //     "timeDatCuoc": 20
                        //   }
                        this.startBettingCountDown(res.timeDatCuoc);

                        if (this.seatOwner == 0) { // Me la Chuong -> K dc bet va k dc vao ga
                            this.btnSoChi.active = false;
                            this.btnCombining.active = false;

                        } else {
                            this.btnSoChi.active = true;
                            this.btnCombining.active = true;

                        }
                    }
                    break;
                case Cmd.Code.CHEAT_CARDS:
                    {
                        App.instance.showLoading(false);
                        //  cc.log("MauBinh CHEAT_CARDS");
                    }
                    break;
                case Cmd.Code.DANG_KY_CHOI_TIEP:
                    {
                        App.instance.showLoading(false);
                        //  cc.log("MauBinh DANG_KY_CHOI_TIEP");
                    }
                    break;
                case Cmd.Code.UPDATE_OWNER_ROOM:
                    {
                        App.instance.showLoading(false);
                        //  cc.log("MauBinh UPDATE_OWNER_ROOM");
                    }
                    break;
                case Cmd.Code.JOIN_ROOM_SUCCESS:
                    {
                        //  cc.log("MauBinh JOIN_ROOM_SUCCESS");
                        App.instance.showLoading(false);
                        let res = new Cmd.ReceivedJoinRoomSucceed(data);
                        this.closeUIRoom();
                        this.setupMatch(res);
                    }
                    break;
                case Cmd.Code.LEAVE_GAME:
                    {
                        App.instance.showLoading(false);
                        let res = new Cmd.ReceivedUserLeaveRoom(data);
                        //  cc.log("MauBinh ReceivedUserLeaveRoom res : ", JSON.stringify(res));

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
                            this.getPlayerHouse(seatId).resetPlayerInfo(seatId);
                            this.getPlayerHouse(seatId).showBtnInvite(true);

                            let arrSeatExistLast = this.getNumPlayers();
                            if (arrSeatExistLast.length == 1) {
                                this.resetPlayersPlaying();
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
                case Cmd.Code.NOTIFY_KICK_FROM_ROOM:
                    {
                        App.instance.showLoading(false);
                        let res = new Cmd.ReceivedKickOff(data);
                        //  cc.log("MauBinh ReceivedKickOff res : ", JSON.stringify(res));
                    }
                    break;
                case Cmd.Code.NEW_USER_JOIN:
                    {
                        App.instance.showLoading(false);
                        let res = new Cmd.ReceivedUserJoinRoom(data);
                        //  cc.log("MauBinh ReceivedUserJoinRoom res : ", JSON.stringify(res));
                        // {
                        //     "info": {
                        //       "nickName": "Ahoang88",
                        //       "avatar": "7",
                        //       "money": 10230080
                        //     },
                        //     "myChair": 5,
                        //     "uStatus": 1
                        //   }

                        let info = res["info"];
                        let myChair = res["myChair"];
                        let uStatus = res["uStatus"];

                        // set State of Seat : Yes | No exist Player
                        for (let index = 0; index < configPlayer.length; index++) {
                            if (configPlayer[index].playerPos == myChair) {
                                // Exist player -> Set Player Info
                                var seatId = configPlayer[index].seatId;
                                this.getPlayerHouse(seatId).resetPlayerInfo(seatId);
                                var customPlayerInfo = {
                                    "avatar": info["avatar"],
                                    "nickName": info["nickName"],
                                    "money": info["money"],
                                }

                                this.setupSeatPlayer(seatId, customPlayerInfo);

                                if (uStatus == Cmd.Code.PLAYER_STATUS_VIEWER) {
                                    configPlayer[seatId].isViewer = true;
                                    this.getPlayerHouse(seatId).setIsViewer(true);
                                    this.getPlayerHouse(seatId).playFxViewer();
                                } else {
                                    configPlayer[seatId].isViewer = false;
                                    this.getPlayerHouse(seatId).setIsViewer(false);
                                }
                            }
                        }
                    }
                    break;
                case Cmd.Code.NOTIFY_USER_GET_JACKPOT:
                    {
                        App.instance.showLoading(false);
                        //  cc.log("MauBinh NOTIFY_USER_GET_JACKPOT");
                    }
                    break;
                case Cmd.Code.UPDATE_MATCH:
                    {
                        App.instance.showLoading(false);
                        let res = new Cmd.ReceivedUpdateMatch(data);
                        //  cc.log("MauBinh ReceivedUpdateMatch res : ", JSON.stringify(res));
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

                        //  cc.log("MauBinh setupMatch configPlayer : ", configPlayer);
                        // theo Pos khong phai SeatId
                        for (let index = 0; index < hasInfo.length; index++) {
                            let pos = configPlayer[index]["playerPos"];
                            if (hasInfo[pos]) {
                                // setGold se inactive isViewer nen dat no len dau de ben duoi config lai
                                this.getPlayerHouse(index).setGold(infos[pos]["money"]);
                                configPlayer[index]["playerId"] = infos[pos]["nickName"];
                                if (infos[pos]["status"] == Cmd.Code.PLAYER_STATUS_SITTING || infos[pos]["status"] == Cmd.Code.PLAYER_STATUS_PLAYING) {
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
                        //  cc.log("MauBinh setupMatch configPlayer : ", configPlayer);
                    }
                    break;
                case Cmd.Code.CHAT_ROOM:
                    {
                        App.instance.showLoading(false);
                        let res = new Cmd.ReceivedChatRoom(data);
                        //  cc.log("MauBinh CHAT_ROOM res : ", JSON.stringify(res));

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
        MauBinhNetworkClient.getInstance().send(new Cmd.CmdSendRequestLeaveGame());
    }

    actionHoldRoom() {
        MauBinhNetworkClient.getInstance().send(new Cmd.CmdSendHoldRoom());
    }

    actionBaoBinh() {
        this.btnSoChi.active = false;
        this.btnCombining.active = true;
        MauBinhNetworkClient.getInstance().send(new Cmd.SendBaoBinh());
    }

    actionBinhSoChi() {
        let arrChiCuoi = [this.currentCard[0], this.currentCard[1], this.currentCard[2]];
        let arrChiGiua = [this.currentCard[3], this.currentCard[4], this.currentCard[5], this.currentCard[6], this.currentCard[7]];
        let arrChiDau = [this.currentCard[8], this.currentCard[9], this.currentCard[10], this.currentCard[11], this.currentCard[12]];

        //  cc.log("Check currentCard ============================== ");
        this.logCard(this.currentCard);
        this.logCard(arrChiCuoi);
        this.logCard(arrChiGiua);
        this.logCard(arrChiDau);

        MauBinhNetworkClient.getInstance().send(new Cmd.SendBinhSoChi(arrChiDau, arrChiGiua, arrChiCuoi));
    }

    actionAutoBinhSoChi() {
        return; // Open will error -> Me auto leave room 
        let arrChiCuoi = [this.currentCard[0], this.currentCard[1], this.currentCard[2]];
        let arrChiGiua = [this.currentCard[3], this.currentCard[4], this.currentCard[5], this.currentCard[6], this.currentCard[7]];
        let arrChiDau = [this.currentCard[8], this.currentCard[9], this.currentCard[10], this.currentCard[11], this.currentCard[12]];

        MauBinhNetworkClient.getInstance().send(new Cmd.SendAutoBinhSoChi(arrChiDau, arrChiGiua, arrChiCuoi));
    }

    actionXepLai() {
        this.btnSoChi.active = true;
        this.btnCombining.active = false;
        MauBinhNetworkClient.getInstance().send(new Cmd.SendXepLai());
    }

    cardSelect(card_info, card_pos, card_Id) {
        //  cc.log("cardSelect card_info : ", card_info.card);
        //  cc.log("cardSelect card_pos  : ", card_pos);
        //  cc.log("cardSelect card_id  : ", card_Id);

        this.cardMove.active = true;
        this.cardMove.setPosition(card_pos.x, card_pos.y - 95);
        let spriteCardId = CardUtils.getNormalId(card_info.card);
        this.cardMove.children[0].getComponent(cc.Sprite).spriteFrame = this.spriteCards[spriteCardId];

        this.cardMoveId = card_Id;
        this.cardMoveValue = card_info.card;

        this.getPlayerHouse(0).resetResultGame();
        for (let a = 0; a < 13; a++) {
            this.meCards.children[a].getComponent("MauBinh.MeCard").setCardShadow(false);
            this.getPlayerHouse(0).shadowCard(a, false);
        }
    }

    showMoveTarget(targetName) {
        //  cc.log("showMoveTarget : ", targetName);
        for (let index = 0; index < 13; index++) {
            let cardTarget = this.meCards.children[index].getComponent("MauBinh.MeCard");
            if (index == targetName) {
                cardTarget.setCardShadow(false);
                cardTarget.setCardFocus(true);
            } else {
                cardTarget.setCardShadow(true);
                cardTarget.setCardFocus(false);
            }
        }
    }

    completeMoveCard(targetName) {
        /* Id value - Node 
        0,1,2         chiCuoi
        3,4,5,6,7     chiGiua
        8,9,10,11,12     chiDau
        */

        //  cc.log("completeMoveCard from id   : ", this.cardMoveId);
        //  cc.log("completeMoveCard target id : ", targetName);

        //  cc.log("completeMoveCard from info   : ", this.currentCard[this.cardMoveId]);
        //  cc.log("completeMoveCard target info : ", this.currentCard[targetName]);

        let cardFrom = this.currentCard[this.cardMoveId];
        let cardTo = this.currentCard[targetName];
        //  cc.log("completeMoveCard cardFrom 1 : ", cardFrom);
        //  cc.log("completeMoveCard cardTo   1 : ", cardTo);
        this.currentCard[this.cardMoveId] = cardTo;
        this.currentCard[targetName] = cardFrom;
        //  cc.log("completeMoveCard cardFrom 2 : ", this.currentCard[this.cardMoveId]);
        //  cc.log("completeMoveCard cardTo 2   : ", this.currentCard[targetName]);

        //  cc.log("completeMoveCard currentCard : ", this.currentCard);

        for (let index = 0; index < 13; index++) {
            let card_id = this.currentCard[index];      // {"card":4,"face":2}
            let spriteCardId = CardUtils.getNormalId(card_id);
            let src = this.spriteCards[spriteCardId];
            let card_Open = this.meCards.children[index];
            card_Open.active = true;
            card_Open.getComponent("MauBinh.MeCard").updateCard(card_id, src);
        }

        this.cardMoveValue = "";
        this.cardMoveId = -1;

        let x = new DetectPlayerCards();
        x.initCard(this.currentCard);
        let result = x.getPlayerCardsInfo(this.isTinhAce); // isTinhAce
        //  cc.log("completeMoveCard result : ", result);

        let isGood = result.cardType == Cmd.Code.TYPE_BINH_LUNG ? false : true;
        let typeName = this.getBinhName(result.cardType);
        this.getPlayerHouse(0).resetResultGame();
        if (result.cardType != Cmd.Code.TYPE_BINH_THUONG) {
            this.getPlayerHouse(0).playFxResultGeneral(0, isGood, typeName, 0);
        }

        let arrChiCuoi = [this.currentCard[0], this.currentCard[1], this.currentCard[2]];
        let arrChiGiua = [this.currentCard[3], this.currentCard[4], this.currentCard[5], this.currentCard[6], this.currentCard[7]];
        let arrChiDau = [this.currentCard[8], this.currentCard[9], this.currentCard[10], this.currentCard[11], this.currentCard[12]];

        //  cc.log("Check currentCard =======================================");
        this.logCard(this.currentCard);
        this.logCard(arrChiCuoi);
        this.logCard(arrChiGiua);
        this.logCard(arrChiDau);

        this.highLightCards(3, result.chiCuoi, arrChiCuoi);
        this.highLightCards(2, result.chiGiua, arrChiGiua);
        this.highLightCards(1, result.chiDau, arrChiDau);

        this.tableCurrentChi.active = true;
        this.tableCurrentChi.children[1].getComponent(cc.Label).string = "1. " + this.getChiName(result.chiDau);
        this.tableCurrentChi.children[2].getComponent(cc.Label).string = "2. " + this.getChiName(result.chiGiua);
        this.tableCurrentChi.children[3].getComponent(cc.Label).string = "3. " + this.getChiName(result.chiCuoi);

        this.actionAutoBinhSoChi();
    }

    highLightCards(chiId, groupKind, cardList) {
        let start = -1;
        let end = -1;
        if (chiId == 3) {
            start = 0;
            end = 3;
        } else if (chiId == 2) {
            start = 3;
            end = 8;
        } else {
            start = 8;
            end = 13;
        }

        for (var a = start; a < end; a++) this.getPlayerHouse(0).shadowCard(a, true);

        switch (groupKind) {
            case Cmd.Code.GROUP_THUNG_PHA_SANH:
            case Cmd.Code.GROUP_CU_LU:
            case Cmd.Code.GROUP_THUNG:
            case Cmd.Code.GROUP_SANH:
                for (var a = start; a < end; a++) this.getPlayerHouse(0).shadowCard(a, false);
                break;
            case Cmd.Code.GROUP_TU_QUY:
            case Cmd.Code.GROUP_SAM_CO:
            case Cmd.Code.GROUP_MOT_DOI:
            case Cmd.Code.GROUP_MAU_THAU:
                for (let a = 0; a < cardList.length - 1; a++) {
                    for (let b = a + 1; b < cardList.length; b++) {
                        if (CardUtils.getNumber(cardList[a]) == CardUtils.getNumber(cardList[b])) {
                            this.getPlayerHouse(0).shadowCard(a + start, false);
                            this.getPlayerHouse(0).shadowCard(b + start, false);
                        }
                    }
                }
                break;
            case Cmd.Code.GROUP_THU:
                for (let a = 0; a < cardList.length - 1; a++) {
                    for (let b = a + 1; b < cardList.length; b++) {
                        if (CardUtils.getNumber(cardList[a]) == CardUtils.getNumber(cardList[b])) {
                            this.getPlayerHouse(0).shadowCard(a + start, false);
                            this.getPlayerHouse(0).shadowCard(b + start, false);
                        }
                    }
                }
                // for (a = 0; a < cardList.length; a++) {
                //     cardList[a] != cardList[0] && cardList[a] != cardList[1] || this.getPlayerHouse(0).shadowCard(a + start, false);
                // }
                break;
            default:
                break;
        }
    }

    // State
    initConfigPlayer() {
        configPlayer = [];
        for (let index = 0; index < Cmd.Code.MAX_PLAYER; index++) {
            configPlayer.push({
                seatId: index,
                playerId: -1,
                playerPos: -1,
                isViewer: true
            });
        }
        //  cc.log("MauBinh configPlayer : ", configPlayer);
    }

    resetPlayersPlaying() {
        for (let index = 0; index < Cmd.Code.MAX_PLAYER; index++) {
            this.getPlayerHouse(index).resetMatchHistory(index);
        }
    }

    // handle Game Players
    setupSeatPlayer(seatId, playerInfo) {
        //  cc.log("MauBinh setupSeatPlayer playerInfo : ", playerInfo);
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
        return this.groupPlayers.children[seatId].getComponent("MauBinh.Player");
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

    getBinhName(maubinhType) {
        let name = "";
        switch (maubinhType) {
            case Cmd.Code.TYPE_SANH_RONG:
                name = "Sảnh Rồng";
                break;
            case Cmd.Code.TYPE_MUOI_BA_CAY_DONG_MAU:
                name = "Mười Ba Cây Đồng Màu";
                break;
            case Cmd.Code.TYPE_MUOI_HAI_CAY_DONG_MAU:
                name = "Mười Hai Cây Đồng Màu";
                break;
            case Cmd.Code.TYPE_BA_CAI_THUNG:
                name = "Ba Cái Thùng";
                break;
            case Cmd.Code.TYPE_BA_CAI_SANH:
                name = "Ba Cái Sảnh";
                break;
            case Cmd.Code.TYPE_LUC_PHE_BON:
                name = "Lục Phế Bôn";
                break;
            case Cmd.Code.TYPE_BINH_THUONG:
                name = "Binh Thường";
                break;
            case Cmd.Code.TYPE_BINH_LUNG:
                name = "Binh Lủng";
                break;
            default:
                break;
        }
        return name;
    }

    needSoChi(playerResultList) {
        let a = 0;
        for (var b = 0; b < playerResultList.length; b++) {
            if (playerResultList[b].maubinhType == Cmd.Code.TYPE_BINH_THUONG) {
                a++;
            }
        }
        return 2 <= a;
    }

    needShowMoneyWhenSoChi(playerResultList) {
        for (var a = 0; a < playerResultList.length; a++) {
            var b = playerResultList[a];
            if (0 == b.chairIndex && b.maubinhType != Cmd.Code.TYPE_BINH_THUONG) return !1
        }
        return !0
    }

    needBatSap(playerResultList) {
        for (var a = 0; a < playerResultList.length; a++)
            if (0 != playerResultList[a].moneySap) return !0;
        return !1
    }

    soChi(chiId, playerResultList) {
        //  cc.log("MauBinh soChi id : ", chiId);

        // hide result chi 1 - 3 : not hide general
        for (let index = 0; index < Cmd.Code.MAX_PLAYER; index++) {
            this.getPlayerHouse(index).resetResultChi(1);
            this.getPlayerHouse(index).resetResultChi(2);
            this.getPlayerHouse(index).resetResultChi(3);
        }

        let isNeedSoChi = this.needSoChi(playerResultList);
        let isNeedShowMoneyWhenSoChi = this.needShowMoneyWhenSoChi(playerResultList);
        //  cc.log("MauBinh soChi isNeedSoChi : ", isNeedSoChi);
        //  cc.log("MauBinh soChi isNeedShowMoneyWhenSoChi : ", isNeedShowMoneyWhenSoChi);

        for (let index = 0; index < playerResultList.length; index++) {
            let result = playerResultList[index];
            let chair = result['chairIndex'];

            let totalCards = [
                result.chi3[0], result.chi3[1], result.chi3[2],
                result.chi2[0], result.chi2[1], result.chi2[2], result.chi2[3], result.chi2[4],
                result.chi1[0], result.chi1[1], result.chi1[2], result.chi1[3], result.chi1[4]
            ];
            let x = new DetectPlayerCards();
            x.initCard(totalCards);
            let playerCardInfo = x.getPlayerCardsInfo(this.isTinhAce); // isTinhAce
            //  cc.log("soChi playerCardInfo : ", playerCardInfo);

            let seatId = this.findPlayerSeatByPos(chair);
            if (seatId != -1) {
                //  cc.log("soChi seatId : ", seatId);
                //  cc.log("soChi maubinhType : ", result.maubinhType);
                if (result.maubinhType == Cmd.Code.TYPE_BINH_THUONG && isNeedSoChi) {
                    // So Chi -> Show card tung chi 1
                    //  cc.log("soChi case 1");
                    let spriteId = -1;
                    let goldChi = result.moneyInChi[chiId - 1];
                    if (chiId == 1) {
                        spriteId = playerCardInfo.chiDau;
                    } else if (chiId == 2) {
                        spriteId = playerCardInfo.chiGiua;
                    } else {
                        spriteId = playerCardInfo.chiCuoi;
                    }
                    this.getPlayerHouse(seatId).playFxCompareChi(chiId, this.spriteGroupCard[spriteId]);
                    if (isNeedShowMoneyWhenSoChi) {
                        this.getPlayerHouse(seatId).playFxGoldSoChi(goldChi);
                    }

                    // Show cards chi
                    if (chiId == 3) {
                        for (var a = 0; a < 3; a++) {
                            let spriteCardId = CardUtils.getNormalId(result.chi3[a]);
                            this.getPlayerHouse(seatId).prepareCardReal(a);
                            this.getPlayerHouse(seatId).transformToCardReal(a, this.spriteCards[spriteCardId], seatId);
                        }

                        setTimeout(() => {
                            let totalGoldChi = result.moneyInChi[0] + result.moneyInChi[1] + result.moneyInChi[2];
                            if (totalGoldChi >= 0) {
                                this.getPlayerHouse(seatId).playFxWinSoChi(totalGoldChi);
                            } else {
                                this.getPlayerHouse(seatId).playFxLoseSoChi(totalGoldChi);
                            }
                        }, 2500);
                    } else if (chiId == 2) {
                        for (var a = 0; a < 5; a++) {
                            let spriteCardId = CardUtils.getNormalId(result.chi2[a]);
                            this.getPlayerHouse(seatId).prepareCardReal(a + 3);
                            this.getPlayerHouse(seatId).transformToCardReal(a + 3, this.spriteCards[spriteCardId], seatId);
                        }
                    } else {
                        for (var a = 0; a < 5; a++) {
                            let spriteCardId = CardUtils.getNormalId(result.chi1[a]);
                            this.getPlayerHouse(seatId).prepareCardReal(a + 8);
                            this.getPlayerHouse(seatId).transformToCardReal(a + 8, this.spriteCards[spriteCardId], seatId);
                        }
                    }
                } else {
                    // Khong can So chi -> Show tat card ra
                    //  cc.log("soChi case 2");
                    if (chiId == 1) {
                        //  // show All cards
                        //  cc.log("soChi case 2 chiId == 1");
                        if (result.maubinhType == Cmd.Code.TYPE_BINH_THUONG) {
                            // show Binh Type
                            //  cc.log("soChi case 2 chiId == 1 = TYPE_BINH_THUONG");
                            if (playerCardInfo.chiDau < 2) {
                                this.getPlayerHouse(seatId).playFxCompareChi(chiId, this.spriteGroupCard[playerCardInfo.chiDau]);
                            }

                            if (playerCardInfo.chiGiua < 2) {
                                this.getPlayerHouse(seatId).playFxCompareChi(chiId, this.spriteGroupCard[playerCardInfo.chiGiua]);
                            }

                            if (playerCardInfo.chiGiua == Cmd.Code.GROUP_SAM_CO) {
                                this.getPlayerHouse(seatId).playFxCompareChi(chiId, this.spriteGroupCard[playerCardInfo.chiCuoi]);
                            }
                        } else {
                            let isGood = result.maubinhType == Cmd.Code.TYPE_BINH_LUNG ? false : true;
                            let typeName = this.getBinhName(result.maubinhType);
                            this.getPlayerHouse(seatId).resetResultGame();
                            this.getPlayerHouse(seatId).playFxResultGeneral(seatId, isGood, typeName, 1);
                        }

                        let totalCards = [
                            result.chi3[0], result.chi3[1], result.chi3[2],
                            result.chi2[0], result.chi2[1], result.chi2[2], result.chi2[3], result.chi2[4],
                            result.chi1[0], result.chi1[1], result.chi1[2], result.chi1[3], result.chi1[4]
                        ];

                        for (let a = 0; a < 13; a++) {
                            let spriteCardId = CardUtils.getNormalId(totalCards[a]);
                            if (seatId == 0) {
                                this.meCards.children[a].children[1].getComponent(cc.Sprite).spriteFrame = this.spriteCards[spriteCardId];
                            } else {
                                this.getPlayerHouse(seatId).prepareToTransform();
                                this.getPlayerHouse(seatId).transformToCardReal(a, this.spriteCards[spriteCardId], seatId);
                            }
                        }

                    }
                }
            }
            if (seatId == 0) {
                for (let a = 0; a < 13; a++) {
                    this.getPlayerHouse(0).shadowCard(a, false);
                    this.meCards.children[a].getComponent("MauBinh.MeCard").setCardShadow(false);
                }
            }
        }

        if (isNeedSoChi) {
            this.node.stopAllActions();
            this.node.runAction(
                cc.sequence(
                    cc.delayTime(2.5), //3s
                    cc.callFunc(() => {
                        if (chiId < 3) {
                            //  cc.log("soChi showGoldResult recall soChi");
                            this.soChi(chiId + 1, playerResultList);
                        } else {
                            //  cc.log("soChi showGoldResult no recall soChi");
                            this.showGoldResult(playerResultList, 2000);
                            this.batSap(playerResultList);
                        }
                    })
                )
            )
        } else {
            // show Gold
            this.showGoldResult(playerResultList, 1000);
            this.batSap(playerResultList);
        }
    }

    showGoldResult(playerResultList, delayTime) {
        setTimeout(() => {
            for (let index = 0; index < playerResultList.length; index++) {
                let result = playerResultList[index];
                let chair = result['chairIndex'];
                let seatId = this.findPlayerSeatByPos(chair);

                if (seatId != -1) {
                    this.getPlayerHouse(seatId).resetResultGame();
                    if (result.moneyCommon >= 0) {
                        // Win
                        this.getPlayerHouse(seatId).fxWin({
                            moneyChange: result.moneyCommon,
                            money: result.currentMoney == 0 ? -1 : result.currentMoney
                        });
                    } else {
                        // Lose
                        this.getPlayerHouse(seatId).fxLose({
                            moneyChange: result.moneyCommon,
                            money: result.currentMoney == 0 ? -1 : result.currentMoney
                        });
                    }
                }
            }
        }, delayTime);
    }

    batSap(playerResultList) {
        //  cc.log("soChi batSap");
        if (this.needBatSap(playerResultList)) {
            let countWin = 0;
            let countLose = 0;
            for (let index = 0; index < playerResultList.length; index++) {
                let seatId = this.findPlayerSeatByPos(playerResultList[index].chairIndex);
                if (seatId != -1 && seatId != 0) {
                    if (playerResultList[index].moneySap > 0) {
                        countLose += 1;
                    } else {
                        if (playerResultList[index].moneySap < 0) {
                            countWin += 1;
                        }
                    }
                }
            }

            this.fxSoChiTotal.active = false;

            for (let index = 0; index < playerResultList.length; index++) {
                let seatId = this.findPlayerSeatByPos(playerResultList[index].chairIndex);
                if (seatId == 0) {
                    if (countLose > 0) {
                        this.fxSoChiTotal.active = true;
                        if (countLose == 3) {
                            // bi_sap_lang
                            this.fxSoChiTotal.getComponent(cc.Sprite).spriteFrame = this.spriteSoChiTotal[1];
                        } else {
                            // sap_3_chi
                            this.fxSoChiTotal.getComponent(cc.Sprite).spriteFrame = this.spriteSoChiTotal[2];
                        }
                        this.fxSoChiTotal.runAction(
                            cc.sequence(
                                cc.scaleTo(0.25, 1.1, 1.1),
                                cc.scaleTo(0.25, 1, 1),
                                cc.scaleTo(0.25, 1.1, 1.1),
                                cc.scaleTo(0.25, 1, 1)
                            )
                        );
                        setTimeout(() => {
                            this.fxSoChiTotal.stopAllActions();
                            this.fxSoChiTotal.active = false;
                        }, 2000);
                    }

                    if (countWin > 0) {
                        this.fxSoChiTotal.active = true;
                        if (countWin == 3) {
                            // bat_sap_lang
                            this.fxSoChiTotal.getComponent(cc.Sprite).spriteFrame = this.spriteSoChiTotal[1];
                            this.fxSoChiTotal.runAction(
                                cc.sequence(
                                    cc.scaleTo(0.25, 1.1, 1.1),
                                    cc.scaleTo(0.25, 1, 1),
                                    cc.scaleTo(0.25, 1.1, 1.1),
                                    cc.scaleTo(0.25, 1, 1)
                                )
                            );
                            setTimeout(() => {
                                this.fxSoChiTotal.stopAllActions();
                                this.fxSoChiTotal.active = false;
                            }, 2000);
                        } else {

                        }
                    }
                } else {
                    if (playerResultList[index].moneySap < 0) {
                        // sap_3_chi
                        this.getPlayerHouse(seatId).playFxSoChiTotal(this.spriteSoChiTotal[2]);
                    }
                }
            }
        } else {
            this.soAt();
        }
    }

    soAt() {
        if (true) {
            // so At
        } else {
            // Tinh tien chung
        }
    }

    getChiName(id) {
        let name = "";
        switch (id) {
            case Cmd.Code.GROUP_THUNG_PHA_SANH:
                name = "Thùng Phá Sảnh";
                break;
            case Cmd.Code.GROUP_TU_QUY:
                name = "Tứ Quý";
                break;
            case Cmd.Code.GROUP_CU_LU:
                name = "Cù Lũ";
                break;
            case Cmd.Code.GROUP_THUNG:
                name = "Thùng";
                break;
            case Cmd.Code.GROUP_SANH:
                name = "Sảnh";
                break;
            case Cmd.Code.GROUP_SAM_CO:
                name = "Sám Cô";
                break;
            case Cmd.Code.GROUP_THU:
                name = "Thú";
                break;
            case Cmd.Code.GROUP_MOT_DOI:
                name = "Một Đôi";
                break;
            case Cmd.Code.GROUP_MAU_THAU:
                name = "Mậu Thầu";
                break;
            default:
                break;
        }
        return name;
    }


    logCard(arrCard) {
        let result = "";
        for (let index = 0; index < arrCard.length; index++) {
            let num = Math.floor(arrCard[index] / 4) + 2;
            let face = arrCard[index] % 4;

            switch (num) {
                case 14:
                    result += "A";
                    break;
                case 13:
                    result += "K";
                    break;
                case 12:
                    result += "Q";
                    break;
                case 11:
                    result += "J";
                    break;
                default:
                    result += num;
                    break;
            }

            switch (face) {
                case 0:
                    result += "♠ "; //B
                    break;
                case 1:
                    result += "♣ "; //T
                    break;
                case 2:
                    result += "♦ "; //R
                    break;
                case 3:
                    result += "♥ "; //C
                    break;
                default:
                    break;
            }
        }
        //  cc.log("Check currentCard Visual : ", result);
    }

    update(dt) { }
}
