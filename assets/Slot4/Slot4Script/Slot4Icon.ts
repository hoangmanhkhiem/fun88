
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {



    // LIFE-CYCLE CALLBACKS:

    @property(cc.Node)
    nodeIcon: cc.Node = null;
    @property(cc.Node)
    fxJackpot: cc.Node = null;
    @property(cc.Node)
    fxBonus: cc.Node = null;
    @property(cc.Node)
    fxFree: cc.Node = null;

    private animation: cc.Animation;

    onLoad() {
        this.animation = this.getComponent(cc.Animation);
    }

    start() {

    }

    setSprite(sf: cc.SpriteFrame) {
        this.nodeIcon.active = true;
        this.fxJackpot.active = false;
        this.fxBonus.active = false;
        this.fxFree.active = false;

        this.nodeIcon.getComponent(cc.Sprite).spriteFrame = sf;
    }

    setSpine(id) {
        this.nodeIcon.active = false;
        this.fxJackpot.active = false;
        this.fxBonus.active = false;
        this.fxFree.active = false;
        switch (parseInt(id)) {
            case 0:
                this.fxJackpot.active = true;
                break;
            case 1:
                this.fxBonus.active = true;
                break;
            case 2:
                this.fxFree.active = true;
                break;
            default:
                break;
        }
    }

    scale() {
        if (this.nodeIcon.active) {
            this.animation.play();
        }
    }

    // update (dt) {}
}
