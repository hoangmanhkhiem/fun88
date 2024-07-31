const {ccclass, property} = cc._decorator;
@ccclass
export default class ItemIconSlot25 extends cc.Component {

    @property(cc.Sprite)
    spriteIcon: cc.Sprite = null;

    @property(sp.Skeleton)
    spineIcon: sp.Skeleton = null;

    @property(cc.Node)
    nodeBox:cc.Node = null;

    public gamePlayManager = null;
    public itemId = null;
    public index = null;
   
    init (itemId, index, gamePlayManager) {
        var self = this;
        self.gamePlayManager = gamePlayManager;
        self.itemId = itemId;
        self.index = index;
        self.spriteIcon.node.active = true;
        if(self.spineIcon){
            self.spineIcon.node.active = false;
        }
        self.spriteIcon.spriteFrame = self.gamePlayManager.getSpriteFrameIcon(self.itemId);
    }

    

    changeSpriteBlurByItemId(itemId){
        var self = this;
        self.itemId = itemId;
        self.spriteIcon.spriteFrame = self.gamePlayManager.getSpriteFrameIconBlur(itemId);
    }

    changeSpriteRealByItemId(itemId){
        var self = this;
        self.itemId = itemId;
        self.spriteIcon.spriteFrame = self.gamePlayManager.getSpriteFrameIcon(itemId);
    }

    changeSpineIcon(itemId){
        var self = this;
        self.itemId = itemId;
        if(self.spineIcon){
            self.spineIcon.skeletonData = self.gamePlayManager.getSpineIcon(itemId);
        }
    }
}
