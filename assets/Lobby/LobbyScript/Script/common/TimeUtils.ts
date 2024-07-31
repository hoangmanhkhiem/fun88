const { ccclass, property } = cc._decorator;

@ccclass
export default class TimeUtils {
    public static currentTimeMillis(): number {
        return Date.now();
    }

    public static ping: number = 0;
    public static minPing: number = -1;
    public static minDistanceTime: number = 0;

    public static serverTime()
    {
        return Math.ceil(this.currentTimeMillis() - this.minDistanceTime + this.minPing/2);
    }
}
