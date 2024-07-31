import LotoController from "./Loto.Controller";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    labelName: cc.Label = null;

    private itemInfo = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    initItem(data) {
        this.itemInfo = data;
        this.labelName.string = data.name;
    }

    itemClicked() {
        //  cc.log("Loto.ItemLocation itemClicked : ", this.itemInfo);
        LotoController.instance.onBetChannelSelected(this.itemInfo.from, this.itemInfo.id);
    }

    updateInfo(newFrom) {
        this.itemInfo.from = newFrom;
        //  cc.log("Loto.ItemLocation itemClicked : ", this.itemInfo);
    }

    // update (dt) {}
}
