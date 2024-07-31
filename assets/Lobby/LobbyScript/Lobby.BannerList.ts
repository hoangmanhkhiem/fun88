// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Configs from "../../Loading/src/Configs";
import { Global } from "../../Loading/src/Global";
import Http from "../../Loading/src/Http";
import App from "./Script/common/App";
import Utils from "./Script/common/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BannerList extends cc.Component {

    @property(cc.PageView)
    pageView: cc.PageView = null;

    @property(cc.Node)
    itemPage: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:
    private intervalBanner = null;
    private dataPage = null;
    private indexPage = 0;
    onLoad() {

    }

    start() {
        this.getBanner();
    }
    getBanner() {
        var data = {};
        data["c"] = 2020;
        Http.get(Configs.App.API, data, (err, res) => {
            if (res.success) {
                this.loadListBanner(res.data);
            }
            else {
                App.instance.alertDialog.showMsg(res.message);
            }
        });
    }
    loadListBanner(data) {
        var self = this;
        let dataBanner = [];
        data.forEach(element => {
            if (element.status == 1) {
                dataBanner.push(element);
            }
        });
        if (dataBanner.length != 0) {
            this.dataPage = dataBanner;
            for (let i = 0; i < dataBanner.length; i++) {
                let item = this.pageView.content.children[i];
                if (!item) {
                    item = cc.instantiate(this.itemPage);
                    this.pageView.addPage(item);
                }
                let url = dataBanner[i].image_path;
                Utils.loadImgFromUrl(item.getComponent(cc.Sprite), url);
            }
            this.intervalBanner = setInterval(function () {
                self.pageView.scrollToPage(self.indexPage, 0.5);
                self.indexPage++;
                if (self.indexPage >= self.dataPage.length) {
                    self.indexPage = 0;
                }
            }, 2000);
            Global.LobbyController.updateSizeListGame(true);
        } else {
            Global.LobbyController.updateSizeListGame(false);
        }

    }



    onDestroy() {
        if (this.intervalBanner != null) {
            clearInterval(this.intervalBanner);
            this.intervalBanner = null;
        }
    }
    // update (dt) {}
}
