import Utils from "../common/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PageView extends cc.Component {

    @property
    autoInit: boolean = true;
    @property
    infinity: boolean = true;
    @property
    cancelInnerEvents: boolean = true;
    @property
    spacing: number = 30;
    @property
    moveOffset: number = 30;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Node)
    items: cc.Node = null;
    @property(cc.Node)
    pages: cc.Node = null;
    @property(cc.Node)
    indicator: cc.Node = null;

    private index = 0;
    private pageCount = 0;
    private left: cc.Node = null;
    private center: cc.Node = null;
    private right: cc.Node = null;
    private pageItems: cc.Node[] = [];
    private touchMoved = false;
    public onTouchStart: () => void = null;
    public onTouchMove: () => void = null;
    public onTouchEndOrCancel: () => void = null;
    public onPageChanged: () => void = null;

    onLoad() {
        cc.PageView
        this.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.touchMoved = false;
            if (this.onTouchStart != null) this.onTouchStart();
        }, this.node, true);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            if (!this.cancelInnerEvents) {
                return;
            }

            if (this.touchMoved) {
                let p = this.items.position;
                p.x += event.getDeltaX();

                let offset = this.content.width + this.spacing;
                if (!this.infinity) {
                    if (this.items.position.x > 0 && this.index == 0) {
                        offset = this.moveOffset;
                    } else if (this.items.position.x < 0 && this.index == this.pageCount - 1) {
                        offset = this.moveOffset;
                    }
                }

                if (Math.abs(p.x) > offset) {
                    p.x = p.x > 0 ? offset : -offset;
                }
                this.items.position = p;

                if (this.onTouchMove != null) this.onTouchMove();
            }

            var deltaMove = event.touch.getLocation().sub(event.touch.getStartLocation()); //FIXME: touch move delta should be calculated by DPI.
            if (deltaMove.mag() > 7) {
                if (!this.touchMoved && event.target != this.node) {
                     //Utils.Log(event.target);
                    // Simulate touch cancel for target node
                    var cancelEvent = new cc.Event.EventTouch(event.getTouches(), event.bubbles);
                    cancelEvent.type = cc.Node.EventType.TOUCH_CANCEL;
                    cancelEvent.touch = event.touch;
                    // cancelEvent.simulate = true;
                    event.target.dispatchEvent(cancelEvent);
                    this.touchMoved = true;
                }
            }
        }, this.node, true);

        let cbEnd = (event: cc.Event.EventTouch) => {
            if (!this.touchMoved) {
                return;
            }
            if (Math.abs(this.items.position.x) > this.content.width / 4) {
                let idx = this.index;
                let position = cc.Vec2.ZERO;
                if (this.infinity) {
                    if (this.items.position.x < 0) {
                        idx++;
                        if (idx > this.pageCount - 1) idx = 0;
                        position = cc.v2(-this.content.width - this.spacing, 0);
                    } else {
                        idx--;
                        if (idx < 0) idx = this.pageCount - 1;
                        position = cc.v2(this.content.width + this.spacing, 0);
                    }
                } else {
                    if (this.items.position.x < 0 && idx < this.pageItems.length - 1) {
                        idx++;
                    } else if (this.items.position.x > 0 && idx >= 1) {
                        idx--;
                    }
                    position = this.index > idx ? cc.v2(this.content.width + this.spacing, 0) : cc.v2(-this.content.width - this.spacing, 0);
                }
                if (this.index != idx) {
                    this.items.stopAllActions();
                    this.items.runAction(cc.sequence(
                        cc.moveTo((this.content.width + this.spacing - Math.abs(this.items.position.x)) / (this.content.width + this.spacing) * 0.5, position),
                        cc.callFunc(() => {
                            this.setPageIndex(idx);
                            if (this.onPageChanged != null) this.onPageChanged();
                        })
                    ));
                } else {
                    this.items.stopAllActions();
                    this.items.runAction(cc.sequence(
                        cc.moveTo(0.3, cc.Vec2.ZERO),
                        cc.callFunc(() => {
                        })
                    ));
                }
            } else {
                this.items.stopAllActions();
                this.items.runAction(cc.sequence(
                    cc.moveTo(0.3, cc.Vec2.ZERO),
                    cc.callFunc(() => {
                    })
                ));
            }
            if (this.onTouchEndOrCancel != null) this.onTouchEndOrCancel();
        };
        this.node.on(cc.Node.EventType.TOUCH_END, cbEnd, this.node, true);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, cbEnd, this.node, true);

        for (let i = 0; i < this.pages.childrenCount; i++) {
            this.pages.children[i].active = false;
        }

        this.left = new cc.Node();
        this.left.parent = this.items;
        this.left.setPosition(-this.content.width - this.spacing, 0);
        this.left.active = true;

        this.center = new cc.Node();
        this.center.parent = this.items;
        this.center.setPosition(0, 0);
        this.center.active = true;

        this.right = new cc.Node();
        this.right.parent = this.items;
        this.right.setPosition(this.content.width + this.spacing, 0);
        this.right.active = true;

        if (this.autoInit) this.init();
    }

    public init() {
        for (let i = 1; i < this.indicator.childrenCount; i++) {
            this.indicator.children[i].destroy();
            i--;
        }
        this.indicator.children[0].active = false;

        this.pageCount = this.pages.childrenCount;
         //Utils.Log("PageCount: "+this.pageCount);
        for (let i = 0; i < this.pages.childrenCount; i++) {
            this.pageItems.push(this.pages.children[i]);
            let item = cc.instantiate(this.indicator.children[0]);
            item.parent = this.indicator;
            item.active = true;
        }
        this.setPageIndex(0);
    }

    public scrollToIndex(index: number, moveToLeft: boolean = false) {
        if (this.index != index) {
            let position = cc.Vec2.ZERO;
            if (this.infinity) {
                position = moveToLeft ? cc.v2(this.content.width + this.spacing, 0) : cc.v2(-this.content.width - this.spacing, 0);
            } else {
                position = this.index > index ? cc.v2(this.content.width + this.spacing, 0) : cc.v2(-this.content.width - this.spacing, 0);
            }
            this.items.stopAllActions();
            if (this.infinity || (Math.abs(this.index - index) == 1 || Math.abs(this.index - index) != this.pageCount - 1)) {
                this.items.runAction(cc.sequence(
                    cc.moveTo(0.5, position),
                    cc.callFunc(() => {
                        this.setPageIndex(index);
                    })
                ));
            } else {
                this.setPageIndex(index);
            }
        }
    }

    public scrollToNextIndex() {
        let idx = this.index + 1;
        if (idx >= this.pageCount) idx = 0;
        this.scrollToIndex(idx, false);
    }

    public setPageIndex(index: number) {
        this.index = index;

        for (let i = 0; i < this.pageItems.length; i++) {
            this.pageItems[i].active = false;
        }

        if (this.infinity) {
            let idx = this.index - 1;
            if (idx < 0) idx = this.pageCount - 1;
            this.pageItems[idx].active = true;
            this.pageItems[idx].parent = this.left;

            idx = this.index;
            this.pageItems[idx].active = true;
            this.pageItems[idx].parent = this.center;

            idx = this.index + 1;
            if (idx > this.pageCount - 1) idx = 0;
            this.pageItems[idx].active = true;
            this.pageItems[idx].parent = this.right;
        } else {
            if (this.pageCount >= 3 && this.index >= 1) {
                this.pageItems[this.index - 1].active = true;
                this.pageItems[this.index - 1].parent = this.left;
            }
            if (this.pageCount >= this.index + 1) {
                this.pageItems[this.index].active = true;
                this.pageItems[this.index].parent = this.center;
            }
            if (this.pageCount >= 2 && this.index < this.pageCount - 1) {
                this.pageItems[this.index + 1].active = true;
                this.pageItems[this.index + 1].parent = this.right;
            }
        }
        this.items.setPosition(cc.Vec2.ZERO);
        this.updateIndicator();
    }

    private updateIndicator() {
        for (let i = 1; i < this.indicator.childrenCount; i++) {
            let item = this.indicator.children[i];
            item.parent = this.indicator;
            let active = (i - 1) == this.index;
            item.getChildByName("active").active = active;
            item.getChildByName("inactive").active = !active;
        }
    }
}
