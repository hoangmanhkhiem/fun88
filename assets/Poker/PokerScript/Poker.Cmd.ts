import Configs from "../../Loading/src/Configs";
import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import OutPacket from "../../Lobby/LobbyScript/Script/networks/Network.OutPacket";

export namespace cmd {
    export class Code {
        static LOGIN = 1;
        static TOPSERVER = 1001;
        static CMD_PINGPONG = 1050;

        static CMD_JOIN_ROOM = 3001;
        static CMD_RECONNECT_ROOM = 3002;
        static MONEY_BET_CONFIG = 3003;
        static JOIN_ROOM_FAIL = 3004;
        static CHAT_ROOM = 3008;

        static GET_LIST_ROOM = 3014;
        static JOIN_GAME_ROOM_BY_ID = 3015;

        static MOI_DAT_CUOC = 3114;
        static UPDATE_OWNER_ROOM = 3117;
        static NOTIFY_USER_GET_JACKPOT = 3122;

        static PLAYER_STATUS_OUT_GAME = 0;
        static PLAYER_STATUS_VIEWER = 1;
        static PLAYER_STATUS_SITTING = 2;
        static PLAYER_STATUS_PLAYING = 3;

        static SELECT_DEALER = 3100;
        static TAKE_TURN = 3101;
        static BUY_IN = 3102;
        static KET_THUC = 3103;
        static CHANGE_TURN = 3104;
        static NEW_ROUND = 3105;
        static DEAL_PRIVATE_CARD = 3106;
        static TU_DONG_BAT_DAU = 3107;
        static SHOW_CARD = 3108;
        static REQUEST_BUY_IN = 3109;
        static THONG_TIN_BAN_CHOI = 3110;
        static DANG_KY_THOAT_PHONG = 3111;
        static REQUEST_STAND_UP = 3113;
        static CHEAT_CARDS = 3115;
        static DANG_KY_CHOI_TIEP = 3116;
        static JOIN_ROOM_SUCCESS = 3118;
        static LEAVE_GAME = 3119;
        static NOTIFY_KICK_FROM_ROOM = 3120;
        static NEW_USER_JOIN = 3121;
        static UPDATE_MATCH = 3123;

        static REQUEST_INFO_TOUR = 3990;
        static UPDATE_TIME = 3991;

        static MAX_PLAYER = 9;
        static MAX_BUY_IN = 250;

        // Game Action
        static GAME_ACTION_NONE = -1;
        static GAME_ACTION_FOLD = 0;
        static GAME_ACTION_CHECK = 1;
        static GAME_ACTION_CALL = 2;
        static GAME_ACTION_RAISE = 3;
        static GAME_ACTION_ALL_IN = 4;

        // Cards
        static EG_SANH_VUA = 0;
        static EG_THUNG_PHA_SANH = 1;
        static EG_TU_QUY = 2;
        static EG_CU_LU = 3;
        static EG_THUNG = 4;
        static EG_SANH = 5;
        static EG_XAM_CO = 6;
        static EG_HAI_DOI = 7;
        static EG_DOI = 8;
        static EG_MAU_THAU = 9;
        static EG_SERVER_NGU = 10;

        // GameState
        static STATE_CHIA_BAI = 1;
        static STATE_JOIN_ROOM = 2;
        static STATE_END_GAME = 3;
        static STATE_NEW_USER_JOIN_ROOM = 5;
        static STATE_USER_LEAVE_ROOM = 6;
        static STATE_DEAL_CARD = 7;
        static STATE_SELECT_DEALER = 8;
        static STATE_CHANGE_TURN = 9;
        static STATE_NEW_BET_ROUND = 10;
        static STATE_NOTIFY_OUT_ROOM = 11;
        static STATE_BUY_IN = 12;
        static STATE_UPDATE_MATCH = 13;
        static STATE_GAME_INFO = 14;
        static STATE_SHOW_CARD = 15;
        static STATE_NOTIFY_BUY_IN = 16;
        static STATE_STAND_UP = 17;
    }

