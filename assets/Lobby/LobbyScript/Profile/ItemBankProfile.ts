// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    txtBank: cc.Label = null;

    @property(cc.Label)
    txtBranch: cc.Label = null;

    @property(cc.Label)
    txtName: cc.Label = null;

    @property(cc.Label)
    txtNumber: cc.Label = null;
    

    private data = null;
    private popupProfile = null;
    init(data,popupProfile){
        this.data = data;
        this.popupProfile = popupProfile;

        this.txtBank.string = data.bankName;
        this.txtBranch.string = data.branch;
        this.txtName.string =data.customerName;
        this.txtNumber.string = data.bankNumber;
    }

    onBtnClick(){
        this.popupProfile.ShowBoxUpdate(this.data);
    }
}
