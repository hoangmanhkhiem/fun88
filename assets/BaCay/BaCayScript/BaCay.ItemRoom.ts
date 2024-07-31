
import Configs from "../../Loading/src/Configs";
import App from "../../Lobby/LobbyScript/Script/common/App";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import BacayRoom from "./BaCay.Room";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaCayItemRoom extends cc.Component {

    @property(cc.Label)
    labelBet: cc.Label = null;
    @property(cc.Label)
    labelBetMin: cc.Label = null;
    @property(cc.Label)
    labelNumPlayers: cc.Label = null;
    @property(cc.Sprite)
    progressNumPlayers: cc.Sprite = null;

    private roomInfo = null;
    private requireChip = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //this.node.active = false;
    }

    start() {

    }

    initItem(info) {
      //  cc.log("initItem:"+JSON.stringify(info));
        this.roomInfo = info;
        this.labelBet.string = Utils.formatNumber(info["id"]);
        this.labelBetMin.string = Utils.formatNumber(info["requiredMoney"]);
        this.requireChip = info["requiredMoney"];
        this.labelNumPlayers.string = info["userCount"] + "/" + info["maxUserPerRoom"];
        this.progressNumPlayers.fillRange = info["userCount"] / info["maxUserPerRoom"];
    }

    chooseRoom() {

        if (Configs.Login.Coin >= this.requireChip) {
            BacayRoom.instance.joinRoom(this.roomInfo);
        }
        else if (this.roomInfo["userCount"] >= this.roomInfo["maxUserPerRoom"]) {
            App.instance.showToast(App.instance.getTextLang('txt_room_err9'))
        }
        else {
            App.instance.showToast(App.instance.getTextLang('txt_not_enough'));
        }
        // BaCayController.instance.joinRoom(this.roomInfo);

    }

    // update (dt) {}
}
