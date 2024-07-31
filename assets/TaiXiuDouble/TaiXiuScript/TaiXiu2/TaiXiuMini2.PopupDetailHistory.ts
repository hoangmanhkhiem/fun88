
import Http from "../../../Loading/src/Http";
import Configs from "../../../Loading/src/Configs";
import TaiXiuMini2Controller from "./TaiXiuMini2.TaiXiuMiniController";
import Dialog from "../../../Lobby/LobbyScript/Script/common/Dialog";
import Utils from "../../../Lobby/LobbyScript/Script/common/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupDetailHistory extends Dialog {
    @property(cc.Label)
    lblSession: cc.Label = null;
    @property(cc.Label)
    lblTime: cc.Label = null;
    @property(cc.Label)
    lblPage: cc.Label = null;

    @property(cc.Label)
    lblTotalBetTai: cc.Label = null;
    @property(cc.Label)
    lblTotalBetXiu: cc.Label = null;

    @property(cc.Label)
    lblTotalRefundTai: cc.Label = null;
    @property(cc.Label)
    lblTotalRefundXiu: cc.Label = null;

    @property([cc.SpriteFrame])
    sfDices: cc.SpriteFrame[] = [];
    @property(cc.SpriteFrame)
    sfTai: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sfXiu: cc.SpriteFrame = null;

    @property(cc.Sprite)
    sprDice1: cc.Sprite = null;
    @property(cc.Sprite)
    sprDice2: cc.Sprite = null;
    @property(cc.Sprite)
    sprDice3: cc.Sprite = null;
    @property(cc.Sprite)
    sprResult: cc.Sprite = null;

    @property(cc.Node)
    itemTemplate: cc.Node = null;

    private items: cc.Node[] = [];
    private inited = false;
    private session: number = 0;
    private page: number = 1;
    private totalPage: number = 1;
    private historiesTai = [];
    private historiesXiu = [];

    showDetail(session: number) {
        this.session = session;
        this.show();
    }

    show() {
        super.show();

        this.sprDice1.node.active = false;
        this.sprDice2.node.active = false;
        this.sprDice3.node.active = false;
        this.sprResult.node.active = false;
        this.lblSession.string = "Phiên: #" + this.session;
        this.lblTime.string = "";

        if (this.inited) {
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].active = false;
            }
            return;
        }
        this.itemTemplate.active = false;
        for (let i = 0; i < 10; i++) {
            let node = cc.instantiate(this.itemTemplate);
            node.parent = this.itemTemplate.parent;
            node.active = false;
            this.items.push(node);
        }
        this.inited = true;
    }

    _onShowed() {
        super._onShowed();
        this.loadData();
    }

    private loadData() {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
        this.sprDice1.node.active = false;
        this.sprDice2.node.active = false;
        this.sprDice3.node.active = false;
        this.sprResult.node.active = false;
        this.lblSession.string = "Phiên: #" + this.session;
        this.lblTime.string = "";
        Http.get(Configs.App.API, { "c": 102, "rid": this.session, "mt": Configs.App.MONEY_TYPE }, (err, res) => {
            if (err != null) return;
            this.historiesTai = [];
            this.historiesXiu = [];
            if (res.success && res["resultTX"] !== null) {
                for (var i = 0; i < res["transactions"].length; i++) {
                    var itemData = res["transactions"][i];
                    if (itemData["betSide"] === 1) {
                        this.historiesTai.push(itemData);
                    } else {
                        this.historiesXiu.push(itemData);
                    }
                }

                for (var i = 0; i < this.items.length; i++) {
                    this.items[i].active = false;
                }

                this.page = 1;
                this.totalPage = this.historiesXiu.length > this.historiesTai.length ? this.historiesXiu.length : this.historiesTai.length;
                this.totalPage = Math.ceil(this.totalPage / this.items.length);
                this.lblPage.string = this.page + "/" + this.totalPage;

                this.lblSession.string = "Phiên: #" + res["resultTX"]["referenceId"];
                this.lblTime.string = res["resultTX"]["timestamp"];
                this.lblTotalBetTai.string = Utils.formatNumber(res["resultTX"]["totalTai"]);
                this.lblTotalBetXiu.string = Utils.formatNumber(res["resultTX"]["totalXiu"]);
                this.lblTotalRefundTai.string = Utils.formatNumber(res["resultTX"]["totalRefundTai"]);
                this.lblTotalRefundXiu.string = Utils.formatNumber(res["resultTX"]["totalRefundXiu"]);

                this.sprDice1.spriteFrame = this.sfDices[res["resultTX"]["dice1"]];
                this.sprDice1.node.active = true;
                this.sprDice2.spriteFrame = this.sfDices[res["resultTX"]["dice2"]];
                this.sprDice2.node.active = true;
                this.sprDice3.spriteFrame = this.sfDices[res["resultTX"]["dice3"]];
                this.sprDice3.node.active = true;

                this.sprResult.spriteFrame = res["resultTX"]["result"] == 1 ? this.sfTai : this.sfXiu;
                this.sprResult.node.active = true;

                this.loadDataPage();
            }
        });
    }

    private loadDataPage() {
        for (var i = 0; i < this.items.length; i++) {
            var idx = (this.page - 1) * this.items.length + i;
            var item = this.items[i];
            item.active = true;

            if (idx < this.historiesTai.length) {
                var itemData = this.historiesTai[idx];
                item.getChildByName("Time").getComponent(cc.Label).string = (itemData["inputTime"] < 10 ? "00:0" : "00:") + itemData["inputTime"];
                item.getChildByName("Account").getComponent(cc.Label).string = itemData["username"];
                item.getChildByName("Refund").getComponent(cc.Label).string = Utils.formatNumber(itemData["refund"]);
                item.getChildByName("Bet").getComponent(cc.Label).string = Utils.formatNumber(itemData["betValue"]);
            } else {
                item.getChildByName("Time").getComponent(cc.Label).string = "";
                item.getChildByName("Account").getComponent(cc.Label).string = "";
                item.getChildByName("Refund").getComponent(cc.Label).string = "";
                item.getChildByName("Bet").getComponent(cc.Label).string = "";
            }

            if (idx < this.historiesXiu.length) {
                var itemData = this.historiesXiu[idx];
                item.getChildByName("Time2").getComponent(cc.Label).string = (itemData["inputTime"] < 10 ? "00:0" : "00:") + itemData["inputTime"];
                item.getChildByName("Account2").getComponent(cc.Label).string = itemData["username"];
                item.getChildByName("Refund2").getComponent(cc.Label).string = Utils.formatNumber(itemData["refund"]);
                item.getChildByName("Bet2").getComponent(cc.Label).string = Utils.formatNumber(itemData["betValue"]);
            } else {
                item.getChildByName("Time2").getComponent(cc.Label).string = "";
                item.getChildByName("Account2").getComponent(cc.Label).string = "";
                item.getChildByName("Refund2").getComponent(cc.Label).string = "";
                item.getChildByName("Bet2").getComponent(cc.Label).string = "";
            }
        }
        this.lblPage.string = this.page + "/" + this.totalPage;
    }

    public actNextPage() {
        this.page++;
        if (this.page > this.totalPage) this.page = this.totalPage;
        this.loadDataPage();
    }

    public actPrevPage() {
        this.page--;
        if (this.page < 1) this.page = 1;
        this.loadDataPage();
    }

    public actNextSession() {
        this.session++;
        if (this.session > TaiXiuMini2Controller.instance.histories[TaiXiuMini2Controller.instance.histories.length - 1].session) {
            this.session = TaiXiuMini2Controller.instance.histories[TaiXiuMini2Controller.instance.histories.length - 1].session;
            return;
        }
        this.loadData();
    }

    public actPrevSession() {
        this.session--;
        this.loadData();
    }
}
