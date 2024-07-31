import TabTopupPaywell from "./TabTopupPaywell";


const { ccclass, property } = cc._decorator;

@ccclass
export default class TabTopupCard extends TabTopupPaywell {

    // LIFE-CYCLE CALLBACKS:
    @property({
        type: cc.Toggle,
        visible: false,
        override: true
    })
    toggleChuyenKhoan: cc.Toggle = null;
    @property({
        type: cc.Toggle,
        visible: false,
        override: true
    })
    toggleSieutToc: cc.Toggle = null;
    // onLoad () {}

    showPayTypes() {
        this.showTab("payasec");
    }
    
    hide() {
        this.node.active = false;
        this.tabNapThe.editMoney.tabIndex = -1;
        this.tabNapThe.editName.tabIndex = -1;
    }
    showTab(payTypeKey) {
        this.tabNapThe.show(this.data, this.dataProvider.providerName);
        this.tabNapThe.editMoney.tabIndex = 0;
        this.tabNapThe.editName.tabIndex = 0;
    }
    // update (dt) {}
}
