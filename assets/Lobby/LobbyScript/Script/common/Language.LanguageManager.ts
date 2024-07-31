
const { ccclass, property } = cc._decorator;

namespace Language {
    @ccclass
    export class LanguageMananger extends cc.Component {

        static instance: LanguageMananger = null;

        @property(cc.TextAsset)
        json: cc.TextAsset = null;


        languageCode = "vi";
        private texts: Object = {};
        private listeners: Array<any> = [];

        onLoad() {
            LanguageMananger.instance = this;
            this.texts = JSON.parse(this.json.text);
            let langCode = cc.sys.localStorage.getItem("langCode");
            if (langCode != null) {
                this.languageCode = langCode;
            }
        }

        public setLanguage(languageCode: string) {
            this.languageCode = languageCode;
            cc.sys.localStorage.setItem("langCode", languageCode);
            for (var i = 0; i < this.listeners.length; i++) {
                var listener = this.listeners[i];
                if (listener.target && listener.target instanceof Object && listener.target.node) {
                    listener.callback(languageCode);
                } else {
                    this.listeners.splice(i, 1);
                    i--;
                }
            }
        }

        public addListener(callback: (languageCode: string) => void, target: cc.Component) {
            this.listeners.push({
                callback: callback,
                target: target
            });
        }

        public getString(id: string): string {
            if (this.texts.hasOwnProperty(id)) {
                if (this.texts[id].hasOwnProperty(this.languageCode)) {
                    return this.texts[id][this.languageCode];
                }
            }
            return id;
        }
    }

}
export default Language.LanguageMananger;