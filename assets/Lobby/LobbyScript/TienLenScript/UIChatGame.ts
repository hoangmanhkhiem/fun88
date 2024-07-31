// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Toggle)
    btnEmotion: cc.Toggle = null;

    @property(cc.Toggle)
    btnChatNhanh: cc.Toggle = null;

    @property(cc.Node)
    tabEmotion:cc.Node = null;

    @property(cc.Node)
    tabChatNhanh:cc.Node = null;

    

    onBtnEmotion(){
        this.tabEmotion.active = true;
        this.tabChatNhanh.active = false;
    }

    onBtnChatNhanh(){
        this.tabEmotion.active = false;
        this.tabChatNhanh.active = true;
    }
}
