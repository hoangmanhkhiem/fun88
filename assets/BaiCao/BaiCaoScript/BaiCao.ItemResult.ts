import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
const { ccclass, property } = cc._decorator;

@ccclass
export default class BaiCaoItemResult extends cc.Component {

    @property(cc.Label)
    labelUserName: cc.Label = null;
    @property(cc.Label)
    labelBet: cc.Label = null;
    @property(cc.Label)
    labelBien: cc.Label = null;
    @property(cc.Label)
    labelKe: cc.Label = null;
    @property(cc.Label)
    labelGa: cc.Label = null;
    @property(cc.Label)
    labelTotal: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    initItem(info) {
        this.labelUserName.string = info.userName;
        this.labelBet.string = Utils.formatNumber(info.bet);
        this.labelBien.string = Utils.formatNumber(info.bien);
        this.labelKe.string = Utils.formatNumber(info.ke);
        this.labelGa.string = Utils.formatNumber(info.ga);
        this.labelTotal.string = Utils.formatNumber(info.total);

        this.labelBet.node.color = info.bet > 0 ? cc.Color.YELLOW : cc.Color.WHITE;
        this.labelBien.node.color = info.bien > 0 ? cc.Color.YELLOW : cc.Color.WHITE;
        this.labelKe.node.color = info.ke > 0 ? cc.Color.YELLOW : cc.Color.WHITE;
        this.labelGa.node.color = info.ga > 0 ? cc.Color.YELLOW : cc.Color.WHITE;
        this.labelTotal.node.color = info.total > 0 ? cc.Color.YELLOW : cc.Color.WHITE;
    }

    // update (dt) {}
}
