import Res from "./TienLen.Res";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Card extends cc.Component {

    spr = null;
    posY = 0;
    offsetY = 20;
    isSelected = false;
    callback = null;
    index = null;

    onLoad() {
        this.spr = this.node.getComponent(cc.Sprite);
        this.posY = this.node.y;
    }

    onSelect() {
        this.node.y += this.isSelected ? -this.offsetY : this.offsetY;
        this.isSelected = !this.isSelected;
        if (this.isSelected && this.callback) {
            this.callback(this.index);
        }

    }

    setCardData(index, callback = null) {
        this.index = index;
        if(this.spr==null){
            this.spr=this.node.getComponent(cc.Sprite);
        }
        this.spr.spriteFrame = Res.getInstance().getCardFace(index);
        this.callback = callback;
    }

    getCardIndex() {
        return this.index;
    }

    select() {
        this.node.y = this.posY + this.offsetY;
        this.isSelected = true;
    }

    deSelect() {
        this.node.y = this.posY;
        this.isSelected = false;
    }
}
