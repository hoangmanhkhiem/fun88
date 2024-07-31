import Configs from "../../Loading/src/Configs";
import Http from "../../Loading/src/Http";
import App from "./Script/common/App";
import BroadcastReceiver from "./Script/common/BroadcastReceiver";
import Dialog from "./Script/common/Dialog";
import Utils from "./Script/common/Utils";

const { ccclass, property } = cc._decorator;
var TW = cc.tween;
@ccclass
export default class PopupDiemDanh1 extends Dialog {

    @property(sp.Skeleton)
    animBox: sp.Skeleton = null;
    @property(sp.Skeleton)
    animChip: sp.Skeleton = null;
    @property([sp.Skeleton])
    animGlow: sp.Skeleton[] = [];
    @property([cc.Node])
    listDot: cc.Node[] = [];
    @property([cc.Node])
    listBgConsecutive: cc.Node[] = [];
    @property([cc.Label])
    listLbBonus: cc.Label[] = [];

    @property(sp.Skeleton)
    animDice1: sp.Skeleton = null;

    @property(sp.Skeleton)
    animDice2: sp.Skeleton = null;

    @property(sp.Skeleton)
    animDice3: sp.Skeleton = null;

    @property(cc.Sprite)
    sprDice1: cc.Sprite = null;

    @property(cc.Sprite)
    sprDice2: cc.Sprite = null;

    @property(cc.Sprite)
    sprDice3: cc.Sprite = null;

    @property(cc.Sprite)
    sprProgress: cc.Sprite = null;


    @property(cc.Label)
    lbRewardNormal: cc.Label = null;

    @property(cc.Label)
    lbBonusDiemDanh: cc.Label = null;
    @property(cc.Label)
    lbBonusVip: cc.Label = null;
    @property(cc.Label)
    lbTotal: cc.Label = null;
    @property(cc.Label)
    lbResultDice: cc.Label = null;
    @property(cc.Button)
    btnSpin: cc.Button = null;

    @property(Dialog)
    PopupGuide: Dialog = null;

    @property([cc.SpriteFrame])
    listSprDice: cc.SpriteFrame[] = [];
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    listFillRange = [0.1, 0.21, 0.365, 0.53, 0.68, 0.85, 1.0];
    listPosChip = [-253, -164, -83, 0, 83, 164, 253];
    currentProgress = 0;
    start() {
        this.animChip.setCompleteListener(() => {
            this.animChip.node.active = false;
        })
    }
    onEnable() {
        this.setInfo();
    }
    loadData() {
        //  cc.log("loadData");
        Http.get(Configs.App.API, { c: "2031", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken, ac: "get" }, (err, res) => {
            //  cc.log("DIEMDANH:", res);
            if (res["success"] == true) {
                this.btnSpin.interactable = true;
                this.btnSpin.node.children[0].color = cc.Color.WHITE;
                this.container.getChildByName('resultContainer').active = true;
                this.container.getChildByName('lbInfo').active = false;
            }
            else {
                this.btnSpin.interactable = false;
                this.btnSpin.node.children[0].color = cc.Color.GRAY;
                this.container.getChildByName('resultContainer').active = false;
                this.container.getChildByName('lbInfo').active = true;
            }
            if (res['data'] != null) {
                this.currentProgress = parseInt(res['data']);
                if (this.currentProgress == 0) {
                    // this.sprChipToday.node.active = false;
                    this.sprProgress.fillRange = 0;
                } else {
                    this.sprProgress.fillRange = this.listFillRange[this.currentProgress - 1];
                    // this.sprChipToday.node.x = this.listPosChip[this.currentProgress - 1];
                }
            }
        });
    }
    setHistory() {
        App.instance.showLoading(true);
        Http.get(Configs.App.API, { c: "2031", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken, ac: "history" }, (err, res) => {
            // res = JSON.parse('{"success":true,"errorCode":"0","message":null,"statistic":null,"totalRecords":0,"data":[{"date":"2021-10-27","ratioBonus":0,"consecutive":0},{"date":"2021-10-28","ratioBonus":0,"consecutive":1},{"date":"2021-10-29","ratioBonus":10,"consecutive":2},{"date":"2021-10-30","ratioBonus":0,"consecutive":0},{"date":"2021-10-31","ratioBonus":0,"consecutive":1},{"date":"2021-11-01","ratioBonus":10,"consecutive":2},{"date":"2021-11-02","ratioBonus":20,"consecutive":3}]}');
            App.instance.showLoading(false);
            if (res["success"] == true) {
                let dataHis = res['data'];
                //  cc.log(dataHis.length);
                for (let i = 0; i < dataHis.length; i++) {
                    if (dataHis[i]['consecutive'] != 0) {
                        this.listDot[i].active = true;
                        this.listLbBonus[i].node.active = true;
                        this.listLbBonus[i].string = "+" + dataHis[i]['ratioBonus'] + "%";
                        if (i < dataHis.length - 1 && dataHis[i + 1]['consecutive'] > 1) {
                            this.listBgConsecutive[i].active = true;
                        }
                    } else {
                        this.listDot[i].active = false;
                        this.listLbBonus[i].node.active = false;
                    }
                }
            }
        });
    }
    setInfo() {
        this.lbResultDice.node.active = false;
        this.lbRewardNormal.node.active = false;
        this.lbBonusDiemDanh.node.active = false;
        this.lbBonusVip.node.active = false;
        this.lbTotal.node.active = false;
        this.animDice1.node.active = false;
        this.animDice2.node.active = false;
        this.animDice3.node.active = false;
        this.animBox.setAnimation(0, 'normal', true);
        this.lbBonusVip.node.active = this.lbBonusDiemDanh.node.active = this.lbResultDice.node.active = this.lbRewardNormal.node.active = this.lbTotal.node.active = false;
        this.animChip.node.active = false;
        this.loadData();
        this.setHistory();
        for (let i = 0; i < 7; i++) {
            this.listLbBonus[i].node.active = false;
            this.listDot[i].active = false;
        }
    }
    onClickReceive() {
        //

        this.btnSpin.getComponentInChildren(sp.Skeleton).node.color = cc.Color.GRAY;
        this.btnSpin.interactable = false;
        // let res = JSON.parse('{"success":true,"errorCode":"0","message":null,"statistic":null,"totalRecords":0,"data":{"id":0,"attend_id":1,"nick_name":"ChiLynDay","date_attend":"2021-09-23 12:25:26","consecutive":1,"bonus_basic":8400,"bonus_consecutive":840,"bonus_vip":0,"spin":"2-2-3","result":"2-2-3"}}');
        Http.get(Configs.App.API, { c: "2031", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken, ac: "receive" }, (err, res) => {
            //  cc.log("Daily:" + JSON.stringify(res));
            if (res["success"] && res['data'] != null) {
                this.setResult(res['data']['result'].split("-"));
                this.lbRewardNormal.string = Utils.formatNumber(res['data']['bonus_basic']);
                this.lbBonusDiemDanh.string = Utils.formatNumber(res['data']['bonus_consecutive']);
                this.lbBonusVip.string = Utils.formatNumber(res['data']['bonus_vip']);
                this.lbTotal.string = Utils.formatNumber(res['data']['bonus_vip'] + res['data']['bonus_basic'] + res['data']['bonus_consecutive']);
                Configs.Login.Coin += (res['data']['bonus_vip'] + res['data']['bonus_basic'] + res['data']['bonus_consecutive']);
                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                this.currentProgress++;
                this.setHistory();
            }
            else {
                App.instance.showToast(App.instance.getTextLang('txt_unknown_error1'));
            }
        });
    }
    setResult(listDice) {
        this.animBox.setAnimation(0, "ban", true);
        this.animDice1.node.active = true;
        this.animDice2.node.active = true;
        this.animDice3.node.active = true;
        this.animDice1.setAnimation(0, "1_" + listDice[0], false);
        this.animDice2.setAnimation(0, "2_" + listDice[1], false);
        this.animDice3.setAnimation(0, "3_" + listDice[2], false);
        this.animDice3.setCompleteListener(() => {
            this.animBox.setAnimation(0, "ban", true);
            this.animBox.paused = true;
            this.sprDice1.node.getComponent(cc.Animation).stop();
            this.sprDice2.node.getComponent(cc.Animation).stop();
            this.sprDice3.node.getComponent(cc.Animation).stop();
            this.sprDice1.spriteFrame = this.listSprDice[listDice[0] - 1];
            this.sprDice2.spriteFrame = this.listSprDice[listDice[1] - 1];
            this.sprDice3.spriteFrame = this.listSprDice[listDice[2] - 1];
            this.lbResultDice.node.active = true;
            this.lbResultDice.string = (parseInt(listDice[0]) + parseInt(listDice[1]) + parseInt(listDice[2])) + "";
            this.effLabelResult();

        })
        this.sprDice1.node.getComponent(cc.Animation).play();
        this.sprDice2.node.getComponent(cc.Animation).play();
        this.sprDice3.node.getComponent(cc.Animation).play();
    }

