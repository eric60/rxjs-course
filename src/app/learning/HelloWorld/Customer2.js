export class Customer2 {
    constructor(_firstName, _lastName) {
        this._firstName = _firstName;
        this._lastName = _lastName;
    }
    get firstName() {
        return this._firstName;
    }
    set firstName(firstName) {
        this._firstName = firstName;
    }
    get lastName() {
        return this._lastName;
    }
    set lastName(value) {
        this._lastName = value;
    }
}
// let customer2 = new Customer2("eric", "S");
// console.log(`Hello ${customer2.firstName} ${customer2.lastName}`)
//# sourceMappingURL=Customer2.js.map
