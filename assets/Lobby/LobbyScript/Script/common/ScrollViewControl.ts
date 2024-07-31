
const { ccclass, property } = cc._decorator;
var DIRECTION = cc.Enum({
    HORIZONTAL: 1,
    VERTICAL: 2,
});
@ccclass

export default class ScrollViewControl extends cc.Component {
    @property({ type: DIRECTION })
    direction = DIRECTION.VERTICAL;
    @property(cc.Prefab)
    itemTemplate: cc.Prefab = null

    @property(cc.Node)
    itemNodeTemplate: cc.Node = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null
    @property
    itemHeight = 80;
    @property
    itemWidth = 80;
    @property
    spacing = 5 // space between each item

    totalCount = 0 // how many items we need for the whole list
    @property
    initCount = 20;
    @property
    bufferZone = 500 // when item is away from bufferZone, we relocate it

    @property
    isLazyInit: boolean = false;

    items = []
    updateTimer = 0
    updateInterval = 0.05
    lastContentPosY = 0
    lastContentPosX = 0
    initHeight = 0;

    listItemRemove = []
    idKeys = []

    updateCallback = null
    setDataCb = null;
    listItemData = []


    // use this for initialization
    onLoad() {
        if (this.direction == DIRECTION.HORIZONTAL) {
            // this.initCount = Math.floor((this.scrollView.node.width + this.scrollView.node.width / 2) * (cc.winSize.width / 1280) / this.itemWidth);
            this.initCount = Math.floor(this.initCount * (cc.winSize.width / 1280));

        }
        this.initialize();
        if (this.itemNodeTemplate) {
            this.itemHeight = this.itemNodeTemplate.height;
            this.itemWidth = this.itemNodeTemplate.width;
        }
    }
    start() {
       
    }

