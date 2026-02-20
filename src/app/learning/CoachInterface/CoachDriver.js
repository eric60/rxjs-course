import { FootballCoach } from "./FootballCoach.js";
import { GolfCoach } from "./GolfCoach.js";
let footballCoach = new FootballCoach("Football Coach");
footballCoach.coachName = "The Football Coach";
let golfCoach = new GolfCoach("Golf Coach");
let coaches = [];
coaches.push(footballCoach, golfCoach);
for (let coach of coaches) {
    console.log(`${coach.coachName}: ${coach.getDailyWorkout()}`);
}
//# sourceMappingURL=CoachDriver.js.map
