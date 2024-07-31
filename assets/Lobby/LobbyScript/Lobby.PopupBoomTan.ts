
import Http from "../../Loading/src/Http";
import Configs from "../../Loading/src/Configs";
import App from "./Script/common/App";
import Dialog from "./Script/common/Dialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupBoomTan extends Dialog {

    @property(cc.Node)
    itemTemplate: cc.Node = null;
    @property([cc.SpriteFrame])
    sfRanks: cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame])
    sfGifts: cc.SpriteFrame[] = [];

    show() {
        super.show();
        for (let i = 0; i < this.itemTemplate.parent.childrenCount; i++) {
            this.itemTemplate.parent.children[i].active = false;
        }
    }

    dismiss() {
        super.dismiss();
        for (let i = 0; i < this.itemTemplate.parent.childrenCount; i++) {
            this.itemTemplate.parent.children[i].active = false;
        }
    }

    _onShowed() {
        super._onShowed();
        this.loadData();
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

    private loadData() {
        App.instance.showLoading(true);
        let url = Configs.App.DOMAIN + "boom_tan.json";
        Http.get(url, null, (err, res) => {
            App.instance.showLoading(false);
            if (err != null) return;
            for (let i = 0; i < res.length; i++) {
                let itemData = res[i];
                let item = this.getItem();
                let sfGift = this.getGiftSpriteFrame(itemData["gift"]);
                if (sfGift != null) {
                    item.getChildByName("SprGift").active = true;
                    item.getChildByName("SprGift").getComponent(cc.Sprite).spriteFrame = sfGift;
                    item.getChildByName("Gift").active = false;
                } else {
                    item.getChildByName("Gift").active = true;
                    item.getChildByName("Gift").getComponent(cc.Label).string = itemData["gift"];
                    item.getChildByName("SprGift").active = false;
                }
                if (i < this.sfRanks.length) {
                    item.getChildByName("SprRank").active = true;
                    item.getChildByName("SprRank").getComponent(cc.Sprite).spriteFrame = this.sfRanks[i];
                    item.getChildByName("Rank").active = false;
                } else {
                    item.getChildByName("Rank").active = true;
                    item.getChildByName("Rank").getComponent(cc.Label).string = itemData["rank"];
                    item.getChildByName("SprRank").active = false;
                }
                let lblNickname: cc.Label = item.getChildByName("Nickname").getComponent(cc.Label);
                let lblScore: cc.Label = item.getChildByName("Score").getComponent(cc.Label);
                lblNickname.string = itemData["nickname"];
                lblScore.string = itemData["score"];
                if (i == 0) {
                    lblNickname.node.color = cc.Color.BLACK.fromHEX("#ff7e00");
                    lblScore.node.color = cc.Color.BLACK.fromHEX("#ff7e00");
                } else if (i == 1) {
                    lblNickname.node.color = cc.Color.BLACK.fromHEX("#004eff");
                    lblScore.node.color = cc.Color.BLACK.fromHEX("#004eff");
                } else if (i == 2) {
                    lblNickname.node.color = cc.Color.BLACK.fromHEX("#06ff00");
                    lblScore.node.color = cc.Color.BLACK.fromHEX("#06ff00");
                } else {
                    lblNickname.node.color = cc.Color.BLACK.fromHEX("#feca85");
                    lblScore.node.color = cc.Color.BLACK.fromHEX("#feca85");
                }
                item.getChildByName("Divider").active = i < res.length - 1;
            }
        });
    }

    public actTheLe() {
        let url = Configs.App.DOMAIN + "the_le_boom_tan.html";
        cc.sys.openURL(url);
    }

    private getGiftSpriteFrame(name: string): cc.SpriteFrame {
        for (let i = 0; i < this.sfGifts.length; i++) {
            if (this.sfGifts[i].name == name) return this.sfGifts[i];
        }
        return null;
    }
}
