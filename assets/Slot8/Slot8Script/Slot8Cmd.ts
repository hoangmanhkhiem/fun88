import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import OutPacket from "../../Lobby/LobbyScript/Script/networks/Network.OutPacket";

const { ccclass } = cc._decorator;

export namespace cmd {
    export class Code {
        static SUBCRIBE = 5003;
        static UNSUBCRIBE = 5004;
        static CHANGE_ROOM = 5005;
        static PLAY = 5001;
        static UPDATE_RESULT = 5001;
        static UPDATE_POT = 5002;
        static AUTO = 5006;
        static STOP_AUTO = 5006;
        static FORCE_STOP_AUTO = 5008;
        static DATE_X2 = 5009;
        static BIG_WIN = 5010;
        static FREE = 5011;
        static FREE_DAI_LY = 5012;
        static MINIMIZE = 5013;
        static UPDATE_JACKPOT_SLOTS = 10003;
        static SUBCRIBE_HALL_SLOT = 10001;
    }
    export class ReceiveFreeDaiLy extends InPacket {
      
        freeSpin = 0;
        constructor(data: Uint8Array) {
            super(data);
            this.freeSpin = this.getByte();
        }
    }
    export class ResUpdateJackpotSlots extends InPacket {
        pots = "";

        constructor(data: Uint8Array) {
            super(data);
            this.pots = this.getString()
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
            // //  cc.log("SendChangeRoom roomLeavedId:"+roomLeavedId+" roomJoinedId:"+roomJoinedId);
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
        valueRoom1 = 0;
        valueRoom2 = 0;
        valueRoom3 = 0;
      
        x21 = 0;
        x22 = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.valueRoom1 = this.getLong();
            this.valueRoom2 = this.getLong();
            this.valueRoom3 = this.getLong();
            
            this.x21 = this.getByte();
            this.x22 = this.getByte();
        }
    }
    export class ReceiveResult extends InPacket {
        ref = 0;
        result = 0;
        matrix = "";
        linesWin = "";
        haiSao = "";
        prize = 0;
        currentMoney = 0;
        isFreeSpin = 0;
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
            this.isFreeSpin = this.getByte();
            this.ratio = this.getByte();
            this.currentNumberFreeSpin = this.getByte();
        }
    }

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