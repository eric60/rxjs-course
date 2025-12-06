import {Shape} from "./Shape";
import {Circle} from "./Circle";
import {Rectangle} from "./Rectangle";

// let shape = new Shape(1,2);
let circle = new Circle(1,2,3);
let rectangle = new Rectangle(1,2,4,5)

// console.log(shape.getInfo())
// console.log(circle.getInfo())

let shapes: Shape[] = [];
shapes.push(circle, rectangle);

for (let shape of shapes) {
    console.log(shape.getInfo())
    console.log(shape.getArea() + "\n")
}