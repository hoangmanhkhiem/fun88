// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import App from "./Script/common/App";


const { ccclass, property } = cc._decorator;

@ccclass
export default class CanvasUpdateApp extends cc.Component {


    start() {

        // App.instance.removeAllWebView();
        App.instance.node.parent = this.node;
        // App.instance.node.setSiblingIndex(this.node.childrenCount);
        App.instance.node.zIndex = cc.macro.MAX_ZINDEX;
        App.instance.node.position = cc.v3(0, 0, 0);
    }

    onDisable() {
        App.instance.node.parent = null;
    }
}
