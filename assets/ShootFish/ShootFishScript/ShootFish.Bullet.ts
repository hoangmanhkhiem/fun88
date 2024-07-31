import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import Play from "./ShootFish.Play";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {

    @property(cc.Node)
    bullet: cc.Node = null;
    @property(cc.Node)
    fishNet: cc.Node = null;

    public id: string = "";
    public targetFishId = -1;

    private readonly worldSize: cc.Size = cc.size(1280, 720);
    private readonly exploreDuration: number = 0.8;

    private vX = 0;
    private vY = 0;
    private collisionCount = 4;
    isExplored = false;
    isExploring = false;
    private curExplore = 0;
    private circle: SAT.Circle = null;

    public run() {
        let speed = Number(Play.SERVER_CONFIG['BulletSpeed']);
        if(isNaN(speed) || speed == 0) speed = 1400;
        let v = Utils.degreesToVec2(this.node.angle);
        this.vX = v.x * speed;
        this.vY = v.y * speed;
        this.collisionCount = 4;
        this.isExplored = false;
        this.isExploring = false;
        this.bullet.active = true;
        this.fishNet.active = false;

        this.circle = new SAT.Circle(new SAT.Vector(this.node.position.x, this.node.position.y), Number(Play.SERVER_CONFIG['BulletRadius']));
    }

    public updateRealTime(dt: number) {
        if (this.isExplored) return;
        if (this.isExploring) {
            this.curExplore -= dt;
            if (this.curExplore <= 0) {
                this.isExplored = true;
                this.node.active = false;
            }
            return;
        }
        var newPos = this.node.position;
        newPos.x += this.vX * dt;
        newPos.y += this.vY * dt;
        this.node.position = newPos;

        if (Math.abs(newPos.x) > this.worldSize.width / 2) {
            this.vX *= -1;

            var angle = Math.atan2(this.vY, this.vX) * Utils.Rad2Deg;
            this.node.angle = angle;

            newPos.x = (newPos.x < 0 ? -1 : 1) * this.worldSize.width / 2;
            this.node.position = newPos;

            this.collisionCount--;
        } else if (Math.abs(newPos.y) > this.worldSize.height / 2) {
            this.vY *= -1;

            var angle = Math.atan2(this.vY, this.vX) * Utils.Rad2Deg;
            this.node.angle = angle;

            newPos.y = (newPos.y < 0 ? -1 : 1) * this.worldSize.height / 2;
            this.node.position = newPos;

            this.collisionCount--;
        }

        this.circle.pos = new SAT.Vector(this.node.position.x, this.node.position.y);

        if (this.collisionCount < 0) {
            this.node.active = false;
        }
    }

    public explore() {
        this.isExploring = true;
        this.curExplore = this.exploreDuration;
        this.bullet.active = false;
        this.fishNet.active = true;
        this.fishNet.opacity = 0;
        this.fishNet.angle = 0;
        this.fishNet.scale = 0;

        this.fishNet.stopAllActions();

        this.fishNet.runAction(cc.spawn(
            cc.sequence(cc.scaleTo(0.3, 1.1), cc.delayTime(0.07), cc.scaleTo(0.3, 1)),
            cc.fadeIn(0.1),
            cc.sequence(cc.delayTime(0.25), cc.rotateTo(0.5, 35)),
            cc.sequence(cc.delayTime(0.4), cc.fadeOut(0.3))
        ));
    }

    public getCircle(): SAT.Circle {
        return this.circle;
    }
}
