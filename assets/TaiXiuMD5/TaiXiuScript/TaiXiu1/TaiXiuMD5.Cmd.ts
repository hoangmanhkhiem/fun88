import Configs from "../../../Loading/src/Configs";
import InPacket from "../../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import OutPacket from "../../../Lobby/LobbyScript/Script/networks/Network.OutPacket";

const { ccclass, property } = cc._decorator;

export namespace cmdMD5 {
    export class Code {
        static SUBSCRIBE = 22000;
        static UNSUBSCRIBE = 22001;
        static BET = 22110;
        static HISTORIES = 22116;
        static GAME_INFO = 22111;
        static UPDATE_TIME = 22112;
        static DICES_RESULT = 22113;
        static RESULT = 22114;
        static NEW_GAME = 22115;
        static LOG_CHAT = 23103;
        static SEND_CHAT = 23100;
        static SUBSCRIBE_CHAT = 23101;
        static UNSUBSCRIBE_CHAT = 23102;
    }

    export class SendScribe extends OutPacket {
        constructor() {
            super();
            console.log("send subscribe md5" + Code.SUBSCRIBE);
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SUBSCRIBE);
            this.packHeader();
            this.putShort(Configs.GameId.TaiXiuMD5);
            this.putShort(Configs.App.MONEY_TYPE);
            this.updateSize();
        }
    }

    export class SendUnScribe extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.UNSUBSCRIBE);
            this.packHeader();
            this.putShort(Configs.GameId.TaiXiuMD5);
            this.putShort(Configs.App.MONEY_TYPE);
            this.updateSize();
        }
    }

    export class SendScribeChat extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SUBSCRIBE_CHAT);
            this.packHeader();
            this.updateSize();
        }
    }

    export class SendUnScribeChat extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.UNSUBSCRIBE_CHAT);
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
        md5Code = "";
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
            this.md5Code = this.getString();
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
        md5code = "";

        constructor(data: Uint8Array) {
            super(data);
            this.result = this.getShort();
            this.dice1 = this.getShort();
            this.dice2 = this.getShort();
            this.dice3 = this.getShort();
            this.md5code = this.getString();

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

    export class ReceiveNewGame extends InPacket {
        referenceId = 0;
        remainTimeRutLoc = 0;
        md5code = "";

        constructor(data: Uint8Array) {
            super(data);
            this.referenceId = this.getLong();
            this.remainTimeRutLoc = this.getShort();
            this.md5code = this.getString();
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
export default cmdMD5;