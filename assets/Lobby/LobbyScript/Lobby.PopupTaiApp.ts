
import Configs from "../../Loading/src/Configs";
import Dialog from "./Script/common/Dialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupTaiApp extends Dialog {

    @property(cc.Sprite)
    qr_android:cc.Sprite = null;
    @property(cc.Sprite)
    qr_ios:cc.Sprite = null;

    @property(cc.SpriteFrame)
    qr_android_lote88:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    qr_ios_lote88:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    qr_android_lot79:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    qr_ios_lot79:cc.SpriteFrame = null;
    start() {
        
    }

    show() {
        super.show();
        
        if(Configs.App.IS_PRO == false){
            this.qr_android.spriteFrame = this.qr_android_lote88;
            this.qr_ios.spriteFrame = this.qr_ios_lote88;
        }
        else{
            this.qr_android.spriteFrame = this.qr_android_lot79;
            this.qr_ios.spriteFrame = this.qr_ios_lot79;
        }
    }

    actTaiApk() {
        cc.sys.openURL("https://sun88.link/");
        // App.instance.alertDialog.showMsg("Tính năng đang phát triển.");
    }

    actTaiIos(){
        cc.sys.openURL("https://sun88.link/");
        // App.instance.alertDialog.showMsg("Tính năng đang phát triển.");
    }
}
