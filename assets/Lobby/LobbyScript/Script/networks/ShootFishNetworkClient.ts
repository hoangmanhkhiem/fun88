import Configs from "../../../../Loading/src/Configs";
import App from "../common/App";
import Utils from "../common/Utils";

const { ccclass, property } = cc._decorator;


class NotifyListener {
    target: cc.Component;
    callback: (route: string, data: Object) => void;

    constructor(target: cc.Component, callback: (route: string, data: Object) => void) {
        this.target = target;
        this.callback = callback;
    }
}

class RequestListener {
    target: cc.Component;
    callback: (res: Object) => void;

    constructor(target: cc.Component, callback: (res: Object) => void) {
        this.target = target;
        this.callback = callback;
    }
}

class NetworkListener {
    target: cc.Component;
    callback: () => void;

    constructor(target: cc.Component, callback: () => void) {
        this.target = target;
        this.callback = callback;
    }
}

@ccclass
export default class ShootFishNetworkClient {
    private static instance: ShootFishNetworkClient;
    private static reqId = 0;
    public static MIN_PING = -1;
    public static PING = 0;
    public static TIME_DISTANCE = 0;
    private static NODE_FIXED = new cc.Node().addComponent(cc.Sprite);
    public static serverCurrentTimeMillis(): number {
        //c - s = d
        //-s = d-c
        //s = -(d-c)
        //s = -d + c
        //s = c - d
        return Date.now() - this.TIME_DISTANCE + Math.round(ShootFishNetworkClient.MIN_PING / 2);
    }
    public static systemCurrentTimeMillis(): number {
        return Date.now();
    }

    public isUseWSS: boolean = Configs.App.USE_WSS;
    public isAutoReconnect: boolean = true;

    private ws: WebSocket = null;
    private host: string = Configs.App.HOST_SHOOT_FISH.host;
    private port: number = Configs.App.HOST_SHOOT_FISH.port;
    // private host: string = "gamebaiyoyo.com";
    // private port: number = 2083;
    private isForceClose = false;
    private onOpenes: Array<NetworkListener> = [];
    private onCloses: Array<NetworkListener> = [];
    private xorKey = "dmVyeSBzZWNyZXQ";
    private requests: Object = new Object();
    private intervalPing: number = -1;

    private listeners: Array<NotifyListener> = new Array<NotifyListener>();

    private isLogining = false;
    private isLogined = false;
    private onLogined: (logined) => void = null;

    public static getInstance(): ShootFishNetworkClient {
        if (this.instance == null) {
            this.instance = new ShootFishNetworkClient();
        }
        return this.instance;
    }

    public checkConnect(onLogined: (isLogined) => void) {
        this.onLogined = onLogined;
        if (!this.isConnected()) {
            App.instance.showErrLoading("Đang kết nối tới server...");
            this.connect();
        } else if (!this.isLogined) {
            this.login();
        } else {
            this.onLogined(this.isLogined);
        }
    }

    private login() {
        if (this.isLogining) return;
        this.isLogining = true;
        App.instance.showErrLoading("Đang đăng nhập...");
        // this.request("quickLogin", {
        //     "deviceId": "shoot123456654" + Configs.Login.Nickname,
        //     "platform": "android",
        //     "language": "vi"
        // }, (res) => {
        this.request("xxenglogin", {
            "username": Configs.Login.Username,
            "password": md5(Configs.Login.Password),
            "platform": Configs.App.getPlatformName(),
        }, (res) => {
            this.isLogining = false;
            App.instance.showLoading(false);
        //    console.log(res);
            if (!res["ok"]) {
                if (this.onLogined != null) this.onLogined(false);
                return;
            }
        //    console.log("login oke");

            this.isLogined = true;
            Configs.Login.CoinFish = res["cash"];
            Configs.Login.UsernameFish = res["username"];
            Configs.Login.PasswordFish = res["password"];
            Configs.Login.UserIdFish = res["userId"];
            Configs.Login.FishConfigs = res["config"];

            if (this.onLogined != null) this.onLogined(true);
        }, ShootFishNetworkClient.NODE_FIXED);
    }

    constructor() {

    }

    private onOpen(ev: Event) {
     //   console.log("onOpen");
        this.intervalPing = setInterval(() => this.ping(), 3000);
        this.ping();

        for (let i = 0; i < this.onOpenes.length; i++) {
            let listener = this.onOpenes[i];
            if (listener.target && listener.target instanceof Object && listener.target.node) {
                listener.callback();
            } else {
                this.onOpenes.splice(i, 1);
                i--;
            }
        }

        if (this.onLogined != null) this.login();
    }

