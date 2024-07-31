import PacketHeaderAnalyze from "./PacketHeaderAnalyze";

export default class OutPacket {
    static INDEX_SIZE_PACKET = 1;
    _controllerId: number = 1;
    _cmdId: number = 0;
    _data: Array<number> = new Array<number>();
    _capacity: Array<number> = new Array<number>();
    _length: number = 0;
    _pos: number = 0;
    _isPackedHeader: boolean = false;

    setCmdId(cmdId: number) {
        this._cmdId = cmdId
    }

    setControllerId(controllerId: number) {
        this._controllerId = controllerId;
    }

    initData(data) {
        this._data = [data];
        this._capacity = data
    }

    reset() {
        this._length = this._pos = 0;
        this._isPackedHeader = false;
    }

    packHeader() {
        if (!this._isPackedHeader) {
            this._isPackedHeader = !0;
            var a = PacketHeaderAnalyze.genHeader(!1, !1);
            this.putByte(a);
            this.putUnsignedShort(this._length);
            this.putByte(this._controllerId);
            this.putShort(this._cmdId)
        }
    }

    putByte(a) {
        this._data[this._pos++] = a;
        this._length = this._pos;
        return this
    }

    putByteArray(a) {
        this.putShort(a.length);
        this.putBytes(a);
        return this
    }

    putBytes(a) {
        for (var b = 0; b < a.length; b++) this.putByte(a[b]);
        return this
    }

    putShort(a) {
        this.putByte(a >> 8 & 255);
        this.putByte(a >> 0 & 255);
        return this
    }

    putUnsignedShort(a) {
        this.putByte(a >> 8);
        this.putByte(a >> 0);
        return this
    }

    putInt(a) {
        this.putByte(a >> 24 & 255);
        this.putByte(a >> 16 & 255);
        this.putByte(a >> 8 & 255);
        this.putByte(a >> 0 & 255);
        return this
    }

    putLong(a) {
        0 > a && console.log("Dev");
        for (var b = [], c = 0; 8 > c; c++) b[c] = a & 255, a = Math.floor(a / 256);
        for (a = 7; 0 <= a; a--) this.putByte(b[a])
    }

    putDouble(a) {
        this.putByte(a >> 24 & 255);
        this.putByte(a >> 16 & 255);
        this.putByte(a >> 8 & 255);
        this.putByte(a >> 0 & 255);
        this.putByte(a >> 24 & 255);
        this.putByte(a >> 16 & 255);
        this.putByte(a >> 8 & 255);
        this.putByte(a >> 0 & 255);
        return this
    }
    putString(a) {
        this.putByteArray(this._stringConvertToByteArray(a));
        return this
    }

    updateUnsignedShortAtPos(a, b) {
        this._data[b] = a >> 8;
        this._data[b + 1] = a >> 0
    }

    updateSize() {
        this.updateUnsignedShortAtPos(this._length - 3, OutPacket.INDEX_SIZE_PACKET);
    }

    getData() {
        return this._data.slice(0, this._length)
    }

    _stringConvertToByteArray(a) {
        if (null == a) return null;
        for (var b = new Uint8Array(a.length), c = 0; c < a.length; c++) b[c] = a.charCodeAt(c);
        return b
    }

    clean() {

    }
}