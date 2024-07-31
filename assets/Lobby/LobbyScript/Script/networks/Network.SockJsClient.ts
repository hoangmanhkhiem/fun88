

import Configs from '../../../../Loading/src/Configs';
import * as SockJS from '../../../../Loading/src/Sockjs.min';
// import * as SockJS from '../../../../Loading/src/sockjs114';
import * as Stomp from '../../../../Loading/src/stomp2'


import NetworkListener from './Network.NetworkListener';
import App from '../common/App';
import Utils from '../common/Utils';


export default class SockJsClient {

    ws: WebSocket = null;
    stompClient: Stomp = null;
    host: string = "";
    apiSub = "";
    port: number = 0;
    isForceClose = false;
    isConnected = false;
    isLogin = false;
    isUseWSS: boolean = false;
    isAutoReconnect: boolean = true;
    retryCount = 0;
    retrySubCount = 0;
    token = "";
    _onOpenes: Array<NetworkListener> = [];
    _onCloses: Array<NetworkListener> = [];
    listSubChannel = [];

    connect(host: string, apiSub) {
        this.token = Configs.Login.AccessTokenSockJs;
        this.isForceClose = false;
        this.host = host;
        this.apiSub = apiSub;
        if (this.ws == null) {
            if (cc.sys.isBrowser) {
                 //Utils.Log("Start Connect Game SockJs:" + host);
                this.ws = new SockJS(host);
            } else {
                host = host.replace("https", "http");
                 //Utils.Log("Start Connect Game SockJs:" + host);
                this.ws = new SockJS(host);

            }
            this.stompClient = Stomp.Stomp.over(this.ws);
            var headers = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + Configs.Login.AccessTokenSockJs
            };
            var _this = this;
            this.stompClient.connect(headers, () => {
                 //Utils.Log("STOMP CONNECTED & SUBSCRIBE");
                _this.isConnected = true;
                this.onConnected();
                this.subscribe(apiSub);
            });
            this.ws.onCustomMessage = this.onCustomMessage.bind(this);
        } else {
            if (this.ws.readyState !== WebSocket.OPEN) {
                this.ws.close();
                this.ws = null;

                this.isConnected = false;
                this.connect(host, apiSub);
            }
        }
    }
    onConnected() {
         //Utils.Log("onConnected Stomp!");
    }
    reconnect() {
        this.connect(this.host, this.apiSub);
    }
    subscribe(destination) {
        if (this.isConnected) {
            this.stompClient.subscribe(destination, (data) => {
                this.onMessage(data)
            });
        }
    }
    unSubscribe(idSub) {
        if (this.isConnected) {
            this.stompClient.unsubscribe(idSub);
        }
    }
    addOnOpen(callback: () => void, target: cc.Component) {
        this._onOpenes.push(new NetworkListener(target, callback));
    }
    addOnClose(callback: () => void, target: cc.Component) {
        this._onCloses.push(new NetworkListener(target, callback));
    }
    onCustomMessage(msg, data = null) {
         //Utils.Log("onCustomMessage:" + msg);
    }
    checkSubChannel(id) {
        let isSub = false;
        for (let i = 0; i < this.listSubChannel.length; i++) {
            if (this.listSubChannel[i].id == id) {
                isSub = true;
                break;
            }
        }
        return isSub;
    }
    protected onOpen(ev: Event) {
        this.isConnected = true;
         //Utils.Log("onOpen SOCKJS");
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
         //Utils.Log("onmessage: " + ev.data);
    }

    protected onError(ev: Event) {
         //Utils.Log("onError SOCKJS:", JSON.stringify(ev));
    }

    protected onClose(ev) {
        this.isConnected = false;
        App.instance.showToast(App.instance.getTextLang('txt_check_connect'));
        for (var i = 0; i < this._onCloses.length; i++) {
            var listener = this._onCloses[i];
            if (listener.target && listener.target instanceof Object && listener.target.node) {
                listener.callback(null);
            } else {
                this._onCloses.splice(i, 1);
                i--;
            }
        }
         //Utils.Log("onClose SOCKJS");

    }
}
