import LiengController from "./Lieng.Controller";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LiengItemRoom extends cc.Component {

    @property(cc.Label)
    labelBet: cc.Label = null;
    @property(cc.Label)
    labelBetMin: cc.Label = null;
    @property(cc.Label)
    labelNumPlayers: cc.Label = null;

    private roomInfo = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    initItem(info) {
        this.roomInfo = info;

        this.labelBet.string = Utils.formatNumber(info["moneyBet"]);
        this.labelBetMin.string = Utils.formatNumber(info["requiredMoney"]);
        this.labelNumPlayers.string = info["userCount"] + "/" + info["maxUserPerRoom"];
    }

    chooseRoom() {
      //  console.log('444');
        LiengController.instance.joinRoom(this.roomInfo);
    }

    // update (dt) {}
}
