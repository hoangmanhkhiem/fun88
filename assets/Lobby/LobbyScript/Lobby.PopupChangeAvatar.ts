import Configs from "../../Loading/src/Configs";
import Http from "../../Loading/src/Http";
import App from "./Script/common/App";
import BroadcastReceiver from "./Script/common/BroadcastReceiver";
import Dialog from "./Script/common/Dialog";
import Utils from "./Script/common/Utils";


const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupChangeAvatar extends Dialog {
    @property(cc.Node)
    items: cc.Node = null;
    @property(cc.Node)
    itemTemplate: cc.Node = null;

    private selectedIdx = -1;

    start() {
        for (let i = 0; i < App.instance.sprFrameAvatars.length; i++) {
            let item = cc.instantiate(this.itemTemplate);
            item.parent = this.items;
            item.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = App.instance.sprFrameAvatars[i];
            item.name = App.instance.sprFrameAvatars[i].name;

            item.on("click", () => {
                this.selectedIdx = i;
                this.actSubmit();
            });
            this.selectedIdx = i;
        }
        // this.itemTemplate.removeFromParent();
        // this.itemTemplate = null;
    }

    show() {
         ////Utils.Log("vao day ha aaaa:" + this.name);
        super.show();
        this.selectedIdx = -1;
        if (this.itemTemplate == null) {
            for (let i = 0; i < this.items.childrenCount; i++) {
                let item = this.items.children[i];
                if (item.name == Configs.Login.Avatar) {
                    this.selectedIdx = i;
                    item.getChildByName("selected").active = true;
                } else {
                    item.getChildByName("selected").active = false;
                }
            }
        }
    }

    actSubmit() {
        Http.get(Configs.App.API, { "c": 125, "nn": Configs.Login.Nickname, "avatar": App.instance.sprFrameAvatars[this.selectedIdx].name }, (err, res) => {
            if (err != null) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_error'));
                return;
            }
            if (!res["success"]) {
                switch (res["errorCode"]) {
                    default:
                        App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_unknown_error") + "\n" + res["errorCode"]);
                        break;
                }
                return;
            }
            this.dismiss();
            Configs.Login.Avatar = App.instance.sprFrameAvatars[this.selectedIdx].name;
            BroadcastReceiver.send(BroadcastReceiver.USER_INFO_UPDATED);
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_action_success'));
        });
    }
}
