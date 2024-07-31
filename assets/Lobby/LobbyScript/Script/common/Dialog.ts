import App from "./App";

const { ccclass, property } = cc._decorator;
var TW = cc.tween
@ccclass
export default class Dialog extends cc.Component {
    isAnimated: boolean = true;
    @property(cc.Node)
    bg: cc.Node = null;
    @property(cc.Node)
    container: cc.Node = null;
    showScale = 1.0;
    startScale = 0.7;

    show(): void {
        // this.node.parent = App.instance.canvas;
        var _this = this;
        this.node.setSiblingIndex(this.node.parent.childrenCount);
        if (!this.bg) this.bg = this.node.getChildByName("Bg");
        if (!this.container) this.container = this.node.getChildByName("Container");
        this.node.active = true;
        this.isAnimated = false;

        this.bg.stopAllActions();
        this.bg.opacity = 0;
        this.bg.runAction(cc.fadeTo(0.2, 128));
        this.bg.setContentSize(cc.winSize);

        // this.container.stopAllActions();
        // this.container.opacity = 0;
        // this.container.scale = this.startScale;
        // this.container.runAction(cc.sequence(
        //     cc.spawn(cc.scaleTo(0.2, this.showScale), cc.fadeIn(0.2)),
        //     cc.scaleTo(0.1, 1),
        //     cc.callFunc(_this._onShowed.bind(this))
        // ));
        cc.Tween.stopAllByTarget(this.container);
        TW(this.container)
            .set({ opacity: 0, scale: this.startScale })
            .to(0.3, { opacity: 255, scale: 1.0 }, { easing: cc.easing.backOut })
            .call(() => {
                this._onShowed();
            })
            .start();
        this.node.zIndex = cc.macro.MAX_ZINDEX - 10;
    }

    dismiss() {
        if (!this.bg) this.bg = this.node.getChildByName("Bg");
        if (!this.container) this.container = this.node.getChildByName("Container");
        this.isAnimated = false;

        this.bg.stopAllActions();
        this.bg.opacity = 128;
        this.bg.runAction(cc.fadeOut(0.2));

        this.container.stopAllActions();
        this.container.opacity = 255;
        this.container.scale = 1;
        TW(this.container).to(0.3, { scale: 0.8, opacity: 150 }, { easing: cc.easing.backIn })
            .call(() => {
                this._onDismissed();
            })
            .start();
    }

    _onShowed() {
        this.isAnimated = true;
        var edits = this.node.getComponentsInChildren(cc.EditBox);
        for (var i = 0; i < edits.length; i++) {
            edits[i].tabIndex = 0;
        }
    }

    _onDismissed() {
        var edits = this.node.getComponentsInChildren(cc.EditBox);

        for (var i = 0; i < edits.length; i++) {
            edits[i].tabIndex = -1;
        }
        this.node.active = false;
        this.isAnimated = true;
    }
}
