import Configs from "../../Loading/src/Configs";
import App from "../../Lobby/LobbyScript/Script/common/App";
import NetworkClient from "../../Lobby/LobbyScript/Script/networks/Network.NetworkClient";
import NetworkListener from "../../Lobby/LobbyScript/Script/networks/Network.NetworkListener";
import OutPacket from "../../Lobby/LobbyScript/Script/networks/Network.OutPacket";

export default class LiengNetworkClient extends NetworkClient {
    private static instance: LiengNetworkClient;

    private listeners: Array<NetworkListener> = new Array<NetworkListener>();

    public static getInstance(): LiengNetworkClient {
        if (this.instance == null) {
            this.instance = new LiengNetworkClient();
        }
        return this.instance;
    }

    constructor() {
        super();
        this.isUseWSS = Configs.App.USE_WSS;
    }

    public connect() {
        super.connect(Configs.App.HOST_LIENG.host, Configs.App.HOST_LIENG.port);
    }

    protected onOpen(ev: Event) {
        super.onOpen(ev);
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
}
