import ItemHu from "./Lobby.ItemTopHu";
import { Tophudata } from './Lobby.ItemTopHu';
import HandlerButton from "./Script/common/HandlerButton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Button)
    btn100: cc.Button = null;
    @property(cc.Button)
    btn1000: cc.Button = null;
    @property(cc.Button)
    btn10000: cc.Button = null;
    @property(cc.Node)
    itemTemplate: cc.Node = null;
    @property(cc.Node)
    animTopHu: cc.Node = null;
    @property(cc.Node)
    nodeHu: cc.Node = null;
    listItem: ItemHu[] = [];

    index: number = 0;
    listData100: Array<Tophudata> = new Array<Tophudata>();
    listData1000: Array<Tophudata> = new Array<Tophudata>();
    listData10000: Array<Tophudata> = new Array<Tophudata>();
    isMove = false;
    distance : number = 0;
    onLoad() {
        this.btn100.node.on('click', this.onBtn100Clicked, this);
        this.btn1000.node.on('click', this.onBtn1000Clicked, this);
        this.btn10000.node.on('click', this.onBtn10000Clicked, this);
        this.index = 2;
        this.animTopHu.on(cc.Node.EventType.TOUCH_START, (touch) => {
            this.isMove = false;
            this.distance = 0;
           
        });
        this.animTopHu.on(cc.Node.EventType.TOUCH_MOVE, (touch) => {
            this.animTopHu.setPosition(this.animTopHu.getPosition().add(touch.getDelta()));
            this.distance += Math.abs(touch.getDelta().x) + Math.abs(touch.getDelta().y);
            if(this.distance >= 70){
                this.isMove = true;
            }
        });
        this.animTopHu.on(cc.Node.EventType.TOUCH_END, (touch) => {
            if (!this.isMove) {
                this.onClickTopHu();
            }
            this.isMove = false;
        });
    }

    onBtn100Clicked(event) {
        this.btn100.node.getComponent(HandlerButton).SetActive(true);
        this.btn1000.node.getComponent(HandlerButton).SetActive(false);
        this.btn10000.node.getComponent(HandlerButton).SetActive(false);
        this.Onshow(0);
    }
    onBtn1000Clicked(event) {
        this.btn100.node.getComponent(HandlerButton).SetActive(false);
        this.btn1000.node.getComponent(HandlerButton).SetActive(true);
        this.btn10000.node.getComponent(HandlerButton).SetActive(false);
        this.Onshow(1);
    }
    onBtn10000Clicked(event) {

        this.btn100.node.getComponent(HandlerButton).SetActive(false);
        this.btn1000.node.getComponent(HandlerButton).SetActive(false);
        this.btn10000.node.getComponent(HandlerButton).SetActive(true);
        this.Onshow(2);
    }

    start() {
        this.btn100.node.getComponent(HandlerButton).SetActive(false);
        this.btn1000.node.getComponent(HandlerButton).SetActive(false);
        this.btn10000.node.getComponent(HandlerButton).SetActive(true);
    }

    public ShowData(listData100: Array<Tophudata>, listData1000: Array<Tophudata>, listData10000: Array<Tophudata>) {
        //  //Utils.Log("ShowData:"+listData100);
        this.listData100 = listData100;
        this.listData1000 = listData1000;
        this.listData10000 = listData10000;
        this.listData100.sort((a, b) => a.value > b.value ? -1 : 1);
        this.listData1000.sort((a, b) => a.value > b.value ? -1 : 1);
        this.listData10000.sort((a, b) => a.value > b.value ? -1 : 1);
        this.Onshow(this.index)
    }
    private getItem(): cc.Node {
        let item = null;
        for (let i = 0; i < this.itemTemplate.parent.childrenCount; i++) {
            let node = this.itemTemplate.parent.children[i];
            if (node != this.itemTemplate && !node.active) {
                item = node;
                item.active = true;
                break;
            }
        }
        if (item == null) {
            item = cc.instantiate(this.itemTemplate);
            item.parent = this.itemTemplate.parent;
        }
        item.active = true;
        return item;
    }
    private Onshow(index: number) {
        var listdata = new Array<Tophudata>();
        if (index == 0) {
            listdata = this.listData100;
        }
        else if (index == 1) {
            listdata = this.listData1000;
        }
        else {
            listdata = this.listData10000;
        }
        // // init list
        if (this.listItem.length <= 0) {
            for (var i = 0; i < listdata.length; i++) {
                let item = this.getItem();
                let itemtophu = item.getComponent(ItemHu);
                this.listItem.push(itemtophu);
            }
        }
        for (var i = 0; i < listdata.length; i++) {
            this.listItem[i].SetData(listdata[i]);
        }
        this.index = index;
    }
    onClickTopHu() {
        this.nodeHu.active = !this.nodeHu.active;
    }

}
