import Utils from "../Script/common/Utils";
import GameData from "../Script/games/GameData";
import TienLenConstant from "./TienLen.Constant";
import Player from "./TienLen.Player";

export default class TienLenGameLogic {
    static instance: TienLenGameLogic;

    roomOwnerID = 0;
    roomOwner = 0;
    bet = 0;
    myChair = -1;
    roomLock = !1;
    roomId = 0;
    roomIndex = 0;
    roomJackpot = 0;
    players = [];
    gameState = -1;
    typeToiTrang = 0;
    timeBaoSam = 0;
    timeAutoStart = 0;
    cardChiabai = [];
    cardDanhBai = [];
    firstTurnCards = [];
    changeTurnChair = -1;
    activeLocalChair = -1;
    newRound = !0;
    gameAction = -1;
    cards = [];
    activeTimeRemain = 0;
    moneyType = 1;
    gameId = 0;
    gameServerState = null;
    baoSam = null;
    boLuot = null;
    toiTrang = null;
    recentCards = [];
    cardSizes = [];
    handCardSizeSize = 0;
    chairLastTurn = -1;

    public static getInstance(): TienLenGameLogic {
        if (this.instance == null) {
            this.instance = new TienLenGameLogic();
        }
        return this.instance;
    }

    constructor() {
        this.roomOwnerID = this.roomOwner = this.bet = 0;
        this.myChair = -1;
        this.roomLock = !1;
        this.roomId = this.roomIndex = this.roomJackpot = 0;
        this.players = [];
        this.gameState = -1;
        this.typeToiTrang = this.timeBaoSam = this.timeAutoStart = 0;
        this.cardChiabai = [];
        this.cardDanhBai = [];
        this.firstTurnCards = [];
        this.changeTurnChair = this.activeLocalChair = -1;
        this.newRound = !0;
        this.gameAction = -1;
        this.cards = [];
        for (var a = this.activeTimeRemain = 0; a < TienLenConstant.Config.MAX_PLAYER; a++) {
            var b = new Player();
            0 == a && (b.type = TienLenConstant.PlayerType.MY);
            this.players.push(b);
        }
    }

    initReconnect(a) {
        cc.sys.localStorage.setItem("outRoom", "0");
        GameData.getInstance().maxPlayer = a.maxPlayer;
        // 2 == gameData.maxPlayer ? GameManager.getInstance().currentGame = 4 : GameManager.getInstance().currentGame = 5;
        this.gameState = TienLenConstant.GameState.PLAYCONTINUE;
        this.bet = a.roomBet;
        this.moneyType = a.moneyType;
        this.roomOwner = a.roomOwner;
        this.roomId = a.roomId;
        this.gameId = a.gameId;
        this.myChair = a.myChair;
        this.cardChiabai = [];
         //Utils.Log("cardChidBai size" + a.cards.length);
        for (var b = 0; b < a.cards.length; b++) this.cardChiabai.push(a.cards[b]),  //Utils.Log("carChiabai " + a.cards[b]);
        this.gameServerState = a.gameServerState;
        this.gameAction = a.gameAction;
        this.activeTimeRemain = a.activeTimeRemain;
        this.changeTurnChair = this.activeLocalChair = this.convertChair(a.currentChair);
        this.baoSam = a.baoSam;
        this.boLuot = a.boLuot;
        this.toiTrang = a.toiTrang;
        this.recentCards = [];
        for (var b = 0; b < a.recentCards.length; b++) this.recentCards.push(a.recentCards[b]);
        for (var b = 0; b < this.players.length; b++) this.players[b].ingame = !1;
        for (var b = 0; b < GameData.getInstance().maxPlayer; b++) {
            var c = this.convertChair(b);
            0 != a.playerStatus[b] && ( Utils.Log("playI: " + b + " " + c), this.players[c].ingame = !0, this.players[c].active = !0, this.players[c].info = a.playerInfos[b],  Utils.Log("pkPlayerInfos" + a.playerInfos[b].nickName), this.players[c].status = a.playerStatus[b], this.players[c].chairInServer = b, this.players[c].chairLocal = c);
        }
    }

    initWith(a) {
        this.gameState = TienLenConstant.GameState.JOINROOM;
        this.bet = a.moneyBet;
        this.moneyType = a.moneyType;
        this.roomOwner = a.roomOwner;
        this.roomId = a.roomId;
        this.gameId = a.gameId;
        this.myChair = a.myChair;
        this.gameId = a.gameId;
        this.gameAction = a.gameAction;
        this.activeTimeRemain = a.activeTimeRemain;
        this.changeTurnChair = this.activeLocalChair = this.convertChair(a.currentChair);
        this.cardSizes = [];
        for (b = 0; b < this.handCardSizeSize; b++) this.cardSizes.push(a.handCardSize[b]);
        for (var b = 0; b < this.players.length; b++) this.players[b].ingame = !1;
        for (b = 0; b < GameData.getInstance().maxPlayer; b++) {
            var c = this.convertChair(b);
            0 != a.playerStatus[b] && (this.players[c].ingame = !0, this.players[c].active = !0, this.players[c].info = a.playerInfos[b], this.players[c].status = a.playerStatus[b], this.players[c].chairInServer = b, this.players[c].chairLocal = c, this.players[c].remainCard = a.handCardSize[b]);
        }
    }

