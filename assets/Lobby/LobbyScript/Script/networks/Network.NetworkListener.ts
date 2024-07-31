export default class NetworkListener {
    target: cc.Component;
    callback: (data: Uint8Array) => void;

    constructor(target: cc.Component, callback: (data: Uint8Array) => void) {
        this.target = target;
        this.callback = callback;
    }
}