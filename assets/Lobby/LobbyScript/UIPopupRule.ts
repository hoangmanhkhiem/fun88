
import App from "./Script/common/App";
import Dialog from "./Script/common/Dialog";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIPopupRule extends Dialog {
   

    start(){
        
    }
    _onShowed() {
        super._onShowed();
     
    }

    

    show() {
        super.show();
        // this.loadData();
    }

    
}
