export interface Coach {
    coachName: string;
    coachAge?: number;

    getDailyWorkout(): string;
}
