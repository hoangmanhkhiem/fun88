import Utils from "../common/Utils";
import NetworkListener from "./Network.NetworkListener";

export default class NetworkClient {
    ws: WebSocket = null;
    host: string = "";
    port: number = 0;
    isForceClose = false;
    isUseWSS: boolean = false;
    isAutoReconnect: boolean = true;
    retryCount = 0;

    _onOpenes: Array<NetworkListener> = [];
    _onCloses: Array<NetworkListener> = [];

    connect(host: string, port: number) {
        //  //Utils.Log("start connect: " + host + ":" + port + " =>" + cc.url.raw("resources/raw/cacert.pem"));
        this.isForceClose = false;
        this.host = host;
        this.port = port;
        if (this.ws == null) {

            if (cc.sys.isBrowser) {
                this.ws = new WebSocket("wss://" + host + ":" + port + "/websocket");
            } else {
                if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
                    this.ws = new WebSocket("wss://" + host + ":" + port + "/websocket", [], cc.url.raw("resources/raw/cacert.pem"));
                    this.ws.binaryType = "arraybuffer";
                } else {
                    this.ws = new WebSocket("wss://" + host + ":" + port + "/websocket");
                }
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
                this.connect(host, port);
            }
        }
    }

    protected onOpen(ev: Event) {
         //Utils.Log("onOpen");
        this.retryCount = 0;
        for (var i = 0; i < this._onOpenes.length; i++) {
            var listener = this._onOpenes[i];
            if (listener.target && listener.target instanceof Object && listener.target.node) {
                listener.callback(null);
            } else {
                this._onOpenes.splice(i, 1);
                i--;
            }
        }
    }

    protected onMessage(ev: MessageEvent) {
        //  //Utils.Log("onmessage: " + ev.data);
    }

    protected onError(ev: Event) {
         //Utils.Log("onError");
    }

    protected onClose(ev: Event) {
         //Utils.Log("onClose");
        for (var i = 0; i < this._onCloses.length; i++) {
            var listener = this._onCloses[i];
            if (listener.target && listener.target instanceof Object && listener.target.node) {
                listener.callback(null);
            } else {
                this._onCloses.splice(i, 1);
                i--;
            }
        }
        if (this.isAutoReconnect && !this.isForceClose) {
            setTimeout(() => {
                if (!this.isForceClose) this.connect(this.host, this.port);
            }, 2000);
        }
    }

    addOnOpen(callback: () => void, target: cc.Component) {
        this._onOpenes.push(new NetworkListener(target, callback));
    }

    addOnClose(callback: () => void, target: cc.Component) {
        this._onCloses.push(new NetworkListener(target, callback));
    }

    close() {
        this.isForceClose = true;
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    isConnected() {
        if (this.ws) {
            return this.ws.readyState == WebSocket.OPEN;
        }
        return false;
    }
}