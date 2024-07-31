const { ccclass, property } = cc._decorator;

const enum SLOT7_ID_ITEM {
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
  X5 = 10,
}

@ccclass
export default class Slot7Item extends cc.Component {
  @property(cc.Sprite)
  sprItem: cc.Sprite = null;

  @property(sp.Skeleton)
  skeItem: sp.Skeleton = null;

  @property(sp.SkeletonData)
  skeDataJackpot: sp.SkeletonData = null;

  @property(sp.SkeletonData)
  skeDataBonus: sp.SkeletonData = null;

  @property(sp.SkeletonData)
  skeDataScatter: sp.SkeletonData = null;

  @property(sp.SkeletonData)
  skeDataWild: sp.SkeletonData = null;

  @property(cc.SpriteFrame)
  frameX500: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  frameX375: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  frameX275: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  frameX150: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  frameX50: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  frameX25: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  frameX5: cc.SpriteFrame = null;

  private mId: number = -1;

  public getId() {
    return this.mId;
  }

  public setId(pId: number) {
    this.mId = pId;
    if (
      this.mId == SLOT7_ID_ITEM.JACKPOT ||
      this.mId == SLOT7_ID_ITEM.WILD ||
      this.mId == SLOT7_ID_ITEM.BONUS ||
      this.mId == SLOT7_ID_ITEM.SCATTER
    ) {
      this.skeItem.node.active = true;
      this.sprItem.node.active = false;

      if (this.mId == SLOT7_ID_ITEM.JACKPOT) {
        this.skeItem.skeletonData = this.skeDataJackpot;
        this.skeItem.animation = "animation";
        this.skeItem.setAnimationCacheMode(
          sp.Skeleton.AnimationCacheMode.SHARED_CACHE
        );
      } else if (this.mId == SLOT7_ID_ITEM.WILD) {
        this.skeItem.skeletonData = this.skeDataWild;
        this.skeItem.animation = "animation";
        this.skeItem.setAnimationCacheMode(
          sp.Skeleton.AnimationCacheMode.SHARED_CACHE
        );
      } else if (this.mId == SLOT7_ID_ITEM.BONUS) {
        this.skeItem.skeletonData = this.skeDataBonus;
        this.skeItem.animation = "animation";
        this.skeItem.setAnimationCacheMode(
          sp.Skeleton.AnimationCacheMode.SHARED_CACHE
        );
      } else if (this.mId == SLOT7_ID_ITEM.SCATTER) {
        this.skeItem.skeletonData = this.skeDataScatter;
        this.skeItem.animation = "animation";
        this.skeItem.setAnimationCacheMode(
          sp.Skeleton.AnimationCacheMode.SHARED_CACHE
        );
      } else {
      }
    } else {
      this.skeItem.node.active = false;
      this.sprItem.node.active = true;

      if (this.mId == SLOT7_ID_ITEM.X500) {
        this.sprItem.spriteFrame = this.frameX500;
      } else if (this.mId == SLOT7_ID_ITEM.X375) {
        this.sprItem.spriteFrame = this.frameX375;
      } else if (this.mId == SLOT7_ID_ITEM.X275) {
        this.sprItem.spriteFrame = this.frameX275;
      } else if (this.mId == SLOT7_ID_ITEM.X150) {
        this.sprItem.spriteFrame = this.frameX150;
      } else if (this.mId == SLOT7_ID_ITEM.X50) {
        this.sprItem.spriteFrame = this.frameX50;
      } else if (this.mId == SLOT7_ID_ITEM.X25) {
        this.sprItem.spriteFrame = this.frameX25;
      } else if (this.mId == SLOT7_ID_ITEM.X5) {
        this.sprItem.spriteFrame = this.frameX5;
      } else {
      }
    }
  }
}
