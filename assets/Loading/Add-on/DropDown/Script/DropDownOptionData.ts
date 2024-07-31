const {ccclass, property} = cc._decorator;

@ccclass("DropDownOptionData")
export default class DropDownOptionData{
    @property(cc.String)
    public optionString: string = "";
    @property(cc.SpriteFrame)
    public optionSf: cc.SpriteFrame = null;
}