    convertChair(a) {
        a = (a - this.myChair + 4) % 4;
        2 == GameData.getInstance().maxPlayer ? 0 != a && (a = 2) : 0 != a && (a = TienLenConstant.Config.MAX_PLAYER - a);
        return a;
    }

    numberPlayer() {
        for (var a = 0, b = 0; b < TienLenConstant.Config.MAX_PLAYER; b++) this.players[b].ingame && 1 < this.players[b].status && a++;
        return a;
    }

    userJoinRoom(a) {
        this.gameState = TienLenConstant.GameState.USERJOIN;
        var b = this.convertChair(a.uChair);
        this.activeLocalChair = b;
        this.players[b].ingame = !0;
        this.players[b].active = !0;
        this.players[b].info = a.info;
        this.players[b].status = a.uStatus;
        this.players[b].chairInServer = a.uChair;
    }

    updateOwnerRoom(a) {
        this.roomOwner = a.chair;
        this.gameState = TienLenConstant.GameState.UPDATEOWNERROOM;
    }

    autoStart(a) {
        this.gameState = TienLenConstant.GameState.AUTOSTART;
        this.timeAutoStart = a.autoStartTime;
    }

    firstTurn(a) {
        this.gameState = TienLenConstant.GameState.FIRSTTURN;
        this.firstTurnCards = [0,
            0, 0, 0, 0
        ];
        if (a.isRandom)
            for (var b = 0; b < a.cards.length && b < GameData.getInstance().maxPlayer; b++) this.firstTurnCards[this.convertChair(b)] = a.cards[b];
        for (b = 0; b < TienLenConstant.Config.MAX_PLAYER; b++)  Utils.Log("this.firstTurn: " + b + " " + this.firstTurnCards[b]);
    }

    chiabai(a) {
        this.gameState = TienLenConstant.GameState.CHIABAI;
        this.cardChiabai = a.cards;
        this.timeBaoSam = a.timeBaoSam;
        this.gameId = a.gameId;
    }

    danhbai(a) {
        this.gameState = TienLenConstant.GameState.DANHBAI;
        this.cardDanhBai = a.cards;
        a = this.convertChair(a.chair);
        0 <= a && 4 >= a && (this.activeLocalChair =
            a);
    }

    boluot(a) {
        this.gameState = TienLenConstant.GameState.BOLUOT;
    }

    notifyOutRoom(a) {
        this.gameState = TienLenConstant.GameState.NOTIFYOUTROOM;
    }

    changeturn(a) {
        this.gameState = TienLenConstant.GameState.CHANGETURN;
        this.newRound = a.newRound;
        var b = this.convertChair(a.chair);
        this.chairLastTurn = this.convertChair(a.chairLastTurn);
         //Utils.Log("chairLastTurn: " + this.chairLastTurn);
        this.changeTurnChair = this.activeLocalChair = b;
    }

    waitBonDoiThong(a) {
        this.gameState = TienLenConstant.GameState.WAITBONDOITHONG;
         //Utils.Log("server.chair: " +
            a.chair);
        this.chairLastTurn = this.convertChair(a.chair);
         //Utils.Log("chairLastTurn: " + this.chairLastTurn);
    }

    quitRoom() {
        this.gameState = TienLenConstant.GameState.QUIT
    }

    chatchong(a) {
        this.gameState = TienLenConstant.GameState.CHATCHONG;
        var b = this.convertChair(a.winChair),
            c = this.convertChair(a.lostChair);
        // 0 == b ? lobby.updateMoney(a.winMoney, this.moneyType) : 0 == c && lobby.updateMoney(a.lostMoney, this.moneyType);
        this.players[b].info.money = a.winCurrentMoney;
        this.players[c].info.money = a.lostCurrentMoney;
    }

    baosam(a) {
        // this.gameState =
        //     TienLenConstant.GameState.BAOSAM;
    }

    huybaosam(a) {
        // this.gameState = TienLenConstant.GameState.HUYBAOSAM
    }

    quyetdinhsam(a) {
        // this.gameState = TienLenConstant.GameState.QUYETDINHSAM
    }

    jackpot(a) {
        this.gameState = TienLenConstant.GameState.JACKPOT;
    }

    userLeave(a) {
        var b = this.convertChair(a.chair);
        0 <= b && 3 >= b && a.nickName == this.players[b].info.nickName && (this.players[b].ingame = !1, this.activeLocalChair = b);
        this.gameState = TienLenConstant.GameState.USERLEAVE;
    }

    endGame(a) {
        this.gameState = TienLenConstant.GameState.ENDGAME;
        this.roomJackpot = a.roomJackpot;
        // for (var i = 0; i < a.currentMoney.length && i < GameData.getInstance().maxPlayer; i++)
        //     this.players[this.convertChair(i)].info && (this.players[this.convertChair(i)].info.money = a.currentMoney[i], 0 == this.convertChair(i) && lobby.updateMoney(a.currentMoney[i], this.moneyType));
         //Utils.Log("endGame");
    }

    updateMath(a) {
        this.gameState = TienLenConstant.GameState.UPDATEMATH;
        this.myChair = a.myChair;
        this.roomOwner = a.ownerChair;
        for (var b = 0; b < a.hasInfo.length && b < GameData.getInstance().maxPlayer; b++)
            if (a.hasInfo[b]) {
                var c = this.convertChair(b);
                this.players[c].ingame &&
                    (this.players[c].info.money = a.infos[b].money, this.players[c].active = !0, this.players[c].status = a.infos[b].status)
            }
    }
}