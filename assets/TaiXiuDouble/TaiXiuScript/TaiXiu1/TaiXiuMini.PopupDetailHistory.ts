
import Http from "../../../Loading/src/Http";
import Configs from "../../../Loading/src/Configs";
import TaiXiuMiniController from "./TaiXiuMini.TaiXiuMiniController";
import Dialog from "../../../Lobby/LobbyScript/Script/common/Dialog";
import Utils from "../../../Lobby/LobbyScript/Script/common/Utils";
import App from "../../../Lobby/LobbyScript/Script/common/App";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupDetailHistory extends Dialog {
    @property(cc.Label)
    lblSession: cc.Label = null;
    @property(cc.Label)
    lblResult: cc.Label = null;
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
    sprResult_Tai: cc.Node = null;
    @property(cc.Node)
    sprResult_Xiu: cc.Node = null;

    @property(cc.Node)
    itemTemplate: cc.Node = null;

    private items: cc.Node[] = [];
    private inited = false;
    private session: number = 0;
    private page: number = 1;
    private totalPage: number = 1;
    private historiesTai = [];
    private historiesXiu = [];
    private totalBetTai = 0;
    private totalRefundTai = 0;
    private totalBetXiu = 0;
    private totalRefundXiu = 0;

    showDetail(session: number) {
        this.session = session;
        this.show();
    }

    show() {
        super.show();
        App.instance.showBgMiniGame("TaiXiu");
        this.sprDice1.node.active = false;
        this.sprDice2.node.active = false;
        this.sprDice3.node.active = false;
        // this.sprResult.node.active = false;
        this.lblSession.string = "Phiên: #" + this.session;
        this.lblResult.string = "";

        if (this.inited) {
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].active = false;
            }
            return;
        }
        this.itemTemplate.active = false;
        for (let i = 0; i < 9; i++) {
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
        // this.sprResult.node.active = false;
        this.lblSession.string = "Phiên: #" + this.session;
        this.lblResult.string = "";
        this.totalBetTai = 0;
        this.totalBetXiu = 0;
        this.totalRefundTai = 0;
        this.totalRefundXiu = 0;
        App.instance.showLoading(true);
        Http.get(Configs.App.API, { "c": 102, "rid": this.session, "mt": Configs.App.MONEY_TYPE }, (err, res) => {
            if (err != null) return;
            this.historiesTai = [];
            this.historiesXiu = [];
            App.instance.showLoading(false);
            if (res.success && res["resultTX"] !== null) {
                //  cc.log("HISTORY SESSION:", JSON.stringify(res));
                for (var i = 0; i < res["transactions"].length; i++) {
                    var itemData = res["transactions"][i];
                    if (itemData["betSide"] === 1) {
                        this.historiesTai.push(itemData);
                        this.totalBetTai += itemData["betValue"];
                        this.totalRefundTai += itemData["refund"];

                    } else {
                        this.historiesXiu.push(itemData);
                        this.totalBetXiu += itemData["betValue"];
                        this.totalRefundXiu += itemData["refund"];
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
                this.lblResult.string = res["resultTX"]["result"] == 1
                    ? " Tài " + (res["resultTX"]["dice1"] + res["resultTX"]["dice2"] + res["resultTX"]["dice3"]) + "(" + res["resultTX"]["dice1"] + "-" + res["resultTX"]["dice2"] + "-" + res["resultTX"]["dice3"] + ")"
                    : " Xỉu " + (res["resultTX"]["dice1"] + res["resultTX"]["dice2"] + res["resultTX"]["dice3"]) + "(" + res["resultTX"]["dice1"] + "-" + res["resultTX"]["dice2"] + "-" + res["resultTX"]["dice3"] + ")";
                this.lblTotalBetTai.string = Utils.formatNumber(this.totalBetTai) + " / " + Utils.formatNumber(this.totalRefundTai);
                this.lblTotalBetXiu.string = Utils.formatNumber(this.totalBetXiu) + " / " + Utils.formatNumber(this.totalRefundXiu);

                this.sprDice1.spriteFrame = this.sfDices[res["resultTX"]["dice1"]];
                this.sprDice1.node.active = true;
                this.sprDice2.spriteFrame = this.sfDices[res["resultTX"]["dice2"]];
                this.sprDice2.node.active = true;
                this.sprDice3.spriteFrame = this.sfDices[res["resultTX"]["dice3"]];
                this.sprDice3.node.active = true;

                // this.sprResult.spriteFrame = res["resultTX"]["result"] == 1 ? this.sfTai : this.sfXiu;
                if (res["resultTX"]["result"] == 1) {
                    cc.Tween.stopAllByTarget(this.sprResult_Tai);
                    cc.Tween.stopAllByTarget(this.sprResult_Xiu);
                    this.sprResult_Tai.scale = 0.6;
                    this.sprResult_Xiu.scale = 0.6;
                    cc.tween(this.sprResult_Tai).repeatForever(
                        cc.tween().sequence(cc.tween().to(0.3,
                            { scale: 0.7 }),
                            cc.tween().to(0.3, { scale: 0.6 }),
                            cc.tween().to(0.3, { scale: 0.5 }),
                            cc.tween().to(0.3, { scale: 0.6 })))
                        .start();
                } else {
                    cc.Tween.stopAllByTarget(this.sprResult_Tai);
                    cc.Tween.stopAllByTarget(this.sprResult_Xiu);
                    this.sprResult_Tai.scale = 0.6;
                    this.sprResult_Xiu.scale = 0.6;
                    cc.tween(this.sprResult_Xiu).repeatForever(
                        cc.tween().sequence(
                            cc.tween().to(0.3, { scale: 0.7 }),
                            cc.tween().to(0.3, { scale: 0.6 }),
                            cc.tween().to(0.3, { scale: 0.5 }),
                            cc.tween().to(0.3, { scale: 0.6 })))
                        .start();
                }
                // this.sprResult.node.active = true;

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
                item.getChildByName("Jackpot").getComponent(cc.Label).string = Utils.formatNumber(itemData["jpAmount"]);
            } else {
                item.getChildByName("Time").getComponent(cc.Label).string = "";
                item.getChildByName("Account").getComponent(cc.Label).string = "";
                item.getChildByName("Refund").getComponent(cc.Label).string = "";
                item.getChildByName("Bet").getComponent(cc.Label).string = "";
                item.getChildByName("Jackpot").getComponent(cc.Label).string = "";
            }

            if (idx < this.historiesXiu.length) {
                var itemData = this.historiesXiu[idx];
                item.getChildByName("Time2").getComponent(cc.Label).string = (itemData["inputTime"] < 10 ? "00:0" : "00:") + itemData["inputTime"];
                item.getChildByName("Account2").getComponent(cc.Label).string = itemData["username"];
                item.getChildByName("Refund2").getComponent(cc.Label).string = Utils.formatNumber(itemData["refund"]);
                item.getChildByName("Bet2").getComponent(cc.Label).string = Utils.formatNumber(itemData["betValue"]);
                item.getChildByName("Jackpot2").getComponent(cc.Label).string = Utils.formatNumber(itemData["jpAmount"]);
            } else {
                item.getChildByName("Time2").getComponent(cc.Label).string = "";
                item.getChildByName("Account2").getComponent(cc.Label).string = "";
                item.getChildByName("Refund2").getComponent(cc.Label).string = "";
                item.getChildByName("Bet2").getComponent(cc.Label).string = "";
                item.getChildByName("Jackpot2").getComponent(cc.Label).string = "";
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
        if (this.session > TaiXiuMiniController.instance.histories[TaiXiuMiniController.instance.histories.length - 1].session) {
            this.session = TaiXiuMiniController.instance.histories[TaiXiuMiniController.instance.histories.length - 1].session;
            return;
        }
        this.loadData();
    }

    public actPrevSession() {
        this.session--;
        this.loadData();
    }
}
