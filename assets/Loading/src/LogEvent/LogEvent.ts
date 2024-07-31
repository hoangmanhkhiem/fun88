import Configs from "../Configs";
import FacebookEvent from "./LogEvent.Facebook";
import FirebaseEvent from "./LogEvent.FireBase";
export default class LogEvent {
    private static instance: LogEvent = null;
    public static getInstance(): LogEvent {
        if (this.instance == null) {
            this.instance = new LogEvent();
        }
        return this.instance;
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
        FacebookEvent.getInstance().sendEventSdt(sdt);
        FirebaseEvent.getInstance().sendEventSdt(sdt);
    }
    sendEventSigupSuccess(method: string,) {
        FacebookEvent.getInstance().sendEventSigupSuccess(method);
        FirebaseEvent.getInstance().sendEventSigupSuccess(method);
    }
    sendEventLogin(method: string) {
        FacebookEvent.getInstance().sendEventLogin(method);
        FirebaseEvent.getInstance().sendEventLogin(method);
    }
    sendEventOpenApp() {
        FirebaseEvent.getInstance().sendEventOpenApp();
        // FacebookEvent.getInstance().sendEventLogin(method);
    }
    sendEventPurchase(currency: string, value: number) {
        FacebookEvent.getInstance().sendEventPurchase(currency, value);
        FirebaseEvent.getInstance().sendEventPurchase(currency, value);
    }
    sendEventMoneyChange(gameName: string, currency: string, value: number) {
        FacebookEvent.getInstance().sendEventMoneyChange(gameName, currency, value);
        FirebaseEvent.getInstance().sendEventMoneyChange(gameName, currency, value);
    }
    sendEventCashout(currencyName: string, value: number) {
        FacebookEvent.getInstance().sendEventCashout(currencyName, value);
        FirebaseEvent.getInstance().sendEventCashout(currencyName, value);
    }
    sendEventClickShop(currencyName: string, value: number) {
        FacebookEvent.getInstance().sendEventClickShop(currencyName, value);
        FirebaseEvent.getInstance().sendEventClickShop(currencyName, value);
    }
    // update (dt) {}
}
