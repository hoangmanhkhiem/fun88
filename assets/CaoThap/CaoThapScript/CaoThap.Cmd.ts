
import Configs from "../../Loading/src/Configs";
import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import OutPacket from "../../Lobby/LobbyScript/Script/networks/Network.OutPacket";

const { ccclass, property } = cc._decorator;

export namespace cmd {
    export class Code {
        static SCRIBE = 6004;
        static UNSCRIBE = 6005;
        static START = 6001;
        static PLAY = 6002;
        static CHANGE_ROOM = 6006;
        static UPDATE_TIME = 6008;
        static UPDATE_INFO = 6009;
        static UPDATE_JACKPOT = 6003;
        static STOP = 6007;
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

    export class ReceiveScribe extends InPacket {
        status = 0;
        roomId = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.status = this.getByte();
            this.roomId = this.getByte();
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

    export class ReceiveChangeRoom extends InPacket {
        status = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.status = this.getByte();
        }
    }

    export class SendStart extends OutPacket {
        constructor(betValue: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.START);
            this.packHeader();
            this.putInt(betValue);
            this.putByte(Configs.App.MONEY_TYPE);
            this.updateSize();
        }
    }

    export class ReceiveStart extends InPacket {
        error = 0;
        referenceId = 0;
        card = 0;
        money1 = 0;
        money2 = 0;
        money3 = 0;
        currentMoney = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.referenceId = this.getLong();
            this.card = this.getByte();
            this.money1 = this.getLong();
            this.money2 = this.getLong();
            this.money3 = this.getLong();
            this.currentMoney = this.getLong();
        }
    }

    export class SendPlay extends OutPacket {
        constructor(betValue: number, isUp: boolean) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.PLAY);
            this.packHeader();
            this.putInt(betValue);
            this.putByte(Configs.App.MONEY_TYPE);
            this.putByte(isUp ? 1 : 0);
            this.updateSize();
        }
    }

    export class ReceivePlay extends InPacket {
        card = 0;
        money1 = 0;
        money2 = 0;
        money3 = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.card = this.getByte();
            this.money1 = this.getLong();
            this.money2 = this.getLong();
            this.money3 = this.getLong();
        }
    }

    export class SendStop extends OutPacket {
        constructor(betValue: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.STOP);
            this.packHeader();
            this.putInt(betValue);
            this.putByte(Configs.App.MONEY_TYPE);
            this.updateSize();
        }
    }

    export class ReceiveStop extends InPacket {
        result = 0;
        currentMoney = 0;
        moneyExchange = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.result = this.getByte();
            this.currentMoney = this.getLong();
            this.moneyExchange = this.getLong();
        }
    }

    export class ReceiveUpdateInfo extends InPacket {
        numA = 0;
        card = 0;
        money1 = 0;
        money2 = 0;
        money3 = 0;
        time = 0;
        step = 0;
        referenceId = 0;
        cards = "";

        constructor(data: Uint8Array) {
            super(data);
            this.numA = this.getByte();
            this.card = this.getByte();
            this.money1 = this.getLong();
            this.money2 = this.getLong();
            this.money3 = this.getLong();
            this.time = this.getShort();
            this.step = this.getByte();
            this.referenceId = this.getLong();
            this.cards = this.getString();
        }
    }

    export class ReceiveUpdateJackpot extends InPacket {
        value = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.value = this.getLong();
        }
    }

    export class ReceiveUpdateTime extends InPacket {
        time = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.time = this.getShort();
        }
    }
}
export default cmd;
