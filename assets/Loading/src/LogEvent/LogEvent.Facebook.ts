import Configs from "../Configs";
import UtilsNative from "../UtilsNative";
import LogEvent from "./LogEvent";

export default class FacebookEvent {
    private static instance: FacebookEvent = null;
    public static getInstance(): FacebookEvent {
        if (this.instance == null) {
            this.instance = new FacebookEvent();
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

    facebookCustomLogsEvent(eventName, params, valueToSum = null) {
        return;
        if (params === undefined) params = [];
        if (valueToSum === undefined || valueToSum == null) valueToSum = 0;

        var dataEvent: any = {};
        dataEvent.eventName = eventName;
        dataEvent.valueToSum = valueToSum;
        dataEvent.params = params;
        if (this.isUseSDK()) {
            // if (cc.sys.os == cc.sys.OS_ANDROID) {
            //     UtilsNative.sendLogEvent(dataEvent);
            // } else if (cc.sys.os == cc.sys.OS_IOS) {
            //     jsb.reflection.callStaticMethod("AppController", "facebookCustomLogsEvent:", dataEvent);
            // }
            sdkbox.PluginFacebook.logEvent(eventName, valueToSum);
        }

    }
    createEventParam(key, value, type = null) {
        if (type === undefined || type == null) type = Configs.ParamType.STRING;
        return {
            key: key,
            value: value,
            typeValue: type
        };
    }
    sendEventSdt(sdt) {
        var params = [];
        params.push(this.createEventParam("phone", sdt));
        this.facebookCustomLogsEvent(Configs.EventFacebook.EVENT_NAME_ADDED_PAYMENT_INFO, params);
    }
    sendEventSigupSuccess(method: string) {
        //method=facebook/normal;
        var params = [];
        params.push(this.createEventParam(Configs.ParamsFacebook.EVENT_PARAM_REGISTRATION_METHOD, method));
        this.facebookCustomLogsEvent(Configs.EventFacebook.EVENT_NAME_COMPLETED_REGISTRATION, params);
    }
    sendEventLogin(method: string) {
        var params = [];
        params.push(this.createEventParam(Configs.ParamsFacebook.EVENT_PARAM_LOGIN_METHOD, method, Configs.ParamType.STRING));
        this.facebookCustomLogsEvent(Configs.EventFacebook.EVENT_NAME_COMPLETED_LOGIN, params);
    }
    sendEventOpenApp() {
        //doan nay can check lai .trong doc ko co gui params gi.
        //  var params = [];
        //  params.push(this.createEventParam(Configs.ParamsFacebook.EVENT_NAME_ACTIVATED_APP,))
        // params[Configs.ParamsFacebook.EVENT_PARAM_LOGIN_METHOD] = "1";
        // this.facebookCustomLogsEvent(Configs.EventFacebook.EVENT_NAME_ACTIVATED_APP, params);
    }
    sendEventPurchase(currency, value) {//nạp tiền thanh cong
        var params = [];
        params.push(this.createEventParam(Configs.ParamsFacebook.EVENT_PARAM_CURRENCY, currency, Configs.ParamType.STRING));
        this.facebookCustomLogsEvent(Configs.EventFacebook.EVENT_NAME_PURCHASED, params, value);
    }
    sendEventMoneyChange(gameName: string, currency: string, value: Number) {
        var params = [];
        params.push(this.createEventParam(Configs.ParamsFacebook.EVENT_PARAM_CONTENT, gameName, Configs.ParamType.STRING));
        params.push(this.createEventParam(Configs.ParamsFacebook.EVENT_PARAM_CURRENCY, currency, Configs.ParamType.STRING));
        this.facebookCustomLogsEvent(Configs.EventFacebook.EVENT_NAME_SPENT_CREDITS, params, value);
    }
    sendEventCashout(currencyName, value) { //Đổi thưởng thành công.
        var params = [];
        params.push(this.createEventParam(Configs.ParamsFacebook.EVENT_PARAM_CURRENCY, currencyName, Configs.ParamType.STRING));
        this.facebookCustomLogsEvent(Configs.EventFacebook.EVENT_NAME_EARN_VIRTUAL_CURRENCY, params, value);
    }
    sendEventClickShop(currencyName, value) {
        var params = [];
        params.push(this.createEventParam(Configs.ParamsFacebook.EVENT_PARAM_CURRENCY, currencyName, Configs.ParamType.STRING));
        this.facebookCustomLogsEvent(Configs.EventFacebook.EVENT_NAME_INITIATED_CHECKOUT, params, value);
    }
}
