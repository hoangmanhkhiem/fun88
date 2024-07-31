// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import TabPopupChuyenKhoan from "./TabTopupChuyenKhoan";
import TabPopupSieuToc from "./TabTopupSieuToc";
import BaseTabShop from "./BaseTabShop";
@ccclass
export default class TabTopupClickPay extends BaseTabShop{

    @property(TabPopupChuyenKhoan)
    tabChuyenKhoan:TabPopupChuyenKhoan=null;

    @property(TabPopupSieuToc)
    tabSieuToc:TabPopupSieuToc=null;

    @property(cc.Toggle)
    toggleChuyenKhoan:cc.Toggle=null;
    @property(cc.Toggle)
    toggleSieutToc:cc.Toggle=null;


    private dataProvider =null;
    private data = null;
    show(data){
        super.show(data);
        this.dataProvider = data;
        this.data= data.providerConfig;
        this.showPayTypes();
        this.onBtnChoseTab(null,"quickPay");
    }

    hide(){
        super.hide();
        this.tabChuyenKhoan.editMoney.tabIndex = -1;
        this.tabChuyenKhoan.editName.tabIndex = -1;
        this.tabSieuToc.editMoney.tabIndex = -1;
        this.tabSieuToc.editName.tabIndex = -1;
    }

    showPayTypes(){
        this.toggleChuyenKhoan.node.active = false;
        this.toggleSieutToc.node.active = false;
        for(var i=0;i<this.data.payType.length;i++){
            if(this.data.payType[i].status == 1){
                if(this.data.payType[i].name == "quickPay"){
                    this.toggleSieutToc.node.active = true;
                }
                else if(this.data.payType[i].name == "banking"){
                    this.toggleChuyenKhoan.node.active = true;
                }
            }
        }
    }

    showTab(payTypeKey){
        if(payTypeKey == "quickPay"){
            this.tabSieuToc.show(this.data,this.dataProvider.providerName);
            this.tabChuyenKhoan.hide();

            this.tabChuyenKhoan.editMoney.tabIndex = -1;
            this.tabChuyenKhoan.editName.tabIndex = -1;
            this.tabSieuToc.editMoney.tabIndex = 0;
            this.tabSieuToc.editName.tabIndex = 0;
        }
        else{
            this.tabSieuToc.hide();
            this.tabChuyenKhoan.show(this.data,this.dataProvider.providerName);

            this.tabChuyenKhoan.editMoney.tabIndex = 0;
            this.tabChuyenKhoan.editName.tabIndex = 0;
            this.tabSieuToc.editMoney.tabIndex = -1;
            this.tabSieuToc.editName.tabIndex = -1;
        }
    }

    onBtnChoseTab(target,data){
        var payTypeKey = data;
        this.showTab(payTypeKey);
    }
}
