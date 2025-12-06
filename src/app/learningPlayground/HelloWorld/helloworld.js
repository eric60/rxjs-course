"use strict";
console.log("Hello");
let found = true;
let grade = 88.8;
let firstName = "Eric";
let lastName = "S";
// found = 0;
console.log(`found: ${found}`);
console.log(`Hello ${firstName} ${lastName}`);
// =============
let reviews = [5, 5, 1, 2];
let total = 0;
for (let i = 0; i < reviews.length; i++) {
    total += reviews[i];
    console.log(reviews[i]);
}
let average = total / reviews.length;
console.log(`Average is: ${average}`);
// ================
let sports = ["football", "basketball"];
sports.push("swimming");
for (let sport of sports) {
    if (sport === "swimming") {
        console.log(sport + " <=== My Favorite");
    }
    else {
        console.log(sport);
    }
}
//# sourceMappingURL=hello.js.map
