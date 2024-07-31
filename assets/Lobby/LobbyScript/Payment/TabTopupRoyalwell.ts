// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Utils from "../Script/common/Utils";
import BaseTabShop from "./BaseTabShop";
import TabTopupSieuToc from "./TabTopupSieuToc";
import TabTopupChuyenKhoan from "./TabTopupSieuToc";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TabTopupPaywell extends BaseTabShop{

    @property(TabTopupChuyenKhoan)
    tabChuyenKhoan:TabTopupChuyenKhoan=null;

    @property(TabTopupSieuToc)
    tabSieuToc:TabTopupSieuToc=null;

    @property(cc.Toggle)
    toggleChuyenKhoan:cc.Toggle=null;
    @property(cc.Toggle)
    toggleSieutToc:cc.Toggle=null;


    private dataProvider =null;
    private data = null;
    show(data){
        super.show(data);
         //Utils.Log("show TabTopupPaywell:"+JSON.stringify(data));
        this.dataProvider = data;
        this.data= data.providerConfig;
        this.showPayTypes();
    }

    hide(){
        super.hide();
    }

    showPayTypes(){
        this.toggleChuyenKhoan.node.active = false;
        this.toggleSieutToc.node.active = false;
        var isFind = false;
        for(var i=0;i<this.data.payType.length;i++){
            if(this.data.payType[i].status == 1){
                if(this.data.payType[i].name == "quickPay"){
                    this.toggleSieutToc.node.active = true;
                }
                else if(this.data.payType[i].name == "banking"){
                    this.toggleChuyenKhoan.node.active = true;
                }
                
                if(isFind == false) {
                    this.onBtnChoseTab(null,this.data.payType[i].name);
                    if(this.data.payType[i].name == "quickPay"){
                        this.toggleSieutToc.isChecked = true;
                    }
                    else if(this.data.payType[i].name == "banking"){
                        this.toggleChuyenKhoan.isChecked = true;
                    }
                    
                    isFind = true;
                }
                if(this.data.payType[i].name == "banking"){
                    this.onBtnChoseTab(null,this.data.payType[i].name);
                    this.toggleSieutToc.isChecked  = false;
                    this.toggleChuyenKhoan.isChecked = true;
                    isFind = true;
                }
               
            }
        }
    }

    showTab(payTypeKey){
        if(payTypeKey == "IB_ONLINE"){
            this.tabSieuToc.show(this.data,this.dataProvider.providerName);
            this.tabChuyenKhoan.hide();
        }
        else{
            this.tabSieuToc.hide();
            this.tabChuyenKhoan.show(this.data,this.dataProvider.providerName);
        }
    }

    onBtnChoseTab(target,data){
        var payTypeKey = data;
        this.showTab(payTypeKey);
    }
}
