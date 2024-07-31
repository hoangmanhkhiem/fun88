const {ccclass} = cc._decorator;

export namespace cmd {
    export class Code {

        static currentChannel = 0;

        static LOTO_LOCATION = {
            MienBac: 0,
            MienTrung: 1,
            MienNam: 2
        };

        static LOTO_CHANNEL = {
            NONE: 0,
            MIEN_BAC: 1,
            // PhuYen: 2,
            // ThuaThiênHue: 3,
            // DakLak: 4,
            // QuangNam: 5,
            // ĐaNang: 6,
            // BinhDinh: 7,
            // QuangBinh: 8,
            // QuangTri: 9,
            // GiaLai: 10,
            // NinhThuan: 11,
            // DacNong: 12,
            // QuangNgai: 13,
            // KhanhHoa: 14,
            // KonTum: 15,
            // CaMau: 16,
            // DongThap: 17,
            // HCM: 18,
            // BacLieu: 19,
            // BenTre: 20,
            // VungTau: 21,
            // CanTho: 22,
            // DongNai: 23,
            // SocTrang: 24,
            // AnGiang: 25,
            // BinhThuan: 26,
            // TayNinh: 27,
            // BinhDuong: 28,
            // TraVinh: 29,
            // VinhLong: 30,
            // BinhPhuoc: 31,
            // HauGiang: 32,
            // LongAn: 33,
            // KienGiang: 34,
            // TienGiang: 35,
            // LamDong: 36
        };

        static LOTO_CHANNEL_NAME = [
            "NONE",
            "Miền Bắc",
            // "Phú Yên",
            // "Thừa T Huế",
            // "Đăk Lắk",
            // "Quảng Nam",
            // "Đà Nẵng",
            // "Bình Định",
            // "Quảng Bình",
            // "Quảng Trị",
            // "Gia Lai",
            // "Ninh Thuận",
            // "Đắc Nông",
            // "Quảng Ngãi",
            // "Khánh Hòa",
            // "KonTum",
            // "Cà Mau",
            // "Đồng Tháp",
            // "Hồ Chí Minh",
            // "Bạc Liêu",
            // "Bến Tre",
            // "Vũng Tàu",
            // "Cần Thơ",
            // "Đồng Nai",
            // "Sóc Trăng",
            // "An Giang",
            // "Bình Thuận",
            // "Tây Ninh",
            // "Bình Dương",
            // "Trà Vinh",
            // "Vĩnh Long",
            // "Bình Phước",
            // "Hậu Giang",
            // "Long An",
            // "Kiên Giang",
            // "Tiền Giang",
            // "Lâm Đồng",
        ];

        static LOTO_GAME_MODE = {
            None: 0,
            BaoLo2So: 1,
            BaoLo3So: 2,
            LoXien2: 3,
            LoXien3: 4,
            LoXien4: 5,
            Dau: 6,
            Duoi: 7,
            DeDau: 8,
            DeDacBiet: 9,
            DanhDauDuoi: 10,
            BaCang: 11,
            BaCangDau: 12,
            BaCangDuoi: 13,
            BaCangDauDuoi: 14,
            LoTruotXien4: 15,
            LoTruotXien8: 16,
            LoTruotXien10: 17,
            XiuChuDau: 18,
            XiuChuDuoi: 19,
            XiuChuDauDuoi: 20,
            Da2: 21,
            Da3: 22,
            Da4: 23,
            LoTruotXien14: 24,
            LoTruotXien12: 25,
        };

        static LOTO_GAME_MODE_NAME = [
            "NONE",
            "Bao Lô 2",
            "Bao Lô 3",
            "Lô Xiên 2",
            "Lô Xiên 3",
            "Lô Xiên 4",
            "Đầu",
            "Đuôi",
            "Đề Đầu",
            "Đề Đặc Biệt",
            "Đánh Đầu Đuôi",
            "Ba Càng",
            "Ba Càng Đầu",
            "Ba Càng Đuôi",
            "Ba Càng Đầu Đuôi",
            "Lô Trượt Xiên 4",
            "Lô Trượt Xiên 8",
            "Lô Trượt Xiên 10",
            "Xỉu Chủ Đầu",
            "Xỉu Chủ Đuôi",
            "Xỉu Chủ Đầu Đuôi",
            "Đá 2",
            "Đá 3",
            "Đá 4",
            "Lô Trượt Xiên 14",
            "Lô Trượt Xiên 12",

        ];

        // Luong so can gui len k phai so chu so
        static LOTO_GAME_MODE_NUM_REQUIRE = [
            0, // None
            1, // BaoLo2So
            1, // BaoLo3So
            2, // LoXien2
            3, // LoXien3
            4, // LoXien4
            1, // Dau
            1, // Duoi
            1, // DeDau
            1, // DeDacBiet
            1, // DanhDauDuoi
            1, // BaCang
            1, // BaCangDau
            1, // BaCangDuoi
            1, // BaCangDauDuoi
            4, // LoTruotXien4
            8, // LoTruotXien8
            10, // LoTruotXien10
            1, // XiuChuDau
            1, // XiuChuDuoi
            1, // XiuChuDauDuoi
            2, // Da2:
            3, // Da3
            4, //  Da4
            14, // LoTruotXien14
            12, // LoTruotXien12
        ];

        // Group Id available at Location
        static LOTO_GROUP_BAC = [1, 2, 4, 5, 6];
        static LOTO_GROUP_TRUNG = [1, 2, 3, 4, 5, 6];
        static LOTO_GROUP_NAM = [1, 3, 4, 6, 7, 8];

        // Mode Id available at Location
        static LOTO_MODE_BAC = [1, 2, 3, 4, 5, 9, 11, 16, 17, 24, 25];
        static LOTO_MODE_TRUNG = [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 15, 16, 17];
        static LOTO_MODE_NAM = [1, 2, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 21, 22, 23];

        // Channel Id available at Location
        static LOTO_CHANNEL_BAC = [1];
        static LOTO_CHANNEL_TRUNG = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        static LOTO_CHANNEL_NAM = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];

        /*
            BaoLo2So: 1,
            BaoLo3So: 2,
            LoXien2: 3,
            LoXien3: 4,
            LoXien4: 5,
            Dau: 6,
            Duoi: 7,
            DeDau: 8,
            DeDacBiet: 9,
            DanhDauDuoi: 10,
            BaCang: 11,
            BaCangDau: 12,
            BaCangDuoi: 13,
            BaCangDauDuoi: 14,
            LoTruotXien4: 15,
            LoTruotXien8: 16,
            LoTruotXien10: 17,
            XiuChuDau: 18,
            XiuChuDuoi: 19,
            XiuChuDauDuoi: 20,
            Da2: 21,
            Da3: 22,
            Da4: 23
        */

    }
}
export default cmd;