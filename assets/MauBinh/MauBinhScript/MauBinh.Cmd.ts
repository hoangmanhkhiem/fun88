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

        static CREATE_ROOM = 3013;
        static GET_LIST_ROOM = 3014;
        static JOIN_GAME_ROOM_BY_ID = 3015;

        static BINH_SO_CHI = 3101; // new
        static BAT_DAU = 3102;
        static KET_THUC = 3103;
        static AUTO_BINH_SO_CHI = 3104; // new
        static CHIA_BAI = 3105;
        static BAO_BINH = 3106; // new
        static TU_DONG_BAT_DAU = 3107;
        static XEP_LAI = 3108; // new
        static DAT_CUOC = 3109;
        static THONG_TIN_BAN_CHOI = 3110;
        static DANG_KY_THOAT_PHONG = 3111;
        static VAO_GA = 3112;
        static DOI_CHUONG = 3113;
        static MOI_DAT_CUOC = 3114;
        static CHEAT_CARDS = 3115;
        static DANG_KY_CHOI_TIEP = 3116;
        static UPDATE_OWNER_ROOM = 3117;
        static JOIN_ROOM_SUCCESS = 3118;
        static LEAVE_GAME = 3119;
        static NOTIFY_KICK_FROM_ROOM = 3120;
        static NEW_USER_JOIN = 3121;
        static NOTIFY_USER_GET_JACKPOT = 3122;
        static UPDATE_MATCH = 3123;

        // Player State
        static PLAYER_STATUS_OUT_GAME = 0;
        static PLAYER_STATUS_VIEWER = 1;
        static PLAYER_STATUS_SITTING = 2;
        static PLAYER_STATUS_PLAYING = 3;

        // Cards Type
        static TYPE_SANH_RONG = 0;
        static TYPE_MUOI_BA_CAY_DONG_MAU = 1;
        static TYPE_MUOI_HAI_CAY_DONG_MAU = 2;
        static TYPE_BA_CAI_THUNG = 3;
        static TYPE_BA_CAI_SANH = 4;
        static TYPE_LUC_PHE_BON = 5;
        static TYPE_BINH_THUONG = 6;
        static TYPE_BINH_LUNG = 7;

        // Group Kind
        static GROUP_THUNG_PHA_SANH = 0;
        static GROUP_TU_QUY = 1;
        static GROUP_CU_LU = 2;
        static GROUP_THUNG = 3;
        static GROUP_SANH = 4;
        static GROUP_SAM_CO = 5;
        static GROUP_THU = 6;
        static GROUP_MOT_DOI = 7;
        static GROUP_MAU_THAU = 8;

        // Cards Kind Level
        static LV_THUONG = 0;
        static LV_HA = 1;
        static LV_BINH_THUONG = 2;

        // Cards Color
        static BLACK = 0;
        static RED = 1;

        // Cards Suite
        static SPADE = 0;
        static CLUB = 1;
        static DIAMOND = 2;
        static HEART = 3;

        // Game State
        static STATE_NO_START = 0;
        static STATE_PLAYING = 1;
        static STATE_END = 2;

        // Max Players
        static MAX_PLAYER = 4;
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

    export class SendCreateRoom extends OutPacket {
        constructor(a: number, b: number, c: number, d: number, e: number, f: string, g: string, h: number,) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CREATE_ROOM);
            this.packHeader();
            this.putInt(a);
            this.putInt(b);
            this.putLong(c);
            this.putInt(d);
            this.putInt(e);
            this.putString(f);
            this.putString(g);
            this.putLong(h);
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
        constructor(a: number) {
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


    export class SendBinhSoChi extends OutPacket {
        constructor(a:number [], b:number [], c:number []) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.BINH_SO_CHI);
            this.packHeader();
            this.putShort(a.length);
            for (var d = 0; d < a.length; d++) this.putByte(a[d]);
            this.putShort(b.length);
            for (d = 0; d < b.length; d++) this.putByte(b[d]);
            this.putShort(c.length);
            for (d = 0; d < c.length; d++) this.putByte(c[d]);
            this.updateSize();
        }
    }

    export class SendBaoBinh extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.BAO_BINH);
            this.packHeader();
            this.updateSize();
        }
    }

    export class SendAutoBinhSoChi extends OutPacket {
        constructor(a: number [], b:number [], c:number []) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.AUTO_BINH_SO_CHI);
            this.packHeader();
            this.putShort(a.length);
            for (var d = 0; d < a.length; d++) this.putByte(a[d]);
            this.putShort(b.length);
            for (d = 0; d < b.length; d++) this.putByte(b[d]);
            this.putShort(c.length);
            for (d = 0; d < c.length; d++) this.putByte(c[d]);
            this.updateSize();
        }
    }

    export class SendXepLai extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.XEP_LAI);
            this.packHeader();
            this.updateSize();
        }
    }


    // InPacket
    export class ReceivedLogin extends InPacket {
        constructor(data: Uint8Array) {
            super(data);
            //  cc.log("____");
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
        moneyBet: number;
        roomId: number;
        gameId: number;
        moneyType: number;
        rule: number;
        playerSize: number;
        playerStatus: any[];
        playerInfos: any[];
        gameState: number;
        gameAction: number;
        countDownTime: number;

        constructor(data: Uint8Array) {
            super(data);
            var a: number;
            this.myChair = this.getByte();
            this.moneyBet = this.getLong();
            this.roomId = this.getInt();
            this.gameId = this.getInt();
            this.moneyType = this.getByte();
            this.rule = this.getByte();
            this.playerSize = this.getShort();
            this.playerStatus = [];
            for (a = 0; a < this.playerSize; a++) this.playerStatus.push(this.getByte());
            this.playerSize = this.getShort();
            this.playerInfos = [];
            for (a = 0; a < this.playerSize; a++) {
                var b = {};
                b["nickName"] = this.getString();
                b["avatar"] = this.getString();
                b["money"] = this.getLong();
                this.playerInfos.push(b);
            }
            this.gameState = this.getByte();
            this.gameAction = this.getByte();
            this.countDownTime = this.getByte();
        }
    }

    // new
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
        cardList: any[];
        mauBinh: number;
        gameId: number;
        countdown: number;
        constructor(data: Uint8Array) {
            super(data);
            var a = this.getShort();
            this.cardList = [];
            for (var b = 0; b < a; b++) this.cardList.push(this.getByte());
            this.mauBinh = this.getByte();
            this.gameId = this.getInt();
            this.countdown = this.getByte()
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
        myChair: number;
        uStatus: number;
        constructor(data: Uint8Array) {
            super(data);
            this.info = {};
            this.info["nickName"] = this.getString();
            this.info["avatar"] = this.getString();
            this.info["money"] = this.getLong();
            this.myChair = this.getByte();
            this.uStatus = this.getByte();
        }
    }

    // new
    export class ReceivedUpdateMatch extends InPacket {
        myChair: number;
        hasInfo: any[];
        infos: any[];
        constructor(data: Uint8Array) {
            super(data);
            this.myChair = this.getByte();
            var a = this.getShort();
            this.hasInfo = [];
            for (var b = 0; b < a; b++) this.hasInfo.push(this.getBool());
            this.infos = [];
            for (b = 0; b < a; b++) {
                var c = {};
                this.hasInfo[b] && (c["nickName"] = this.getString(), c["avatar"] = this.getString(), c["money"] = this.getLong(), c["status"] = this.getInt());
                this.infos.push(c);
            }
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

    // co the k dung toi
    export class ReceivedMoiDatCuoc extends InPacket {
        timeDatCuoc: number;
        constructor(data: Uint8Array) {
            super(data);
            this.timeDatCuoc = this.getByte();
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
        playerResultList: any[];
        timeEndGame: number;

        constructor(data: Uint8Array) {
            super(data);
            this.playerResultList = [];
            for (var a = this.getShort(), b = 0; b < a; b++) {
                var c = {};
                c["chairIndex"] = this.getByte();
                c["maubinhType"] = this.getInt();
                var d = this.getShort();
                c["chi1"] = [];
                for (var e = 0; e < d; e++) c["chi1"].push(this.getByte());
                d = this.getShort();
                c["chi2"] = [];
                for (e = 0; e < d; e++) c["chi2"].push(this.getByte());
                d = this.getShort();
                c["chi3"] = [];
                for (e = 0; e < d; e++) c["chi3"].push(this.getByte());
                c["moneyInChi"] = [];
                d = this.getShort();
                for (e = 0; e < d; e++) c["moneyInChi"].push(this.getLong());
                c["moneyAt"] = this.getLong();
                c["moneyCommon"] = this.getLong();
                c["moneySap"] = this.getLong();
                c["currentMoney"] = this.getLong();
                this.playerResultList.push(c)
            }
            this.timeEndGame = this.getByte()
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
        myChair: number;
        gameState: number;
        gameAction: number;
        countdownTime: number;
        moneyBet: number;
        moneyType: number;
        gameId: number;
        roomId: number;
        rule: number;
        hasInfo: any[];
        players: any[];
        constructor(data: Uint8Array) {
            super(data);
            this.myChair = this.getByte();
            this.gameState = this.getByte();
            this.gameAction = this.getByte();
            this.countdownTime = this.getByte();
            this.moneyBet = this.getLong();
            this.moneyType = this.getByte();
            this.gameId = this.getInt();
            this.roomId = this.getInt();
            this.rule = this.getByte();
            var a = this.getShort();
            this.hasInfo = [];
            for (var b = 0; b < a; b++) this.hasInfo[b] = this.getBool();
            this.players = [];
            for (b = 0; b < cmd.Code.MAX_PLAYER; b++)
                if (this.hasInfo[b]) {
                    this.players[b] = {};
                    if (this.gameState == cmd.Code.STATE_PLAYING) {
                        if (b == this.myChair) {
                            a = this.getShort();
                            this.players[b].cardList = [];
                            for (var c = 0; c < a; c++) this.players[b].cardList.push(this.getByte())
                        }
                    } else if (this.gameState == cmd.Code.STATE_END) {
                        a = this.getShort();
                        this.players[b].cardList = [];
                        for (c = 0; c < a; c++) this.players[b].cardList.push(this.getByte());
                        this.players[b].maubinhType = this.getByte();
                        this.players[b].moneyCommon =
                            this.getLong()
                    }
                    this.players[b].sochi = this.getBool();
                    this.players[b].status = this.getByte();
                    this.players[b].avatar = this.getString();
                    this.players[b].userId = this.getInt();
                    this.players[b].nickName = this.getString();
                    this.players[b].currentMoney = this.getLong()
                }
        }
    }

    // new
    export class ReceivedTopServer extends InPacket {
        rankType: number;
        topDay_money: string;
        topWeek_money: string;
        topMonth_money: string;
        topDay_number: string;
        topWeek_number: string;
        topMonth_number: string;
        constructor(data: Uint8Array) {
            super(data);
            this.rankType = this.getByte();
            this.topDay_money = this.getString();
            this.topWeek_money = this.getString();
            this.topMonth_money = this.getString();
            this.topDay_number = this.getString();
            this.topWeek_number = this.getString();
            this.topMonth_number = this.getString();
        }
    }

    export class ReceivedJoinRoomFail extends InPacket {
        constructor(data: Uint8Array) {
            super(data);
        }
    }

    // new
    export class ReceivedMauBinhConfig extends InPacket {
        listSize: number;
        list: any[];
        constructor(data: Uint8Array) {
            super(data);
            this.listSize = this.getShort();
            this.list = [];
            for (var a = 0; a < this.listSize; a++) {
                var b = {};
                b["maxUserPerRoom"] = this.getByte();
                b["moneyType"] = this.getByte();
                b["moneyBet"] = this.getLong();
                b["moneyRequire"] = this.getLong();
                b["nPersion"] = this.getInt();
                this.list.push(b);
            }
        }
    }

    // new
    export class ReceivedBinhSoChi extends InPacket {
        chair: number;
        constructor(data: Uint8Array) {
            super(data);
            this.chair = this.getByte();
        }
    }

    // new
    export class ReceivedXepLai extends InPacket {
        chair: number;
        constructor(data: Uint8Array) {
            super(data);
            this.chair = this.getByte();
        }
    }

}
export default cmd;