// ===========================
// Record<K,T> = object where keys are one type and value another type
// ==============================
var coursesById = {
    "101": { id: 101, name: "Math" },
    "102": { id: 102, name: "Science" }
};
var courses = Object.values(coursesById);
console.log(courses);
var statusMessages = {
    pending: 'Waiting...',
    approved: 'All good',
    rejected: 'Nope'
};
// Use Record by default. Reach for Map only when you need its special powers.
var users1 = {
    '1': { name: 'Eric' },
    '2': { name: 'Alice' }
};
var users2 = new Map();
users2.set('1', { name: 'Eric' });
users2.set('2', { name: 'Alice' });
/*
✅ Why Record is usually better (Angular/TS apps)

1️⃣ Works naturally with JSON & APIs

APIs return objects — not Maps.
 */
var response = {
    "1": { "name": "Eric" },
    "2": { "name": "Alice" }
};
/*
✅ No conversion needed
❌ Map requires manual transformation
 */
var data = response;
/*
✅ Compiler enforces every key exists
✅ No extra keys allowed
❌Impossible with Map at compile time.
 */
var labels = {
    pending: 'Waiting...',
    approved: 'Done'
};
/*
3️⃣ Angular templates like objects, not Maps

In templates:
{{ users[userId].name }}

With map:
{{ users.get(userId)?.name }}

✅ Cleaner
✅ Less null-safety noise
✅ Easier change detection
 */
/*
4️⃣ Serialization & state management

Redux / NgRx / signals / localStorage:

✅ Record serializes automatically
❌ Map becomes {} unless you convert it

 */
/*
5️⃣ Lower cognitive overhead

No .get(), .set(), .has()

users[id] = user;
delete users[id];

Simple. Readable. Predictable.
 */
/*
🚨 When Map is the right tool

Use Map if any of these are true:

✅ Keys are not strings

const cache = new Map<User, number>();

Objects & functions as keys → Map only


✅ You need guaranteed insertion order

Maps preserve insertion order strictly.

Objects mostly do — but with edge cases for numeric keys.


✅ You need frequent add/remove in hot paths

Maps can be faster for:
    •	massive datasets
    •	frequent mutations
    •	cache implementations


    ✅ You rely on .size
    map.size // O(1)
    Object.keys(obj).length // O(n)

 */
/*
❌ When NOT to use Map
    •	App state
    •	API data
    •	Template-driven lookup
    •	Anything that needs to be serialized
    •	Angular services storing data

This is most app code.

TL;DR decision rule

✅ App state / API data / configs / lookups → Record
✅ Caching / performance-critical logic / non-string keys → Map

If you want, I can:
    •	show performance benchmarks
    •	refactor a real Map → Record example
    •	explain why Angular change detection prefers objects

 */
