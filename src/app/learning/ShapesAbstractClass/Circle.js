import { Shape } from "./Shape";
export class Circle extends Shape {
    constructor(theX, theY, _radius) {
        super(theX, theY);
        this._radius = _radius;
    }
    get radius() {
        return this._radius;
    }
    set radius(value) {
        this._radius = value;
    }
    getInfo() {
        return super.getInfo() + `, radius=${this._radius}`;
    }
    getArea() {
        return Math.PI * Math.pow(this._radius, 2);
    }
}
//# sourceMappingURL=Circle.js.map