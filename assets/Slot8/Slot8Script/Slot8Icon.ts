
const { ccclass, property } = cc._decorator;

@ccclass
export default class Slot8Icon extends cc.Component {



    // LIFE-CYCLE CALLBACKS:

    @property(cc.Node)
    nodeIcon: cc.Node = null;
    @property(sp.Skeleton)
    spineIcon: sp.Skeleton = null;
    @property(cc.Node)

    private animation: cc.Animation=null;

    onLoad() {
        this.animation = this.getComponent(cc.Animation);
    }

    start() {

    }

    setSprite(sf: cc.SpriteFrame) {
        this.nodeIcon.active = true;
        this.spineIcon.node.active = false;

        this.nodeIcon.getComponent(cc.Sprite).spriteFrame = sf;
    }

    setSpine(ske:sp.SkeletonData,id) {
        this.nodeIcon.active = false;
        this.spineIcon.node.active = true;
        
        this.spineIcon.skeletonData = ske;
        if(id == 0){
            this.spineIcon.setAnimation(0,"jackport",true);
        }
        else if(id == 1){
            this.spineIcon.setAnimation(0,"bonus",true);
        }
        else if(id == 2){
            this.spineIcon.setAnimation(0,"freespin",true);
        }
    }
    normal(){
        this.nodeIcon.color = new cc.Color(255,255,255);
        this.spineIcon.node.color = new cc.Color(255,255,255);
    }

    unscale() {
        this.nodeIcon.color = new cc.Color(50,50,50);
        this.spineIcon.node.color = new cc.Color(50,50,50);
    }

    scale() {
        this.nodeIcon.color = new cc.Color(255,255,255);
        this.spineIcon.node.color = new cc.Color(255,255,255);
        if (this.nodeIcon.active) {
            this.animation.play();
        }
    }

    // update (dt) {}
}
