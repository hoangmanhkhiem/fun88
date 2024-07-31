

export namespace cmd {
    export class Code {
        static CMD_51S = 5;
        static CMD_50S = 1;
        static CMD_14S = 2;
        static CMD_BET = 3;
        static CMD_WIN_USER = 4;
        static CMD_REFUND_USER = 7;
        static CMD_HISTORY = 6;
        static CMD_TXRECORD_HISTORY = 8;
        static CMD_THONGKE_PHIEN = 9;
        static CMD_CHAT = 10;
        static CMD_CHAT_ALL = 11;
        static CMD_MAINTAIN = 12;
        static CMD_USER_BET = 13;
        static CMD_TOP_HONOR = 14;
        static CMD_DIS_TX = 20;
    }
    export class API {
        static LOGIN = "api/login";
        static WS = "websocket/ws-taixiu";
        static USER = "/user/queue/tx";
        static DISCONNECT = "/queue/disconnect";
        static CHAT = "/topic/chats"
        static HISTORY_BET = 'api/tx/lichsucuoc';
    }
}
export default cmd;
