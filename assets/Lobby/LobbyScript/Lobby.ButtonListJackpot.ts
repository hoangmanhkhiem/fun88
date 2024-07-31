import cmd from "./Lobby.Cmd";
import Tween from "./Script/common/Tween";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ButtonListJackpot extends cc.Component {

    @property(cc.Node)
    button: cc.Node = null;
    @property(cc.Node)
    container: cc.Node = null;

    @property(cc.ToggleContainer)
    togglesBlind: cc.ToggleContainer = null;

    @property(cc.Label)
    labelsRangeRover: cc.Label = null;
    @property(cc.Label)
    labelsMayBach: cc.Label = null;
    @property(cc.Label)
    labelsBentley: cc.Label = null;
    @property(cc.Label)
    labelsRollsRoyce: cc.Label = null;
    @property(cc.Label)
    labelsMiniPoker: cc.Label = null;
    @property(cc.Label)
    labelsSlot3x3: cc.Label = null;

    private buttonClicked = true;
    private buttonMoved = cc.Vec2.ZERO;
    private animate = false;

    private static lastRes: cmd.ResUpdateJackpots = null;
    private selectedIdx = 0;

    onLoad() {
        this.container.active = false;

        this.button.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.buttonClicked = true;
            this.buttonMoved = cc.Vec2.ZERO;
        }, this);

        this.button.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            this.buttonMoved = this.buttonMoved.add(event.getDelta());
            if (this.buttonClicked) {
                if (Math.abs(this.buttonMoved.x) > 30 || Math.abs(this.buttonMoved.y) > 30) {
                    let pos = this.node.position;
                    pos.x += this.buttonMoved.x;
                    pos.y += this.buttonMoved.y;
                    this.node.position = pos;
                    this.buttonClicked = false;
                }
            } else {
                let pos = this.node.position;
                pos.x += event.getDeltaX();
                pos.y += event.getDeltaY();
                this.node.position = pos;
            }
        }, this);

        this.button.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            if (this.buttonClicked) {
                this.toggleShowPanel();
            }
        }, this);

        for (let i = 0; i < this.togglesBlind.toggleItems.length; i++) {
            this.togglesBlind.toggleItems[i].node.on("toggle", () => {
                this.selectedIdx = i;
                this.updateJackpot(0.3);
            });
        }
    }

    private toggleShowPanel() {
        if (this.animate) return;
        this.animate = true;
        if (!this.container.active) {
            this.container.stopAllActions();
            this.container.active = true;
            this.container.scaleY = 0;
            this.container.runAction(cc.sequence(
                cc.scaleTo(0.2, 1).easing(cc.easeBackOut()),
                cc.callFunc(() => {
                    this.animate = false;
                })
            ));
        } else {
            this.container.stopAllActions();
            this.container.runAction(cc.sequence(
                cc.scaleTo(0.2, 1, 0).easing(cc.easeBackIn()),
                cc.callFunc(() => {
                    this.container.active = false;
                    this.animate = false;
                })
            ));
        }
    }

    setData(res: cmd.ResUpdateJackpots) {
        ButtonListJackpot.lastRes = res;
        this.updateJackpot();
    }

    updateJackpot(duration: number = 4) {
        if (ButtonListJackpot.lastRes == null) return;
        switch (this.selectedIdx) {
            case 0:
                Tween.numberTo(this.labelsRangeRover, ButtonListJackpot.lastRes.khoBau100, duration);
                Tween.numberTo(this.labelsMayBach, ButtonListJackpot.lastRes.NDV100, duration);
                Tween.numberTo(this.labelsBentley, ButtonListJackpot.lastRes.Avengers100, duration);
                Tween.numberTo(this.labelsRollsRoyce, ButtonListJackpot.lastRes.Vqv100, duration);
                Tween.numberTo(this.labelsMiniPoker, ButtonListJackpot.lastRes.miniPoker100, duration);
                Tween.numberTo(this.labelsSlot3x3, ButtonListJackpot.lastRes.pokeGo100, duration);
                break;
            case 1:
                Tween.numberTo(this.labelsRangeRover, ButtonListJackpot.lastRes.khoBau1000, duration);
                Tween.numberTo(this.labelsMayBach, ButtonListJackpot.lastRes.NDV1000, duration);
                Tween.numberTo(this.labelsBentley, ButtonListJackpot.lastRes.Avengers1000, duration);
                Tween.numberTo(this.labelsRollsRoyce, ButtonListJackpot.lastRes.Vqv1000, duration);
                Tween.numberTo(this.labelsMiniPoker, ButtonListJackpot.lastRes.miniPoker1000, duration);
                Tween.numberTo(this.labelsSlot3x3, ButtonListJackpot.lastRes.pokeGo1000, duration);
                break;
            case 2:
                Tween.numberTo(this.labelsRangeRover, ButtonListJackpot.lastRes.khoBau10000, duration);
                Tween.numberTo(this.labelsMayBach, ButtonListJackpot.lastRes.NDV10000, duration);
                Tween.numberTo(this.labelsBentley, ButtonListJackpot.lastRes.Avengers10000, duration);
                Tween.numberTo(this.labelsRollsRoyce, ButtonListJackpot.lastRes.Vqv10000, duration);
                Tween.numberTo(this.labelsMiniPoker, ButtonListJackpot.lastRes.miniPoker10000, duration);
                Tween.numberTo(this.labelsSlot3x3, ButtonListJackpot.lastRes.pokeGo10000, duration);
                break;
        }
    }
}