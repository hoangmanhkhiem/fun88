import App from "./Script/common/App";

const { ccclass, property } = cc._decorator;

namespace lobby {
    @ccclass
    export class MiniGame extends cc.Component {

        @property(cc.Node)
        gamePlay: cc.Node = null;
        @property
        nameGame: string = "";
        onLoad() {
            this.gamePlay.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
                App.instance.showBgMiniGame(this.nameGame);
            }, this);

            this.gamePlay.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
                var pos = this.gamePlay.position;
                pos.x += event.getDeltaX();
                pos.y += event.getDeltaY();
                this.gamePlay.position = pos;
            }, this);
        }

        reOrder() {
            // var zIndex = 0;
            // for (var i = 0; i < this.node.parent.childrenCount; i++) {
            //     let node = this.node.parent.children[i];
            //     if (node != this.node) {
            //         node.zIndex = zIndex++;
            //     }
            // }
            // this.node.zIndex = zIndex++;
            // App.instance.showBgMiniGame(this.nameGame);
            this.node.setSiblingIndex(this.node.parent.childrenCount);
        }

        show() {
            this.reOrder();
            this.node.active = true;
            this.gamePlay.stopAllActions();
            this.gamePlay.scale = 0.8;
            // this.gamePlay.runAction(cc.sequence(
            //     cc.scaleTo(0.3, 1),
            //     cc.callFunc(() => {
            //         this._onShowed();
            //     })
            // ));
            cc.tween(this.gamePlay).to(0.3, { scale: 1.0, opacity: 255 }, { easing: cc.easing.backOut }).call(() => {
                this._onShowed();
            }).start();
        }

        _onShowed() {
            //  //Utils.Log("_onShowed");
        }

        dismiss() {
            this.gamePlay.stopAllActions();
            // this.gamePlay.runAction(cc.sequence(
            //     cc.scaleTo(0.3, 0),
            //     cc.callFunc(() => {
            //         this._onDismissed();
            //     })
            // ));
            cc.tween(this.gamePlay).to(0.3, { scale: 0.8, opacity: 150 }, { easing: cc.easing.backIn }).call(() => {
                this._onDismissed();
            }).start();
        }

        _onDismissed() {
            //  //Utils.Log("_onDismissed");
            this.node.active = false;
        }
    }

}

export default lobby.MiniGame;