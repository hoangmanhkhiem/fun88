// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemSlot extends cc.Component {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;
    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.SpriteAtlas)
    sprAtlas: cc.SpriteAtlas = null;

    id = 0;
    animName = "";
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    setId(id) {

        id = id + 1;
        this.id = id;
        this.sprite.spriteFrame = this.sprAtlas.getSpriteFrame("icon" + this.id);
        this.spine.node.active = true;
        this.sprite.node.active = false;
        switch (this.id) {
            case 1:
                this.animName = "wild"
                break;
            case 2:
                this.animName = 'do';
                break;
            case 3:
                this.animName = 'xanh luc';
                break;
            case 4:
                this.animName = 'la';
                break;
            case 5:
                this.animName = 'tim';
                break;
            case 6:
                this.animName = 'xanh duong';
                break;
        }
        this.spine.setAnimation(0, this.animName, true);
    }
    setBlur() {
        this.sprite.spriteFrame = this.sprAtlas.getSpriteFrame("icon" + (this.id + 1) + "_blur");
        this.spine.node.active = false;
        this.sprite.node.active = true;
    }

    // update (dt) {}
}
