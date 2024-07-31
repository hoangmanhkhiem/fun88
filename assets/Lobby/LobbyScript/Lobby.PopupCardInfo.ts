import Dialog from "./Script/common/Dialog";
import Utils from "./Script/common/Utils";


const { ccclass, property } = cc._decorator;





@ccclass
export default class PopupCardInfo extends Dialog {

    @property(cc.Node)
    itemFactorTemplate: cc.Node = null;

    @property(cc.Node)
    contentItem: cc.Node = null;

    
    private _nodeTemplate: cc.Node = null;

    private tabSelectedIdx = 0;

    start() {
        
    }
    setListItem(listItem: string){
        let itemArray = JSON.parse(listItem);
        //let content = cc.instantiate(this.itemFactorTemplate).parent;
        if(this._nodeTemplate == null){
            this._nodeTemplate = cc.instantiate(this.itemFactorTemplate);
            //this._nodeTemplate.parent =  this.itemFactorTemplate.parent
        }
        

        this.contentItem.removeAllChildren();
        for (let i = 0; i < itemArray.length; i++) {
            let node = cc.instantiate(this._nodeTemplate);
            node.parent = this.contentItem;
            node.active = true;

            
            node.getChildByName("stt").getComponent(cc.Label).string = (i + 1).toString();
            node.getChildByName("telcoName").getComponent(cc.Label).string = itemArray[i].Telco;
            node.getChildByName("amount").getComponent(cc.Label).string = Utils.formatNumber(Number(itemArray[i].Amount));
            node.getChildByName("pincode").getComponent(cc.Label).string = itemArray[i].PinCode;
            node.getChildByName("serial").getComponent(cc.Label).string = itemArray[i].Serial;
        }
        this.show();
    }
    

    show() {
        super.show();
       
       
    }

    

    

    
}
