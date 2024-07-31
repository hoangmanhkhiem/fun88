import Configs from "../../Loading/src/Configs";
import { Global } from "../../Loading/src/Global";
import Http from "../../Loading/src/Http";
import App from "./Script/common/App";
import BroadcastReceiver from "./Script/common/BroadcastReceiver";
import Dialog from "./Script/common/Dialog";
import Utils from "./Script/common/Utils";


const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupEvent extends Dialog {

    // LIFE-CYCLE CALLBACKS:
    @property(sp.Skeleton)
    animLixi: sp.Skeleton = null
    dataEvent: any = null;
    @property([cc.Node])
    listItem: cc.Node[] = [];
    @property(cc.Node)
    nodeResult: cc.Node = null
    @property(cc.Node)
    nodeRule: cc.Node = null
    @property(cc.Node)
    nodeItemContainer: cc.Node = null
    @property(cc.Label)
    lbMoney: cc.Label = null
    @property(sp.Skeleton)
    animResult: sp.Skeleton = null

    type: number = 0;

    start() {
        this.node.zIndex = cc.macro.MAX_ZINDEX;
        this.bg.on(cc.Node.EventType.TOUCH_END, () => {
            this.onClick();
        })
    }
    showpPopup() {
        //  cc.log('type=' + this.type)
        super.show();
        this.animLixi.node.active = false;
        this.animLixi.node.opacity = 255;
        this.nodeResult.active = false;
        this.container.active = false;
        this.nodeRule.active = false;
        if (this.type == 0) {
            this.container.active = true;
            this.nodeItemContainer.active = false;
            this.nodeRule.active = true;
        } else {
            this.container.active = false;
            this.animLixi.node.active = true;
        }
    }
    onClick() {
        App.instance.showLoading(true);
        cc.tween(this.animLixi.node).to(2.0, { opacity: 0 }).call(() => {
            this.animLixi.node.active = false;
        }).start();
        this.bg.off(cc.Node.EventType.TOUCH_END);
        //http://43.128.27.35:8081/api?c=2036&nn=BigBird&at=9350306a24c780af46509750ba4b50ab&ac=get
        Http.get(Configs.App.API, { "c": 2036, "nn": Configs.Login.Nickname, "at": Configs.Login.AccessToken, "ac": "receive" }, (err, res) => {
            App.instance.showLoading(false);
            if (err) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_unknown_error1"));
                this.dismiss();
                return;
            } else {
                if (res.success) {
                    this.container.active = true;
                    this.nodeItemContainer.active = true;
                    this.nodeRule.active = false;
                    this.setInfo(res);
                } else {
                    this.animLixi.node.active = false;
                    App.instance.ShowAlertDialog(res['message']);
                    this.dismiss();
                }
            }
        });
    }
    setInfo(data) {
        let indexItem = Utils.randomRangeInt(0, 3);
        let itemReceive = this.listItem[indexItem];
        for (let i = 0; i < 3; i++) {
            let item = this.listItem[i];
            if (item != itemReceive) {
                item.getChildByName("bgTien").active = false;
                item.getChildByName("icon").color = cc.Color.GRAY;
                item.getChildByName("btn_received").active = false;
                item.color = cc.Color.GRAY;
            }
        }
        itemReceive.getChildByName("bgTien").getComponentInChildren(cc.Label).string = Utils.formatNumber(data['data']);
        itemReceive.getChildByName("bgTien").active = false
        itemReceive.getChildByName("btn_received").on('click', () => {
            this.lbMoney.string = Utils.formatNumber(data['data']);
            Configs.Login.Coin += data['data'];
            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
            this.nodeResult.active = true;
            this.animResult.setAnimation(0, "start", false);
            this.animResult.setCompleteListener(() => {
                this.animResult.setAnimation(0, "idle", true);
            })
            this.container.active = false;
            this.scheduleOnce(() => {
                this.dismiss();
            }, 3.0);
        })
    }


    // update (dt) {}
}
