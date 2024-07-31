export default class InPacket {
    private _pos = 0;
    private _data: Uint8Array = new Uint8Array(0);
    private _length = 0;
    private _controllerId = 0;
    private _cmdId = 0;
    private _error = 0;

    constructor(data: Uint8Array) {
        this.init(data);
    }

    init(data: Uint8Array) {
        this._pos = 0;
        this._data = data;
        this._length = data.length;
        this._controllerId = this.parseByte();
        this._cmdId = this.getShort();
        this._error = this.parseByte()
    }
    getCmdId() {
        return this._cmdId
    }

    getControllerId() {
        return this._controllerId
    }

    getError() {
        return this._error
    }

    parseByte() {
        // cc.error(this._pos < this._length, "parseByte:IndexOutOfBoundsException");
        return this._data[this._pos++]
    }

    getByte() {
        return this.parseByte()
    }

    getBool() {
        // cc.error(this._pos < this._length, "getByte:IndexOutOfBoundsException ", this._pos, ",", this._length);
        return 0 < this._data[this._pos++]
    }

    getBytes(a) {
        // cc.error(this._pos + a <= this._length, "getBytes:IndexOutOfBoundsException");
        for (var b = [], c = 0; c < a; c++) b.push(this.parseByte());
        return b
    }

    getShort() {
        // cc.error(this._pos + 2 <= this._length, "getShort:IndexOutOfBoundsException");
        if (this._pos + 2 > this._length) return 0;
        var a = (this.parseByte() << 8) + (this.parseByte() & 255);
        return 32767 < a ? a - 65536 :
            a
    }

    getUnsignedShort() {
        // cc.error(this._pos + 2 <= this._length, "getUnsignedShort:IndexOutOfBoundsException");
        var a = (this.parseByte() & 255) << 8,
            b = (this.parseByte() & 255) << 0;
        return a + b
    }

    getInt() {
        // cc.error(this._pos + 4 <= this._length, "getInt:IndexOutOfBoundsException");
        return ((this.parseByte() & 255) << 24) + ((this.parseByte() & 255) << 16) + ((this.parseByte() & 255) << 8) + ((this.parseByte() & 255) << 0)
    }

    byteArrayToLong(a: Array<number>) {
        var b = true,
            c = 0,
            d = 0;
        255 == a[0] && (b = false);
        if (b)
            for (d = 0; 8 > d; d++) c = 256 * c + a[d];
        else {
            for (d = c = 1; 7 >= d; d++) c = 256 * c - a[d];
            c = -c;
        }
        return c;
    }

    getLong() {
        // cc.error(this._pos + 8 <= this._length, "getLong:IndexOutOfBoundsException");
        for (var a = [], b = 0; 8 > b; b++) a[b] = this.parseByte();
        return this.byteArrayToLong(a);
    }

    getDouble() {
        // cc.error(this._pos + 8 <= this._length, "getDouble:IndexOutOfBoundsException");
        for (var a = new ArrayBuffer(8), b = new Uint8Array(a), c = 7; 0 <= c; c--) b[7 - c] = this.parseByte();
        return (new DataView(a)).getFloat64(0)
    }

    getCharArray() {
        var a = this.getUnsignedShort();
        return this.getBytes(a)
    }

    getString() {
        var a = this.getCharArray();
        var b = new Uint8Array(a.length);
        for (var c = 0; c < a.length; c++) {
            b[c] = parseInt(a[c], 10);
        }
        var s: string = String.fromCharCode.apply(null, b);
        return decodeURIComponent(escape(s));
    }

    clean() {

    }
}