import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import OutPacket from "../../Lobby/LobbyScript/Script/networks/Network.OutPacket";

export namespace cmd {
    export class Code {
        static SCRIBE = 5001;
        static UNSCRIBE = 5002;
        static CHANGE_ROOM = 5003;
        static BET = 5004;
        static INFO = 5005;
        static START_NEW_GAME = 5007;
        static UPDATE = 5006;
        static RESULT = 5008;
        static PRIZE = 5009;
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

    export class SendBet extends OutPacket {
        constructor(betData: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.BET);
            this.packHeader();
            this.putString(betData);
            this.updateSize();
        }
    }

    export class ReceiveBet extends InPacket {
        result = 0;
        currentMoney = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.result = this.getByte();
            this.currentMoney = this.getLong();
        }
    }

    export class ReceiveInfo extends InPacket {
        referenceId = 0;
        remainTime = 0;
        bettingState = false;
        potData = "";
        betData = "";
        lichSuPhien = "";
        dice1 = 0;
        dice2 = 0;
        dice3 = 0;
        xPot = 0;
        xValue = 0;
        room = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.referenceId = this.getLong();
            this.remainTime = this.getByte();
            this.bettingState = this.getBool();
            this.potData = this.getString();
            this.betData = this.getString();
            this.lichSuPhien = this.getString();
            this.dice1 = this.getByte();
            this.dice2 = this.getByte();
            this.dice3 = this.getByte();
            this.xPot = this.getByte();
            this.xValue = this.getByte();
            this.room = this.getByte();
        }
    }

    export class ReceiveNewGame extends InPacket {
        referenceId = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.referenceId = this.getLong();
        }
    }

    export class ReceiveUpdate extends InPacket {
        potData = "";
        remainTime = 0;
        bettingState = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.potData = this.getString();
            this.remainTime = this.getByte();
            this.bettingState = this.getByte();
        }
    }

    export class ReceiveResult extends InPacket {
        dice1 = 0;
        dice2 = 0;
        dice3 = 0;
        xPot = 0;
        xValue = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.dice1 = this.getByte();
            this.dice2 = this.getByte();
            this.dice3 = this.getByte();
            this.xPot = this.getByte();
            this.xValue = this.getByte();
        }
    }

    export class ReceivePrize extends InPacket {
        prize = 0;
        currentMoney = 0;
        room = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.prize = this.getLong();
            this.currentMoney = this.getLong();
            this.room = this.getByte();
        }
    }
}
export default cmd;