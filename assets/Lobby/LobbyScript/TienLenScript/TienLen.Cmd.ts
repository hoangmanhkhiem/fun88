
import Utils from "../Script/common/Utils";
import InPacket from "../Script/networks/Network.InPacket";
import OutPacket from "../Script/networks/Network.OutPacket";
import TienLenConstant from "./TienLen.Constant";

const { ccclass } = cc._decorator;

export namespace TienLenCmd {
    export class Code {
        static LOGIN = 1;
        static NOTIFY_DISCONNECT = 37;
        static PING_PONG = 50;
        static JOIN_ROOM = 3001;
        static RECONNECT_GAME_ROOM: 3002;
        static QUICK_ROOM_SUCCEED = 3006;
        static CHAT_ROOM = 3008;
        static DANH_BAI = 3101;
        static START_GAME = 3102;
        static END_GAME = 3103;
        static THANG_TRANG = 3104;
        static CHIA_BAI = 3105;
        static BO_LUOT = 3106;
        static AUTO_START = 3107;
        static FIRST_TURN = 3108;
        static UPDATE_GAME_INFO = 3110;
        static REQUEST_LEAVE_ROOM = 3111;
        static CHANGE_TURN = 3112;
        static CHAT_CHONG = 3113;
        static HOLD = 3116;
        static JOIN_ROOM_SUCCESS = 3118;
        static USER_LEAVE_ROOM = 3119;
        static NOTIFY_KICK_OFF = 3120;
        static USER_JOIN_ROOM = 3121;
        static UPDATE_MATCH = 3123;
        static WAIT_4_DOI_THONG = 3124;
    }

    export class SendTest extends OutPacket {
        constructor(a: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(0)
            this.packHeader();
            this.putString(a);
            this.putInt(111);
            this.putLong(2147483647);
            this.putLong(325);
            this.putLong(8686);
            this.updateSize()
        }
    }
    
