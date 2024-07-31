

import Utils from "../Script/common/Utils";
import BaseTabShop from "./BaseTabShop";
import TabTopupChuyenKhoan from "./TabTopupChuyenKhoan";
import TabTopupNapThe from "./TabTopupNapThe";
import TabTopupSieuToc from "./TabTopupSieuToc";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TabTopupPaywell extends BaseTabShop {

    @property(TabTopupChuyenKhoan)
    tabChuyenKhoan: TabTopupChuyenKhoan = null;

    @property(TabTopupSieuToc)
    tabSieuToc: TabTopupSieuToc = null;

    @property(TabTopupNapThe)
    tabNapThe: TabTopupNapThe = null;

    @property(cc.Toggle)
    toggleChuyenKhoan: cc.Toggle = null;
    @property(cc.Toggle)
    toggleSieutToc: cc.Toggle = null;


    public dataProvider = null;
    public data = null;
    show(data) {
        super.show(data);
        //Utils.Log("show TabTopupPaywell:" + JSON.stringify(data));
        this.dataProvider = data;
        this.data = data.providerConfig;
        this.showPayTypes();
    }

    hide() {
        super.hide();
        this.tabChuyenKhoan.editMoney.tabIndex = -1;
        this.tabChuyenKhoan.editName.tabIndex = -1;
        this.tabSieuToc.editMoney.tabIndex = -1;
        this.tabSieuToc.editName.tabIndex = -1;
    }

    showPayTypes() {
        this.toggleChuyenKhoan.node.active = false;
        this.toggleSieutToc.node.active = false;
        var isFind = false;

        for (var i = 0; i < this.data.payType.length; i++) {
            if (this.data.payType[i].status == 1) {
                if (this.data.payType[i].name == "quickPay") {
                    this.toggleSieutToc.node.active = true;
                }
                else if (this.data.payType[i].name == "banking") {
                    this.toggleChuyenKhoan.node.active = true;
                }

                if (isFind == false) {
                    this.onBtnChoseTab(null, this.data.payType[i].name);
                    if (this.data.payType[i].name == "quickPay") {
                        this.toggleSieutToc.isChecked = true;
                    }
                    else if (this.data.payType[i].name == "banking") {
                        this.toggleChuyenKhoan.isChecked = true;
                    }

                    isFind = true;
                }
                if (this.data.payType[i].name == "banking") {
                    this.onBtnChoseTab(null, this.data.payType[i].name);
                    this.toggleSieutToc.isChecked = false;
                    this.toggleChuyenKhoan.isChecked = true;
                    isFind = true;
                }

            }
        }
    }

    showTab(payTypeKey) {
        if (payTypeKey == "quickPay") {
            this.tabSieuToc.show(this.data, this.dataProvider.providerName);
            this.tabChuyenKhoan.hide();
            this.tabChuyenKhoan.node.getChildByName("");

            this.tabChuyenKhoan.editMoney.tabIndex = -1;
            this.tabChuyenKhoan.editName.tabIndex = -1;
            if (this.tabSieuToc != null) {
                this.tabSieuToc.editMoney.tabIndex = 0;
                this.tabSieuToc.editName.tabIndex = -0;
            }
        }
        else {
            this.tabChuyenKhoan.show(this.data, this.dataProvider.providerName);
            this.tabChuyenKhoan.editMoney.tabIndex = 0;
            this.tabChuyenKhoan.editName.tabIndex = 0;
            if (this.tabSieuToc != null) {
                this.tabSieuToc.hide();
                this.tabSieuToc.editMoney.tabIndex = -1;
                this.tabSieuToc.editName.tabIndex = -1;
            }
        }
    }
    onBtnChoseTab(target, data) {
        var payTypeKey = data;
        this.showTab(payTypeKey);
    }
}
