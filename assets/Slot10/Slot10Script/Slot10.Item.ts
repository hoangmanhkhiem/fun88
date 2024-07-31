const { ccclass, property } = cc._decorator;
@ccclass
export default class Slot10ItemSlot extends cc.Component {

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
        this.spineIcon = cc.find("Box/ske", this.node).getComponent(sp.Skeleton);
        this.nodeBox = this.node.getChildByName("Box");
    }
    init(itemId, index, gamePlayManager) {
        itemId = parseInt(itemId);
        this.gamePlayManager = gamePlayManager;
        this.itemId = itemId;
        this.index = index;
        this.spriteIcon.node.active = true;
        this.spineIcon.node.scale = 0.65;
        // this.spriteIcon.node.setContentSize(cc.size(this.spriteIcon.node.width *0.67, this.spriteIcon.node.height *0.67));
        this.spineIcon.node.active = false;
        // self.spriteIcon.spriteFrame = self.gamePlayManager.getSpriteFrameIcon(self.itemId);
        this.spriteIcon.spriteFrame = this.itemAtlast.getSpriteFrame("item_" + (itemId + 1));
    }



    changeSpriteBlurByItemId(itemId) {
        itemId = parseInt(itemId);
        this.itemId = itemId;
        this.spineIcon.node.active = false;
        this.spriteIcon.node.active = true;
        this.spriteIcon.sizeMode = cc.Sprite.SizeMode.TRIMMED;
        this.spriteIcon.spriteFrame = this.itemAtlast.getSpriteFrame("item_" + (itemId + 1) + "_blur");
        // this.spriteIcon.node.setContentSize(cc.size(this.spriteIcon.node.width*0.67, this.spriteIcon.node.height*0.67));
    }

    changeSpriteRealByItemId(itemId) {
        itemId = parseInt(itemId);
        this.itemId = itemId;
        this.spriteIcon.sizeMode = cc.Sprite.SizeMode.TRIMMED;
        this.spineIcon.node.active = false;
        this.spriteIcon.node.active = true;
        this.spriteIcon.spriteFrame = this.itemAtlast.getSpriteFrame("item_" + (itemId + 1));
        // this.spriteIcon.node.setContentSize(cc.size(this.spriteIcon.node.width*0.67, this.spriteIcon.node.height*0.67));
    }

    changeSpineIcon(itemId) {
        itemId = parseInt(itemId);
        this.itemId = itemId;
        this.spriteIcon.sizeMode = cc.Sprite.SizeMode.TRIMMED;
        this.spriteIcon.spriteFrame = this.itemAtlast.getSpriteFrame("item_" + (itemId + 1));
        this.spriteIcon.node.active = true;
        // this.spriteIcon.node.setContentSize(cc.size(this.spriteIcon.node.width *0.67, this.spriteIcon.node.height *0.67));
        if (itemId != 0 && itemId != 2) {
            this.spineIcon.node.active = false;

        } else {
            itemId = parseInt(itemId);
            switch (itemId) {
                case 0:
                    this.animName = "jackpot"
                    break;
                case 2:
                    this.animName = "bonus";
                    break;
            }

            // this.spineIcon.setAnimation(0, this.animName, true);
        }
    }
    checkShowSpriteOrSpine() {
        //  cc.log("checkShowSpriteOrSpine");
        cc.Tween.stopAllByTarget(this.spriteIcon.node);
        cc.Tween.stopAllByTarget(this.spineIcon.node);
        if (this.itemId != 0 && this.itemId != 2) {
            this.spineIcon.node.active = false;
            this.spriteIcon.node.active = true;
            this.spriteIcon.node.color = cc.Color.WHITE;
            // cc.tween(this.spriteIcon.node)
            //     .to(0.25, { scale: 0.9 }, { easing: cc.easing.sineOut })
            //     .to(0.25, { scale: 0.8 }, { easing: cc.easing.sineOut })
            //     .delay(0.4)
            //     .call(() => {
            //         this.spriteIcon.node.color = cc.Color.GRAY;
            //     }).start();
        } else {
            this.spineIcon.node.active = true;
            this.spriteIcon.node.active = false;
            this.spineIcon.setAnimation(0, this.animName, true);
            this.spineIcon.node.color = cc.Color.WHITE;
        }
        cc.tween(this.node)
            .delay(0.9).call(() => {
                //  cc.log("co chay vao day ko");
                this.spineIcon.node.color = cc.Color.GRAY;
                this.spriteIcon.node.color = cc.Color.GRAY;
                this.spriteIcon.node.active = true;
                this.spineIcon.node.active = false;
            }).start();
    }
}