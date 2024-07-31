import NetworkClient from "./Network.NetworkClient";
import OutPacket from "./Network.OutPacket";
import NetworkListener from "./Network.NetworkListener";
import InPacket from "./Network.InPacket";
import cmd from "./Network.Cmd";
import Configs from "../../../../Loading/src/Configs";

export default class CardGameNetworkClient extends NetworkClient {
    static instance: CardGameNetworkClient;

    listeners: Array<NetworkListener> = new Array<NetworkListener>();
    isLogin = false;
    onLogined: () => void = null;

    public static getInstance(): CardGameNetworkClient {
        if (this.instance == null) {
            this.instance = new CardGameNetworkClient();
        }
        return this.instance;
    }

    constructor() {
        super();
        this.isUseWSS = Configs.App.USE_WSS;
    }

    public checkConnect(onLogined: () => void) {
        this.onLogined = onLogined;
        if (this.ws != null && this.ws.readyState == WebSocket.CONNECTING) return;
        if (!this.isConnected()) {
            this._connect();
            return;
        }
        if (this.isLogin && this.onLogined != null) this.onLogined();
    }

    _connect() {
    }

    onOpen(ev: Event) {
        super.onOpen(ev);
        this.send(new cmd.SendLogin(Configs.Login.Nickname, Configs.Login.AccessToken));
    }

    onMessage(ev: MessageEvent) {
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
                    this.onLogined();
                }
                break;
        }
    }

    public addListener(callback: (data: Uint8Array) => void, target: cc.Component) {
        this.listeners.push(new NetworkListener(target, callback));
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
}