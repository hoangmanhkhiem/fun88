import VersionConfig from "../../../../Loading/src/VersionConfig";


const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Sprite)
export default class CPSprite extends cc.Component {

    @property(cc.SpriteFrame)
    sprR99: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sprVip52: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sprXXeng: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sprManVip: cc.SpriteFrame = null;

    onLoad() {
        switch (VersionConfig.CPName) {
            default:
                this.getComponent(cc.Sprite).spriteFrame = this.sprR99;
                break;
        }
    }
}
