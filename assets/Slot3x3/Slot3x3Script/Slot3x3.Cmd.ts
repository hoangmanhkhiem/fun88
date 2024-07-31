import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import OutPacket from "../../Lobby/LobbyScript/Script/networks/Network.OutPacket";

export namespace cmd {
    export class Code {
        static SCRIBE = 7003;
        static UNSCRIBE = 7004;
        static CHANGE_ROOM = 7005;
        static SPIN = 7001;
        static UPDATE_JACKPOT = 7002;
    }

    export class SendScribe extends OutPacket {
        constructor(betIdx: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SCRIBE);
            this.packHeader();
            this.putByte(betIdx);
            this.updateSize();
        }
    }

    export class SendUnScribe extends OutPacket {
        constructor(betIdx: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.UNSCRIBE);
            this.packHeader();
            this.putByte(betIdx);
            this.updateSize();
        }
    }

    export class SendChangeRoom extends OutPacket {
        constructor(oldBetIdx: number, newBetIdx: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CHANGE_ROOM);
            this.packHeader();
            this.putByte(oldBetIdx);
            this.putByte(newBetIdx);
            this.updateSize();
        }
    }

    export class SendSpin extends OutPacket {
        constructor(betValue: number, betLines: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SPIN);
            this.packHeader();
            this.putInt(betValue);
            this.putString(betLines);
            this.updateSize();
        }
    }

    export class ReceiveUpdateJackpot extends InPacket {
        value = 0;
        x2 = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.value = this.getLong();
            this.x2 = this.getByte()
        }
    }

    export class ReceiveSpin extends InPacket {
        result = 0;
        matrix = "";
        linesWin = "";
        prize = 0;
        currentMoney = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.result = this.getByte();
            this.matrix = this.getString();
            this.linesWin = this.getString();
            this.prize = this.getLong();
            this.currentMoney = this.getLong()
        }
    }
}
export default cmd;