import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject, timer} from 'rxjs';
import {Course} from '../model/course';
import {delayWhen, filter, map, retryWhen, shareReplay, tap, withLatestFrom} from 'rxjs/operators';
import {createHttpObservable} from './util';
import {fromPromise} from 'rxjs/internal-compatibility';


@Injectable({
  providedIn: 'root' // Angular registers this Store globally to be injectable anywhere
})
export class Store {

  private subject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.subject.asObservable();


  init() {

    const http$: Observable<any> = createHttpObservable('/api/courses')

    http$
      .pipe(
        tap(res => console.log("store service GET /api/courses executed. res: ", res)),
        map(res => Object.values(res['payload']) as Course[])
      )
      .subscribe(courses => {
        this.subject.next(courses)
      })
  }

  selectBeginnerCourses() {
    return this.filterByCategory('BEGINNER');
  }

  selectAdvancedCourses() {
    return this.filterByCategory('ADVANCED');
  }

  selectCourseById(courseId: number) {
    return this.courses$
      .pipe(
        map(courses => courses.find(course => course.id == courseId)),
        filter(course => !!course)
      );
  }

  filterByCategory(category: string) {
    return this.courses$
      .pipe(
        map(courses => courses
          .filter(course => course.category == category))
      );
  }

  /*
  save course in memory and broadcast new course to all subscribers
  course saved optimistically in memory

  ✅ You update the UI immediately, before the server responds
  ❌ If the save fails, you rollback or show an error

This makes the app feel fast instead of “spinner-heavy”.

Normal save: click → wait → server → update UI
Optimistic save: click → update UI → server
                 ↳ rollback if error
   */
  saveCourse(courseId: number, courseChanges) {
    // part 1: optimistically update course on the frontend with in memory changes -- then update on backend later
    const courses: Course[] = this.subject.getValue()

    const courseIndex = courses.findIndex(course => course.id = courseId)

    // copy courses into new array for the update request
    const newCourses = courses.slice(0)

    newCourses[courseIndex] = {
      ...courses[courseIndex], // spread operator copy all other courses including desired course
      ...courseChanges // spread operator update that course with the updated changes
    }

    // part 1: broadcast changes in memory for UI to update optimistically
    this.subject.next(newCourses)
    /*
    Problem:
    When frontend changes don’t update optimistically after
this.subject.next(newCourses), the issue is almost always how the data is being mutated or subscribed, not the .next() call itself.

     */

    // part 2: request to backend, return promise to the dialog
    return fromPromise(fetch(`api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(courseChanges),
      headers: {
        'content-type': 'application/json'
      }
    }));


  }


}

/*
always have data in notes to reference

  12: {
    id: 12,
    titles: {
      description: 'Angular Testing Course',
      longDescription: 'In-depth guide to Unit Testing and E2E Testing of Angular Applications'
    },
    iconUrl: 'https://s3-us-west-1.amazonaws.com/angular-university/course-images/angular-testing-small.png',
    category: 'BEGINNER',
    seqNo: 0,
    url: 'angular-testing-course',
    lessonsCount: 10,
  },

  2: {
    id: 2,
 */


























