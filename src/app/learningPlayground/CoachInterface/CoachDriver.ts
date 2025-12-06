import {FootballCoach} from "./FootballCoach";
import {GolfCoach} from "./GolfCoach";
import {Coach} from "./Coach";

let footballCoach = new FootballCoach("Football Coach");
footballCoach.coachName = "The Football Coach"

let golfCoach = new GolfCoach("Golf Coach");
golfCoach.coachName = "The Golf Coach"
golfCoach.coachAge = 32;

let coaches: Coach[] = [];
coaches.push(footballCoach, golfCoach)

for (let coach of coaches) {
    console.log(`${coach.coachName}: ${coach.getDailyWorkout()}`);
}
