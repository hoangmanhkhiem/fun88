import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import OutPacket from "../../Lobby/LobbyScript/Script/networks/Network.OutPacket";

const { ccclass } = cc._decorator;

export namespace cmd {
    export class ReceiveDateX2 extends InPacket {
        
        ngayX2 = "";
        remain = 0;
        currentMoney = 0;
        freeSpin = 0;
        lines = "";
        currentRoom = 0;

      
        constructor(data: Uint8Array) {
            super(data);
           
            this.ngayX2 = this.getString();
            this.remain = this.getByte();
            this.currentMoney = this.getLong();
            this.freeSpin = this.getByte();
            this.lines = this.getString();
            this.currentRoom = this.getByte();
        }
    }

    export class ReceiveFreeDaiLy extends InPacket {
      
        freeSpin = 0;

      
        constructor(data: Uint8Array) {
            super(data);
           
            this.freeSpin = this.getByte();
            
        }
    }
    export class Code {
        static SUBCRIBE = 4003;
        static UNSUBCRIBE = 4004;
        static CHANGE_ROOM = 4005;
        static PLAY = 4001;
        static UPDATE_POT = 4002;
        static AUTO = 4006;
        static FORCE_STOP_AUTO = 4008;
        static DATE_X2 = 4009;
        static BIG_WIN = 4010;
        static FREE = 4011;
        static FREE_DAI_LY = 4012;
        static MINIMIZE = 4013;
        static UPDATE_JACKPOT_SLOTS = 10003;
        static SUBCRIBE_HALL_SLOT = 10001;
    }
    export class SendSubcribe extends OutPacket {
        constructor(roomId: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SUBCRIBE);
            this.packHeader();
            this.putByte(roomId);
            this.updateSize();
        }
    }
    export class SendUnSubcribe extends OutPacket {
        constructor(roomId: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.UNSUBCRIBE);
            this.packHeader();
            this.putByte(roomId);
            this.updateSize();
        }
    }
    export class SendPlay extends OutPacket {
        constructor(lines: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.PLAY);
            this.packHeader();
            this.putString(lines);
            this.updateSize();
        }
    }
    export class SendChangeRoom extends OutPacket {
        constructor(roomLeavedId: number, roomJoinedId: number) {
            super();
            cc.log("room leave: " + roomLeavedId + ", room join: " + roomJoinedId);
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CHANGE_ROOM);
            this.packHeader();
            this.putByte(roomLeavedId);
            this.putByte(roomJoinedId);
            this.updateSize();
        }
    }
    export class ReceiveUpdatePot extends InPacket {
        jackpot = 0;
        x2 = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.jackpot = this.getLong();
            this.x2 = this.getByte();
        }
    }

    export class ResUpdateJackpotSlots extends InPacket {
        pots = "";

        constructor(data: Uint8Array) {
            super(data);
            this.pots = this.getString()
        }
    }
    export class ReceivePlay extends InPacket {
        ref = 0;
        result = 0;
        matrix = "";
        linesWin = "";
        haiSao = "";
        prize = 0;
        currentMoney = 0;
        freeSpin = 0;
        isFree = false;
        itemsWild = "";
        ratio = 0;
        currentNumberFreeSpin = 0;
        
        constructor(data: Uint8Array) {
            super(data);
            this.ref = this.getLong();
            this.result = this.getByte();
            this.matrix = this.getString();
            this.linesWin = this.getString();
            this.haiSao = this.getString();
            this.prize = this.getLong();
            this.currentMoney = this.getLong();
            this.freeSpin = this.getByte();
            this.isFree = this.getBool();
            this.itemsWild = this.getString();
            this.ratio = this.getByte();
            this.currentNumberFreeSpin = this.getByte();
        }
    }

    export class ReqSubcribeHallSlot extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SUBCRIBE_HALL_SLOT);
            this.packHeader();
            this.updateSize();
        }
    }
}
export default cmd;