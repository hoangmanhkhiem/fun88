import Tween from "../Script/common/Tween";

const {ccclass, property} = cc._decorator;


@ccclass
export default class ItemGameLive extends cc.Component {

    @property
    id:number = 0;
    @property(cc.Label)
    txtName:cc.Label = null;
    @property(cc.Label)
    txtBalance:cc.Label = null;
    @property(cc.Label)
    txtMaintain:cc.Label = null;
    @property(cc.Node)
    nodeBox:cc.Node = null;

    public money = 0;
    show(){
        this.node.active = true;
        this.money = 0;
    }

    hide(){
        this.node.active = false;
    }

    maintain(){
        this.txtBalance.node.active = false;
        this.txtMaintain.node.active = true;
    }
    updateData(data){
        this.txtBalance.node.active = true;
        this.txtMaintain.node.active = false;
        this.money  = parseInt(data);
        if(this.id == 1 || this.id == 2 || this.id == 3){
            Tween.numberTo(this.txtBalance,this.money*1000,1);
        }
        else{
            Tween.numberTo(this.txtBalance,this.money,1);
        }
    }

    onBtnClick(){

    }
    
}
