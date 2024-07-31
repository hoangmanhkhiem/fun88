import Play from "./ShootFish.Play";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PanelMenu extends cc.Component {

    @property(cc.Node)
    arrow: cc.Node = null;

    @property(cc.Button)
    btnSound: cc.Button = null;
    @property(cc.SpriteFrame)
    sfSoundOn: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sfSoundOff: cc.SpriteFrame = null;
    @property(cc.Button)

    btnMusic: cc.Button = null;
    @property(cc.SpriteFrame)
    sfMusicOn: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sfMusicOff: cc.SpriteFrame = null;

    private isShow = false;

    private soundState = 1;
    private musicState = 1;

    show(isShow: boolean) {
        this.isShow = isShow;
        if (this.isShow) {
            this.node.runAction(cc.moveTo(0.3, cc.v2(-115, 0)));
            this.arrow.runAction(cc.rotateTo(0.3, 0));
        } else {
            this.node.runAction(cc.moveTo(0.3, cc.v2(0, 0)));
            this.arrow.runAction(cc.rotateTo(0.3, 180));
        }
        
        this.btnSound.getComponent(cc.Sprite).spriteFrame = this.getSound() > 0 ? this.sfSoundOn : this.sfSoundOff;
        this.btnMusic.getComponent(cc.Sprite).spriteFrame = this.getMussic() > 0 ? this.sfMusicOn : this.sfMusicOff;
    }

    toggleShow() {
        this.show(!this.isShow);
    }

    toggleSound() {
        //SPUtils.setSoundVolumn(SPUtils.getSoundVolumn() > 0 ? 0 : 1);
        var state = this.getSound() > 0 ? 0 : 1;
        
        this.btnSound.getComponent(cc.Sprite).spriteFrame = state > 0 ? this.sfSoundOn : this.sfSoundOff;
        Play.instance.settingSound();
        
    }

    toggleMusic() {
        //SPUtils.setMusicVolumn(SPUtils.getMusicVolumn() > 0 ? 0 : 1);
        
        var state = this.getMussic() > 0 ? 0 : 1;
        //  cc.log("toggle music result "+state);
        

        this.btnMusic.getComponent(cc.Sprite).spriteFrame = state > 0 ? this.sfMusicOn : this.sfMusicOff;
        Play.instance.settingMusic();
    }
    getSound(){
        
        var soundSave = cc.sys.localStorage.getItem("sound_fish_shot");
        if (soundSave != null) {
            this.soundState = parseInt(soundSave);
        }
        return this.soundState;
    }
    
    
    getMussic(){
        var soundSave = cc.sys.localStorage.getItem("music_fish_shot");
        if (soundSave != null) {
            this.musicState = parseInt(soundSave);
        }
        return this.musicState;
    }
    
}
