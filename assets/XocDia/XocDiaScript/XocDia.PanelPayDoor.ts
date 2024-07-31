import Utils from "../../Lobby/LobbyScript/Script/common/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PanelPayDoor extends cc.Component {

    @property(cc.Label)
    title1: cc.Label = null;
    @property(cc.Label)
    title2: cc.Label = null;
    @property(cc.Node)
    itemTemplate: cc.Node = null;
    @property(cc.Slider)
    slider: cc.Slider = null;
    @property(cc.Sprite)
    sprProgress: cc.Sprite = null;
    @property(cc.Label)
    lblCoin: cc.Label = null;

    public coin = 1;
    private minCoin = 1;
    private maxCoin = 0;

    start() {
        this.slider.node.on("slide", () => {
            this.updateValue();
        });
    }

    public show(action: number, maxCoin: number) {
        if (action == 2) {
            this.title1.string = this.title2.string = "MUA CHẴN";
        } else {
            this.title1.string = this.title2.string = "MUA LẺ";
        }
        this.coin = this.minCoin;
        this.maxCoin = maxCoin;
        this.node.active = true;
        this.itemTemplate.active = false;
        for (let i = 1; i < this.itemTemplate.parent.childrenCount; i++) {
            this.itemTemplate.parent.children[i].destroy();
        }
        this.slider.progress = 1;
        this.sprProgress.fillRange = 1;
        this.updateValue();
    }

    public addUser(nickname: string, coin: number, newMaxCoin: number) {
        if (newMaxCoin == 0) {
            this.node.active = false;
        }
        this.maxCoin = newMaxCoin;
        if (this.coin > this.maxCoin) {
            this.coin = this.maxCoin;
        }
        this.slider.progress = this.coin / (this.maxCoin - this.minCoin);
        this.sprProgress.fillRange = this.slider.progress;
        this.lblCoin.string = Utils.formatNumber(this.coin);

        let item = cc.instantiate(this.itemTemplate);
        item.parent = this.itemTemplate.parent;
        item.getChildByName("lblNickname").getComponent(cc.Label).string = nickname;
        item.getChildByName("lblCoin").getComponent(cc.Label).string = Utils.formatMoney(coin);
        item.active = true;
    }

    public getCoin(): number {
        return this.coin;
    }

    private updateValue() {
        this.sprProgress.fillRange = this.slider.progress;
        this.coin = this.minCoin + Math.round((this.maxCoin - this.minCoin) * this.slider.progress);
        this.lblCoin.string = Utils.formatMoney(this.coin);
    }
}
