import VersionConfig from "../../../../Loading/src/VersionConfig";


const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Label)
export default class CPSprite extends cc.Component {

    @property
    strR99: string = "";

    onLoad() {
        switch (VersionConfig.CPName) {
            default:
                this.getComponent(cc.Label).string = this.strR99;
                break;
        }
    }
}
