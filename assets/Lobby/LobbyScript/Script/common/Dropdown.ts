import DropdownItem from "./DropdownItem";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Button)
export default class Dropdown extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;

    @property(DropdownItem)
    itemTemplate: DropdownItem = null;

    private value: number = 0;

    private onValueChange: (idx: number) => void;
    private data: Array<string> = [];
    private items: Array<DropdownItem> = [];

    public start() {
        this.itemTemplate.node.active = false;
    }

    public show() {
        this.node.active = true;
        this.node.opacity = 0;
        this.node.runAction(cc.fadeIn(0.2));
        
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].checkMark.active = this.items[i].idx == this.value;
        }
    }

    public setOptions(data: Array<string> = []) {
        this.data = data;
        var childen = this.itemTemplate.node.parent.children;
        for (var i = 0; i < childen.length; i++) {
            childen[i].active = false;
        }
        this.items = [];
        for (var i = 0; i < data.length; i++) {
            var item = this.getItem();
            item.idx = i;
            item.label.string = data[i];
            item.checkMark.active = i == this.value;
            this.items.push(item);
        }
    }

    public dismiss() {
        var _this = this;
        this.node.runAction(cc.sequence(cc.fadeOut(0.2), cc.callFunc(() => {
            _this.node.active = false;
        })));
    }

    public setOnValueChange(callback: (idx: number) => void) {
        this.onValueChange = callback;
    }

    public setValue(value: number) {
        if (value < this.data.length) {
            this.value = value;
            this.label.string = this.data[this.value];
        } else {
            this.value = 0;
        }
    }

    public getValue(): number {
        return this.value;
    }

    private getItem(): DropdownItem {
        var node: cc.Node = null;
        var childen = this.itemTemplate.node.parent.children;
        for (var i = 0; i < childen.length; i++) {
            if (!childen[i].active && childen[i] != this.itemTemplate.node) node = childen[i];
        }
        if (node == null) {
            node = cc.instantiate(this.itemTemplate.node);
            node.parent = this.itemTemplate.node.parent;
            node.on("click", (target: any) => {
                this.value = target.getComponent(DropdownItem).idx;
                this.label.string = this.data[this.value];
                if (this.onValueChange) this.onValueChange(this.value);
                this.dismiss();
            }, this);
        }
        node.active = true;
        node.zIndex = this.getLastZIndex();
        return node.getComponent(DropdownItem);
    }

    private getLastZIndex() {
        var c = 0;
        var childen = this.itemTemplate.node.parent.children;
        for (var i = 1; i < childen.length; i++) {
            if (childen[i].active) c++;
        }
        return c;
    }

    public getData() : Array<string>{
        return this.data;
    }
}
