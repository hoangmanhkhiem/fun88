// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import App from "../Script/common/App";
import Dialog from "../Script/common/Dialog";
import Utils from "../Script/common/Utils";

const { ccclass, property } = cc._decorator;
@ccclass
export default class LobbyChoseBank extends Dialog {

    @property(cc.Node)
    nodeContent: cc.Node = null;

    @property(cc.Node)
    prefabItem: cc.Node = null;

    @property(cc.Node)
    nodeBox: cc.Node = null;

    @property(cc.Label)
    lbTitle: cc.Label = null;

    init(tabWell, banks, callback, isWithDraw = false) {
        this.node.active = true;
        this.nodeContent.removeAllChildren();
        this.lbTitle.string = App.instance.getTextLang('txt_select_bank').toUpperCase();
        if (tabWell == "clickpay") {
            for (var i = 0; i < banks.length; i++) {
                if (banks[i].stat == 1) {
                    var nodeItem = cc.instantiate(this.prefabItem);
                    nodeItem.parent = this.nodeContent;
                    nodeItem.getComponent("ItemChoseBank").init(tabWell, banks[i], (dataBank) => {
                        callback(dataBank);
                        this.dismiss();
                    });
                }
            }
        }
        else {
            for (var i = 0; i < banks.length; i++) {
                if (banks[i].status == 1) {
                    var nodeItem = cc.instantiate(this.prefabItem);
                    nodeItem.parent = this.nodeContent;
                    nodeItem.getComponent("ItemChoseBank").init(tabWell, banks[i], (dataBank) => {
                        callback(dataBank);
                        this.dismiss();
                    });
                }
            }
        }
        if (tabWell == "payasec") {
            this.lbTitle.string = App.instance.getTextLang('txt_select_card').toUpperCase();
        }
    }



    onBtnExit() {
        this.dismiss();
    }
}
