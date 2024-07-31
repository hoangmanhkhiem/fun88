import Configs from "../Configs";
export default class FirebaseEvent {
    private static instance: FirebaseEvent = null;
    public static getInstance(): FirebaseEvent {
        if (this.instance == null) {
            this.instance = new FirebaseEvent();
        }
        return this.instance;
    }
    isUseSDK() {
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS) {
                return true;
            }
        }
        return false;
    };
    onClickSendLogEvent() {
        return;
        const evt = {}
        evt[sdkbox.firebase.Analytics.Param.kFIRParameterItemID] = 'id123456';
        evt[sdkbox.firebase.Analytics.Param.kFIRParameterItemName] = 'name123456';
        evt[sdkbox.firebase.Analytics.Param.kFIRParameterItemCategory] = 'category123456';
        evt[sdkbox.firebase.Analytics.Param.kFIRParameterPrice] = '123.4';
        sdkbox.firebase.Analytics.logEvent(sdkbox.firebase.Analytics.Event.kFIREventViewItem, evt);
        // log custom event
        // evt['customKey'] = 'custom value';
        // sdkbox.firebase.Analytics.logEvent("customEvent", evt);
        //  cc.log('Onclick log event:', JSON.stringify(evt));
    }
    firebaseSendLogEvent(eventName, params) {
        return;
        if (!this.isUseSDK())
            return;
        sdkbox.firebase.Analytics.logEvent(eventName, params);
        //  cc.log("firebaseSendLogEvent:EventName=" + eventName + " Params:", JSON.stringify(params));
    }
    sendEventSdt(sdt) {
        var params: any = {};
        params.phone = sdt;
        this.firebaseSendLogEvent(Configs.EventFirebase.ADD_PAYMENT_INFO, params);
    }
    sendEventSigupSuccess(method: string) {
        //method=facebook/normal;
        var params: any = {};
        params[Configs.ParamsFireBase.METHOD] = method;
        this.firebaseSendLogEvent(Configs.EventFirebase.SIGN_UP, params);
    }
    sendEventLogin(method: string) {
        var params: any = {};
        params[Configs.ParamsFireBase.METHOD] = method;
        this.firebaseSendLogEvent(Configs.EventFirebase.LOGIN, params);
    }
    sendEventOpenApp() {
        var params: any = {};
        params[Configs.ParamsFireBase.CONTENT] = "1";
        this.firebaseSendLogEvent(Configs.EventFirebase.APP_OPEN, params);
    }
    sendEventPurchase(currency: string, value: number) {
        var params: any = {};
        params[Configs.ParamsFireBase.CURRENCY] = currency;
        params[Configs.ParamsFireBase.VALUE] = value;
        this.firebaseSendLogEvent(Configs.EventFirebase.ECOMMERCE_PURCHASE, params);
    }
    sendEventMoneyChange(gameName: string, currency: string, value: number) {
        var params: any = {};
        params[Configs.ParamsFireBase.ITEM_NAME] = gameName;
        params[Configs.ParamsFireBase.VIRTUAL_CURRENCY_NAME] = currency;
        params[Configs.ParamsFireBase.VALUE] = value;
        this.firebaseSendLogEvent(Configs.EventFirebase.SPEND_VIRTUAL_CURRENCY, params);
    }
    sendEventCashout(currencyName: string, value: number) {
        var params: any = {};
        params[Configs.ParamsFireBase.VIRTUAL_CURRENCY_NAME] = currencyName;
        params[Configs.ParamsFireBase.VALUE] = value;
        this.firebaseSendLogEvent(Configs.EventFirebase.EARN_VIRTUAL_CURRENCY, params);
    }
    sendEventClickShop(currencyName: string, value: number) {
        var params: any = {};
        params[Configs.ParamsFireBase.CURRENCY] = currencyName;
        params[Configs.ParamsFireBase.VALUE] = value;
        this.firebaseSendLogEvent(Configs.EventFirebase.BEGIN_CHECKOUT, params);
    }
    // update (dt) {}
}
