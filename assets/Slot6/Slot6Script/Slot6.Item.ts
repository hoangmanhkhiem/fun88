

const { ccclass, property } = cc._decorator;

const enum SLOT6_ID_ITEM {
    JACKPOT = 3,
    BONUS = 1,
    WILD = 2,
    SCATTER = 0,
    X500 = 4,
    X375 = 5,
    X275 = 6,
    X150 = 7,
    X50 = 8,
    X25 = 9,
    X5 = 10
}

@ccclass
export default class Slot6Item extends cc.Component {



    @property(sp.Skeleton)
    skeItem: sp.Skeleton = null;
    @property(cc.Sprite)
    sprItem: cc.Sprite = null;

    @property(sp.SkeletonData)
    skeDataSpecical: sp.SkeletonData = null;
    @property(sp.SkeletonData)
    skeDataIcon: sp.SkeletonData = null;
    @property(sp.SkeletonData)
    skeDataIcon2: sp.SkeletonData = null;

    @property(cc.SpriteAtlas)
    sprAtlast: cc.SpriteAtlas = null;

    private mId: number = -1;
    animName = "";

    public getId() {
        return this.mId;
    }

    public setId(pId: number, isWin = false) {
        this.mId = pId;
        this.sprItem.sizeMode = cc.Sprite.SizeMode.TRIMMED;
        switch (this.mId) {
            case SLOT6_ID_ITEM.JACKPOT:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("jackpot")
                this.skeItem.skeletonData = this.skeDataSpecical;
                this.skeItem.animation = isWin ? "animation" : "animation";
                this.animName = isWin ? "animation" : "animation";
                break;
            case SLOT6_ID_ITEM.WILD:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("wild")
                this.skeItem.skeletonData = this.skeDataSpecical;
                this.skeItem.animation = isWin ? "animation" : "animation";
                this.animName = isWin ? "animation" : "animation";
                break;
            case SLOT6_ID_ITEM.BONUS:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("bonus");
                this.skeItem.skeletonData = this.skeDataSpecical;
                this.skeItem.animation = isWin ? "bonus" : "bonus2";
                this.animName = isWin ? "bonus" : "bonus2";
                break;
            case SLOT6_ID_ITEM.SCATTER:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("scatter");
                this.skeItem.skeletonData = this.skeDataSpecical;
                this.skeItem.animation = "scatter";
                this.animName = "scatter";
                break;
            case SLOT6_ID_ITEM.X500:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_4");
                this.skeItem.skeletonData = this.skeDataIcon;
                this.skeItem.animation = isWin ? "nhan ma" : "nhan ma2";
                this.animName = isWin ? "nhan ma" : "nhan ma2";
                break;
            case SLOT6_ID_ITEM.X375:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_7");
                this.skeItem.skeletonData = this.skeDataIcon;
                this.skeItem.animation = isWin ? "su tu" : "su tu2";
                this.animName = isWin ? "su tu" : "su tu2";
                break;
            case SLOT6_ID_ITEM.X275:
                this.skeItem.skeletonData = this.skeDataIcon;
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_6");
                this.skeItem.animation = isWin ? "bo cap" : "bo cap2";
                this.animName = isWin ? "bo cap" : "bo cap2";
                break;
            case SLOT6_ID_ITEM.X150:
                this.skeItem.skeletonData = this.skeDataIcon;
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_5");
                this.skeItem.animation = isWin ? "bach duong" : "bach duong2";
                this.animName = isWin ? "bach duong" : "bach duong2";
                break;
            case SLOT6_ID_ITEM.X50:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_3");
                this.skeItem.skeletonData = this.skeDataIcon2;
                this.skeItem.animation = "NguoiEm";
                this.animName = "nguoiem";
                break;
            case SLOT6_ID_ITEM.X25:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_1");
                this.skeItem.skeletonData = this.skeDataIcon2;
                this.skeItem.animation = "NguoiEm";
                this.animName = "nguoiem";
                break;
            case SLOT6_ID_ITEM.X5:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_2");
                this.skeItem.skeletonData = this.skeDataIcon2;
                this.skeItem.animation = "NguoiEm";
                this.animName = "nguoiem";
                break;
        }
        this.sprItem.node.setContentSize(cc.size(this.sprItem.node.width / 1.1, this.sprItem.node.height / 1.1));
    }
    showItemAnim() {
        this.skeItem.node.color = cc.Color.WHITE;
        this.skeItem.node.active = true;
        this.sprItem.node.active = false;
        this.skeItem.setAnimation(0, this.animName, true);
    }
    setIdBlur(id) {
        this.sprItem.sizeMode = cc.Sprite.SizeMode.TRIMMED;
        switch (this.mId) {
            case SLOT6_ID_ITEM.JACKPOT:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("jackpot_blur")
                break;
            case SLOT6_ID_ITEM.WILD:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("wild")
                break;
            case SLOT6_ID_ITEM.BONUS:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("bonus_blur");
                break;
            case SLOT6_ID_ITEM.SCATTER:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("scatter_blur");
                break;
            case SLOT6_ID_ITEM.X500:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_4_blur");
                break;
            case SLOT6_ID_ITEM.X375:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_7_blur");
                break;
            case SLOT6_ID_ITEM.X275:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_6_blur");
                break;
            case SLOT6_ID_ITEM.X150:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_5_blur");
                break;
            case SLOT6_ID_ITEM.X50:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_3_blur");
                break;
            case SLOT6_ID_ITEM.X25:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_1_blur");
                break;
            case SLOT6_ID_ITEM.X5:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_2_blur");
                break;
        }
        this.sprItem.node.setContentSize(cc.size(this.sprItem.node.width / 1.1, this.sprItem.node.height / 1.1));
    }
    offItemAnim() {
        this.sprItem.node.active = true;
        this.skeItem.node.active = false;
    }
}
