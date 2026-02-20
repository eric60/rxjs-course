export class Customer2 {
    constructor(private _firstName: string, private _lastName: string) {
    }

    get firstName(): string {
        return this._firstName
    }

    set firstName(firstName: string) {
        this._firstName = firstName
    }

    get lastName(): string {
        return this._lastName;
    }

    set lastName(value: string) {
        this._lastName = value;
    }
}

// let customer2 = new Customer2("eric", "S");
// console.log(`Hello ${customer2.firstName} ${customer2.lastName}`)