    export class SendLogin extends OutPacket {
        constructor(a: string, b: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.LOGIN)
            this.packHeader();
            this.putString(a);
            this.putString(b);
            this.updateSize()
        }
    }
    
    export class SendReconnectRoom extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.RECONNECT_GAME_ROOM);
            this.packHeader();
            this.updateSize()
        }
    }
    
    export class SendReadyAutoStart extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(3124);
            this.packHeader();
            this.updateSize()
        }
    }
    
    export class SendStartGame extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.START_GAME);
            this.packHeader();
            this.updateSize()
        }
    }

    export class SendPing extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(0);
            this.setCmdId(Code.PING_PONG);
            this.packHeader();
            this.updateSize();
        }
    }

    export class SendDanhBai extends OutPacket {
        constructor(a: boolean, b) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.DANH_BAI);
            this.packHeader();
            this.putByte(a);
            if (!a) {
                this.putShort(b.length);
                for (let c = 0; c < b.length; c++) this.putByte(b[c]);
            }
            this.updateSize()
        }
    }

    export class SendBoLuot extends OutPacket {
        constructor(a: boolean) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.DANH_BAI);
            this.packHeader();
            this.putByte(a);
            this.updateSize()
        }
    }
    
    export class SendRequestLeaveGame extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.REQUEST_LEAVE_ROOM);
            this.packHeader();
            this.updateSize()
        }
    }
    
    export class ReceivedJoinRoomSuccess extends InPacket {
        myChair = 0;
        moneyBet = 0;
        roomOwner = 0;
        roomId = 0;
        gameId = 0;
        moneyType = 0;
        playerSize = 0;
        playerStatus = [];
        playerInfos = [];
        gameAction = 0;
        handCardSizeSize = 0;
        handCardSize = [];
        currentChair = 0;
        countDownTime = 0;
        
        constructor(data: Uint8Array) {
            super(data);
            this.myChair = this.getByte();
            this.moneyBet = this.getLong();
            this.roomOwner = this.getByte();
            this.roomId = this.getInt();
            this.gameId = this.getInt();
            this.moneyType = this.getByte();
            this.playerSize = this.getShort();
            this.playerStatus = [];
            for (var a = 0; a < this.playerSize; a++) this.playerStatus.push(this.getByte());
            this.playerSize = this.getShort();
            this.playerInfos = [];
            for (var a = 0; a < this.playerSize; a++) {
                var b = {
                    avatar: this.getString(),
                    nickName: this.getString(),
                    money: this.getLong()
                };
                this.playerInfos.push(b)
            }
            this.gameAction = this.getByte();
            this.handCardSizeSize = this.getShort();
            this.handCardSize = [];
            for (var a = 0; a < this.handCardSizeSize; a++) this.handCardSize.push(this.getByte());
            this.currentChair = this.getByte();
            this.countDownTime = this.getByte()
        }
    }

    export class ReceivedDisconnect extends InPacket {
        constructor(data: Uint8Array) {
            super(data);
        }
    }

    export class ReceivedUpdateGameInfo extends InPacket {
        maxPlayer = 0;
        myChair = 0;
        cards = [];
        boLuot = false;
        toiTrang = 0;
        newRound = false;
        gameServerState = 0;
        gameAction = 0;
        activeTimeRemain = 0;
        currentChair = 0;
        recentCards = [];
        moneyType = 0;
        moneyBet = 0;
        gameId = 0;
        roomId = 0;
        playerStatus = [];
        hasInfoList = [];
        playerInfos = [];

        constructor(data: Uint8Array) {
            super(data);
            this.maxPlayer = this.getByte();
            this.myChair = this.getByte();
            var b = this.getShort();
            this.cards = [];
            for (var a = 0; a < b; a++) this.cards.push(this.getByte());
            this.boLuot = this.getBool();
            this.toiTrang = this.getInt();
            this.newRound = this.getBool();
            this.gameServerState = this.getByte();
            this.gameAction = this.getByte();
            this.activeTimeRemain = this.getByte();
            this.currentChair = this.getByte();
            b = this.getShort();
            this.recentCards = [];
            for (var a = 0; a < b; a++) this.recentCards.push(this.getByte());
            this.moneyType = this.getByte();
            this.moneyBet = this.getLong();
            this.gameId = this.getInt();
            this.roomId = this.getInt();
            b = this.getShort();
            this.playerStatus = [];
            this.hasInfoList = [];
            this.playerInfos = [];
            for (var a = 0; a < b; a++) this.hasInfoList.push(this.getBool());
            for (var a = 0; a < TienLenConstant.Config.MAX_PLAYER; a++) {
                var info = {};
                if (this.hasInfoList[a]) {
                    var cards = this.getByte();
                    this.playerStatus.push(this.getByte());
                    var avatar = this.getString();
                    var uID = this.getInt();
                    var nickName = this.getString();
                    var money = this.getLong();
                    info = {
                        cards: cards,
                        avatar: avatar,
                        uID: uID,
                        nickName: nickName,
                        money: money
                    }
                } else
                    this.playerStatus.push(0);
                this.playerInfos.push(info);
            }
        }
    }

    export class ReceivedAutoStart extends InPacket {
        isAutoStart = false;
        autoStartTime = 0;
        
        constructor(data: Uint8Array) {
            super(data);
            this.isAutoStart = this.getBool();
            this.autoStartTime = this.getByte();
        }
    }

    export class ReceivedChiaBai extends InPacket {
        cardSize = 0;
        cards = [];
        toiTrang = 0;
        timeBaoSam = 0;
        gameId = 0;

        constructor(data: Uint8Array) {
            super(data);
            var a = 0;
            this.cardSize = this.getShort();
            this.cards = [];
            for (a = 0; a < this.cardSize; a++) this.cards.push(this.getByte());
            this.toiTrang = this.getByte();
            this.timeBaoSam = this.getByte();
            this.gameId = this.getInt()
        }
    }
    
    export class ReceivedDanhBai extends InPacket {
        chair = 0;
        cards = [];
        numberCard = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.chair = this.getByte();
            var b = this.getShort();
            this.cards = [];
            for (var a = 0; a < b; a++) this.cards.push(this.getByte());
            this.numberCard = this.getByte();
        }
    }
    
    export class ReceivedBoluot extends InPacket {
        chair = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.chair = this.getByte()
        }
    }
    
    export class ReceivedChangeTurn extends InPacket {
        newRound = false;
        chair = 0;
        chairLastTurn = 0;
        time = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.newRound = this.getBool();
            this.chair = this.getByte();
            this.chairLastTurn = this.getByte();
             //Utils.Log("chairLastTurn: " + this.chairLastTurn);
            this.time = this.getByte()
        }
    }
    
    export class ReceivedWaitBonDoiThong extends InPacket {
        chair = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.chair = this.getByte()
        }
    }
    
    export class ReceivedEndGame extends InPacket {
        winTypes = [];
        ketQuaTinhTienList = [];
        cards = [];
        sizeWinType = 0;
        kqTinhTienSize = 0;
        currentMoney = [];
        countDown = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.winTypes = [];
            this.ketQuaTinhTienList = [];
            this.cards = [];
            this.sizeWinType = this.getShort();
             //Utils.Log("sizeWinType: " + this.sizeWinType);
            for (var a = 0; a < this.sizeWinType; a++) this.winTypes.push(this.getByte());
            this.kqTinhTienSize = this.getShort();
            for (a = 0; a < this.kqTinhTienSize; a++) this.ketQuaTinhTienList.push(this.getLong());
            var b = this.getShort();
            this.currentMoney = [];
            for (var a = 0; a < b; a++) this.currentMoney.push(this.getLong());
            for (var a = 0; a < TienLenConstant.Config.MAX_PLAYER; a++) {
                for (var b = this.getShort(), c = [], d = 0; d < b; d++) c.push(this.getByte());
                this.cards.push(c)
            }
            this.countDown = this.getByte()
        }
    }
    
    export class ReceivedFirstTurnDecision extends InPacket {
        isRandom = false;
        chair = 0;
        cardSize = 0;
        cards = [];

        constructor(data: Uint8Array) {
            super(data);
            this.isRandom = this.getBool();
            this.chair = this.getByte();
            this.cardSize = this.getShort();
            this.cards = [];
            for (var a = 0; a < this.cardSize; a++) {
                var b = this.getByte();
                this.cards.push(b);
                 //Utils.Log("cardFirstTurn: " + a + " " + b)
            }
        }
    }
    
    export class ReceivedChatChong extends InPacket {
        winChair = 0;
        lostChair = 0;
        winMoney = 0;
        lostMoney = 0;
        winCurrentMoney = 0;
        lostCurrentMoney = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.winChair = this.getByte();
            this.lostChair = this.getByte();
            this.winMoney = this.getLong();
            this.lostMoney = this.getLong();
            this.winCurrentMoney = this.getLong();
            this.lostCurrentMoney = this.getLong()
        }
    }
    
    export class ReceivedPingPong2 extends InPacket {
        id = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.id = this.getLong()
        }
    }
    
    export class UserLeaveRoom extends InPacket {
        chair = 0;
        nickName = "";

        constructor(data: Uint8Array) {
            super(data);
            this.chair = this.getByte();
            this.nickName = this.getString()
        }
    }
    
    export class ReceiveUserJoinRoom extends InPacket {
        info = {};
        uChair = 0;;
        uStatus = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.info = {
                nickName: this.getString(),
                avatar: this.getString(),
                money: this.getLong()
            };
            this.uChair = this.getByte();
            this.uStatus = this.getByte()
        }
    }
    
    export class ReceivedUpdateMatch extends InPacket {
        myChair = 0;
        hasInfo = [];
        infos = [];

        constructor(data: Uint8Array) {
            super(data);
            this.myChair = this.getByte();
            var a = this.getShort();
            this.hasInfo = [];
            for (var b = 0; b < a; b++) this.hasInfo.push(this.getBool());
            this.infos = [];
            for (b = 0; b < a; b++) {
                var c = {
                    money: this.getLong(),
                    status: this.getInt()
                };
                this.hasInfo[b] && (c.money, c.status);
                this.infos.push(c)
            }
        }
    }
    
    export class ReceiveSamConfig extends InPacket {
        listSize = 0;
        list = [];

        constructor(data: Uint8Array) {
            super(data);
            this.listSize = this.getShort();
            this.list = [];
            for (var a = 0; a < this.listSize; a++) {
                var b = {
                    maxUserPerRoom: this.getByte(),
                    moneyType: this.getByte(),
                    moneyBet: this.getLong(),
                    moneyRequire: this.getLong(),
                    nPersion: this.getInt()
                };
                this.list.push(b)
            }
        }
    }
    
    export class ReceivedNotifyRegOutRoom extends InPacket {
        outChair = 0;
        isOutRoom = false;

        constructor(data: Uint8Array) {
            super(data);
            this.outChair = this.getByte();
            this.isOutRoom = this.getBool()
        }
    }

    export class ReceivedKickOff extends InPacket {
        reason = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.reason = this.getByte()
        }
    }

    export class ReceivePingPong extends InPacket {
        test = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.test = this.getLong()
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
}
export default TienLenCmd;