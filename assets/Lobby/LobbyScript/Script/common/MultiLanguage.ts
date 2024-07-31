import LanguageLanguageManager from "./Language.LanguageManager";


const { ccclass, property } = cc._decorator;
export enum TYPE_OBJECT {
    LABEL,
    SPRITE,
    SKELETON
}
@ccclass
export default class MultiLanguage extends cc.Component {

    @property({ type: cc.Enum(TYPE_OBJECT) })
    TYPE: TYPE_OBJECT = TYPE_OBJECT.LABEL;
    @property({
        visible: function (this: MultiLanguage) { return this.TYPE == TYPE_OBJECT.LABEL }
    })
    id: string = '';
    @property({
        visible: function (this: MultiLanguage) { return this.TYPE == TYPE_OBJECT.LABEL }
    })
    isAddColon: boolean = false;

    // @property({
    //     visible: function (this: MultiLanguage) { return this.TYPE == TYPE_OBJECT.SKELETON }
    // })
    // BundleName: string = '';
    @property({
        visible: function (this: MultiLanguage) { return this.TYPE == TYPE_OBJECT.SKELETON }
    })
    BundleName: string = '';

    @property({
        visible: function (this: MultiLanguage) { return this.TYPE == TYPE_OBJECT.SKELETON },
        type: sp.Skeleton
    })
    skeletonNode: sp.Skeleton = null
    @property({
        visible: function (this: MultiLanguage) { return this.TYPE == TYPE_OBJECT.SKELETON },
        type: [cc.String]
    })
    animationName: string[] = [];

    @property({
        visible: function (this: MultiLanguage) { return this.TYPE == TYPE_OBJECT.SPRITE },
        type: [cc.SpriteFrame]
    })
    spriteFrames: cc.SpriteFrame[] = [];

    @property({
        visible: function (this: MultiLanguage) { return this.TYPE == TYPE_OBJECT.SPRITE },
        type: cc.Sprite
    })
    sprite: cc.Sprite = null;

    @property({
        visible: function (this: MultiLanguage) { return this.TYPE == TYPE_OBJECT.LABEL },
    })
    @property({
        visible: function (this: MultiLanguage) { return this.TYPE == TYPE_OBJECT.LABEL }
    })
    isUpperCase: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    }

    start() {
        LanguageLanguageManager.instance.addListener(() => {
            this.updateLanguage();
        }, this);

    }
    onEnable() {
        this.updateLanguage();
    }
    updateLanguage() {
        if (this.TYPE == TYPE_OBJECT.LABEL) {
            this.updateText();
        } else if (this.TYPE == TYPE_OBJECT.SPRITE) {
            this.updateSprite();
        } else if (this.TYPE == TYPE_OBJECT.SKELETON) {
            this.updateSkeleton();
        }
    }
    private updateText() {
        let str = LanguageLanguageManager.instance.getString(this.id);
        if (str != null && str.trim().length == 0) {
            return;
        }
        if (this.isUpperCase) {
            str = str.toUpperCase();
        }
        if (this.isAddColon)
            str = str + ":";
        this.getComponent(cc.Label).string = str;
    }
    updateSprite() {
        if (this.sprite == null) {
            this.sprite = this.getComponent(cc.Sprite);
        }
        switch (LanguageLanguageManager.instance.languageCode) {
            case "vi":
                this.sprite.spriteFrame = this.spriteFrames[0];
                break;
            case "en":
                this.sprite.spriteFrame = this.spriteFrames[1];
                break;
        }
    }
    updateSkeleton() {
        switch (LanguageLanguageManager.instance.languageCode) {
            case "vi":
                this.skeletonNode.setAnimation(0, this.animationName[0], true);
                break;
            case "en":
                this.skeletonNode.setAnimation(0, this.animationName[1], true);
                break;
        }
    }

    // update (dt) {}
}
