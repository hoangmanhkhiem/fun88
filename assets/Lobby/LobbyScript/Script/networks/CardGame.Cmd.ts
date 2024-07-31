import OutPacket from "./Network.OutPacket";
import InPacket from "./Network.InPacket";

const { ccclass } = cc._decorator;

export namespace CardGameCmd {
    export class Code {
        static LOGIN = 1;
        static NOTIFY_DISCONNECT = 37;
        static PING_PONG = 50;
        static JOIN_ROOM = 3001;
        static RECONNECT_GAME_ROOM = 3002;
        static JOIN_ROOM_FAIL = 3004;
        static HOLD = 3116;
        static MONEY_BET_CONFIG = 3003;
        static GET_LIST_ROOM = 3014;
        static TOP_SERVER = 1001;
        static CHEAT_CARD = 3115;
        static PING_TEST = 1050;
        static CHAT_ROOM = 3008;
        static NO_HU_VANG = 3007;
        static THONG_TIN_HU_VANG = 3009;
        static REQUEST_INFO_MOI_CHOI = 3010;
        static MOI_CHOI = 3011;
        static ACCEPT_MOI_CHOI = 3012;
        static CREATE_ROOM = 3013;
        static JOIN_GAME_ROOM_BY_ID = 3015;
        static FIND_ROOM_LOBBY = 3016;
        static GET_XOCDIA_CONFIG = 3017;
        static CREATE_ROOM_FAIL = 3018;
    }

    export class SendMoneyBetConfig extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.MONEY_BET_CONFIG);
            this.packHeader();
            this.updateSize();
        }
    }

    export class ResMoneyBetConfig extends InPacket {
        list = [];
        rules = [];
        constructor(data: Uint8Array) {
            super(data);
            let listSize = this.getShort();
            for (var a = 0; a < listSize; a++) {
                var b = {
                    maxUserPerRoom: this.getInt(),
                    moneyType: this.getByte(),
                    moneyBet: this.getLong(),
                    moneyRequire: this.getLong(),
                    nPersion: this.getInt(),
                };
                this.list.push(b);
            }
            for (a = 0; a < listSize; a++) this.rules.push(this.getByte());
        }
    }

    export class SendGetListRoom extends OutPacket {
        constructor(moneyType: number, maxPlayer: number, param3: number, param4: number, cardFrom: number, cardTo: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.GET_LIST_ROOM);
            this.packHeader();
            this.putByte(moneyType);
            this.putByte(maxPlayer);
            this.putByte(param3);
            this.putByte(param4);
            this.putByte(cardFrom);
            this.putByte(cardTo);
            this.updateSize();
        }
    }

    export class SendJoinRoom extends OutPacket {
        constructor(type: number, max: number, bet: number, rule: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.JOIN_ROOM);
            this.packHeader();
            this.putInt(type);
            this.putInt(max);
            this.putLong(bet);
            this.putInt(rule);
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

    export class ReceivedJoinRoomFail extends InPacket {
        error = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
        }
    }
}
export default CardGameCmd;