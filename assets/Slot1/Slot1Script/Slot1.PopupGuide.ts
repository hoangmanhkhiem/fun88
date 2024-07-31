import Dialog from "../../Lobby/LobbyScript/Script/common/Dialog";

const { ccclass, property } = cc._decorator;

@ccclass
export class PopupGuide extends Dialog {

    @property([cc.Node])
    pages: cc.Node[] = [];
    

    private page = 0;

    private soundSlotState = null;

    start() {
    }


    show() {
       
        super.show();
        this.page = 0;
        // this.reloadData();
    }

    actNext() {
        if (this.page < this.pages.length - 1) {
            this.page++;
        }
        this.reloadData();
       
    }

    actPrev() {
        if (this.page > 0) {
            this.page--;
        }
        this.reloadData();
      
    }

    private reloadData() {
        for (let i = 0; i < this.pages.length; i++) {
            this.pages[i].active = i == this.page;
        }
    }

    dismiss() {
        
        super.dismiss();
    }

    canPlaySound() {
        var soundSave = cc.sys.localStorage.getItem("sound_Slot_1");
        if (soundSave != null) {
            this.soundSlotState = parseInt(soundSave);
        } else {
            this.soundSlotState = 1;
        }

        if (this.soundSlotState == 1) {
            return true;
        } else {
            return false;
        }
    }
}
export default PopupGuide;