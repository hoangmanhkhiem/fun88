
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.SpriteFrame)
    spriteFrameOn: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    spriteFrameOff: cc.SpriteFrame = null;
    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.sprite.spriteFrame=this.spriteFrameOn;
    }

    public SetActive(active:Boolean)
    {
        //  //Utils.Log("activeactiveactiveactiveactive: "+active);
        if(active)
        this.sprite.spriteFrame=this.spriteFrameOn;
        else
        this.sprite.spriteFrame=this.spriteFrameOff;
    }
}