    // OutPacket
    export class CmdLogin extends OutPacket {
        constructor(a: string, b: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.LOGIN);
            this.packHeader();
            this.putString(a); // nickname
            this.putString(b); // accessToken
            this.updateSize();
        }
    }

    export class CmdJoinRoom extends OutPacket {
        constructor(a: number, b: number, c: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CMD_JOIN_ROOM);
            this.packHeader();
            this.putInt(a);
            this.putInt(b);
            this.putLong(c);
            this.putInt(0);
            this.updateSize();
        }
    }

    export class CmdReconnectRoom extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CMD_RECONNECT_ROOM);
            this.packHeader();
            this.updateSize();
        }
    }

    export class CmdSendRequestLeaveGame extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.DANG_KY_THOAT_PHONG);
            this.packHeader();
            this.updateSize();
        }
    }

    export class CmdSendHoldRoom extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.DANG_KY_CHOI_TIEP);
            this.packHeader();
            this.updateSize();
        }
    }

    export class SendGetGameConfig extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.MONEY_BET_CONFIG);
            this.packHeader();
            this.updateSize();
        }
    }

    export class SendGetTopServer extends OutPacket {
        constructor(a: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.TOPSERVER);
            this.packHeader();
            this.putByte(a);
            this.updateSize();
        }
    }

    export class SendCardCheat extends OutPacket {
        constructor(a: number, b: []) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CHEAT_CARDS);
            this.packHeader();
            this.putByte(a);
            this.putByte(0);
            this.putShort(b.length);
            if (a)
                for (var c = 0; c < b.length; c++) this.putByte(b[c]);
            this.updateSize();
        }
    }

    export class CmdSendPing extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CMD_PINGPONG);
            this.packHeader();
            this.updateSize();
        }
    }

    export class SendGetListRoom extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.GET_LIST_ROOM);
            this.packHeader();
            this.putInt(Configs.App.MONEY_TYPE);//money type
            this.putInt(Code.MAX_PLAYER);//maxplayer
            this.putLong(-1);//khong xac dinh
            this.putInt(0);//khong xac dinh
            this.putInt(0);//CARD_FROM
            this.putInt(50);//CARD_TO
            this.updateSize();
        }
    }

    export class SendJoinRoomById extends OutPacket {
        constructor(id: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.JOIN_GAME_ROOM_BY_ID);
            this.packHeader();
            this.putInt(id);
            this.putString("");//mat khau
            this.updateSize();
        }
    }

    export class SendChatRoom extends OutPacket {
        constructor(a: number, b: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CHAT_ROOM);
            this.packHeader();
            this.putByte(a ? 1 : 0);
            this.putString(encodeURI(b));
            this.updateSize();
        }
    }


    // new OutPacket
    export class SendTakeTurn extends OutPacket {
        constructor(a: number, b: number, c: number, d: number, e: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.TAKE_TURN);
            this.packHeader();
            this.putByte(a);
            this.putByte(b);
            this.putByte(d);
            this.putByte(c);
            this.putByte(!1);
            this.putLong(e);
            this.updateSize();
        }
    }

    export class SendBuyIn extends OutPacket {
        constructor(a: number, b: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.BUY_IN);
            this.packHeader();
            this.putLong(a);
            this.putByte(b);
            this.updateSize();
        }
    }

    export class SendShowCard extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SHOW_CARD);
            this.packHeader();
            this.updateSize();
        }
    }

    export class SendGetInfoTour extends OutPacket {
        constructor(a: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.REQUEST_INFO_TOUR);
            this.packHeader();
            this.putByte(a);
            this.updateSize()
        }
    }

    export class SendDungDay extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.REQUEST_STAND_UP);
            this.packHeader();
            this.updateSize();
        }
    }

    // InPacket
    export class ReceivedLogin extends InPacket {
        constructor(data: Uint8Array) {
            super(data);
            cc.log("____");
        }
    }

    export class ReceivedGetListRoom extends InPacket {
        list: any[] = [];

        constructor(data: Uint8Array) {
            super(data);
            let listSize = this.getShort();
            this.list = [];
            for (var i = 0; i < listSize; i++) {
                let item: any = {};
                item["id"] = this.getInt();
                item["userCount"] = this.getByte();
                item["limitPlayer"] = this.getByte();
                item["maxUserPerRoom"] = this.getInt();
                item["moneyType"] = this.getByte();
                item["moneyBet"] = this.getInt();
                item["requiredMoney"] = this.getInt();
                item["rule"] = this.getByte();
                item["nameRoom"] = this.getString();
                item["key"] = this.getBool();
                item["quyban"] = this.getLong();
                this.list.push(item)
            }
        }
    }

    // edited
    export class ReceivedJoinRoomSucceed extends InPacket {
        myChair: number;
        chuongChair: number;
        moneyBet: number;
        roomId: number;
        gameId: number;
        moneyType: number;
        rule: number;
        playerSize: number;
        playerStatus: any[];
        playerInfos: any[];
        gameAction: number;
        countDownTime: number;
        roomOwner: number;
        handCardSizeSize: number;
        handCardSizeList: any[];
        currentActionChair: number;
        minBuyInTiLe: number;
        maxBuyInTiLe: number;

        constructor(data: Uint8Array) {
            super(data);
            this.myChair = this.getByte();
            this.moneyBet = this.getLong();
            this.roomOwner = this.getByte();
            this.roomId = this.getInt();
            this.gameId = this.getInt();
            this.moneyType = this.getByte();
            this.rule = this.getByte();
            this.playerSize = this.getShort();
            this.playerStatus = [];
            for (var a = 0; a < this.playerSize; a++) this.playerStatus.push(this.getByte());
            this.playerSize = this.getShort();
            this.playerInfos = [];
            for (a = 0; a < this.playerSize; a++) {
                var b = {};
                b["avatar"] = this.getString();
                b["nickName"] = this.getString();
                b["currentMoney"] = this.getLong();
                this.playerInfos.push(b)
            }
            this.gameAction = this.getByte();
            this.handCardSizeSize = this.getShort();
            this.handCardSizeList = [];
            for (a = 0; a < this.handCardSizeSize; a++) this.handCardSizeList.push(this.getByte());
            this.currentActionChair = this.getByte();
            this.countDownTime = this.getByte();
            this.minBuyInTiLe = this.getInt();
            this.maxBuyInTiLe = this.getInt()
        }
    }

    export class ReceivedAutoStart extends InPacket {
        isAutoStart: boolean;
        timeAutoStart: number;
        constructor(data: Uint8Array) {
            super(data);
            this.isAutoStart = this.getBool();
            this.timeAutoStart = this.getByte();
        }
    }

    // new
    export class ReceivedChiaBai extends InPacket {
        cardSize: number;
        cards: any[];
        gameId: number;
        timeChiaBai: number;
        constructor(data: Uint8Array) {
            super(data);
            var a = 0;
            this.cardSize = this.getShort();
            this.cards = [];
            for (a = 0; a < this.cardSize; a++) this.cards.push(this.getByte());
            this.gameId = this.getInt();
            this.timeChiaBai = this.getByte();
        }
    }

    // new
    export class ReceivedUserLeaveRoom extends InPacket {
        chair: number;
        nickName: string;
        constructor(data: Uint8Array) {
            super(data);
            this.chair = this.getByte();
            this.nickName = this.getString();
        }
    }

    // new
    export class ReceivedUserJoinRoom extends InPacket {
        info: {};
        uChair: number;
        uStatus: number;
        constructor(data: Uint8Array) {
            super(data);
            this.info = {};
            this.info["nickName"] = this.getString();
            this.info["avatar"] = this.getString();
            this.info["money"] = this.getLong();
            this.uChair = this.getByte();
            this.uStatus = this.getByte();
        }
    }


    // new
    export class ReceivedUpdateMatch extends InPacket {
        chair: number;
        hasInfoSize: number;
        hasInfoList: any[];
        currentMoneyList: any[];
        statusList: any[];
        constructor(data: Uint8Array) {
            super(data);
            this.chair = this.getByte();
            this.hasInfoSize = this.getShort();
            this.hasInfoList = [];
            for (var a = 0; a < this.hasInfoSize; a++) this.hasInfoList.push(this.getByte());
            this.currentMoneyList = [];
            this.statusList = [];
            for (a = 0; a < Code.MAX_PLAYER; a++) this.hasInfoList[a] ? (this.currentMoneyList.push(this.getLong()), this.statusList.push(this.getInt())) : (this.currentMoneyList.push(0), this.statusList.push(0))
        }
    }

    // new
    export class ReceivedNotifyRegOutRoom extends InPacket {
        outChair: number;
        isOutRoom: boolean;
        constructor(data: Uint8Array) {
            super(data);
            this.outChair = this.getByte();
            this.isOutRoom = this.getBool();
        }
    }

    // new
    export class ReceivedKickOff extends InPacket {
        reason: number;
        constructor(data: Uint8Array) {
            super(data);
            this.reason = this.getByte();
        }
    }

    // new
    export class ReceivedMoiDatCuoc extends InPacket {
        timeDatCuoc: number;
        constructor(data: Uint8Array) {
            super(data);
            this.timeDatCuoc = this.getByte();
        }
    }


    // new
    export class ReceivedDatCuoc extends InPacket {
        chairDatCuoc: number;
        level: number;
        constructor(data: Uint8Array) {
            super(data);
            this.chairDatCuoc = this.getByte();
            this.level = this.getByte();
        }
    }

    // new
    export class ReceivedMoBai extends InPacket {
        chairMoBai: number;
        cardSize: number;
        cards: any[];
        constructor(data: Uint8Array) {
            super(data);
            this.chairMoBai = this.getByte();
            this.cardSize = this.getShort();
            this.cards = [];
            for (var a = 0; a < this.cardSize; a++) {
                this.cards.push(this.getByte());
            }
        }
    }

    // new
    export class ReceivedEndGame extends InPacket {
        potAmount: number;
        rankSize: number;
        rankList: any[];
        kqttSize: number;
        kqttList: any[];
        booleanWinerSize: number;
        booleanWinerList: any[];
        moneyArraySize: number;
        currentMoney: any[];
        gameMoney: any[];
        gameMoneySize: number;
        publicCardSize: number;
        publicCards: any[];
        hasInfoSize: number;
        hasInfoList: any[];
        privateCardList: any[];
        maxCardList: any[];
        cardNameList: any[];
        constructor(data: Uint8Array) {
            super(data);
            this.potAmount = this.getLong();
            this.rankSize = this.getShort();
            this.rankList = [];
            for (var a = 0; a < this.rankSize; a++) this.rankList.push(this.getLong());
            this.kqttSize = this.getShort();
            this.kqttList = [];
            for (a = 0; a < this.kqttSize; a++) this.kqttList.push(this.getLong());
            this.booleanWinerSize = this.getShort();
            this.booleanWinerList = [];
            for (a = 0; a < this.booleanWinerSize; a++) this.booleanWinerList.push(this.getByte());
            this.moneyArraySize = this.getShort();
            this.currentMoney = [];
            for (a = 0; a < this.moneyArraySize; a++) this.currentMoney.push(this.getLong());
            this.gameMoney = [];
            this.gameMoneySize = this.getShort();
            for (a = 0; a < this.gameMoneySize; a++) this.gameMoney.push(this.getLong());
            this.publicCardSize = this.getShort();
            this.publicCards = [];
            for (a = 0; a < this.publicCardSize; a++) this.publicCards.push(this.getByte());
            this.hasInfoSize = this.getShort();
            this.hasInfoList = [];
            for (a = 0; a < this.hasInfoSize; a++) this.hasInfoList.push(this.getByte());
            this.privateCardList = [];
            this.maxCardList = [];
            this.cardNameList = [];
            for (a = 0; a < Code.MAX_PLAYER; a++) {
                var b = 0,
                    c = [],
                    d = [];
                if (this.hasInfoList[a]) {
                    for (var b = this.getShort(), e = 0; e < b; e++) d.push(this.getByte());
                    for (var b = this.getByte(), f = this.getShort(), e = 0; e < f; e++) c.push(this.getByte())
                } else b = 0, c = [];
                this.maxCardList.push(c);
                this.privateCardList.push(d);
                this.cardNameList.push(b)
            }
        }
    }

    // new
    export class ReceivedDoiChuong extends InPacket {
        chuongChair: number;
        constructor(data: Uint8Array) {
            super(data);
            this.chuongChair = this.getByte();
        }
    }

    // new
    export class ReceivedChatRoom extends InPacket {
        chair: number;
        isIcon: boolean;
        content: string;
        nickname: string;
        constructor(data: Uint8Array) {
            super(data);
            this.chair = this.getByte();
            this.isIcon = this.getBool();
            this.content = decodeURI(this.getString());
            this.nickname = this.getString()
        }
    }

    // new
    export class ReceivedGameInfo extends InPacket {
        maxPlayer: number;
        chair: number;
        myCardSize: number;
        myCards: any[];
        publicCardSize: number;
        publicCards: any[];
        dealerChair: number;
        smallBlindChair: number;
        bigBlindChair: number;
        potAmount: number;
        maxBet: number;
        raiseStep: number;
        roundId: number;
        gameServerState: number;
        gameAction: number;
        countDownTime: number;
        currentActiveChair: number;
        moneyType: number;
        bet: number;
        gameId: number;
        roomId: number;
        hasInfoSize: number;
        hasInfoList: any[];
        playerInfoList: any[];
        constructor(data: Uint8Array) {
            super(data);
            this.maxPlayer = this.getByte();
            this.chair = this.getByte();
            this.myCardSize = this.getShort();
            this.myCards = [];
            for (var a = 0; a < this.myCardSize; a++) this.myCards.push(this.getByte());
            this.publicCardSize = this.getShort();
            this.publicCards = [];
            for (a = 0; a < this.publicCardSize; a++) this.publicCards.push(this.getByte());
            this.dealerChair = this.getByte();
            this.smallBlindChair =  this.getByte();
            this.bigBlindChair = this.getByte();
            this.potAmount = this.getLong();
            this.maxBet = this.getLong();
            this.raiseStep = this.getLong();
            this.roundId = this.getByte();
            this.gameServerState = this.getByte();
            this.gameAction = this.getByte();
            this.countDownTime = this.getByte();
            this.currentActiveChair = this.getByte();
            this.moneyType = this.getByte();
            this.bet = this.getLong();
            this.gameId = this.getInt();
            this.roomId = this.getInt();
            this.hasInfoSize = this.getShort();
            this.hasInfoList = [];
            for (a = 0; a < this.hasInfoSize; a++) this.hasInfoList.push(this.getByte());
            this.playerInfoList = [];
            for (a = 0; a < this.maxPlayer; a++) {
                if (this.hasInfoList[a]) {
                    var b = {};
                    b["hasFold"] = this.getByte();
                    b["hasAllIn"] = this.getByte();
                    b["currentBet"] = this.getLong();
                    b["currentMoney"] = this.getLong();
                    b["status"] = this.getByte();
                    b["avatarUrl"] = this.getString();
                    b["nickName"] = this.getString()
                } else b = {}, b["hasFold"] = 0, b["hasAllIn"] = 0, b["currentBet"] = 0, b["currentMoney"] = 0, b["status"] = 0, b["avatarUrl"] = "", b["nickName"] = "";
                this.playerInfoList.push(b)
            }
        }
    }

    export class ReceivedTakeTurn extends InPacket {
        actionChair: number;
        action: number;
        lastRaise: number;
        currentBet: number;
        maxBet: number;
        currentMoney: number;
        raiseStep: number;
        raiseBlock: number;
        constructor(data: Uint8Array) {
            super(data);
            this.actionChair = this.getByte();
            this.action = this.getByte();
            this.lastRaise = this.getLong();
            this.currentBet = this.getLong();
            this.maxBet = this.getLong();
            this.currentMoney = this.getLong();
            this.raiseStep = this.getLong();
            this.raiseBlock = this.getByte();
        }
    }

    export class ReceivedSelectDealer extends InPacket {
        dealerChair: number;
        smallBlindChair: number;
        bigBlindChair: number;
        hasInfoSize: number;
        hasInfoList: any[];
        playerStatusList: any[];
        gameId: number;
        isCheat: number;
        currentMoneySize: number;
        currentMoneyList: any[];
        size: number;
        listBetBigBlind: any[];
        constructor(data: Uint8Array) {
            super(data);
            this.dealerChair = this.getByte();
            this.smallBlindChair = this.getByte();
            this.bigBlindChair = this.getByte();
            this.hasInfoSize = this.getShort();
            this.hasInfoList = [];
            cc.log("this.hasInfoSize: " + this.hasInfoSize);
            for (var a = 0; a < this.hasInfoSize; a++) {
                var b: any = this.getByte();
                this.hasInfoList.push(b);
                cc.log("i: " + a + " " + b)
            }
            this.playerStatusList = [];
            for (a = 0; a < Code.MAX_PLAYER; a++) this.hasInfoList[a] ?
                (b = this.getByte(), this.playerStatusList.push(b), cc.log("i: " + a + " " + b)) : this.playerStatusList.push(0);
            this.gameId = this.getInt();
            this.isCheat = this.getByte();
            this.currentMoneySize = this.getShort();
            this.currentMoneyList = [];
            for (a = 0; a < this.currentMoneySize; a++) this.currentMoneyList.push(this.getLong());
            this.size = this.getShort();
            this.listBetBigBlind = [];
            b = "";
            for (a = 0; a < this.size; a++) this.listBetBigBlind.push(this.getByte()), b += " " + this.listBetBigBlind[a];
            cc.log("Big Blind them: " + b)
        }
    }

    export class ReceivedBuyIn extends InPacket {
        chair: number;
        buyInMoney: number;
        constructor(data: Uint8Array) {
            super(data);
            this.chair = this.getByte();
            this.buyInMoney = this.getLong();
        }
    }

    export class ReceivedChangeTurn extends InPacket {
        roundId: number;
        chair: number;
        betTime: number;
        constructor(data: Uint8Array) {
            super(data);
            this.roundId = this.getByte();
            this.chair = this.getByte();
            this.betTime = this.getByte();
        }
    }

    export class ReceivedDealCards extends InPacket {
        chair: number;
        sizeCard: number;
        myCards: any[];
        boBaiId: number;

        constructor(data: Uint8Array) {
            super(data);
            this.chair = this.getByte();
            this.sizeCard = this.getShort();
            this.myCards = [];
            for (var a = 0; a < this.sizeCard; a++) this.myCards.push(this.getByte());
            this.boBaiId = this.getByte();
            cc.log("Bo bai server tra: " + this.boBaiId);
        }
    }

    export class ReceivedNewBetRound extends InPacket {
        roundId: number;
        sizeCard: number;
        plusCards: any[];
        cardName: number;
        potAmount: number;
        constructor(data: Uint8Array) {
            super(data);
            this.roundId = this.getByte();
            this.sizeCard = this.getShort();
            cc.log("sizeCard: " + this.sizeCard);
            this.plusCards = [];
            for (var a = 0; a < this.sizeCard; a++) this.plusCards.push(this.getByte());
            this.cardName = this.getByte();
            this.potAmount = this.getLong();
        }
    }

    export class ReceivedShowCard extends InPacket {
        chair: number;
        constructor(data: Uint8Array) {
            super(data);
            this.chair = this.getByte();
        }
    }

    export class ReceivedStandUp extends InPacket {
        isUp: number;
        constructor(data: Uint8Array) {
            super(data);
            this.isUp = this.getByte();
        }
    }

    export class ReceivedUpdateTime extends InPacket {
        chair: number;
        constructor(data: Uint8Array) {
            super(data);
            this.chair = this.getByte();
        }
    }

    export class ReceivedJoinRoomFail extends InPacket {
        constructor(data: Uint8Array) {
            super(data);
        }
    }
}
export default cmd;