// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseTabShop from "./BaseTabShop";
import TabTopupChuyenKhoan from "./TabTopupChuyenKhoan";
import TabTopupMomo from "./TabTopupMomo";
import TabTopupSieuToc from "./TabTopupSieuToc";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TabTopupPaywell extends BaseTabShop{

    @property(TabTopupChuyenKhoan)
    tabChuyenKhoan:TabTopupChuyenKhoan=null;

    @property(TabTopupSieuToc)
    tabSieuToc:TabTopupSieuToc=null;

    @property(TabTopupMomo)
    tabMomo:TabTopupMomo=null;

    @property(cc.Toggle)
    toggleChuyenKhoan:cc.Toggle=null;
    @property(cc.Toggle)
    toggleSieutToc:cc.Toggle=null;
    @property(cc.Toggle)
    toggleMomo:cc.Toggle=null;

    private dataProvider =null;
    private data = null;
    private payTypesAlive = null;
    show(data){
        super.show(data);
        this.dataProvider = data;
        this.data= data.providerConfig;
        this.showPayTypes();

        
    }

    hide(){
        super.hide();

        this.tabChuyenKhoan.editMoney.tabIndex = -1;
        this.tabChuyenKhoan.editName.tabIndex = -1;
        this.tabSieuToc.editMoney.tabIndex = -1;
        this.tabSieuToc.editName.tabIndex = -1;
        this.tabMomo.editMoney.tabIndex = -1;
        this.tabMomo.editName.tabIndex = -1;
    }

    showPayTypes(){
        this.toggleChuyenKhoan.node.active = false;
        this.toggleSieutToc.node.active = false;
        this.toggleMomo.node.active = false;
        var isFind = false;
        for(var i=0;i<this.data.payType.length;i++){
            if(this.data.payType[i].status == 1){
                if(this.data.payType[i].name == "quickPay"){
                    this.toggleSieutToc.node.active = true;
                }
                else if(this.data.payType[i].name == "banking"){
                    this.toggleChuyenKhoan.node.active = true;
                }
                else{
                    this.toggleMomo.node.active = true;
                }
                if(isFind == false) {
                    this.onBtnChoseTab(null,this.data.payType[i].name);
                    if(this.data.payType[i].name == "quickPay"){
                        this.toggleSieutToc.isChecked = true;
                    }
                    else if(this.data.payType[i].name == "banking"){
                        this.toggleChuyenKhoan.isChecked = true;
                    }
                    else{
                        this.toggleMomo.isChecked = true;
                    }
                    isFind = true;
                }
                if(this.data.payType[i].name == "banking"){
                    this.onBtnChoseTab(null,this.data.payType[i].name);
                    this.toggleSieutToc.isChecked  = false;
                    this.toggleMomo.isChecked = false;
                    this.toggleChuyenKhoan.isChecked = true;
                    isFind = true;
                }
               
            }
        }
    }

    showTab(payTypeKey){
        if(payTypeKey == "quickPay"){
            this.tabSieuToc.show(this.data,this.dataProvider.providerName);
            this.tabChuyenKhoan.hide();
            this.tabMomo.hide();

            this.tabChuyenKhoan.editMoney.tabIndex = -1;
            this.tabChuyenKhoan.editName.tabIndex = -1;
            this.tabSieuToc.editMoney.tabIndex = 0;
            this.tabSieuToc.editName.tabIndex = 0;
            this.tabMomo.editMoney.tabIndex = -1;
            this.tabMomo.editName.tabIndex = -1;
        }
        else if(payTypeKey == "banking"){
            this.tabSieuToc.hide();
            this.tabMomo.hide();
            this.tabChuyenKhoan.show(this.data,this.dataProvider.providerName);
            this.tabChuyenKhoan.editMoney.tabIndex = 0;
            this.tabChuyenKhoan.editName.tabIndex = 0;
            this.tabSieuToc.editMoney.tabIndex = -1;
            this.tabSieuToc.editName.tabIndex = -1;
            this.tabMomo.editMoney.tabIndex = -1;
            this.tabMomo.editName.tabIndex = -1;
        }
        else{
            this.tabChuyenKhoan.editMoney.tabIndex = -1;
            this.tabChuyenKhoan.editName.tabIndex = -1;
            this.tabSieuToc.editMoney.tabIndex = -1;
            this.tabSieuToc.editName.tabIndex = -1;
            this.tabMomo.editMoney.tabIndex = 0;
            this.tabMomo.editName.tabIndex = 0;
            this.tabSieuToc.hide();
            this.tabChuyenKhoan.hide();
            this.tabMomo.show(this.data,this.dataProvider.providerName);
        }
    }

    onBtnChoseTab(target,data){
        var payTypeKey = data;
        this.showTab(payTypeKey);
    }
}
