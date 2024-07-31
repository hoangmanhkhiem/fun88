import Dialog from "../../Lobby/LobbyScript/Script/common/Dialog";

const { ccclass, property } = cc._decorator;

@ccclass
export class PopupGuide extends Dialog {

    // @property([cc.Node])
    // pages: cc.Node[] = [];
    // @property(cc.Node)
    // btnNext: cc.Node = null;
    // @property(cc.Node)
    // btnPrev: cc.Node = null;
    // @property({ type: cc.AudioClip })
    // soundClick: cc.AudioClip = null;

    private page = 0;

    private soundSlotState = null;

    start() {
    }


    show() {
        // if (this.canPlaySound()) {
        //     cc.audioEngine.play(this.soundClick, false, 1);
        // }
        super.show();
        //this.page = 0;
        //this.btnPrev.active = true;
       // this.reloadData();
    }

    
    dismiss() {
        
        super.dismiss();
    }

    canPlaySound() {
       
    }
}
export default PopupGuide;