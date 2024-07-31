const { ccclass, property } = cc._decorator;
@ccclass
export default class Slot1ItemSlot extends cc.Component {

    @property(cc.Sprite)
    spriteIcon: cc.Sprite = null;

    @property(sp.Skeleton)
    spineIcon: sp.Skeleton = null;

    @property(cc.Node)
    nodeBox: cc.Node = null;
    @property(cc.SpriteAtlas)
    itemAtlast: cc.SpriteAtlas = null;

    public gamePlayManager = null;
    public itemId = null;
    public index = null;
    public animName = null;
    onLoad() {
        this.spriteIcon = cc.find("Box/sprite", this.node).getComponent(cc.Sprite);
        this.spineIcon = cc.find("Box/spine", this.node).getComponent(sp.Skeleton);
        this.nodeBox = this.node.getChildByName("Box");

    }
    init(itemId, index, gamePlayManager) {
        var self = this;
        self.gamePlayManager = gamePlayManager;
        self.itemId = itemId;
        self.index = index;
        self.spriteIcon.node.active = true;
        this.spineIcon.node.scale = 0.65;
        this.spriteIcon.node.setContentSize(cc.size(this.spriteIcon.node.width / 1, this.spriteIcon.node.height / 1));
        self.spineIcon.node.active = false;
        // self.spriteIcon.spriteFrame = self.gamePlayManager.getSpriteFrameIcon(self.itemId);
        this.spriteIcon.spriteFrame = this.itemAtlast.getSpriteFrame(itemId);
    }



    changeSpriteBlurByItemId(itemId) {
        var self = this;
        self.itemId = itemId;
        this.spineIcon.node.active = false;
        this.spriteIcon.node.active = true;
        this.spriteIcon.sizeMode = cc.Sprite.SizeMode.TRIMMED;
        self.spriteIcon.spriteFrame = this.itemAtlast.getSpriteFrame("blur_" + itemId);
        this.spriteIcon.node.setContentSize(cc.size(this.spriteIcon.node.width / 1, this.spriteIcon.node.height / 1));
    }

    changeSpriteRealByItemId(itemId) {
        var self = this;
        this.itemId = itemId;
        this.spriteIcon.sizeMode = cc.Sprite.SizeMode.TRIMMED;
        this.spriteIcon.spriteFrame = this.itemAtlast.getSpriteFrame(itemId);
        this.spriteIcon.node.setContentSize(cc.size(this.spriteIcon.node.width / 1, this.spriteIcon.node.height / 1));
    }

    changeSpineIcon(itemId) {
        var self = this;
        self.itemId = itemId;
        this.spriteIcon.node.y = 0;
        this.spriteIcon.sizeMode = cc.Sprite.SizeMode.TRIMMED;
        this.spriteIcon.spriteFrame = this.itemAtlast.getSpriteFrame(itemId);
        this.spriteIcon.node.setContentSize(cc.size(this.spriteIcon.node.width / 1, this.spriteIcon.node.height / 1));
        if (itemId > 2) {
            this.spineIcon.node.active = false;
        } else {
            itemId = parseInt(itemId);
            switch (itemId) {
                case 0:
                    this.animName = "animation_Fire"
                    this.spriteIcon.node.y = 10;
                    break;
                case 1:
                    this.animName = "animation"
                    break;
                case 2:
                    this.animName = "animation";
                    break;
            }

            // this.spineIcon.setAnimation(0, animName, true);
        }
    }
    checkShowSpriteOrSpine() {
        cc.Tween.stopAllByTarget(this.spriteIcon.node);
        cc.Tween.stopAllByTarget(this.spineIcon.node);
        if (this.itemId > 2) {
            this.spineIcon.node.active = false;
            this.spriteIcon.node.active = true;
            this.spriteIcon.node.color = cc.Color.WHITE;
            cc.tween(this.spriteIcon.node)
                .to(0.25, { scale: 0.9 }, { easing: cc.easing.sineOut })
                .to(0.25, { scale: 0.8 }, { easing: cc.easing.sineOut })
                .delay(0.4)
                .call(() => {
                    this.spriteIcon.node.color = cc.Color.GRAY;
                }).start();
        } else {
            this.spineIcon.node.active = true;
            this.spriteIcon.node.active = false;
            this.spineIcon.setAnimation(0, this.animName, true);
            this.spineIcon.node.color = cc.Color.WHITE;

            cc.tween(this.spineIcon.node)
                .delay(0.9).call(() => {
                    this.spineIcon.node.color = cc.Color.GRAY;
                    this.spriteIcon.node.active = true;
                    this.spineIcon.node.active = false;
                }).start();
        }
    }
}