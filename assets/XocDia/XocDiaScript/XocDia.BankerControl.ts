
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import cmd from "./XocDia.Cmd";
import XocDiaNetworkClient from "./XocDia.XocDiaNetworkClient";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BankerControl extends cc.Component {

    @property(cc.Label)
    lblTitle: cc.Label = null;
    @property(cc.Slider)
    slider: cc.Slider = null;
    @property(cc.Label)
    lblCoin: cc.Label = null;
    @property(cc.Node)
    panelSell: cc.Node = null;

    private coinOdd = 0;
    private coinEven = 0;

    private maxCoin = 0;
    private minCoin = 1;
    private coin = 0;
    private sellingEven = false;

    start() {
        this.slider.node.on("slide", () => {
            this.coin = this.minCoin + Math.round((this.maxCoin - this.minCoin) * this.slider.progress);
            this.lblCoin.string = Utils.formatNumber(this.coin);
        });
    }

    show(coinOdd: number, coinEven: number) {
        this.coinOdd = coinOdd;
        this.coinEven = coinEven;
        this.panelSell.active = false;
        this.node.active = true;
    }

    public actCanTat() {
        this.node.active = false;
        XocDiaNetworkClient.getInstance().send(new cmd.SendBankerSellGate(1, this.coin));
    }

    public actSellOdd() {
        this.lblTitle.string = "BÁN LẺ";
        this.maxCoin = this.coinOdd;
        this.coin = this.maxCoin;
        this.lblCoin.string = Utils.formatNumber(this.coin);
        this.slider.progress = 1;
        this.panelSell.active = true;
        this.sellingEven = false;
    }

    public actSellEven() {
        this.lblTitle.string = "BÁN CHẴN";
        this.maxCoin = this.coinEven;
        this.coin = this.maxCoin;
        this.lblCoin.string = Utils.formatNumber(this.coin);
        this.slider.progress = 1;
        this.panelSell.active = true;
        this.sellingEven = true;
    }

    public actSell() {
        this.node.active = false;
        XocDiaNetworkClient.getInstance().send(new cmd.SendBankerSellGate(this.sellingEven ? 2 : 3, this.coin));
    }
}
