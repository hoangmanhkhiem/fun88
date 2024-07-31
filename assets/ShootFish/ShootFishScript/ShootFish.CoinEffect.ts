import Utils from "../../Lobby/LobbyScript/Script/common/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CoinEffect extends cc.Component {

    @property(cc.Label)
    lblCoin: cc.Label = null;
    @property(sp.Skeleton)
    coinExplore: sp.Skeleton = null;
    @property(cc.Node)
    coin0: cc.Node = null;
    @property(cc.Node)
    coin1: cc.Node = null;
    @property(cc.Node)
    coin2: cc.Node = null;

    public run(coin: number, startPos: cc.Vec2, toPos: cc.Vec2) {
        this.coinExplore.node.position = startPos;

        this.coin0.stopAllActions();
        this.coin0.position = startPos.clone().add(cc.v2(Utils.randomRange(80, -80), Utils.randomRange(80, -80)));
        this.coin0.scale = 0;

        this.coin1.stopAllActions();
        this.coin1.position = startPos.clone().add(cc.v2(Utils.randomRange(80, -80), Utils.randomRange(80, -80)));
        this.coin1.scale = 0;

        this.coin2.stopAllActions();
        this.coin2.position = startPos.clone().add(cc.v2(Utils.randomRange(80, -80), Utils.randomRange(80, -80)));
        this.coin2.scale = 0;

        this.lblCoin.string = Utils.formatNumber(coin);
        this.lblCoin.node.position = startPos;
        this.lblCoin.node.stopAllActions();
        this.lblCoin.node.opacity = 0;
        this.lblCoin.node.scale = 0;
        this.lblCoin.node.runAction(cc.sequence(
            cc.spawn(cc.fadeIn(0.2), cc.scaleTo(0.2, 1)),
            cc.moveBy(0.1, new cc.Vec2(0, 5)),
            cc.moveBy(0.1, new cc.Vec2(0, -5)),
            cc.moveBy(0.1, new cc.Vec2(0, 5)),
            cc.moveBy(0.1, new cc.Vec2(0, -5)),
            cc.moveBy(0.1, new cc.Vec2(0, 5)),
            cc.moveBy(0.1, new cc.Vec2(0, -5)),
            cc.moveBy(0.1, new cc.Vec2(0, 5)),
            cc.moveBy(0.1, new cc.Vec2(0, -5)),
            cc.fadeOut(0.15)
        ));

        this.coinExplore.setAnimation(0, "Idle", false);
        this.coin0.runAction(cc.sequence(
            cc.scaleTo(0.15, Utils.randomRange(0.7, 1)),
            cc.delayTime(0.4),
            cc.moveBy(0.1, new cc.Vec2(0, 50)),
            cc.moveBy(0.1, new cc.Vec2(0, -50)),
            cc.moveBy(0.1, new cc.Vec2(0, 50)),
            cc.moveBy(0.1, new cc.Vec2(0, -50)),
            cc.moveTo(0.7, toPos),
            cc.scaleTo(0.15, 0)
        ));
        this.coin1.runAction(cc.sequence(
            cc.scaleTo(0.15, Utils.randomRange(0.7, 1)),
            cc.delayTime(0.55),
            cc.moveBy(0.1, new cc.Vec2(0, 50)),
            cc.moveBy(0.1, new cc.Vec2(0, -50)),
            cc.moveBy(0.1, new cc.Vec2(0, 50)),
            cc.moveBy(0.1, new cc.Vec2(0, -50)),
            cc.moveTo(0.7, toPos),
            cc.scaleTo(0.15, 0)
        ));
        this.coin2.runAction(cc.sequence(
            cc.scaleTo(0.15, Utils.randomRange(0.7, 1)),
            cc.delayTime(0.7),
            cc.moveBy(0.1, new cc.Vec2(0, 50)),
            cc.moveBy(0.1, new cc.Vec2(0, -50)),
            cc.moveBy(0.1, new cc.Vec2(0, 50)),
            cc.moveBy(0.1, new cc.Vec2(0, -50)),
            cc.moveTo(0.7, toPos),
            cc.scaleTo(0.15, 0),
            cc.callFunc(() => {
                this.node.active = false;
            })
        ));
    }
}
