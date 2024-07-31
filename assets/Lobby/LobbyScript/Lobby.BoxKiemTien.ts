
import Configs from "../../Loading/src/Configs";
import { Global } from "../../Loading/src/Global";
import Http from "../../Loading/src/Http";
import App from "./Script/common/App";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoxKiemTien extends cc.Component {

    @property(cc.Label)
    lbTime: cc.Label = null;
    isMove = false;
    distance: number = 0;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (touch) => {
            this.node.setPosition(this.node.getPosition().add(touch.getDelta()));
            this.distance += Math.abs(touch.getDelta().x) + Math.abs(touch.getDelta().y);
            if (this.distance >= 70) {
                this.isMove = true;
            }
        });
        this.node.on(cc.Node.EventType.TOUCH_END, (touch) => {
            if (!this.isMove) {
                Global.LobbyController.actKiemTien();
            }
            this.isMove = false;
        });
    }

    start() {

    }
    // update (dt) {}
}
