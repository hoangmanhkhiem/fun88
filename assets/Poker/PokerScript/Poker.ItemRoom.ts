import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import PokerController from "./Poker.Controller";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerItemRoom extends cc.Component {

    @property(cc.Label)
    labelBet: cc.Label = null;
    @property(cc.Label)
    labelBetMin: cc.Label = null;
    @property(cc.Label)
    labelNumPlayers: cc.Label = null;
    @property(cc.Sprite)
    progressNumPlayers: cc.Sprite = null;

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
        this.progressNumPlayers.fillRange = info["userCount"] / info["maxUserPerRoom"];
    }

    chooseRoom() {
        PokerController.instance.joinRoom(this.roomInfo);
    }

    // update (dt) {}
}
