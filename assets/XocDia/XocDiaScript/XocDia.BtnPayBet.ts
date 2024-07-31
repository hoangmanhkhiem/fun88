import Utils from "../../Lobby/LobbyScript/Script/common/Utils";


const { ccclass, property } = cc._decorator;

@ccclass
export default class BtnPayBet extends cc.Component {

    @property(cc.Label)
    lblTotalBet: cc.Label = null;
	@property(cc.Label)
    lblBet: cc.Label = null;
	@property(cc.Label)
    total: cc.Label = null;
    @property(cc.Node)
    active: cc.Node = null;

    public reset() {
        this.lblTotalBet.string = "";
		this.lblBet.string = "";
		this.total.string = 0;
        this.active.active = false;
    }

    public setTotalBet(coin: number) {
        this.lblTotalBet.string = coin > 0 ? Utils.formatMoney(coin) : "";
    }
	public setBet(coin: number) {
        this.lblBet.string = coin > 0 ? Utils.formatMoney(coin) : "";
    }
}
