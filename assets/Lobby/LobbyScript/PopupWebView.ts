import Dialog from "./Script/common/Dialog";
import SPUtils from "./Script/common/SPUtils";

const { ccclass, property } = cc._decorator;
var TW = cc.tween

@ccclass
export default class PopupWebView extends Dialog {

    @property(cc.WebView)
    webView: cc.WebView = null;

    show1(url: string){
        this.node.active = true;

        this.node.zIndex = cc.macro.MAX_ZINDEX;
        this.webView.url = url;
    }

    actConfirm(){
        this.webView.url = "";
        this._onDismissed();
    }
}
