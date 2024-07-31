
import App from "./App";
import Utils from "./Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    nodeBox: cc.Node = null;
    @property(cc.Label)
    labelUser: cc.Label = null;
    @property(cc.Label)
    labelGame: cc.Label = null;
    @property(cc.Label)
    labelGold: cc.Label = null;
    @property(cc.Label)
    labelTypeWin: cc.Label = null;
    @property(cc.Label)
    lbNotify: cc.Label = null;
    @property(cc.Node)
    nodeJackpot: cc.Node = null;
    @property(cc.Node)
    nodeNotify: cc.Node = null;
    private listContent = [];
    private index = 0;

    onLoad() {
    }

    ctor() {
        var self = this;
        self.listContent = [];
        this.index = 0;
    }

    test() {

        var data = {};
        data["username"] = "user" + this.index;
        data["totalPrizes"] = 100000 + this.index;
        data["type"] = 0;
        data["gameName"] = "Chim Điên"
        //Utils.Log("data:" + JSON.stringify(data));
        this.addJackpot(data);
        this.index++;
    }

    addJackpot(data) {

        if (this.listContent == null) {
            return;
        }
        //Utils.Log("addJackpot:" + JSON.stringify(data));
        this.listContent.push(data);
        if (this.listContent.length == 1) {
            //run now
            this.show(data);
        }
        else {
            // running, add list
            this.listContent.push(data);
        }
    }
    addNotify(data) {
        if (this.listContent == null) {
            return;
        }
        //  cc.log("addNotify:" + JSON.stringify(data));
        this.listContent.push(data);
        if (this.listContent.length == 1) {
            //run now
            this.showNoti(data);
        }
        else {
            // running, add list
            this.listContent.push(data);
        }
    }

    show(data) {
        this.nodeJackpot.active = true;
        this.nodeNotify.active = false;
        if (data == null || data.totalPrizes === undefined) {
            this.hide();
            return;
        }
        if (App.instance.isShowNotifyJackpot == false) {
            this.node.active = false;
            return;
        }
        this.labelUser.string = data.username;
        this.labelGold.string = Utils.formatNumber(data.totalPrizes);
        this.labelGame.string = data.gameName;
        this.labelTypeWin.string = data.type;
        cc.Tween.stopAllByTarget(this.node);
        this.node.active = true;
        cc.tween(this.node).delay(5.0).set({ x: cc.winSize.width / 2 + 500 }).to(0.6, { x: cc.winSize.width / 2 - 170 }, { easing: cc.easing.backOut }).delay(4.0)
            .call(() => {
                this.hide();
            }).start();
    }
    showNoti(data) {
        this.nodeJackpot.active = false;
        this.nodeNotify.active = true;
        this.lbNotify.string = data['message'];
        cc.Tween.stopAllByTarget(this.node);
        this.node.active = true;
        cc.tween(this.node).delay(5.0).set({ x: cc.winSize.width / 2 + 500 }).to(0.6, { x: cc.winSize.width / 2 - 170 }, { easing: cc.easing.backOut }).delay(4.0)
            .call(() => {
                this.hide();
            }).start();
    }
    hide() {
        cc.Tween.stopAllByTarget(this.node);
        cc.tween(this.node).to(0.3, { x: cc.winSize.width / 2 + 200 }, { easing: cc.easing.backIn }).call(() => {
            this.node.active = false;
            this.listContent.splice(0, 1);
            if (this.listContent.length >= 1) {
                var data = this.listContent[0];
                if (data.hasOwnProperty("message")) {
                    this.showNoti(data)
                } else {
                    this.show(data);
                }
            }
        }).start();

    }
}
