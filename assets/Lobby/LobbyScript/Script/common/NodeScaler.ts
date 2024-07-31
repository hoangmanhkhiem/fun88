// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NodeScaler extends cc.Component {

    @property
    designResolution: cc.Size = new cc.Size(1280, 720);
    @property
    fitX: boolean = false;
    @property
    fitY: boolean = false;

    lastWitdh: number = 0;
    lastHeight: number = 0;

    canvas: cc.Canvas = null;

    start() {
        this.canvas = this.getCanvas();
        this.updateSize();
    }

    update(dt: number) {
        this.updateSize();
    }

    updateSize() {
        var frameSize = cc.view.getFrameSize();
        if (this.lastWitdh !== frameSize.width || this.lastHeight !== frameSize.height) {

            this.lastWitdh = frameSize.width;
            this.lastHeight = frameSize.height;

            if (this.canvas != null && this.fitX && !this.fitY) {
                this.node.scaleX = this.canvas.designResolution.width / this.designResolution.width;
            } else if (this.canvas != null && this.fitY && !this.fitX) {
                this.node.scaleY = this.canvas.designResolution.height / this.designResolution.height;
            } else {
                var frameScale = frameSize.width / frameSize.height;
                var designScale = this.designResolution.width / this.designResolution.height;

                if (this.designResolution.width / this.designResolution.height > frameSize.width / frameSize.height) {
                    this.node.setScale(designScale / frameScale);
                } else {
                    this.node.setScale(frameScale / designScale);
                }
            }
        }
    }

    private getCanvas(node: cc.Node = null): cc.Canvas {
        if (node == null) {
            node = this.node;
        }
        if (node.parent != null) {
            let canvas = node.parent.getComponent(cc.Canvas);
            if (canvas != null) {
                return canvas;
            } else {
                return this.getCanvas(node.parent);
            }
        }
        return null;
    }
}
