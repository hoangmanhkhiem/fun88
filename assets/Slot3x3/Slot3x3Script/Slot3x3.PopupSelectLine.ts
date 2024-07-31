import App from "../../Lobby/LobbyScript/Script/common/App";
import Dialog from "../../Lobby/LobbyScript/Script/common/Dialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupSelectLine extends Dialog {
    @property(cc.Node)
    buttonsLine: cc.Node = null;
    @property(cc.Button)
    btnClose: cc.Button = null;

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
    show(){
        super.show();
        App.instance.showBgMiniGame("Slot3x3");
    }
    actSelectAll() {
        for (let i = 0; i < this.buttonsLine.childrenCount; i++) {
            let node = this.buttonsLine.children[i];
            node[this.SELECTED] = true;
            node.opacity = node[this.SELECTED] ? 255 : 80;
        }
        if (this.onSelectedChanged != null) this.onSelectedChanged(this.getSelectedLines());
        this.btnClose.interactable = true;
    }

    actSelectEven() {
        for (let i = 0; i < this.buttonsLine.childrenCount; i++) {
            let node = this.buttonsLine.children[i];
            node[this.SELECTED] = i % 2 != 0;
            node.opacity = node[this.SELECTED] ? 255 : 80;
        }
        if (this.onSelectedChanged != null) this.onSelectedChanged(this.getSelectedLines());
        this.btnClose.interactable = true;
    }

    actSelectOdd() {
        for (let i = 0; i < this.buttonsLine.childrenCount; i++) {
            let node = this.buttonsLine.children[i];
            node[this.SELECTED] = i % 2 == 0;
            node.opacity = node[this.SELECTED] ? 255 : 80;
        }
        if (this.onSelectedChanged != null) this.onSelectedChanged(this.getSelectedLines());
        this.btnClose.interactable = true;
    }

    actDeselectAll() {
        for (let i = 0; i < this.buttonsLine.childrenCount; i++) {
            let node = this.buttonsLine.children[i];
            node[this.SELECTED] = false;
            node.opacity = node[this.SELECTED] ? 255 : 80;
        }
        if (this.onSelectedChanged != null) this.onSelectedChanged(this.getSelectedLines());
        this.btnClose.interactable = false;
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