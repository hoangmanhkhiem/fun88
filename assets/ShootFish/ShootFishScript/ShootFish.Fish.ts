import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import ShootFishNetworkClient from "../../Lobby/LobbyScript/Script/networks/ShootFishNetworkClient";
import Play from "./ShootFish.Play";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Fish extends cc.Component {

    @property(cc.Node)
    anim: cc.Node = null;
    @property(cc.Label)
    lblId: cc.Label = null;

    id: number;

    public isDie = false;
    public type = -1;

    private polygon: SAT.Polygon = null;
    // private lastPolygonAngle = 0;

    private dataPointsUpdate = [];
    private currentStep = 0;
    private currentTimeStep = -1;
    public currentVStepX = 0;
    public currentVStepY = 0;

    public setData(fishData: any) {
        this.id = fishData['id'];
        this.lblId.string = this.id.toString();

        if (fishData["h"] <= 0 || fishData['path'].length == 0) {
            this.die();
            if (fishData['path'].length == 0) {
                //  cc.log("fishData path length = 0");
            }
            return;
        }
        if (this.type != fishData["t"]) {
            this.type = fishData["t"];
            this.anim.removeAllChildren();
            let animNode = cc.instantiate(Play.instance.getFishAnimByType(this.type));
            animNode.parent = this.anim;

            let width = fishData['H'];
            let height = fishData['w'];
            this.polygon = new SAT.Box(new SAT.Vector(0, 0), width, height).toPolygon();
            this.polygon.translate(- width / 2, - height / 2);

            this.node.width = width;
            this.node.height = height;
        }
        // //  cc.log("setfishdata " + this.id)

        let dX = Number(fishData['dx']);
        let dY = Number(fishData['dy']);
        let posX = Number(fishData['px']);
        let posY = Number(fishData['py']);
        let path = fishData['path'];
        let time = ShootFishNetworkClient.serverCurrentTimeMillis();

        this.node.angle = Math.atan2(dY, dX) * Utils.Rad2Deg;

        let dataPoints = [];
        for (var i = 0; i < path.length; i++) {
            var dataP = { 't': Number(path[i]['t']) };
            dataP['p'] = cc.v2(Number(path[i]['x']), Number(path[i]['y']));
            switch (Play.instance.mePlayer.serverPos) {
                case 1:
                    dataP['p'] = cc.v2(-Number(path[i]['x']), Number(path[i]['y']));
                    break;
                case 2:
                    dataP['p'] = cc.v2(-Number(path[i]['x']), -Number(path[i]['y']));
                    break;
                case 3:
                    dataP['p'] = cc.v2(Number(path[i]['x']), -Number(path[i]['y']));
                    break;
            }
            dataPoints.push(dataP);
        }

        this.node.setPosition(posX, posY);
        switch (Play.instance.mePlayer.serverPos) {
            case 1:
                this.node.setPosition(-posX, posY);
                break;
            case 2:
                this.node.setPosition(-posX, -posY);
                break;
            case 3:
                this.node.setPosition(posX, -posY);
                break;
        }

        let isFirstPoint = true;
        let point = -1;
        this.dataPointsUpdate.length = 0;
        for (let i = 1; i < dataPoints.length; i++) {
            let data1 = dataPoints[i - 1];
            let data2 = dataPoints[i];
            let p1: cc.Vec2 = data1['p'];
            let p2: cc.Vec2 = data2['p'];
            let t1: number = data1['t'];
            let t2: number = data2['t'];
            if (time - t2 < 0) {
                if (point < 0) point = i;
                let deltaPos = p2.clone().sub(p1);
                let angle = Math.atan2(deltaPos.y, deltaPos.x) * Utils.Rad2Deg;
                let timeMove = 0;
                if (isFirstPoint) {
                    timeMove = (t2 - time) / 1000;
                    isFirstPoint = false;
                } else {
                    timeMove = (t2 - t1) / 1000;
                }
                this.dataPointsUpdate.push({ 'p': p2, 't': timeMove, 'a': angle, "tms": t2});
            }
        }

        this.currentTimeStep = -1;
        this.currentStep = 0;
        this.currentVStepX = 0;
        this.currentVStepY = 0;

        if (this.dataPointsUpdate.length > 0) {
            this.currentTimeStep = this.dataPointsUpdate[this.currentStep]['t'];
            let moveToPos: cc.Vec2 = this.dataPointsUpdate[this.currentStep]['p'];
            let deltaPos = moveToPos.sub(new cc.Vec2(this.node.position.x,this.node.position.y));
            this.currentVStepX = deltaPos.x / this.currentTimeStep;
            this.currentVStepY = deltaPos.y / this.currentTimeStep;
            this.node.angle = this.dataPointsUpdate[this.currentStep]['a'];
        } else {
            //  cc.log("can't find path: " + this.id);
        }
        this.isDie = false;
        this.node.active = true;
    }

    public updateRealTime(dt: number) {
        if (!this.node.active || this.isDie) {
            return;
        }
        if (this.dataPointsUpdate.length > 0) {
            if (this.currentTimeStep >= 0) {
                let pos = this.node.position;
                this.currentTimeStep -= dt;
                if (this.currentTimeStep < 0) {
                    this.currentStep++;
                    if (this.currentStep < this.dataPointsUpdate.length) {
                        this.currentTimeStep = this.dataPointsUpdate[this.currentStep]['t'] + Math.abs(this.currentTimeStep);

                        this.node.angle = this.dataPointsUpdate[this.currentStep]['a'];
                        this.polygon.angle = this.node.angle * Utils.Deg2Rad;

                        let moveToPos: cc.Vec2 = this.dataPointsUpdate[this.currentStep]['p'];
                        let deltaPos = moveToPos.sub(new cc.Vec2(pos.x,pos.y));
                        this.currentVStepX = deltaPos.x / this.currentTimeStep;
                        this.currentVStepY = deltaPos.y / this.currentTimeStep;

                        ////  cc.log("fish " + this.id + " cstep: " + this._currentStep + " maxStep: " + this._dataPointsUpdate.length + " moveToPos: " + moveToPos.x + ", " + moveToPos.y);
                    } else {
                        ////  cc.log("this._current " + this.id + " PrepareStop _dataPointsUpdatel: " + this._dataPointsUpdate.length + "  _currentStep: " + this._currentStep);
                    }
                }
                pos.x += this.currentVStepX * dt;
                pos.y += this.currentVStepY * dt;
                this.node.position = pos;
            }
        }
    }

    public die() {
        this.isDie = true;
        this.node.active = false;
    }

    public getPolygon(): SAT.Polygon {
        // if (Math.abs(this.lastPolygonAngle - this.node.angle) >= 3) {
        //     this.lastPolygonAngle = this.node.angle;
        //     this.polygon.setAngle(this.node.angle * Utils.Deg2Rad);
        // }
        this.polygon.pos = new SAT.Vector(this.node.position.x, this.node.position.y);
        return this.polygon;
    }

    public hurt() {
        if (this.anim.children.length == 0 || this.anim.children[0].children.length == 0) return;
        this.anim.children[0].children[0].stopActionByTag(99);
        var action = cc.sequence(
            cc.tintTo(0.05, 255, 54, 54),
            cc.delayTime(0.1),
            cc.tintTo(0.05, 255, 255, 255)
        );
        action.setTag(99);
        this.anim.children[0].children[0].runAction(action);
    }
}