    setDataList(_updateCallback, _listItemData) {
        this.setDataCb = () => {
            this.setDataList(_updateCallback, _listItemData);
        }
        this.updateCallback = _updateCallback
        this.listItemData = _listItemData
        this.totalCount = this.listItemData.length;
        if (this.direction == DIRECTION.VERTICAL) {
            this.scrollView.content.height = this.totalCount * (this.itemHeight + this.spacing) + this.spacing; // get total content height
        } else {
            this.scrollView.content.width = this.totalCount * (this.itemWidth + this.spacing) + this.spacing; // get total content height
        }

        if (this.totalCount === 0 || this.totalCount <= this.items.length) {
            for (let i = this.totalCount; i < this.items.length; i++) {
                this.listItemRemove.push(this.items[i])
                this.items[i].parent = null
                this.items.splice(i, 1);
                i--;
            }
        } else {
            for (let i = 0; i < this.listItemRemove.length; i++) {

                this.items.push(this.listItemRemove[i])
                this.listItemRemove[i].parent = this.scrollView.content;
                this.listItemRemove.splice(i, 1);
                i--;
            }
        }
        if (this.direction == DIRECTION.VERTICAL) {
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].setPosition(0, -this.items[i].height * (0.5 + i) - this.spacing * (i + 1));
                this.items[i].itemID = i;
                if (this.updateCallback !== null && i < this.listItemData.length) {
                    this.listItemData[i]['index'] = i;
                    this.updateCallback(this.items[i], this.listItemData[i])
                }
            }
        } else {
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].setPosition(this.items[i].width * (0.5 + i) + this.spacing * (i + 1), 0);
                this.items[i].itemID = i;
                if (this.updateCallback !== null && this.listItemData[i] != null) {
                    this.updateCallback(this.items[i], this.listItemData[i])
                }
            }
        }

    }
    updateDataList(_listItemData) {
        this.listItemData = _listItemData;
        this.totalCount = this.listItemData.length;
        if (this.direction == DIRECTION.VERTICAL) {
            this.scrollView.content.height = this.totalCount * (this.itemHeight + this.spacing) + this.spacing; // get total content height
        } else {
            this.scrollView.content.width = this.totalCount * (this.itemWidth + this.spacing) + this.spacing; // get total content height
        }
    }
    initialize() {
        if (this.direction == DIRECTION.VERTICAL) {
            this.scrollView.content.height = this.totalCount * (this.itemHeight + this.spacing) + this.spacing; // get total content height
        } else {
            this.scrollView.content.width = this.totalCount * (this.itemWidth + this.spacing) + this.spacing; // get total content height
        }

        for (let i = 0; i < this.initCount; ++i) { // spawn items, we only need to do this once
            let item;
            if (cc.isValid(this.itemTemplate)) {
                item = cc.instantiate(this.itemTemplate);
                this.scrollView.content.addChild(item);
            } else {
                if (i == 0) {
                    item = this.itemNodeTemplate;
                } else {
                    if (cc.isValid(this.scrollView.content.children[i])) {
                        item = this.scrollView.content.children[i];
                    } else {
                        item = cc.instantiate(this.itemNodeTemplate);
                        this.scrollView.content.addChild(item);
                    }
                }
            }
            if (this.direction == DIRECTION.VERTICAL) {
                item.setPosition(0, -item.height * (0.5 + i) - this.spacing * (i + 1));
            } else {
                item.setPosition(item.width * (0.5 + i) + this.spacing * (i + 1), 0);
            }
            item['itemID'] = i;
            this.items.push(item);
        }
        if (this.listItemData.length > 0) {
            this.setDataCb();
        }
    }

    getPositionInView(item) { // get item position in scrollview's node space
        let worldPos = item.parent.convertToWorldSpaceAR(item.getPosition());
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    }
    update(dt) {
        if (this.listItemData.length <= this.initCount) return;

        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) return; // we don't need to do the math every frame
        this.updateTimer = 0;
        let items = this.items;
        let buffer = this.bufferZone;
        let isDown = false;
        let offset;
        if (this.direction == DIRECTION.VERTICAL) {
            isDown = this.scrollView.content.y < this.lastContentPosY; // scrolling direction
            offset = (this.itemHeight + this.spacing) * items.length;

        } else {
            isDown = this.scrollView.content.x > this.lastContentPosX; // scrolling direction
            offset = (this.itemWidth + this.spacing) * items.length;
        }
        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]);
            if (isDown) {
                if (this.direction == DIRECTION.VERTICAL) {
                    if (viewPos.y < -buffer && items[i].y + offset < 0) {
                        items[i].y = items[i].y + offset;
                        let itemId = items[i].itemID - items.length; // update item id
                        items[i].itemID = itemId;
                        if (this.updateCallback !== null) {
                            this.updateCallback(items[i], this.listItemData[itemId])
                        }
                    }
                } else {
                    if (viewPos.x > buffer && items[i].x - offset > 0) {
                        items[i].x = items[i].x - offset;
                        let itemId = items[i].itemID - items.length; // update item id
                        items[i].itemID = itemId;
                        if (this.updateCallback !== null)
                            this.updateCallback(items[i], this.listItemData[itemId])
                    }
                }
                // if away from buffer zone and not reaching top of content

            } else {
                // if away from buffer zone and not reaching bottom of content
                if (this.direction === DIRECTION.VERTICAL) {
                    if (viewPos.y > buffer && items[i].y - offset > -this.scrollView.content.height) {
                        items[i].y = items[i].y - offset;
                        let itemId = items[i].itemID + items.length;
                        items[i].itemID = itemId;
                        if (this.updateCallback !== null) {
                            this.updateCallback(items[i], this.listItemData[itemId])
                        }

                    }
                } else {
                    if (viewPos.x < -buffer && items[i].x + offset < this.scrollView.content.width) {
                        items[i].x = items[i].x + offset;
                        let itemId = items[i].itemID + items.length;
                        items[i].itemID = itemId;
                        if (this.updateCallback !== null)
                            this.updateCallback(items[i], this.listItemData[itemId])
                    }
                }

            }
        }
        // update lastContentPosY
        this.lastContentPosY = this.scrollView.content.y;
        this.lastContentPosX = this.scrollView.content.x;
    }
    setStateItem(state) {
        this.scrollView.content.children.forEach((item) => {
            item.active = state;
        })
    }
}
