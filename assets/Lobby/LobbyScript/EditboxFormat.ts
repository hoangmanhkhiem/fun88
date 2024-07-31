// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Utils from "./Script/common/Utils";


const { ccclass, property } = cc._decorator;

@ccclass
export default class EditboxFormat extends cc.Component {

    private edit: cc.EditBox = null;
    @property
    isMutiple: boolean = false;
    number = 0;
    onLoad() {
        this.edit = this.node.getComponent(cc.EditBox);
    }
    onChanged() {
        var temp = Utils.ToInt(this.edit.string);
        temp = Math.abs(temp);
        this.edit.string = Utils.ToVND(temp);
        if (cc.sys.isBrowser) {
            this.edit.focus();
        }
    }

    onFormatName() {
        this.edit.string = Utils.formatName(this.edit.string);
        if (cc.sys.isBrowser) {
            this.edit.focus();
        }
    }
    onFormatNameMark() {
        this.edit.string = Utils.formatNameBank(this.edit.string);
        if (cc.sys.isBrowser) {
            this.edit.focus();
        }
    }
    onEnded() {
        setTimeout(() => {
            var temp = Utils.ToInt(this.edit.string);
            if (this.isMutiple && temp > 1000) {
                let hs = 1000
                if (temp % hs != 0) {
                    temp = temp - (temp % hs);
                }

            }
            temp = Math.abs(temp);
            this.edit.string = Utils.ToVND(temp);
        }, 200);

    }


}
