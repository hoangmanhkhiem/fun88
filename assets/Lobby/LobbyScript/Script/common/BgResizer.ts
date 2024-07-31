const { ccclass, property } = cc._decorator;

@ccclass
export default class BgResizer extends cc.Component {
    @property
    designResolution: cc.Size = new cc.Size(1280, 720);

    lastWitdh: number = 0;
    lastHeight: number = 0;

    start() {
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

            if (this.designResolution.width / this.designResolution.height > frameSize.width / frameSize.height) {
                var height = this.designResolution.width * frameSize.height / frameSize.width;
                var width = height * this.designResolution.width / this.designResolution.height;
                
                var newDesignSize = cc.size(width, height);
                this.node.setContentSize(newDesignSize);
            } else {
                var width = this.designResolution.height * frameSize.width / frameSize.height;
                var height = width * this.designResolution.height / this.designResolution.width;
                var newDesignSize = cc.size(width, height);

                var newDesignSize = cc.size(width, height);
                this.node.setContentSize(newDesignSize);
            }
        }
    }
}