    effLabelResult() {
        let timeEff = 0.75;
        let effLb = TW().set({ scale: 5.0, opacity: 0 })
            .to(timeEff, { scale: 1.0, opacity: 255 }, { easing: cc.easing.sineIn });
        TW(this.node)
            .call(() => {
                this.lbRewardNormal.node.active = true;
                effLb.clone(this.lbRewardNormal.node).start();
                this.animGlow[0].node.active = true;
                this.animGlow[0].setAnimation(0, "animation", false);
                this.animGlow[0].node.x = this.lbRewardNormal.node.x;
                this.animGlow[0].setCompleteListener(() => {
                    this.animGlow[0].node.active = false;
                })

            })
            .delay(timeEff - 0.25)
            .call(() => {
                this.lbBonusDiemDanh.node.active = true;
                effLb.clone(this.lbBonusDiemDanh.node).start();
                this.animGlow[1].node.active = true;
                this.animGlow[1].setAnimation(0, "animation", false);
                this.animGlow[1].node.x = this.lbBonusDiemDanh.node.x;
                this.animGlow[1].setCompleteListener(() => {
                    this.animGlow[0].node.active = false;
                })
            })
            .delay(timeEff - 0.25)
            .call(() => {
                this.lbBonusVip.node.active = true;
                effLb.clone(this.lbBonusVip.node).start();
                this.animGlow[2].node.active = true;
                this.animGlow[2].setAnimation(0, "animation", false);
                this.animGlow[2].node.x = this.lbBonusVip.node.x;
                this.animGlow[2].setCompleteListener(() => {
                    this.animGlow[2].node.active = false;
                })
            })
            .delay(timeEff - 0.25)
            .call(() => {
                this.lbTotal.node.active = true;
                effLb.clone(this.lbTotal.node).start();
                this.animGlow[3].node.active = true;
                this.animGlow[3].setAnimation(0, "animation", false);
                this.animGlow[3].node.x = this.lbTotal.node.x;
                this.animGlow[3].setCompleteListener(() => {
                    this.animGlow[3].node.active = false;
                })
            })
            .delay(timeEff)
            .call(() => {
                this.animChip.node.active = true;
                this.animChip.setAnimation(0, "animation", false);
            })
            .start();
    }
    onClickGuide() {
        this.PopupGuide.show();
    }

    // update (dt) {}
}
