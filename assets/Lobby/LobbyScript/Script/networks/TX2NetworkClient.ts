import NetworkClient from "./Network.NetworkClient";
import NetworkListener from "./Network.NetworkListener";
import InPacket from "./Network.InPacket";
import cmd from "./Network.Cmd";
import OutPacket from "./Network.OutPacket";
import Configs from "../../../../Loading/src/Configs";
import Utils from "../common/Utils";

export default class TX2NetworkClient extends NetworkClient {
    private static instance: TX2NetworkClient;

    private listeners: Array<NetworkListener> = new Array<NetworkListener>();
    private isLogin = false;
    private onLogined: () => void = null;

    public static getInstance(): TX2NetworkClient {
        if (this.instance == null) {
            this.instance = new TX2NetworkClient();
        }
        return this.instance;
    }

    constructor() {
        super();
        this.isUseWSS = Configs.App.USE_WSS;
    }

    public checkConnect(onLogined: () => void = null) {
        this.onLogined = onLogined;
        if (this.ws != null && this.ws.readyState == WebSocket.CONNECTING) return;
        if (!this.isConnected()) {
            this.connect();
            return;
        }
        if (this.isLogin && this.onLogined != null) this.onLogined();
    }

     connect() {
        super.connect(Configs.App.HOST_TAI_XIU_MINI2.host, Configs.App.HOST_TAI_XIU_MINI2.port);
    }

    protected onOpen(ev: Event) {
        super.onOpen(ev);
        this.send(new cmd.SendLogin(Configs.Login.Nickname, Configs.Login.AccessToken));
         //Utils.Log("tx2 connected");
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
