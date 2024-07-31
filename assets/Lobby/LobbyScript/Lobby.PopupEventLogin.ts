import Configs from "../../Loading/src/Configs";
import App from "./Script/common/App";
import Dialog from "./Script/common/Dialog";


const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupEventLogin extends Dialog {
    @property(cc.Node)
    itemTemplate: cc.Node = null;

    show() {
        super.show();
        // for (let i = 0; i < this.itemTemplate.parent.childrenCount; i++) {
        //     this.itemTemplate.parent.children[i].active = false;
        // }
    }

    dismiss() {
        super.dismiss();
        // for (let i = 0; i < this.itemTemplate.parent.childrenCount; i++) {
        //     this.itemTemplate.parent.children[i].active = false;
        // }
    }

    _onShowed() {
        super._onShowed();
       // this.loadData();
    }

    private getItem(): cc.Node {
        let item = null;
        for (let i = 0; i < this.itemTemplate.parent.childrenCount; i++) {
            let node = this.itemTemplate.parent.children[i];
            if (node != this.itemTemplate && !node.active) {
                item = node;
                break;
            }
        }
        if (item == null) {
            item = cc.instantiate(this.itemTemplate);
            item.parent = this.itemTemplate.parent;
        }
        item.active = true;
        return item;
    }

    // sau sẽ load sựu kiện từ s
    private loadData() {
        // App.instance.showLoading(true);
        // Http.get(Configs.App.API, { "c": 401 }, (err, res) => {
        //     App.instance.showLoading(false);
        //     if (err != null) return;
        //     if (res["success"]) {
        //         for (let i = 0; i < res["transactions"].length; i++) {
        //             let itemData = res["transactions"][i];
        //             let nickname = itemData["nickName"];
        //             let item = this.getItem();
        //             item.getChildByName("bg").opacity = i % 2 == 0 ? 10 : 0;
        //             item.getChildByName("No.").getComponent(cc.Label).string = (i + 1).toString();
        //             item.getChildByName("Fullname").getComponent(cc.Label).string = itemData["fullName"];
        //             item.getChildByName("Nickname").getComponent(cc.Label).string = nickname;
        //             item.getChildByName("Phone").getComponent(cc.Label).string = itemData["mobile"];
        //             item.getChildByName("Phone").color = cc.Color.WHITE;
        //             item.getChildByName("Phone").off("click");
        //             if (itemData["mobile"] && itemData["mobile"].trim().length > 0 && itemData["mobile"].trim()[0] != "0") {
        //                 item.getChildByName("Phone").color = cc.Color.CYAN;
        //                 item.getChildByName("Phone").on("click", () => {
        //                     App.instance.openTelegram(itemData["mobile"]);
        //                 });
        //             }
        //             item.getChildByName("Address").getComponent(cc.Label).string = itemData["address"];
        //             item.getChildByName("BtnFacebook").off("click");
        //             item.getChildByName("BtnFacebook").on("click", () => {
        //                 cc.sys.openURL(itemData["facebook"]);
        //             });
        //             item.getChildByName("BtnTransfer").off("click");
        //             item.getChildByName("BtnTransfer").on("click", () => {
        //                 //App.instance.ShowAlertDialog("Tính năng đang tạm khóa");
        //                 App.instance.popupShop.showAndOpenTransfer(nickname);
        //             });
        //         }
        //     }
        // });
    }

    public actOpen() {
        App.instance.openTelegram(Configs.App.getLinkTelegram());
    }
}
