import Configs from "../../../Loading/src/Configs";
import InPacket from "../../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import OutPacket from "../../../Lobby/LobbyScript/Script/networks/Network.OutPacket";

const { ccclass, property } = cc._decorator;

export namespace cmd {
    export class Code {
        static SCRIBE = 2000;
        static UNSCRIBE = 2001;
        static BET = 2110;
        static HISTORIES = 2116;
        static GAME_INFO = 2111;
        static UPDATE_TIME = 2112;
        static DICES_RESULT = 2113;
        static RESULT = 2114;
        static NEW_GAME = 2115;
        static REFUND = 2200;
        static JACKPOT = 2199;
        static LOG_CHAT = 18003;
        static SEND_CHAT = 18000;
        static SCRIBE_CHAT = 18001;
        static UNSCRIBE_CHAT = 18002;
    }

    export class SendScribe extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SCRIBE);
            this.packHeader();
            this.putShort(Configs.GameId.TaiXiu);
            this.putShort(Configs.App.MONEY_TYPE);
            this.updateSize();
        }
    }

    export class SendUnScribe extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.UNSCRIBE);
            this.packHeader();
            this.putShort(Configs.GameId.TaiXiu);
            this.putShort(Configs.App.MONEY_TYPE);
            this.updateSize();
        }
    }

    export class SendScribeChat extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SCRIBE_CHAT);
            this.packHeader();
            this.updateSize();
        }
    }

    export class SendUnScribeChat extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.UNSCRIBE_CHAT);
            this.packHeader();
            this.updateSize();
        }
    }

    export class SendChat extends OutPacket {
        constructor(message: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SEND_CHAT);
            this.packHeader();
            this.putString(message);
            this.updateSize();
        }
    }

    export class SendBet extends OutPacket {
        constructor(referenceId: number, betValue: number, door: number, remainTime: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.BET);
            this.packHeader();
            this.putInt(1);
            this.putLong(referenceId);
            this.putLong(betValue);
            this.putShort(Configs.App.MONEY_TYPE);
            this.putShort(door);
            this.putShort(remainTime);
            this.updateSize();
        }
    }

    export class ReceiveGameInfo extends InPacket {
        gameId = 0;
        moneyType = 0;
        referenceId = 0;
        remainTime = 0;
        bettingState = false;
        potTai = 0;
        potXiu = 0;
        betTai = 0;
        betXiu = 0;
        dice1 = 0;
        dice2 = 0;
        dice3 = 0;
        remainTimeRutLoc = 0;
        jpTai = 0;
        jpXiu = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.gameId = this.getShort();
            this.moneyType = this.getShort();
            this.referenceId = this.getLong();
            this.remainTime = this.getShort();
            this.bettingState = this.getBool();
            this.potTai = this.getLong();
            this.potXiu = this.getLong();
            this.betTai = this.getLong();
            this.betXiu = this.getLong();
            this.dice1 = this.getShort();
            this.dice2 = this.getShort();
            this.dice3 = this.getShort();
            this.remainTimeRutLoc = this.getShort();
            this.jpTai = this.getLong();
            this.jpXiu = this.getLong();
        }
    }

    export class ReceiveUpdateTime extends InPacket {
        remainTime = 0;
        bettingState = false;
        potTai = 0;
        potXiu = 0;
        numBetTai = 0;
        numBetXiu = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.remainTime = this.getShort();
            this.bettingState = this.getBool();
            this.potTai = this.getLong();
            this.potXiu = this.getLong();
            this.numBetTai = this.getShort();
            this.numBetXiu = this.getShort();
        }
    }

    export class ReceiveDicesResult extends InPacket {
        result = 0;
        dice1 = 0;
        dice2 = 0;
        dice3 = 0;


        constructor(data: Uint8Array) {
            super(data);
            this.result = this.getShort();
            this.dice1 = this.getShort();
            this.dice2 = this.getShort();
            this.dice3 = this.getShort();

        }
    }

    export class ReceiveResult extends InPacket {
        moneyType = 1;
        totalMoney = 0;
        currentMoney = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.moneyType = this.getShort();
            this.totalMoney = this.getLong();
            this.currentMoney = this.getLong()
        }
    }

    export class ReceiveRefund extends InPacket {
        moneyRefund = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.moneyRefund = this.getLong();
        }
    }
    export class ReceiveNewGame extends InPacket {
        referenceId = 0;
        remainTimeRutLoc = 0;
        jpTai = 0;
        jpXiu = 0;
        constructor(data: Uint8Array) {
            super(data);
            this.referenceId = this.getLong();
            this.remainTimeRutLoc = this.getShort();
            this.jpTai = this.getLong();
            this.jpXiu = this.getLong();
        }
    }

    export class ReceiveHistories extends InPacket {
        data = "";

        constructor(data: Uint8Array) {
            super(data);
            this.data = this.getString();
        }
    }

    export class ReceiveBet extends InPacket {
        result = 0;
        currentMoney = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.result = this.getError();
            this.currentMoney = this.getLong();
        }
    }
    export class ReceiveJackpotWin extends InPacket {
        jackpot = 0;
        nickname = "";
        idSession = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.idSession = this.getLong();
            this.jackpot = this.getLong();
            this.nickname = this.getString();
        }
    }

    export class ReceiveLogChat extends InPacket {
        message = "";
        minVipPoint = 0;
        timeBan = 0;
        userType = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.message = this.getString();
            this.minVipPoint = this.getByte();
            this.timeBan = this.getLong();
            this.userType = this.getByte()
        }
    }

    export class ReceiveSendChat extends InPacket {
        error = 0;
        nickname = "";
        message = "";

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.nickname = this.getString();
            this.message = this.getString()
        }
    }
}
export default cmd;