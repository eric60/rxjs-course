"use strict";
class Customer {
    constructor(firstName, lastName) {
        this._firstName = firstName;
        this._lastName = lastName;
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
let customer = new Customer("eric", "S");
console.log(`Hello ${customer.firstName} ${customer.lastName}`);
// console.log(`Hello ${customer.firstName} ${customer.lastName}`);
// tsc --noEmitOnError
//# sourceMappingURL=Customer.js.map
