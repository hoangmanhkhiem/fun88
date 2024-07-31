import Dialog from "./Dialog";
const { ccclass, property } = cc._decorator;

class AlertDialogQueueItem {
    msg: string;
    doneTitle: string;
    onDismissed: () => void;

    constructor(msg: string, doneTitle: string, onDismissed: () => void) {
        this.msg = msg;
        this.doneTitle = doneTitle;
        this.onDismissed = onDismissed;
    }
}

@ccclass
export default class AlertDialog extends Dialog {

    @property(cc.Label)
    lblMessage: cc.Label = null;
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(cc.Label)
    lblDone: cc.Label = null;

    onDismissed: any = null;

    queue: Array<AlertDialogQueueItem> = new Array<AlertDialogQueueItem>();

    showMsg(msg: string) {
        this.show4(msg, null, null, false);
    }

    showMsgWithOnDismissed(msg: string, onDismissed: () => void, canClose = true) {
        this.show4(msg, null, onDismissed);
        this.btnClose.node.active = canClose;
    }

    show3(msg: string, onDismissed: () => void, addQueue: boolean = false) {
        this.show4(msg, null, onDismissed, addQueue);
    }

    show4(msg: string, doneTitle: string, onDismissed: () => void, addQueue: boolean = false, forceAddQueue: boolean = true): void {
        if (addQueue) {
            this.queue.push(new AlertDialogQueueItem(msg, doneTitle, onDismissed));
            if (this.queue.length == 1) {
                this.lblDone.string = !doneTitle ? "XÁC NHẬN" : doneTitle;
                this.onDismissed = onDismissed;
                this.lblMessage.string = msg;
                super.show();
            }
        } else {
            if (this.queue.length > 0 && forceAddQueue) {
                this.queue.push(new AlertDialogQueueItem(msg, doneTitle, onDismissed));
            } else {
                this.lblDone.string = !doneTitle ? "XÁC NHẬN" : doneTitle;
                this.onDismissed = onDismissed;
                this.lblMessage.string = msg;
                super.show()
            }
        }
    }

    _onShowed() {
        super._onShowed();
    }

    _onDismissed() {
        super._onDismissed();
        if (typeof this.onDismissed === "function") this.onDismissed();
        if (this.queue.length > 0) {
            this.queue.splice(0, 1);
            if (this.queue.length > 0) {
                this.show4(this.queue[0].msg, this.queue[0].doneTitle, this.queue[0].onDismissed, false, false);
            }
        }
    }

    dismiss() {
        if (!this.isAnimated) return;
        super.dismiss();
    }
}
