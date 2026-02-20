// make updates at the top



props = {"prop1": 1, "prop2": "string"}


class Playground {
    addNums(n1, n2, n3) {
        return n1 + n2 + n3;
    }
}

console.log("hello")
test = new Playground()
console.log(test.addNums(1, 2, [3, 4]))
console.log(test.addNums(...[1, 2, 3]))
console.log("/dir1/file1".split("/"))
