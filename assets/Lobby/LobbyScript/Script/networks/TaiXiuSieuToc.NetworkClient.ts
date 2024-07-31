import Configs from "../../../../Loading/src/Configs";
import App from "../common/App";
import Utils from "../common/Utils";
import NetworkListener from "./Network.NetworkListener";
import SockJsClient from "./Network.SockJsClient";
export default class TaiXiuSTNetworkClient extends SockJsClient {
    private static instance: TaiXiuSTNetworkClient;
    token = "";
    public static TaiXiuSieuTocController = null;
    isOpenGame = false;
    private listeners: Array<NetworkListener> = new Array<NetworkListener>();
    public static getInstance(): TaiXiuSTNetworkClient {
        if (this.instance == null) {
            this.instance = new TaiXiuSTNetworkClient();
        }
        return this.instance;
    }
    connect() {
        super.connect(Configs.App.HOST_SOCKJS + Configs.App.SOCKJS_LOGIN + "?access_token=" + Configs.Login.AccessTokenSockJs, Configs.App.TXST_SUB_TOPIC);
    }
    public addListener(callback: (data: Uint8Array) => void, target: cc.Component) {
        this.listeners.push(new NetworkListener(target, callback));
    }
    protected onMessage(data) {
        for (var i = 0; i < this.listeners.length; i++) {
            var listener = this.listeners[i];
            if (listener.target && listener.target instanceof Object && listener.target.node) {
                listener.callback(data);
            } else {
                this.listeners.splice(i, 1);
                i--;
            }
        }
    }
    onCustomMessage(msg, data = null) {
        super.onCustomMessage(msg, data);
        switch (msg) {
            case "SUBSCRIBE":
                 //Utils.Log(data);
                this.listSubChannel.push(data); // add sub-id to list to check later in game;
                if (data.destination == "/user/queue/tx") {
                    TaiXiuSTNetworkClient.TaiXiuSieuTocController.gameSubscribeId = data.id;
                }
                break;
            case "UNSUBSCRIBE"://event unsubscribe delete sub-id to check subscribed channel in game  before send data
                 //Utils.Log(data);
                for (let i = 0; i < this.listSubChannel.length; i++) {
                    if (this.listSubChannel[i].id == data.id) {
                        this.subscribe(this.listSubChannel[i].destination);
                        this.listSubChannel.splice(i, 1);
                        break;
                    }
                }
                break;
            case "ONCLOSE":
                this.onClose("ONCLOSE");
                break;
        }

    }
    onConnected() {
        super.onConnected();
        if (this.isOpenGame) {
            App.instance.openMiniGameTaiXiuSieuToc("TaiXiuSieuToc", "TaiXiuSieuToc");
            this.isOpenGame = false;
        }
    }
    sendBet(data) {
         //Utils.Log("data Bet==", data);
        this.send("/topic/bet", JSON.stringify(data));
    }
    sendChat(data) {
        this.send("/topic/chats", JSON.stringify(data));
    }
    getChatHistory() {
        let data: any = {};
        this.send("/topic/public", JSON.stringify(data));
    }
    getHistorySession() {
         //Utils.Log("getHistorySession");
        let data: any = {};
        this.send("/topic/lichsuphien", JSON.stringify(data));
    }
    checkConnect(cb) {
        if (this.isConnected && this.isLogin) {
            cb();
        } else {
            this.reconnect();
        }
    }

    protected send(destination, data) {
        var headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + this.token
        };
         //Utils.Log("Bearer " + this.token);
        this.stompClient.send(destination, headers, data);
    }
    protected onClose(event) {
        super.onClose(event);
        if (TaiXiuSTNetworkClient.TaiXiuSieuTocController != null) {
            TaiXiuSTNetworkClient.TaiXiuSieuTocController.dismiss();
        }
    }
    getHistory(page, size, onFinished) {
        let url = Configs.App.HOST_SOCKJS + "api/tx/lichsucuoc?page=%d&size=%d&sort=id%2Cdesc";
        url = cc.js.formatStr(url, page, size);
        this.requestAPI(url, onFinished);
    }
    getHistorySessionId(sessionid, onFinished) {
        let url = Configs.App.HOST_SOCKJS + "api/tx/thongkephien/" + sessionid;
        this.requestAPI(url, onFinished);
    }
    getTopHonor() {
        // let url = Configs.App.HOST_SOCKJS + "api/tx-ranks";
        // this.requestAPI(url, onFinished, "GET");
        let data: any = {};
        this.send("/topic/ranktx", JSON.stringify(data));
    }
    requestAPI(url: string, onFinished: (err: any, json: any) => void, method = "POST") {
        var xhr = new XMLHttpRequest();
         //Utils.Log("url==" + url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var data = null;
                    var e = null;
                    try {
                        data = JSON.parse(xhr.responseText);
                    } catch (ex) {
                        e = ex;
                    }
                    onFinished(e, data);
                } else {
                    onFinished(xhr.status, null);
                }
            }
        };
         //Utils.Log("Method==" + method);
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${this.token}`);
        xhr.send();

    }
}
