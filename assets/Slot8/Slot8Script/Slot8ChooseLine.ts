import Dialog from "../../Lobby/LobbyScript/Script/common/Dialog";
import Tween from "../../Lobby/LobbyScript/Script/common/Tween";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Slot8ChooseLine extends Dialog {

    @property(cc.Node)
    nodeBox:cc.Node = null;
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(cc.Node)
    lineParent: cc.Node = null;

    listToggle: cc.Toggle[] = [];
    private readonly SELECTED = "selected";

    onSelectedChanged: (lines: Array<number>) => void = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        for(let i = 0; i < this.lineParent.childrenCount; i++) {
            let node = this.lineParent.children[i];
            let toggle = node.getComponent(cc.Toggle);
            this.listToggle.push(toggle);
            node[this.SELECTED] = true;
            node.on('click', () => {
                node[this.SELECTED] = !node[this.SELECTED];
                // node.opacity = node[this.SELECTED] ? 255 : 80;
                // toggle.isChecked = node[this.SELECTED];
                if(this.onSelectedChanged != null) this.onSelectedChanged(this.getLineSelected());                
            });
        }
    }

   

    getLineSelected() {
        let lines = new Array<number>();
        for(let i = 0; i < this.listToggle.length; i++) {
            let node = this.listToggle[i].node;
            if (typeof node[this.SELECTED] == "undefined" || node[this.SELECTED]) {
                lines.push(i + 1);
            }
        }
       
        this.btnClose.interactable = lines.length > 0;
        return lines;
    }

    selectAll() {
        for(let i = 0; i < this.listToggle.length; i++) {   
            this.listToggle[i].node[this.SELECTED] = true;
            // this.listToggle[i].node.opacity =  this.listToggle[i].node[this.SELECTED] ? 255 : 80;
            this.listToggle[i].isChecked = true;        
        }
        if(this.onSelectedChanged != null) this.onSelectedChanged(this.getLineSelected());
    }

    deSelectAll() {
        for(let i = 0; i < this.listToggle.length; i++) {   
            this.listToggle[i].node[this.SELECTED] = false;
            // this.listToggle[i].node.opacity =  this.listToggle[i].node[this.SELECTED] ? 255 : 80;
            this.listToggle[i].isChecked = false;        
        }
        if(this.onSelectedChanged != null) this.onSelectedChanged(this.getLineSelected());
    }

    selectEven() {
        for(let i = 0; i < this.listToggle.length; i++) {    
            this.listToggle[i].node[this.SELECTED] = i % 2 != 0;
            // this.listToggle[i].node.opacity = this.listToggle[i].node[this.SELECTED] ? 255 : 80;        
            this.listToggle[i].isChecked = i % 2 !== 0;           
        }
        if(this.onSelectedChanged != null) this.onSelectedChanged(this.getLineSelected());
    }

    selectOdd() {
        for(let i = 0; i < this.listToggle.length; i++) {    
            this.listToggle[i].node[this.SELECTED] = i % 2 == 0;
            // this.listToggle[i].node.opacity = this.listToggle[i].node[this.SELECTED] ? 255 : 80;        
            this.listToggle[i].isChecked = i % 2 == 0;           
        }
        if(this.onSelectedChanged != null) this.onSelectedChanged(this.getLineSelected());
    }

    showPopup(arrLineSelected) {
        super.show();
        // Tween.showPopup(this.nodeBox,this.nodeBox.parent);

        for(let i = 0; i < this.listToggle.length; i++) {
            let node = this.listToggle[i];
            this.listToggle[i].isChecked = this.listToggle[i].node[this.SELECTED];    
            // this.listToggle[i].node.opacity = this.listToggle[i].node[this.SELECTED] ? 255 : 80;        
        }

    }

    hide() {
       
        Tween.hidePopup(this.nodeBox,this.nodeBox.parent,false);
    }



    // update (dt) {}
}
