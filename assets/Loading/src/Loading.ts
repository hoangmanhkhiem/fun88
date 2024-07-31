
import Http from "../../Loading/src/Http";
import BundleControl from "./BundleControl";
import Configs from "./Configs";
import { Global } from "./Global";
import UtilsNative from "./UtilsNative";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends cc.Component {


    @property(cc.Label)
    lblStatus: cc.Label = null;
    @property(cc.Label)
    lbTips: cc.Label = null;
    @property(cc.Slider)
    nodeSlider: cc.Slider = null;

    // @property(cc.Slider)
    // slider :cc.Slider = null;

    @property(cc.Sprite)
    spriteProgress: cc.Sprite = null;
    listSkeData = []
    listTips = [
        {
            vi: "Đừng quên đăng nhập hàng ngày để nhận thưởng Điểm Danh bạn nhé!",
            en: "Dont forget login every day to get free attendance bonus!"
        },
        {
            vi: "Tiến Lên Miền Nam: Chống gian lận,an toàn tuyệt đối",
            en: "Killer 13: Anti cheating,absolute safety"
        },
        {
            vi: "Nạp đầu nhận thưởng lên tới 790K",
            en: "First cash-in can receive bonus up to 790K"
        },
        {
            vi: "Bộ phận chăm sóc khách hàng luôn online 24/24 bạn nhé!",
            en: "Customer care team support online 24/24!"
        },
        {
            vi: "Go88 nạp rút nhanh chóng và an toàn!",
            en: "Go88 quick cashin,cashout and alway safety!"
        },
    ]
    start() {
        cc.assetManager.downloader.maxConcurrency = 20;
		cc.assetManager.downloader.maxRequestsPerFrame = 6;
        this.showTips();
    }
    startGame() {
        this.lblStatus.string = "Tải tài nguyên từ máy chủ..."; 
        this.spriteProgress.fillRange = 0;
        this.nodeSlider.progress = 0;

        if (Configs.App.IS_LOCAL == false) {
            Http.get("https://sun102.fun/assets/AssetBundleVersion.json", {}, (err, data) => {
                BundleControl.init(data);
              this.loadLobby();  
            });
			
        }
        else {
            this.loadLobby();
        }
        UtilsNative.getDeviceId();
    }
    loadScriptCore() {
        BundleControl.loadBundle("ScriptCore", (bundle) => {
            this.loadLobby();
        });
    }

    loadLobby() {
        var self = this;
        let time = new Date().getTime();
        BundleControl.loadBundle("Lobby", (bundle) => {
            Global.BundleLobby = bundle;
            let size = this.listSkeData.length;
            for (let i = 0; i < size; i++) {
                let path = this.listSkeData[i];
                bundle.load(path, sp.SkeletonData, (err, asset) => {
                    if (err) {
                        //  cc.log("err load ske:", err);
                        return;
                    }
                    // cc.log("load Success Ske Data:" + path);
                });
            }
            bundle.loadScene('Lobby', function (finish, total, item) {
                self.lblStatus.string = "Loading: " + parseInt((finish / total) * 100) + "%";
                self.spriteProgress.fillRange = (finish / total);
                self.nodeSlider.progress = self.spriteProgress.fillRange;
            }, (err1, scene) => {
                if (err1 != null) {
                    //  cc.log("Error Load Scene Lobby:", JSON.stringify(err1));
                }
                cc.sys.localStorage.setItem("SceneLobby", scene);
                cc.director.runScene(scene);
                let time2 = new Date().getTime();
                //  cc.log("Time Delta=" + ((time2 - time) / 1000));
            });
            bundle.loadDir("PrefabPopup", cc.Prefab, (err, arrPrefab) => {
                if (err) {
                    //  cc.log("Error Bundle LoadDir PrefabPopup!");
                    return;
                }
            });
        })

    }
    showTips() {
        this.schedule(() => {
            this.lbTips.string = this.getStrTips();
        }, 3.0, cc.macro.REPEAT_FOREVER, 0.1)
    }
    getStrTips() {
        let langCode = cc.sys.localStorage.getItem("langCode");
        if (langCode == null) {
            langCode = "vi"
        }
        let strTip = this.listTips[this.randomRangeInt(0, this.listTips.length)];
        return strTip[langCode];
    }
    randomRangeInt(min: number, max: number): number {
        //Returns a random number between min (inclusive) and max (inclusive)
        //Math.floor(Math.random() * (max - min + 1)) + min;

        //Returns a random number between min (inclusive) and max (exclusive)
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // update (dt) {}
}
