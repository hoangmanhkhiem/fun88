import BundleControl from "../../Loading/src/BundleControl";
import Dialog from "../../Lobby/LobbyScript/Script/common/Dialog";

const { ccclass, property } = cc._decorator;

@ccclass
export class PopupSelectLine extends Dialog {
    @property(cc.Node)
    buttonsLine: cc.Node = null;
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(cc.SpriteAtlas)
    atlasPopup: cc.SpriteAtlas = null;
    @property([cc.Button])
    listBtn: cc.Button[] = [];

    onSelectedChanged: (lines: Array<number>) => void = null;
    private readonly SELECTED = "selected";

    start() {
        for (let i = 0; i < this.buttonsLine.childrenCount; i++) {
            let node = this.buttonsLine.children[i];
            node[this.SELECTED] = true;
            node.on("click", () => {
                node[this.SELECTED] = !node[this.SELECTED];
                node.opacity = node[this.SELECTED] ? 255 : 80;
                if (this.onSelectedChanged != null) this.onSelectedChanged(this.getSelectedLines());
                this.btnClose.interactable = this.getSelectedLines().length > 0;
            });
        }
    }
    onClickOptionLine(even, data) {

    }
    resetSpriteButton() {
        let listSpriteName = ["btn_bochon", "btn_chonchan", "btn_chonle", "btn_tatca"];
        for (let i = 0; i < this.listBtn.length; i++) {
            //  cc.log("name sprite==")
            this.listBtn[i].node.getComponent(cc.Sprite).spriteFrame = this.atlasPopup.getSpriteFrame(listSpriteName[i]);
        }
    }
    actSelectAll(even) {
        this.resetSpriteButton();
        for (let i = 0; i < this.buttonsLine.childrenCount; i++) {
            let node = this.buttonsLine.children[i];
            node[this.SELECTED] = true;
            node.opacity = node[this.SELECTED] ? 255 : 80;
        }
        if (this.onSelectedChanged != null) this.onSelectedChanged(this.getSelectedLines());
        this.btnClose.interactable = true;
        even.target.getComponent(cc.Sprite).spriteFrame = this.atlasPopup.getSpriteFrame("btn_tatca_on");
    }

    actSelectEven(even) {
        this.resetSpriteButton();
        for (let i = 0; i < this.buttonsLine.childrenCount; i++) {
            let node = this.buttonsLine.children[i];
            node[this.SELECTED] = i % 2 != 0;
            node.opacity = node[this.SELECTED] ? 255 : 80;
        }
        if (this.onSelectedChanged != null) this.onSelectedChanged(this.getSelectedLines());
        this.btnClose.interactable = true;
        even.target.getComponent(cc.Sprite).spriteFrame = this.atlasPopup.getSpriteFrame("btn_chonchan_on");
    }

    actSelectOdd(even) {
        this.resetSpriteButton();
        for (let i = 0; i < this.buttonsLine.childrenCount; i++) {
            let node = this.buttonsLine.children[i];
            node[this.SELECTED] = i % 2 == 0;
            node.opacity = node[this.SELECTED] ? 255 : 80;
        }
        if (this.onSelectedChanged != null) this.onSelectedChanged(this.getSelectedLines());
        this.btnClose.interactable = true;
        even.target.getComponent(cc.Sprite).spriteFrame = this.atlasPopup.getSpriteFrame("btn_chonle_on");
    }

    actDeselectAll(even) {
        this.resetSpriteButton();
        for (let i = 0; i < this.buttonsLine.childrenCount; i++) {
            let node = this.buttonsLine.children[i];
            node[this.SELECTED] = false;
            node.opacity = node[this.SELECTED] ? 255 : 80;
        }
        if (this.onSelectedChanged != null) this.onSelectedChanged(this.getSelectedLines());
        this.btnClose.interactable = false;
        even.target.getComponent(cc.Sprite).spriteFrame = this.atlasPopup.getSpriteFrame("btn_bochon_on");
    }

    private getSelectedLines() {
        let lines = new Array<number>();
        for (let i = 0; i < this.buttonsLine.childrenCount; i++) {
            let node = this.buttonsLine.children[i];
            if (typeof node[this.SELECTED] == "undefined" || node[this.SELECTED]) {
                lines.push(i + 1);
            }
        }
        return lines;
    }

    dismiss() {
        if (this.getSelectedLines().length > 0) {
            super.dismiss();
        }
    }
}
export default PopupSelectLine;