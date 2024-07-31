
const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemChoseBank extends cc.Component {

    @property(cc.Sprite)
    spriteBank: cc.Sprite = null;

    @property([cc.SpriteFrame])
    sfBankArray: cc.SpriteFrame[] = [];

    private callback = null;
    private data = null;
    init(tabWell, data, callback) {
        this.data = data;
        this.callback = callback;
        var self = this;
        this.spriteBank.spriteFrame = null;
        if (tabWell == "clickpay") {
            try {
                cc.loader.load(data.bank_logo, function (err, texture) {
                    var newSpriteFrame = new cc.SpriteFrame(texture);
                    self.spriteBank.spriteFrame = newSpriteFrame;
                });
            }
            catch (e) {

            }
        }
        else {
            cc.loader.load(data.imageUrl, function (err, texture) {
                var newSpriteFrame = new cc.SpriteFrame(texture);
                self.spriteBank.spriteFrame = newSpriteFrame;
            });
        }

    }

    onBtnClick() {
        if (this.callback != null) {
            this.callback(this.data);
        }
    }
}
