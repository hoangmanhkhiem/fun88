const { ccclass, property } = cc._decorator;

@ccclass
export default class Dialog extends cc.Component {
    isAnimated: boolean = true;

    bg: cc.Node = null;
    container: cc.Node = null;
    showScale = 1.1;
    startScale = 0.7;

    show(): void {
        var _this = this;
        if(!this.bg) this.bg = this.node.getChildByName("Bg");
        if(!this.container) this.container = this.node.getChildByName("Container");
        this.node.active = true;
        this.isAnimated = false;

        this.bg.stopAllActions();
        this.bg.opacity = 0;
        this.bg.runAction(cc.fadeTo(0.2, 128));

        this.container.stopAllActions();
        this.container.opacity = 0;
        this.container.scale = this.startScale;
        this.container.runAction(cc.sequence(
            cc.spawn(cc.scaleTo(0.2, this.showScale), cc.fadeIn(0.2)),
            cc.scaleTo(0.1, 1),
            cc.callFunc(_this._onShowed.bind(this))
        ));
    }

    dismiss() {
        if(!this.bg) this.bg = this.node.getChildByName("Bg");
        if(!this.container) this.container = this.node.getChildByName("Container");
        var _this = this;
        this.isAnimated = false;
        
        this.bg.stopAllActions();
        this.bg.opacity = 128;
        this.bg.runAction(cc.fadeOut(0.2));

        this.container.stopAllActions();
        this.container.opacity = 255;
        this.container.scale = 1;
        this.container.runAction(cc.sequence(
            cc.scaleTo(0.1, this.showScale),
            cc.spawn(cc.scaleTo(0.2, this.startScale), cc.fadeOut(0.2)),
            cc.callFunc(_this._onDismissed.bind(this))
        ));
    }

    _onShowed() {
        this.isAnimated = true;
    }

    _onDismissed() {
        this.node.active = false;
        this.isAnimated = true;
    }
}
