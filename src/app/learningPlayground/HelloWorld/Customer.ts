class Customer {
    private _firstName: string;
    private _lastName: string;

    constructor(firstName: string, lastName: string) {
        this._firstName = firstName
        this._lastName = lastName
    }

    public get firstName(): string {
        return this._firstName
    }

    public set firstName(firstName: string) {
        this._firstName = firstName
    }

    public get lastName(): string {
        return this._lastName;
    }

    public set lastName(value: string) {
        this._lastName = value;
    }


    // public getFirstName(): string {
    //     return this.firstName;
    // }
    //
    // public setFirstName(firstName: string): void {
    //     this.firstName = firstName;
    // }
}

let customer = new Customer("eric", "S");
console.log(`Hello ${customer.firstName} ${customer.lastName}`)
// console.log(`Hello ${customer.firstName} ${customer.lastName}`);
// tsc --noEmitOnError
