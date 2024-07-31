declare function md5(v:string);
declare class base64 {
    static encode(v:string);
    static decode(v:string);
}

declare class msgpack {
    static encode(v:string):Uint8Array;
    static encode(v:any):Uint8Array;
    static decode(v:any):any;
}

namespace SAT {
    declare class Polygon {
        angle: number;
        pos: Vector;
        setAngle(radian: number): void;
        translate(x: number, y: number);
    }

    declare class Box {
        angle: number;
        w: number;
        h: number;
        pos: Vector;
        constructor(pos: Vector, width: number, height: number);
        toPolygon(): Polygon;
    }

    declare class Circle {
        radius: number;
        pos: Vector;
        constructor(pos: Vector, radius: number);
    }

    declare class Vector {
        x: number;
        y: number;
        constructor(x: number, y: number);
    }

    declare class Response {

    }
}

declare class SAT {
    static testPolygonPolygon(a: SAT.Polygon, b: SAT.Polygon): boolean;
    static testPolygonPolygon(a: SAT.Polygon, b: SAT.Polygon, response: SAT.Response): boolean;
    static testCirclePolygon(circle: SAT.Circle, polygon: SAT.Polygon): boolean;
    static testCirclePolygon(circle: SAT.Circle, polygon: SAT.Polygon, response: SAT.Response): boolean;
}