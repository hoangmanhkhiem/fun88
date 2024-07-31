
import Tween from "../../Lobby/LobbyScript/Script/common/Tween";
import Slot4Controller from "./Slot4Controller";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Slot4Glory extends cc.Component {
    @property(cc.Node)
    nodeBox:cc.Node = null;
    @property(cc.Sprite)
    spriteTutorial: cc.Sprite = null;
    @property([cc.SpriteFrame])
    sfTutorialArr: cc.SpriteFrame[] = [];

    show(controller:Slot4Controller) {
        Tween.showPopup(this.nodeBox,this.nodeBox.parent);
        if(controller.betId == -1){
            this.spriteTutorial.spriteFrame = this.sfTutorialArr[2];
        }
        else if(controller.betId == 0){
            this.spriteTutorial.spriteFrame = this.sfTutorialArr[0];
        }
        else if(controller.betId == 1){
            this.spriteTutorial.spriteFrame = this.sfTutorialArr[1];
        }
        else{
            this.spriteTutorial.spriteFrame = this.sfTutorialArr[2];
        }
    }

    hide() {
        Tween.hidePopup(this.nodeBox,this.nodeBox.parent,false);
        
    }

    
}