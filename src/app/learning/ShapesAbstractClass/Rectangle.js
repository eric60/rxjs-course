import { Shape } from "./Shape";
export class Rectangle extends Shape {
    constructor(theX, theY, _width, _length) {
        super(theX, theY);
        this._width = _width;
        this._length = _length;
    }
    get length() {
        return this._length;
    }
    set length(value) {
        this._length = value;
    }
    get width() {
        return this._width;
    }
    set width(value) {
        this._width = value;
    }
    getInfo() {
        return super.getInfo() + `, width=${this._width}, length=${this._length}`;
    }
    getArea() {
        return this._width * this._length;
    }
}
//# sourceMappingURL=Rectangle.js.map