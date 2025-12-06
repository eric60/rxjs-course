console.log("Hello");

let found: boolean = true;
let grade: number = 88.8;
let firstName: string = "Eric";
let lastName: string = "S";
// found = 0;
console.log(`found: ${found}`)
console.log(`Hello ${firstName} ${lastName}`)

// =============
let reviews: number[] = [5,5,1,2];
let total: number = 0;

for (let i = 0; i < reviews.length; i++) {
    total += reviews[i];
    console.log(reviews[i]);
}
let average: number = total/reviews.length
console.log(`Average is: ${average}`)

// ================
let sports: string[] = ["football", "basketball"]
sports.push("swimming")
for (let sport of sports) {
    if (sport === "swimming") {
        console.log(sport + " <=== My Favorite")
    } else {
        console.log(sport);
    }
}
