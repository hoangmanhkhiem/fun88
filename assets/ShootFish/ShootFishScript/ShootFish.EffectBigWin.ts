import Utils from "../../Lobby/LobbyScript/Script/common/Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EffectBigWin extends cc.Component {

    @property(sp.Skeleton)
    skeleton: sp.Skeleton = null;
    @property(cc.Label)
    lblNickname: cc.Label = null;
    @property(cc.Label)
    lblCoin: cc.Label = null;

    public show(isShow: boolean, nickname: string = null, coin: number = 0){
        this.node.stopAllActions();
        if(isShow){
            this.lblCoin.string = Utils.formatNumber(coin);
            this.lblCoin.node.active = false;
            this.lblNickname.string = nickname;
            this.lblNickname.node.active = false;
    
            this.skeleton.setAnimation(0, "animation", false);
    
            this.node.active = true;
            this.node.runAction(cc.sequence(
                cc.delayTime(0.7),
                cc.callFunc(()=>{
                    this.lblNickname.node.active = true;
                    this.lblCoin.node.active = true;
                }),
                cc.delayTime(3),
                cc.callFunc(()=>{
                    this.node.active = false;
                })
            ))
        }else{
            this.node.active = false;
        }
    }
}
