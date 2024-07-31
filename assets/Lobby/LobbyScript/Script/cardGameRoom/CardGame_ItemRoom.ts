const { ccclass, property } = cc._decorator;

@ccclass
export default class CardGame_ItemRoom extends cc.Component {

    @property(cc.Label)
    labelBet: cc.Label=null;

    @property(cc.Label)
    labelPlayers: cc.Label=null;

    @property(cc.Label)
    labelState: cc.Label=null;

    itemInfo = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // start() {}

    // update (dt) {}

    initItems(data) {
        this.itemInfo = data;
        this.labelBet.string = this.formatGold(data.bet);
        this.labelPlayers.string = this.formatGold(data.players);
        this.labelState.string = data.maxUser == 2 ? "Solo" : data.maxUser + " Người";
    }

    chooseRoom() {
        let controller = null;
        switch (this.itemInfo.gameId) {
            case 0:
            case 1:
                controller = this.node.parent.parent.parent.parent.getComponent("TienLen.Room");
                controller.handleJoinRoom(this.itemInfo);
                break;

            default:
                break;
        }
        //  //Utils.Log("CardGame_ItemRoom chooseRoom : ", this.node.parent.parent);
        //  //Utils.Log("CardGame_ItemRoom chooseRoom : ", this.node.parent.parent.parent);
        //  //Utils.Log("CardGame_ItemRoom chooseRoom : ", this.node.parent.parent.parent.parent);
    }

    formatGold(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

}