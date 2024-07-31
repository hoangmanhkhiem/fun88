import Utils from "../../Lobby/LobbyScript/Script/common/Utils";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property
    localPos: number = 0;
    @property(cc.Label)
    lblNickname: cc.Label = null;
    @property(cc.Label)
    lblCoin: cc.Label = null;
    @property(cc.Label)
    lblBet: cc.Label = null;
    @property(cc.Node)
    gunRotate: cc.Node = null;
    @property(cc.Sprite)
    sprGunBar: cc.Sprite = null;
    @property([cc.SpriteFrame])
    sprFramesGunBar: cc.SpriteFrame[] = [];
    @property([sp.Skeleton])
    guns: sp.Skeleton[] = [];

    public id = 0;
    public username = "";
    public nickname = "";
    public coin = 0;
    public avatar = "";
    public serverPos = -1;

    private gun: sp.Skeleton = null;
    private curGunIdx = -1;

    set(id: number, username: string, nickname: string, coin: number, avatar: string) {
        this.id = id;
        this.username = username;
        this.nickname = nickname;
        this.coin = coin;
        this.avatar = avatar;
        this.gunRotate.angle = 0;
        this.node.active = true;

        this.lblNickname.string = this.nickname;
        this.lblCoin.string = Utils.formatNumber(coin);
        switch (this.localPos) {
            case 0:
            case 1:
                this.gunRotate.angle = 90;
                break;
            case 2:
            case 3:
                this.gunRotate.angle = -90;
                break;
        }
        this.setGun(0);
    }

    leave() {
        this.id = -1;
        this.nickname = "";
        this.coin = 0;
        this.avatar = "";
        this.node.active = false;
    }

    setGun(gunIdx: number) {
        if (gunIdx >= this.guns.length) gunIdx = 0;
        if (this.curGunIdx == gunIdx) return;

        this.curGunIdx = gunIdx;

        for (let i = 0; i < this.guns.length; i++) {
            this.guns[i].node.active = i == gunIdx;
        }
        this.sprGunBar.spriteFrame = this.sprFramesGunBar[gunIdx];
        this.gun = this.guns[gunIdx];
    }

    rotateGun(touchPos: cc.Vec2) {
        var gunWorldPos = this.gunRotate.convertToWorldSpaceAR(cc.Vec2.ZERO);
        var d = touchPos.sub(gunWorldPos);
        var angle = Math.atan2(d.y, d.x) * Utils.Rad2Deg;
        if (angle < -90) {
            angle = 180;
        } else if (angle < 0 && angle > -90) {
            angle = 0;
        }
        this.gunRotate.angle = angle;
    }

    shoot() {
        this.gun.setAnimation(0, "2", false);
        this.gun.addAnimation(0, "1", true);
    }
}
