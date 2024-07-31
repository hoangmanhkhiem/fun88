import MauBinhController from "./MauBinh.Controller";
const { ccclass, property } = cc._decorator;

@ccclass
export default class DragCardController extends cc.Component {

    public static instance: DragCardController = null;
    // LIFE-CYCLE CALLBACKS:

    currentTarget = null;
    other = null;
    self = null;

    onLoad() {
        DragCardController.instance = this;
    }

    start() {
        cc.director.getCollisionManager().enabled = true;
    }

    updatePos(pos_X, pos_Y) {
        // this.node.opacity = 100;
        this.node.opacity = 255;
        this.node.setPosition(pos_X, pos_Y);
    }

    endMove() {
        //  cc.log("endMove : ", this.currentTarget);
        MauBinhController.instance.completeMoveCard(this.currentTarget);
        this.node.active = false;
    }

    onCollisionEnter(other, self) {
        this.other = other.node;
        this.self = self.node;

        this.currentTarget = parseInt(this.other.name) - 1;
        MauBinhController.instance.showMoveTarget(this.currentTarget);
    }

    // update (dt) {}
}
