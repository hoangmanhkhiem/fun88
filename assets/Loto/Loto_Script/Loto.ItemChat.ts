const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    initItem(data) {
        // <color=#ffcc00>-:</c><color=#ffffff>-</color>
        this.node.getComponent(cc.RichText).string = "<color=#ffcc00>" + data.nickname + " : </c><color=#ffffff>" + data.msg + "</color>";
    }

    // update (dt) {}
}
