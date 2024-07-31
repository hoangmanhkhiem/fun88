namespace Network {
    export class PacketHeaderAnalyze {
        static BIT_IS_BINARY_INDEX = 7;
        static BIT_IS_ENCRYPT_INDEX = 6;
        static BIT_IS_COMPRESS_INDEX = 5;
        static BIT_IS_BLUE_BOXED_INDEX = 4;
        static BIT_IS_BIG_SIZE_INDEX = 3;
        static BYTE_PACKET_SIZE_INDEX = 1;
        static BIG_HEADER_SIZE = 5;
        static NORMAL_HEADER_SIZE = 3;

        static getDataSize(a) {
            return this.isBigSize(a) ? this.getIntAt(a, this.BYTE_PACKET_SIZE_INDEX) : this.getUnsignedShortAt(a, this.BYTE_PACKET_SIZE_INDEX);
        }
        static getCmdIdFromData(a) {
            return this.getShortAt(a, 1);
        }
        static isBigSize(a) {
            return this.getBit(a[0], this.BIT_IS_BIG_SIZE_INDEX);
        }
        static isCompress(a) {
            return this.getBit(a[0], this.BIT_IS_COMPRESS_INDEX);
        }
        static getValidSize(a) {
            var b = 0,
                c = 0;
            if (this.isBigSize(a)) {
                if (length < this.BIG_HEADER_SIZE) return -1;
                b = this.getIntAt(a,
                    this.BYTE_PACKET_SIZE_INDEX);
                c = this.BIG_HEADER_SIZE
            } else {
                if (length < this.NORMAL_HEADER_SIZE) return -1;
                b = this.getUnsignedShortAt(a, this.BYTE_PACKET_SIZE_INDEX);
                c = this.NORMAL_HEADER_SIZE;
            }
            return b + c
        }
        static getBit(a, b) {
            return 0 != (a & 1 << b)
        }
        static genHeader(a, b) {
            var c;
            c = this.setBit(0, 7, !0);
            c = this.setBit(c, 6, !1);
            c = this.setBit(c, 5, b);
            c = this.setBit(c, 4, !0);
            return c = this.setBit(c, 3, a);
        }
        static setBit(a, b, c) {
            return c ? a | 1 << b : a & ~(1 << b);
        }
        static getIntAt(a, b) {
            return ((a[b] & 255) << 24) + ((a[b + 1] & 255) << 16) + ((a[b + 2] & 255) << 8) + ((a[b + 3] & 255) << 0);
        }
        static getUnsignedShortAt(a, b) {
            return ((a[b] & 255) << 8) + ((a[b + 1] & 255) << 0);
        }
        static getShortAt(a, b) {
            return (a[b] << 8) + (a[b + 1] & 255);
        }
    }
}
export default Network.PacketHeaderAnalyze;