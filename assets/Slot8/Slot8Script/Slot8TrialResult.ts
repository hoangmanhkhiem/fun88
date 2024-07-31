// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Slot4TrialResult {

    static results = [
        {
            ref: 3541,
            result: 3,
            matrix: "2,0,1,6,1,0,5,0,3,0,4,5,1,0,6",
            linesWin: "1,2,2,4,5,6,8,8,9,9,10,12,12,13,14,17,18,20",
            haiSao: "",
            prize: 516700,
            currentMoney: 1706231246
        },
        {
            ref: 3542,
            result: 5,
            matrix: "6,2,2,2,2,5,0,4,5,3,1,2,3,0,6",
            linesWin: "2,6,8,9,17,19",
            haiSao: "1,0,1,1,1,1,1,1,1,1,1",
            prize: 19200,
            currentMoney: 1706248446
        },
        {
            ref: 3543,
            result: 5,
            matrix: "4,5,2,1,1,1,5,2,2,0,1,4,5,2,5",
            linesWin: "1,2,2,4,6,6,7,8,8,9,9,10,10,11,13,13,13,14,15,16,17,17,19,19",
            haiSao: "0,1,1,1,1,1,1,1,0,1,1,1",
            prize: 21000,
            currentMoney: 1706267446
        },
        {
            ref: 3546,
            result: 1,
            matrix: "5,1,3,2,4,1,2,6,3,0,5,2,4,1,4",
            linesWin: "3,4,10,10,10,13,14,14,17,17,17,18,18,18,20",
            haiSao: "",
            prize: 8300,
            currentMoney: 1706781306
        },
        {
            ref: 3547,
            result: 1,
            matrix: "1,6,6,0,1,1,5,2,6,6,3,6,6,3,3",
            linesWin: "2,2,3,4,5,6,6,7,8,8,10,12,16,17,18,20",
            haiSao: "",
            prize: 5800,
            currentMoney: 1706785106
        },
        {
            ref: 3549,
            result: 1,
            matrix: "6,2,1,5,4,2,3,2,3,6,2,4,3,5,0",
            linesWin: "4,5,8,11,12,14,17",
            haiSao: "",
            prize: 2200,
            currentMoney: 1706804406
        },
        {
            ref: 3555,
            result: 1,
            matrix: "1,4,4,0,5,1,5,0,5,2,6,5,3,6,6",
            linesWin: "2,6,12,13,16,17",
            haiSao: "",
            prize: 1800,
            currentMoney: 1706823006
        },
        {

            ref: 3560,
            result: 1,
            matrix: "3,4,1,0,3,5,3,4,6,1,3,4,3,6,4",
            linesWin: "2,4,5,7,8,9,11,12,13,14,16,17,17,20",
            haiSao: "",
            prize: 5400,
            currentMoney: 1707335746
        },
        {
            ref: 3568,
            result: 2,
            matrix: "1,4,0,6,3,0,1,1,1,4,3,5,5,4,3",
            linesWin: "1,1,4,4,5,5,6,6,7,11,11,12,12,14,15,16,19,20,20",
            haiSao: "",
            prize: 57200,
            currentMoney: 1707941766
        },
        {
            ref: 3569,
            result: 1,
            matrix: "4,2,0,0,6,5,0,0,6,5,1,5,3,1,1",
            linesWin: "3,3,7,7,9,9,11,15,18,19,20,20,20",
            haiSao: "",
            prize: 20700,
            currentMoney: 1707960466
        },
        {
            ref: 3578,
            result: 1,
            matrix: "6,3,2,3,1,5,3,4,1,3,6,4,3,4,4",
            linesWin: "1,2,3,4,5,6,7,8,10,12,15,16,16,17,19,20",
            haiSao: "",
            prize: 9800,
            currentMoney: 1708507826
        },
        {
            ref: 3605,
            result: 1,
            matrix: "0,1,0,4,4,6,6,6,1,6,6,1,4,4,2",
            linesWin: "1,2,2,3,4,5,6,8,8,10,12,13,14,15,18,19",
            haiSao: "",
            prize: 5700,
            currentMoney: 1709815386
        },
        {
            ref: 3615,
            result: 1,
            matrix: "3,0,4,3,2,0,4,4,6,4,0,3,6,3,4",
            linesWin: "1,4,8,11,15",
            haiSao: "",
            prize: 1100,
            currentMoney: 1709866486
        },
        {
            ref: 3634,
            result: 1,
            matrix: "2,2,6,2,5,3,0,5,6,5,5,0,2,3,5",
            linesWin: "2,6,10",
            haiSao: "",
            prize: 1200,
            currentMoney: 1711120986
        },
        {
            ref: 3656,
            result: 1,
            matrix: "1,0,6,3,6,0,6,2,4,1,5,1,3,6,5",
            linesWin: "8,10,10,13,13,13,14,17,18,18",
            haiSao: "",
            prize: 4300,
            currentMoney: 1711713906
        },
        {
            ref: 3693,
            result: 2,
            matrix: "3,3,0,1,1,0,6,3,0,1,3,3,1,3,2",
            linesWin: "1,2,2,3,4,5,6,7,8,9,9,10,10,12,12,13,13,14,16,17,17,18,18,19,20",
            haiSao: "",
            prize: 78800,
            currentMoney: 1713716007
        },
        {
            ref: 3848,
            result: 5,
            matrix: "2,3,5,3,2,5,5,1,1,1,3,0,4,0,5",
            linesWin: "1,4,5,5,6,6,7,9,10,11,12,13,13,14,14,15,15,16,17,18,19",
            haiSao: "1,1,1,1,1,1,1,1,0,2,0,1",
            prize: 15200,
            currentMoney: 1721477607
        },
        {
            ref: 3568,
            result: 2,
            matrix: "1,4,0,6,3,0,1,1,1,4,3,5,5,4,3",
            linesWin: "1,1,4,4,5,5,6,6,7,11,11,12,12,14,15,16,19,20,20",
            haiSao: "",
            prize: 57200,
            currentMoney: 0
        }
    ]
}
