import Utils from "../Script/common/Utils";
import Res from "./TienLen.Res";
const { ccclass, property } = cc._decorator;

@ccclass
export default class TienLen_ItemPlayerResult extends cc.Component {

    @property(cc.Label)
    labelRank: cc.Label = null;
    @property(cc.Label)
    labelUserName: cc.Label = null;
    @property(cc.Label)
    labelMoneyChange: cc.Label = null;
    @property(cc.Node)
    listCards: cc.Node = null;
    @property(cc.Node)
    resultWin: cc.Node = null;
    @property(cc.Node)
    resultLose: cc.Node = null;
    @property(cc.Node)
    fxResult: cc.Node = null;
    @property(cc.Label)
    labelFx: cc.Label = null;
    @property(cc.Font)
    fontFx: cc.Font[] = [];
    @property(cc.SpriteFrame)
    sprCups: cc.SpriteFrame[] = [];
    @property(cc.BitmapFont)
    fontNumber: cc.BitmapFont[] = [];
    @property(cc.Prefab)
    prefabCard: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    initItem(data) {
         //Utils.Log("TTTTTTTTTT ItemPlayerResult data : ", data);

        this.labelRank.string = data.countId;
        this.labelRank.font = this.fontFx[data.winTypes < 10 ? 0 : 1];
        this.labelUserName.string = data.userName;
        this.labelMoneyChange.string = data.goldChange > 0 ? "+" + Utils.formatNumber(data.goldChange) : Utils.formatNumber(data.goldChange);
        this.labelMoneyChange.font = data.goldChange > 0 ? this.fontNumber[0] : this.fontNumber[1];
        if(data.goldChange > 0){
            this.labelMoneyChange.font = this.fontNumber[0];
            this.labelMoneyChange.node.position = cc.v3(-207,3,0);
        }
        else{
            this.labelMoneyChange.font = this.fontNumber[1];
            this.labelMoneyChange.node.position = cc.v3(-207,-8,0);
        }
        for (let index = 0; index < data.cards.length; index++) {
            let item = cc.instantiate(this.prefabCard);
            item.getComponent(cc.Sprite).spriteFrame = Res.getInstance().getCardFace(data.cards[index]);
            this.listCards.addChild(item);
        }
        this.resultWin.active = data.winTypes < 11 ? true : false;
        if(data.countId <= 3){
            this.node.getChildByName("ic_cup").active = true ;
            this.node.getChildByName("ic_cup").getComponent(cc.Sprite).spriteFrame = this.sprCups[data.countId - 1];
        }
        else{
            this.node.getChildByName("ic_cup").active = false ;
        }
        this.resultLose.active = !this.resultWin.active;

        if (data.isTLMN) {
            switch (data.winTypes) {
                case 2:

                    break;
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                    if (data.winTypes == 3) {
                         //Utils.Log("TTTTTTTTTT ItemPlayerResult Thắng Bắt Treo data.winTypes : ", data.winTypes);
                        this.fxResult.active = true;
                        this.labelFx.font = this.fontFx[0];
                        this.labelFx.string = "Thắng Bắt Treo";
                         //Utils.Log("TTTTTTTTTT ItemPlayerResult Thắng Bắt Treo");
                    } else {
                         //Utils.Log("TTTTTTTTTT ItemPlayerResult Tới Trắng data.winTypes : ", data.winTypes);
                        this.fxResult.active = true;
                        this.labelFx.font = this.fontFx[0];
                        this.labelFx.string = "Tới Trắng";
                         //Utils.Log("TTTTTTTTTT ItemPlayerResult Tới Trắng");
                    }
                    break;
                case 11:
                    // Thoi Tu Quy | 2
                    if (this.kiemtraThoiTuQuy(data.cards)) {
                        this.fxResult.active = true;
                        this.labelFx.font = this.fontFx[1];
                        this.labelFx.string = "Thối Tứ Quý";
                         //Utils.Log("TTTTTTTTTT ItemPlayerResult Thối Tứ Quý");
                    }

                    if (this.kiemtraThoiHeo(data.cards)) {
                        this.fxResult.active = true;
                        this.labelFx.font = this.fontFx[1];
                        this.labelFx.string = "Thối 2";
                         //Utils.Log("TTTTTTTTTT ItemPlayerResult Thối 2");
                    }
                    break;
                case 12:
                    // Cong
                    this.fxResult.active = true;
                    this.labelFx.font = this.fontFx[1];
                    this.labelFx.string = "Cóng";
                     //Utils.Log("TTTTTTTTTT ItemPlayerResult Cóng");
                    break;
                case 13:
                    // Thua Toi Trang
                    this.fxResult.active = true;
                    this.labelFx.font = this.fontFx[1];
                    this.labelFx.string = "Thua Tới Trắng";
                     //Utils.Log("TTTTTTTTTT ItemPlayerResult Thua Tới Trắng");
                    break;
                default:
                    break;
            }
        } else {
            switch (data.winTypes) {
                case 2:
                case 5:
                case 10:
                    break;
                case 3:
                case 4:
                case 6:
                case 7:
                case 8:
                case 9:
                    if (data.winTypes == 3) {
                        this.fxResult.active = true;
                        this.labelFx.font = this.fontFx[0];
                        this.labelFx.string = "Thắng Sâm";
                    } else if (data.winTypes == 4) {
                        this.fxResult.active = true;
                        this.labelFx.font = this.fontFx[0];
                        this.labelFx.string = "Chặn Sâm";
                    } else {
                        this.fxResult.active = true;
                        this.labelFx.font = this.fontFx[0];
                        this.labelFx.string = "Tới Trắng";
                    }
                    break;
                case 11:
                case 12:

                    break;
                case 13:
                    // Thoi Tu Quy | 2
                    if (this.kiemtraThoiTuQuy(data.cards)) {
                        this.fxResult.active = true;
                        this.labelFx.font = this.fontFx[1];
                        this.labelFx.string = "Thối Tứ Quý";
                         //Utils.Log("TTTTTTTTTT ItemPlayerResult Thối Tứ Quý");
                    }

                    if (this.kiemtraThoiHeo(data.cards)) {
                        this.fxResult.active = true;
                        this.labelFx.font = this.fontFx[1];
                        this.labelFx.string = "Thối 2";
                         //Utils.Log("TTTTTTTTTT ItemPlayerResult Thối 2");
                    }
                    break;
                case 14:
                    // Cong
                    this.fxResult.active = true;
                    this.labelFx.font = this.fontFx[1];
                    this.labelFx.string = "Cóng";
                    break;
                case 15:

                    break;
                case 16:
                    // Bi chan sam
                    this.fxResult.active = true;
                    this.labelFx.font = this.fontFx[1];
                    this.labelFx.string = "Bị Chặn Sâm";
                    break;
                default:
                    break;
            }
        }
    }

    kiemtraThoiHeo(a) {
        for (var b = 0, c = 0; c < a.length; c++) Math.floor(a[c] / 4) == 12 && b++;
        return 0 < b ? !0 : !1
    }

    kiemtraThoiTuQuy(a) {
        a.sort(function (a, b) {
            return a - b
        });
        if (4 <= a.length)
            for (var b = a.length - 1, c = 0; 0 < b;) {
                if (Math.floor(a[b] / 4) == Math.floor(a[b - 1] / 4)) {
                    if (c++, 3 == c) return !0
                } else c = 0;
                b--
            }
        return !1
    };

    // update (dt) {}
}
