import App from "./Script/common/App";
import Dialog from "./Script/common/Dialog";
import LanguageLanguageManager from "./Script/common/Language.LanguageManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends Dialog {

    @property(cc.Node)
    dropDownBox: cc.Node = null;

    @property(cc.Label)
    lbCurrentLang: cc.Label = null;
    languageCode = ""
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (LanguageLanguageManager.instance.languageCode == "vn") {
            this.lbCurrentLang.string = "Tiếng Việt";
        } else if (LanguageLanguageManager.instance.languageCode == "en") {
            this.lbCurrentLang.string = "English";
        }
    }

    start() {

    }
    showDropDown(status) {
        if (status) {
            this.dropDownBox.scaleY = 0;
            this.dropDownBox.active = true;
            cc.Tween.stopAllByTarget(this.dropDownBox);
            cc.tween(this.dropDownBox).to(0.1, { scaleY: 1 }).start();
        } else {
            cc.tween(this.dropDownBox).to(0.1, { scaleY: 0 }).call(() => {
                this.dropDownBox.active = false;
            }).start();
        }
    }
    onClickChangeLanguage(even, data) {
        this.languageCode = LanguageLanguageManager.instance.languageCode;
        switch (data) {
            case "1":
                this.showDropDown(!this.dropDownBox.active);
                break;
            case "2"://vn
                this.lbCurrentLang.string = "Tiếng Việt";
                if (this.languageCode != "vi") {
                    LanguageLanguageManager.instance.setLanguage("vi");
                    let msg = LanguageLanguageManager.instance.getString("txt_notify_change_language");
                    App.instance.ShowAlertDialog(msg);
                }
                this.showDropDown(false);
                break;
            case "3"://en
                this.lbCurrentLang.string = "English";
                if (this.languageCode != "en") {
                    LanguageLanguageManager.instance.setLanguage("en");
                    let msg = LanguageLanguageManager.instance.getString("txt_notify_change_language");
                    App.instance.ShowAlertDialog(msg);
                }
                this.showDropDown(false);
                break;
        }
    }

    // update (dt) {}
}
