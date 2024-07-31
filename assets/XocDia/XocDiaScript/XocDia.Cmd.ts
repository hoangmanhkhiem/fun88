import Configs from "../../Loading/src/Configs";
import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import OutPacket from "../../Lobby/LobbyScript/Script/networks/Network.OutPacket";


export namespace cmd {
    export class Code {
        static LOGIN = 1;
        static GETLISTROOM = 3014;
        static JOIN_GAME_ROOM_BY_ID = 3015;
        static CMDJOINROOMFAIL = 3004;
        static CMDRECONNECTGAMEROOM = 3002;
        static REQUEST_INFO_MOI_CHOI = 3010;
        static MOI_CHOI = 3011;
        static ACCEPT_MOI_CHOI = 3012;

        static JOIN_ROOM_FAIL = 3004;
        static JOIN_ROOM_SUCCESS = 3101;
        static USER_JOIN_ROOM_SUCCESS = 3102;
        static USER_OUT_ROOM = 3104;
        static ORDER_BANKER = 3113;
        static ACTION_IN_GAME = 3105;
        static PUT_MONEY = 3106;
        static PUT_MONEY_X2 = 3115;
        static PUT_ALL_IN = 3116;
        static QUIT_ROOM = 3103;
        static DANG_KY_THOAT_PHONG = 3100;
        static START_GAME = 3117;
        static BANKER_SELL_GATE = 3110;
        static BUY_GATE = 3111;
        static REFUN_MONEY = 3118;
        static FINISH_GAME = 3112;
        static GET_TIME = 3119;
        static HUY_LAM_CAI = 3130;
        static STOP_GAME = 3122;
        static SOI_CAU = 3121;
        static MESSAGE_ERROR_BANKER = 3123;
        static SET_CHEAT = 3124;
        static CHAT_MS = 3008;
        static INFO_GATE_SELL = 3126;
        static INFO_MONEY_AFTER_BANKER_SELL = 3128;
        static ACTION_BANKER = 3127;
        static KICK_OUT_XOCDIA = 3132;
        static DESTROY_ROOM = 3133;
        static LOCK_GATE = 3131;
        static GET_MONEY_LAI = 3134;
        static UPDATE_CURRENT_MONEY = 3135;
    }
    export class SendGetListRoom extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.GETLISTROOM);
            this.packHeader();
            this.putInt(Configs.App.MONEY_TYPE);//money type
            this.putInt(30);//maxplayer
            this.putLong(-1);//khong xac dinh
            this.putInt(0);//khong xac dinh
            this.putInt(0);//CARD_FROM
            this.putInt(50);//CARD_TO
            this.updateSize();
        }
    }
    export class ReceiveGetListRoom extends InPacket {
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

    export class SendJoinRoomById extends OutPacket {
        constructor(id: number) {
            super();
            //  cc.log("SendJoinRoomById:"+id);
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.JOIN_GAME_ROOM_BY_ID);
            this.packHeader();
            this.putInt(id);
            this.putString("");//mat khau
            this.updateSize();
        }
    }

    export class ReceiveJoinRoomSuccess extends InPacket {
        moneyBet = 0;
        roomId = 0;
        gameId = 0;
        moneyType = 0;
        gameState = 0;
        countTime = 0;
        playerCount = 0;
        potID = [];
        playerInfos = [];
        money = 0;
        banker = false;
        isSubBanker = false;
        purchaseStatus = 0;
        potPurchase = 0;
        moneyPurchaseEven = 0;
        moneyPurchaseOdd = 0;
        moneyRemain = 0;
        subListCount = 0;
        list_buy_gate = [];
        bankerReqDestroy = false;
        bossReqDestroy = false;
        rule = 0;
        moneyRegisBanker = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.moneyBet = this.getInt();
            this.roomId = this.getInt();
            this.gameId = this.getInt();
            this.moneyType = this.getByte();
            this.gameState = this.getByte();
            this.countTime = this.getInt();
            this.playerCount = this.getByte();
            this.potID = [];
            for (let a = 0; 6 > a; a++) {
                let b: any = {};
                b["id"] = this.getByte();
                b["ratio"] = this.getInt();
                b["maxMoneyBet"] = this.getLong();
                b["totalMoney"] = this.getLong();
                b["moneyBet"] = this.getLong();
                b["isLock"] = this.getBool();
                this.potID.push(b);
            }
            this.playerInfos = [];
            for (let a = 0; a < this.playerCount; a++) {
                let b: any = {};
                b["nickname"] = this.getString();
                b["avatar"] = this.getString();
                b["money"] = this.getLong();
                b["banker"] = this.getBool();
                b["isSubBanker"] = this.getBool();
                b["reqKickroom"] = this.getBool();
                this.playerInfos.push(b);

            }
            this.money = this.getLong();
            this.banker = this.getBool();
            this.isSubBanker = this.getBool();
            this.purchaseStatus = this.getInt();
            this.potPurchase = this.getInt();
            this.moneyPurchaseEven = this.getLong();
            this.moneyPurchaseOdd = this.getLong();
            this.moneyRemain = this.getLong();
            this.subListCount = this.getInt();
            this.list_buy_gate = [];
            for (let a = 0; a < this.subListCount; a++) {
                let b: any = {};
                b["nickname"] = this.getString();
                b["money"] = this.getLong();
                this.list_buy_gate.push(b);
            }
            this.bankerReqDestroy = this.getBool();
            this.bossReqDestroy = this.getBool();
            this.rule = this.getInt();
            this.moneyRegisBanker = this.getLong()
        }
    }
    export class ReceiveJoinRoomFail extends InPacket {
        constructor(data: Uint8Array) {
            super(data);
        }
    }

    export class SendLeaveRoom extends OutPacket {
        constructor() {
            //  cc.log("SendLeaveRoom ĐANG KY THOAT PHONG");
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.DANG_KY_THOAT_PHONG);
            this.packHeader();
            this.updateSize();
        }
    }

    export class ReceiveLeavedRoom extends InPacket {
        reason = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.reason = this.getByte()
        }
    }

    export class ReceiveLeaveRoom extends InPacket {
        bRegis = false;
        nickname = "";

        constructor(data: Uint8Array) {
            super(data);
            this.bRegis = this.getBool();
            this.nickname = this.getString()
        }
    }

    export class ReceiveUserJoinRoom extends InPacket {
        nickname = "";
        avatar = "";
        money = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.nickname = this.getString();
            this.avatar = this.getString();
            this.money = this.getLong()
        }
    }

    export class ReceiveUserOutRoom extends InPacket {
        nickname = "";

        constructor(data: Uint8Array) {
            super(data);
            this.nickname = this.getString();
        }
    }

    export class ReceiveActionInGame extends InPacket {
        action = 0;
        time = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.action = this.getByte();
            this.time = this.getByte()
        }
    }

    export class ReceiveStartGame extends InPacket {
        banker = "";
        gameId = 0;
        moneyBanker = 0;
        list_lock_gate = [];

        constructor(data: Uint8Array) {
            super(data);
            this.banker = this.getString();
            this.gameId = this.getInt();
            this.moneyBanker = this.getLong();
            this.list_lock_gate = [];
            for (var a = 0; 6 > a; a++) {
                var b: any = {};
                b["id"] = this.getByte();
                b["isLock"] = this.getBool();
                this.list_lock_gate.push(b);
            }
        }
    }

    export class SendPutMoney extends OutPacket {
        constructor(doorId: number, coin: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.PUT_MONEY);
            this.packHeader();
            this.putByte(doorId);
            this.putLong(coin);
            this.updateSize();
        }
    }

    export class ReceivePutMoney extends InPacket {
        error = 0;
        nickname = "";
        betMoney = 0;
        potId = 0;
        potMoney = 0;
        currentMoney = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.nickname = this.getString();
            this.betMoney = this.getLong();
            this.potId = this.getByte();
            this.potMoney = this.getLong();
            this.currentMoney = this.getLong();
        }
    }

    export class ReceiveBankerSellGate extends InPacket {
        action = 0;//1: nhà cái cân tất, 2: ban chẵn, 3: bán lẻ
        moneySell = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.action = this.getByte();
            this.moneySell = this.getLong();
        }
    }

    export class SendBuyGate extends OutPacket {
        constructor(coin: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.BUY_GATE);
            this.packHeader();
            this.putLong(coin);
            this.updateSize();
        }
    }

    export class ReceiveBuyGate extends InPacket {
        error = 0;
        nickname = "";
        moneyBuy = 0;
        rmMoneySell = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.nickname = this.getString();
            this.moneyBuy = this.getLong();
            this.rmMoneySell = this.getLong()
        }
    }

    export class ReceiveRefunMoney extends InPacket {
        rfCount = 0;
        potID = [];
        playerInfosRefun = []

        constructor(data: Uint8Array) {
            super(data);
            this.rfCount = this.getInt();
            for (let a = 0; 6 > a; a++) {
                let b = {};
                b["id"] = this.getByte();
                b["moneyRefund"] = this.getLong();
                b["totalMoney"] = this.getLong();
                this.potID.push(b);
            }
            this.playerInfosRefun = [];
            for (let a = 0; a < this.rfCount; a++) {
                let b = {};
                b["nickname"] = this.getString();
                b["moneyRefund"] = this.getLong();
                b["currentMoney"] = this.getLong();
                b["pots"] = this.getString();
                b["moneyRfPots"] = this.getString();
                this.playerInfosRefun.push(b);
            }
        }
    }

    export class ReceiveFinishGame extends InPacket {
        infoAllPot = [];
        diceIDs = [];
        moneyBankerBefore = 0;
        moneyBankerAfter = 0;
        moneyBankerExchange = 0;
        playerInfoWin = [];
        subListCount = 0;
        infoSubBanker = [];

        constructor(data: Uint8Array) {
            super(data);
            for (let a = 0; 6 > a; a++) {
                let b = {};
                b["potId"] = this.getByte();
                b["totalMoney"] = this.getLong();
                b["win"] = this.getBool();
                this.infoAllPot.push(b)
            }
            for (let a = 0; 4 > a; a++) {
                this.diceIDs.push(this.getInt());
            }
            this.moneyBankerBefore = this.getLong();
            this.moneyBankerAfter = this.getLong();
            this.moneyBankerExchange = this.getLong();
            let playerWinCount = this.getInt();
            for (let a = 0; a < playerWinCount; a++) {
                let b = {};
                b["nickname"] = this.getString();
                b["moneyWin"] = this.getLong();
                b["currentMoney"] = this.getLong();
                b["potsWin"] = this.getString();
                b["moneyWinPots"] = this.getString();
                this.playerInfoWin.push(b);
            }
            this.subListCount = this.getInt();
            for (let a = 0; a < this.subListCount; a++) {
                let b = {};
                b["nicknameSubbanker"] = this.getString();
                b["potSubBanker"] = this.getByte();
                b["moneySubBanker"] = this.getLong();
                b["moneySubBankerNoFee"] = this.getLong();
                b["currentMoneySubBanker"] = this.getLong();
                this.infoSubBanker.push(b);
            }
        }
    }

    export class SendReconnect extends OutPacket {
        constructor() {
            super();
            //  cc.log("SendJoinRoomById sendReconnect");
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CMDRECONNECTGAMEROOM);
            this.packHeader();
            this.updateSize();
        }
    }

    export class CmdSendGetCau extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SOI_CAU);
            this.packHeader();
            this.updateSize();
        }
    }

    export class ReceiveGetCau extends InPacket {
        totalEven = 0;
        totalOdd = 0;
        rsCount = 0;
        arrayCau: number[] = [];

        constructor(data: Uint8Array) {
            super(data);
            this.totalEven = this.getInt();
            this.totalOdd = this.getInt();
            this.rsCount = this.getInt();
            for (var a = 0; a < this.rsCount; a++) {
                this.arrayCau.push(this.getByte())
            }
        }
    }

    export class SendOrderBanker extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.ORDER_BANKER);
            this.packHeader();
            this.updateSize();
        }
    }

    export class ReceiveOrderBanker extends InPacket {
        error = 0;
        moneyRequire = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.moneyRequire = this.getLong()
        }
    }

    export class ReceiveInfoGateSell extends InPacket {
        moneyEven = 0;
        moneyOdd = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.moneyEven = this.getLong();
            this.moneyOdd = this.getLong()
        }
    }

    export class SendCancelBanker extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.HUY_LAM_CAI);
            this.packHeader();
            this.updateSize();
        }
    }

    export class ReceiveCancelBanker extends InPacket {
        bDestroy = false;
        nickname = "";

        constructor(data: Uint8Array) {
            super(data);
            this.bDestroy = this.getBool();
            this.nickname = this.getString();
        }
    }

    export class SendBankerSellGate extends OutPacket {
        constructor(door: number, coin: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.BANKER_SELL_GATE);
            this.packHeader();
            this.putByte(door);//1: nhà cái cân tất, 2: ban chẵn, 3: bán lẻ
            this.putLong(coin);
            this.updateSize();
        }
    }

    export class ReceiveInfoMoneyAfterBankerSell extends InPacket {
        money = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.money = this.getLong()
        }
    }

    export class SendRequestInfoMoiChoi extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.REQUEST_INFO_MOI_CHOI);
            this.packHeader();
            this.updateSize();
        }
    }

    export class SendMoiChoi extends OutPacket {
        constructor(nicknames: string[]) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.MOI_CHOI);
            this.packHeader();
            this.putShort(nicknames.length);
            for (var b = 0; b < nicknames.length; b++)
                this.putString(nicknames[b]);
            this.updateSize();
        }
    }

    export class SendAcceptMoiChoi extends OutPacket {
        constructor(name: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.ACCEPT_MOI_CHOI);
            this.packHeader();
            this.putString(name);
            this.updateSize();
        }
    }
    export class SendChatRoom extends OutPacket {
        constructor(a: number, b: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CHAT_MS);
            this.packHeader();
            this.putByte(a ? 1 : 0);
            this.putString(encodeURI(b));
            this.updateSize();
        }
    }
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
}
export default cmd;