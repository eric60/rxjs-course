class SimpleStorage {
    map;
    constructor() {
        this.map = new Map()
    }
    addFile(file) {
        this.map.set(file, "true")
    }

}

s = new SimpleStorage();
s.addFile("test")
console.log(s.map)