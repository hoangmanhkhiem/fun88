import NetworkClient from "./Network.NetworkClient";
import OutPacket from "./Network.OutPacket";
import NetworkListener from "./Network.NetworkListener";
import InPacket from "./Network.InPacket";
import cmd from "./Network.Cmd";
import App from "../common/App";
import Configs from "../../../../Loading/src/Configs";
import Utils from "../common/Utils";

export default class MiniGameNetworkClient2 extends NetworkClient {
    private static instance: MiniGameNetworkClient2;

    private listeners: Array<NetworkListener> = new Array<NetworkListener>();
    private isLogin = false;
    private onLogined: () => void = null;

    private intervalPing: number = -1;

    public static getInstance(): MiniGameNetworkClient2 {
        if (this.instance == null) {
            this.instance = new MiniGameNetworkClient2();
        }
        return this.instance;
    }

    constructor() {
        super();
        this.isUseWSS = Configs.App.USE_WSS;
    }

    public checkConnect(onLogined: () => void = null) {
         //Utils.Log("checkConnect MiniGame");
        this.onLogined = onLogined;
        if (this.ws != null && this.ws.readyState == WebSocket.CONNECTING) return;
        if (!this.isConnected()) {
            // App.instance.showErrLoading("Đang vào game...");
            this.connect();
            return;
        }
        if (this.isLogin && this.onLogined != null) this.onLogined();
    }

    protected onError(ev: Event) {
        App.instance.showLoading(false);
         //Utils.Log("onError minigame:" + JSON.stringify(ev));
    }

    connect() {
        super.connect(Configs.App.HOST_MINIGAME2.host, Configs.App.HOST_MINIGAME2.port);
         //Utils.Log("Port Mini Game:"+ Configs.App.HOST_MINIGAME2.port);
    }

    protected onOpen(ev: Event) {
        super.onOpen(ev);
        this.send(new cmd.SendLogin(Configs.Login.Nickname, Configs.Login.AccessToken));
         //Utils.Log("minigame connected:"+Configs.Login.AccessToken);
        App.instance.showLoading(false);
        this.intervalPing = setInterval(() => this.ping(), 1);
        this.ping();
    }

    protected onMessage(ev: MessageEvent) {
        var data = new Uint8Array(ev.data);
        for (var i = 0; i < this.listeners.length; i++) {
            var listener = this.listeners[i];
            if (listener.target && listener.target instanceof Object && listener.target.node) {
                listener.callback(data);
            } else {
                this.listeners.splice(i, 1);
                i--;
            }
        }

        let inpacket = new InPacket(data);
        switch (inpacket.getCmdId()) {
            case cmd.Code.LOGIN:
                this.isLogin = true;
                if (this.onLogined != null) {
                     //Utils.Log("Logined");
                    this.onLogined();
                }
                break;
        }
    }

    public addListener(callback: (data: Uint8Array) => void, target: cc.Component) {
        this.listeners.push(new NetworkListener(target, callback));
    }

    protected onClose(ev: Event) {
         //Utils.Log("onclose minigame");
        super.onClose(ev);
    }

    public send(packet: OutPacket) {
        for (var b = new Int8Array(packet._length), c = 0; c < packet._length; c++)
            b[c] = packet._data[c];
        if (this.ws != null && this.isConnected())
            this.ws.send(b.buffer);
    }

    public sendCheck(packet: OutPacket) {
        this.checkConnect(() => {
            this.send(packet);
        });
    }
    public ping() {
        if (this.ws != null && this.ws.readyState !== WebSocket.OPEN) {
            //  //Utils.Log("WebSocket minigame instance wasn't ready...");
        };
    }
}
