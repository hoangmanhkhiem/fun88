import Configs from "../../Loading/src/Configs";
import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import OutPacket from "../../Lobby/LobbyScript/Script/networks/Network.OutPacket";

export namespace cmd {
    export class Code {
        static SCRIBE = 4003;
        static UNSCRIBE = 4004;
        static CHANGE_ROOM = 4005;
        static SPIN = 4001;
        static UPDATE_JACKPOT = 4002;
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
        constructor(betValue: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SPIN);
            this.packHeader();
            this.putLong(betValue);
            this.putShort(Configs.App.MONEY_TYPE);
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
        prize = 0;
        card1 = 0;
        card2 = 0;
        card3 = 0;
        card4 = 0;
        card5 = 0;
        currentMoney = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.result = this.getShort();
            this.prize = this.getLong();
            this.card1 = this.getByte();
            this.card2 = this.getByte();
            this.card3 = this.getByte();
            this.card4 = this.getByte();
            this.card5 = this.getByte();
            this.currentMoney = this.getLong()
        }
    }
}
export default cmd;