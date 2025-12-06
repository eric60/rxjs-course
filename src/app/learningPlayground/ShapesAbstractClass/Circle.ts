import {Shape} from "./Shape";

export class Circle extends Shape {
    constructor(theX:number, theY:number, private _radius:number) { // radius is a parameter property
        super(theX, theY);
    }

    get radius(): number {
        return this._radius;
    }

    set radius(value: number) {
        this._radius = value;
    }

    override getInfo(): string {
        return super.getInfo() + `, radius=${this._radius}`;
    }

    getArea(): number {
        return Math.PI * Math.pow(this._radius, 2);
    }
}
