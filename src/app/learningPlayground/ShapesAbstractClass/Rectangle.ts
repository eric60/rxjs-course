import {Shape} from "./Shape";

export class Rectangle extends Shape {
    constructor(theX: number, theY: number, private _width: number, private _length: number) {
        super(theX, theY);
    }

    get length(): number {
        return this._length;
    }

    set length(value: number) {
        this._length = value;
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }

  override getInfo(): string {
        return super.getInfo() + `, width=${this._width}, length=${this._length}`
    }

    getArea(): number {
        return this._width * this._length;
    }
}
