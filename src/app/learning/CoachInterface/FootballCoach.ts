import {Coach} from "./Coach";

export class FootballCoach implements Coach {
  public coachName: string;

  constructor(coachName: string) {
    this.coachName = coachName;
  }

  getDailyWorkout(): string {
        return "Throw 100 balls";
    }
}
