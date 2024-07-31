/** 
 * 日期组件
 */

cc.Class({
    extends: cc.Component,

    properties: {
        lbYearMonth: cc.Label,
        ndDays: cc.Node,
        pfbDay: cc.Prefab,
        displayDate: cc.Label,
        contentShow: cc.Node,
        ChangeEvent:{
            default:[],
            type:cc.Component.EventHandler
        }
    },

    onLoad () {
        this.initData();
        this.updateDate();
    },

    initData() {
        // this.date = this.date ? this.date : Date.now();
        this.date = new Date(Date.now());
        
        this.year = this.date.getFullYear();
        this.month = this.date.getMonth() + 1;
        this.day = this.date.getDate();
        this.pfgListDay = [];
        for (let i = 0; i < 31; ++i) {
            let node = cc.instantiate(this.pfbDay);
            node.parent = this.ndDays;
            this.pfgListDay.push(node);
        }
    },

    // 设置显示的日志，默认为当前日期
    setDate(year, month, day) {
        this.date = new Date(year, month - 1, day);
        this.year = this.date.getFullYear();
        this.month = this.date.getMonth() + 1;
        this.day = this.date.getDate();

        
        this.updateDate();
        
    },

    updateDate () {
        // this.lbYearMonth.string = cc.js.formatStr("%s年%s月", this.year, this.month + 1);
        this.lbYearMonth.string = cc.js.formatStr("%s-%s", this.year, this.month + 1);

        let date = new Date(this.year, this.month - 1, 0);
        let totalDays = date.getDate();
        let fromWeek = date.getDay();
        for (let i = 0; i < this.pfgListDay.length; ++i) {
            let node = this.pfgListDay[i];
            if (i < totalDays) {
                node.active = true;
                let index = fromWeek + i;
                let row = Math.floor(index / 7);
                let col = index % 7;
                let x = -(this.ndDays.width - node.width) * 0.5 + col * node.width;
                let y = (this.ndDays.height - node.height) * 0.5 - row * node.height;
                node.setPosition(x, y);
                let script = node.getComponent("UIItemDay");
                script.setDay(i, i + 1, this.day === i + 1, (selIndex, selDay)=>{
                    this.day = selDay;
                    this.updateDate();
                });
            } else {
                node.active = false;
            }
        }
        var month = ("0" + this.month).slice(-2);
        var day = ("0" + this.day).slice(-2);
        this.displayDate.string = day +"-" +month +"-"+this.year;
        this.CurrentDayChoose = this.year+"/"+ month+"/" + day;
        this.onClickClose();
    },

    onClickLeft () {
        if (this.month > 0) {
            this.month -= 1;
        } else {
            this.month = 11;
            this.year -= 1;
        }
        this.date.setFullYear(this.year);
        this.date.setMonth(this.month);
        this.updateDate();
    },

    onClickRight () {
        if (this.month < 11) {
            this.month += 1;
        } else {
            this.month = 0;
            this.year += 1;
        }
        this.date.setFullYear(this.year);
        this.date.setMonth(this.month);
        this.updateDate();
    },

    // 设置选中日期之后的回调
    setPickDateCallback(cb) {
        this.cb = cb;
    },

    onClickClose () {
        if (this.cb) {
            this.cb(this.year, this.month, this.day);
        }
        if(this.ChangeEvent != null)
        {
            this.ChangeEvent.forEach(x =>{
                x.emit();
            });
           
        }
        this.contentShow.active = false;
    },
    onClickShow()
    {
        this.contentShow.active = true;
    }
});
