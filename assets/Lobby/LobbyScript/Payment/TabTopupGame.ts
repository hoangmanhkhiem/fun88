// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import App from "../Script/common/App";
import BaseTabShop from "./BaseTabShop";
import TabTopupChuyenKhoan from "./TabTopupChuyenKhoan";
import TabTopupManualBank from "./TabTopupManualBank";
import TapTopupManualMomo from "./TabTopupManualMomo";
import TapTopupManualZalo from "./TabTopupManualZalo";
import TabTopupMomo from "./TabTopupMomo";
import TabTopupSieuToc from "./TabTopupSieuToc";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TabTopupGame extends BaseTabShop {

    @property(cc.Toggle)
    toggleChuyenKhoan: cc.Toggle = null;

    @property(cc.Toggle)
    toggleZalo: cc.Toggle = null;

    @property(cc.Toggle)
    toggleMomo: cc.Toggle = null;

    @property(cc.Label)
    lbContentBanking: cc.Label = null;

    @property(TabTopupManualBank)
    tabChuyenKhoan: TabTopupManualBank = null;
    @property(TapTopupManualMomo)
    tabManualMomo: TapTopupManualMomo = null;
    @property(TapTopupManualZalo)
    tabManualZalo: TapTopupManualZalo = null;



    private dataProvider = null;
    private data = null;
    private payTypesAlive = null;
    show(data) {
        super.show(data);
        this.dataProvider = data;
        this.data = data.providerConfig;
        this.showPayTypes();
    }

    hide() {
        super.hide();
        this.tabChuyenKhoan.editName.tabIndex = -1;
        this.tabChuyenKhoan.editMoney.tabIndex = -1;
        this.tabChuyenKhoan.editBankNumber.tabIndex = -1;
    }
    showPayTypes() {
        this.toggleChuyenKhoan.node.active = false;
        this.toggleZalo.node.active = false;
        this.toggleMomo.node.active = false;
        var isFind = false;
        for (var i = 0; i < this.data.payType.length; i++) {
            if (this.data.payType[i].status == 1) {
                switch (this.data.payType[i].name) {
                    case "momo_recharge":
                        this.toggleMomo.node.active = true;
                        if (!isFind) {
                            this.onBtnChoseTab(null,this.data.payType[i].name);
                            this.toggleMomo.isChecked = true;
                            isFind = true;
                        }
                        break;
                }
            }
        }
    }

    showTab(payTypeKey) {
        else if (payTypeKey == "momo_recharge") {
            this.tabChuyenKhoan.hide();
            this.tabManualZalo.hide();
            this.tabManualMomo.show(this.data, this.dataProvider.providerName);
            this.tabManualMomo.editMoney.tabIndex = 0;
            this.tabManualMomo.editBankNumber.tabIndex=0;
            this.tabManualMomo.editName.tabIndex = 0;

        }
    }
    onBtnChoseTab(target, data) {
        var payTypeKey = data;
        this.showTab(payTypeKey);
    }
    onClickNap(even, data) {

    }

}
