import LotoController from "./Loto.Controller";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    labelValue: cc.Label = null;

    private itemInfo = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    initItem(numCount, data) {
        this.itemInfo = data;
        this.formatName(numCount);
    }

    formatName(numCount) {
        var text = this.itemInfo;
        if (numCount == 10) {

        } else if (numCount == 100) {
            if (this.itemInfo < 10) {
                text = "0" + this.itemInfo;
            }
        } else {
            if (this.itemInfo < 10) {
                text = "00" + this.itemInfo;
            } else if (this.itemInfo < 100) {
                text = "0" + this.itemInfo;
            }
        }
        this.labelValue.string = text;
    }

    choose() {
        let state = this.node.getComponent(cc.Toggle).isChecked;
        if (state) {
            LotoController.instance.addNumberPicked(this.labelValue.string);
        } else {
            LotoController.instance.removeNumberPicked(this.labelValue.string);
        }
    }

    // update (dt) {}
}
