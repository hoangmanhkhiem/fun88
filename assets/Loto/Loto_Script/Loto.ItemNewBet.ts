import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import cmd from "./Loto.Cmd";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    initItem(data) {
        // <color=#ffcc00>-:</c><color=#ffffff>-</c>
        this.node.getComponent(cc.RichText).string =
            "<color=#ffcc00>" + data.nickname + " : </c><color=#ff0000>Đặt cược " + Utils.formatNumber(data.bet)
            + " Gold</c><color=#ffffff> Cược đài </c><color=#0036ff>" + cmd.Code.LOTO_CHANNEL_NAME[data.channel]
            + " </c><color=#ffffff> loại </c><color=#ff0000>" + cmd.Code.LOTO_GAME_MODE_NAME[data.mode] + "</c>"
            + " <color=#00ff9c>" + data.nums + " </c>";
    }

    // update (dt) {}
}
