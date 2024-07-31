import MauBinhController from "./MauBinh.Controller";
import DragCardController from "./MauBinh.DragCard";
const { ccclass, property } = cc._decorator;

@ccclass
export default class MeCardController extends cc.Component {

    public static instance: MeCardController = null;

    @property(cc.Node)
    imgFocus: cc.Node = null;
    @property(cc.Node)
    imgCard: cc.Node = null;
    @property(cc.Node)
    imgShadow: cc.Node = null;

    card_info = null;
    initPos = null;
    canDrag = null;
    dragging: boolean;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        MeCardController.instance = this;

        this.initPos = this.node.position;
    }

    start() { }

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onBeginDrag, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onDrag, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onEndDrag, this);
    }

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onBeginDrag, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onDrag, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onEndDrag, this);
    }

    activeDrag() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onBeginDrag, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onDrag, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onEndDrag, this);
    }

    offDrag() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onBeginDrag, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onDrag, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onEndDrag, this);
    }

    onBeginDrag(event) {
        //  cc.log("onBeginDrag : ", this.node.name);
        //  cc.log("onBeginDrag initPos : ", this.initPos);
        //  cc.log("onBeginDrag card_info : ", this.card_info);
        MauBinhController.instance.cardSelect(this.card_info, this.node.position, parseInt(this.node.name) - 1);
    }

    onDrag(event) {
        this.dragging = true;
        var delta = event.getDelta();

        var currentPos = this.node.position;
        this.node.x = currentPos.x + delta.x;
        this.node.y = currentPos.y + delta.y;
        DragCardController.instance.updatePos(currentPos.x + delta.x, currentPos.y + delta.y - 95);
    }

    onEndDrag(event) {
        this.dragging = false;
        this.node.position = this.initPos;
        DragCardController.instance.endMove();
    }

    resetState() {
        if (this.initPos) {
            this.node.position = this.initPos;
            this.setCardFocus(false);
            this.setCardShadow(false);
        }
    }

    setupCard(data, src) {
        this.card_info = data;
        //  cc.log("MauBinh MeCard card_info : ", data);
        this.setCardFocus(false);
        this.setCardShadow(false);

        cc.tween(this.node)
            .to(0.1, { scaleX: 0 })
            .call(() => {
                this.imgCard.getComponent(cc.Sprite).spriteFrame = src;
            })
            .to(0.1, { scaleX: 1 })
            .start();
    }

    updateCard(data, src) {
        this.card_info.card = data;
        this.setCardFocus(false);
        this.setCardShadow(false);
        this.setCardSrc(src);
    }

    setCardSrc(src) {
        this.imgCard.getComponent(cc.Sprite).spriteFrame = src;
    }

    setCardShadow(state) {
        this.imgShadow.active = state;
    }

    setCardFocus(state) {
        this.imgFocus.active = state;
    }

    setIsActive(state) {
        this.node.active = state;
    }

    getIsActive() {
        return this.node.active;
    }

    // update (dt) {}
}
