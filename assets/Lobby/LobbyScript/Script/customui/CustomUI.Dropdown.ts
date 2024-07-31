const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Button)
export default class Dropdown extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Node)
    template: cc.Node = null;

    private options: string[] = [];
    private value: number = 0;
    private blocker: cc.Node = null;
    private dropdownList: cc.Node = null;
    private animating = false;
    private onValueChanged: (idx: number) => void;

    onLoad() {
        this.template.active = false;

        let parent = this.findParent();
        this.node.on("click", () => {
            if (this.animating) return;
            this.animating = true;
            this.blocker = this.addBlocker(parent);

            this.dropdownList = cc.instantiate(this.template);
            this.dropdownList.getComponent(cc.Widget).enabled = false;
            this.dropdownList.parent = this.blocker;
            this.dropdownList.name = "dropdownList";

            let pos = this.template.convertToWorldSpaceAR(this.template.position);
            this.dropdownList.position = this.dropdownList.convertToNodeSpaceAR(pos);

            this.dropdownList.active = true;
            this.dropdownList.scaleY = 0;
            this.dropdownList.opacity = 0;
            this.dropdownList.stopAllActions();
            this.dropdownList.runAction(cc.sequence(
                cc.spawn(
                    cc.scaleTo(0.3, 1, 1).easing(cc.easeBackOut()),
                    cc.fadeIn(0.15)
                ),
                cc.callFunc(() => {
                    this.animating = false;
                }))
            );

            //draw list options
            let scrContent = this.dropdownList.getComponent(cc.ScrollView).content;
            let itemTemp = scrContent.children[0];
            itemTemp.active = false;
            for (let i = 0; i < this.options.length; i++) {
                let item = cc.instantiate(itemTemp);
                item.parent = itemTemp.parent;
                item.active = true;

                let label = item.getComponentInChildren(cc.Label);
                label.string = this.options[i];

                let check = item.getComponentInChildren(cc.Sprite);
                check.node.active = i == this.value;

                item.on("click", () => {
                    this.setValue(i);
                    if (this.onValueChanged != null) this.onValueChanged(i);
                    this.dismiss();
                });

                if (i == this.value) {
                    let p = scrContent.position;
                    p.y = itemTemp.height * i - itemTemp.height / 2;
                    scrContent.position = p;
                }
            }
        });
    }

    onEnable() {
        if (this.blocker != null) this.blocker.destroy();
    }

    onDestroy() {
        if (this.blocker != null) this.blocker.destroy();
    }

    private addBlocker(parent: cc.Node): cc.Node {
        let blocker = new cc.Node("blocker");
        blocker.parent = parent;
        blocker.addComponent(cc.Button);
        blocker.zIndex = 30000;

        let widget = blocker.addComponent(cc.Widget);
        widget.isAlignTop = true;
        widget.top = 0;
        widget.isAlignBottom = true;
        widget.bottom = 0;
        widget.isAlignLeft = true;
        widget.left = 0;
        widget.isAlignRight = true;
        widget.right = 0;
        // blocker.setSiblingIndex(30000);
        blocker.on("click", () => {
            this.dismiss();
        });

        cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LOADING, () => {
            //  //Utils.Log("cc.Director.EVENT_BEFORE_SCENE_LOADING");
            this.onDestroy();
        });
        return blocker;
    }

    private findParent(node: cc.Node = null): cc.Node {
        if (node == null) node = this.node;
        if (node.parent == null || node.parent instanceof cc.Scene) {
            return node;
        }
        return this.findParent(node.parent);
    }

    private dismiss() {
        if (this.animating) return;
        this.animating = true;
        this.dropdownList.stopAllActions();
        this.dropdownList.runAction(cc.sequence(
            cc.spawn(
                cc.scaleTo(0.3, 1, 0).easing(cc.easeBackIn()),
                cc.sequence(cc.delayTime(0.15), cc.fadeOut(0.15))
            ),
            cc.callFunc(() => {
                this.blocker.destroy();
                this.blocker = null;
                this.animating = false;
            }))
        );
    }

    public setOptions(options: string[]) {
        this.options = options;
    }

    public setValue(value: number) {
        this.value = value;
        this.label.string = this.options[this.value];
    }

    public getValue(): number {
        return this.value;
    }

    public getLabelString(): string {
        return this.label.string;
    }

    public setOnValueChange(onValueChanged: (idx: number) => void) {
        this.onValueChanged = onValueChanged;
    }
}