    private onMessage(ev: MessageEvent) {
        let data = new Uint8Array(ev.data);
        data = this.doXOR(data, 0, data.length);
        let pack: Object = msgpack.decode(data);
        if (pack.hasOwnProperty("msgId")) {
            if (pack["msgId"] == 0) {
                // console.log(pack);
                for (let i = 0; i < this.listeners.length; i++) {
                    let listener = this.listeners[i];
                    if (listener.target && listener.target instanceof Object && listener.target.node) {
                        listener.callback(pack["route"], pack["data"]);
                    } else {
                        this.listeners.splice(i, 1);
                        i--;
                    }
                }
            } else {
                // console.log(pack);
                if (this.requests.hasOwnProperty(pack["msgId"])) {
                    let listener: RequestListener = this.requests[pack["msgId"]];
                    if (listener.target && listener.target instanceof Object && listener.target.node) {
                        listener.callback(pack["data"]);
                    }
                    delete this.requests[pack["msgId"]];
                }
            }
        }
    }

    private onError(ev: Event) {
        App.instance.showLoading(false);
   //     console.log("onError");
    }

    private onClose(ev: Event) {
      //  console.log("onClose");
        if (this.intervalPing > 0) clearInterval(this.intervalPing);
        for (var i = 0; i < this.onCloses.length; i++) {
            var listener = this.onCloses[i];
            if (listener.target && listener.target instanceof Object && listener.target.node) {
                listener.callback();
            } else {
                this.onCloses.splice(i, 1);
                i--;
            }
        }
        if (this.isAutoReconnect && !this.isForceClose) {
            setTimeout(() => {
                if (!this.isForceClose) this.connect();
            }, 2000);
        }
    }

    private send(msg: any) {
        if (!this.isConnected()) return;
        let source = msgpack.encode(msg);
        source = this.doXOR(source, 0, source.length);
        this.ws.send(source);
    }

    private doXOR(source: Uint8Array, start: number, count: number) {
        let index = 0;
        let end = start + count;
        for (let i = start; i < end; i++) {
            source[i] = (source[i] ^ Number(this.xorKey.charAt(index % this.xorKey.length)));
            index++;
        }
        return source;
    }

    public connect() {
    //    console.log("start connect: " + this.host + ":" + this.port);
        this.isForceClose = false;
        if (this.ws == null) {
            // this.ws = new WebSocket("wss://" + host + ":" + port + "/websocket");
            if (this.isUseWSS) {
                if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
                    this.ws = new (Function.prototype.bind.apply(WebSocket, [null, "wss://" + this.host + ":" + this.port, [], cc.url.raw("resources/raw/cacert.pem")]));
                } else {
                    this.ws = new WebSocket("wss://" + this.host + ":" + this.port);
                }
            } else {
                this.ws = new WebSocket("ws://" + this.host + ":" + this.port);
            }
            this.ws.binaryType = "arraybuffer";
            this.ws.onopen = this.onOpen.bind(this);
            this.ws.onmessage = this.onMessage.bind(this);
            this.ws.onerror = this.onError.bind(this);
            this.ws.onclose = this.onClose.bind(this);
        } else {
            if (this.ws.readyState !== WebSocket.OPEN) {
                this.ws.close();
                this.ws = null;
                this.connect();
            }
        }
    }

    public addOnOpen(callback: () => void, target: cc.Component) {
        this.onOpenes.push(new NetworkListener(target, callback));
    }

    public addOnClose(callback: () => void, target: cc.Component) {
        this.onCloses.push(new NetworkListener(target, callback));
    }

    public close() {
        this.isForceClose = true;
        if (this.ws) {
            this.ws.close();
        }
    }

    public isConnected() {
        if (this.ws) {
            return this.ws.readyState == WebSocket.OPEN;
        }
        return false;
    }

    public addListener(callback: (route: string, data: Object) => void, target: cc.Component) {
        this.listeners.push(new NotifyListener(target, callback));
    }

    public request(route: string, data: any, callback: (res: Object) => void, target: cc.Component) {
        ShootFishNetworkClient.reqId++;
        if (ShootFishNetworkClient.reqId > 64999) {
            ShootFishNetworkClient.reqId = 1;
        }
        this.requests[ShootFishNetworkClient.reqId] = new RequestListener(target, callback);
        // console.log({ data: typeof data != "object" || data == null || !data ? {} : data, msgId: ShootFishNetworkClient.reqId, route: route });
        this.send({ data: typeof data != "object" || data == null || !data ? {} : data, msgId: ShootFishNetworkClient.reqId, route: route });
    }

    public notify(route: string, data: any) {
        // console.log(JSON.stringify({ data: typeof data != "object" || data == null || !data ? {} : data, msgId: 0, route: route }));
        this.send({ data: typeof data != "object" || data == null || !data ? {} : data, msgId: 0, route: route });
    }

    public ping(callback: () => void = null, target: cc.Component = null) {
        let t = Date.now();
        this.request("ping", null, (res) => {
            // console.log(res);
            ShootFishNetworkClient.PING = Date.now() - t;
            if (ShootFishNetworkClient.MIN_PING < 0 || ShootFishNetworkClient.PING < ShootFishNetworkClient.MIN_PING) {
                ShootFishNetworkClient.MIN_PING = ShootFishNetworkClient.PING;
                ShootFishNetworkClient.TIME_DISTANCE = Date.now() - res["time"];
            }
            if (callback != null) callback();
        }, target != null ? target : ShootFishNetworkClient.NODE_FIXED);
    }
}
