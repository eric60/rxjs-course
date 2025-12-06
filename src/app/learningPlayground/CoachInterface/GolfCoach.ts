import {Coach} from "./Coach";

export class GolfCoach implements Coach {
  public coachName: string;
  public coachAge = 32;

  constructor(coachName: string) {
    this.coachName = coachName;
  }

  getDailyWorkout(): string {
      return "Hit 100 balls";
    }
}
