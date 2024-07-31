const { ccclass, property, requireComponent} = cc._decorator;

import LanguageManager from "./Language.LanguageManager";

namespace Language {
    @ccclass
    @requireComponent(cc.Sprite)
    export class Sprite extends cc.Component {

        @property(cc.SpriteFrame)
        sprFrameVi: cc.SpriteFrame = null;
        @property(cc.SpriteFrame)
        sprFrameEn: cc.SpriteFrame = null;

        start() {
            LanguageManager.instance.addListener(() => {
                this.updateSpriteFrame();
            }, this);
            this.updateSpriteFrame();
        }

        private updateSpriteFrame(){
            switch (LanguageManager.instance.languageCode) {
                case "en":
                    this.getComponent(cc.Sprite).spriteFrame = this.sprFrameEn;
                    break;
                default:
                    this.getComponent(cc.Sprite).spriteFrame = this.sprFrameVi;
                    break;
            }
        }
    }

}
export default Language.Sprite;