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
    http$.pipe(
      tap(res => console.log("store service GET /api/courses executed. res: " + res)),
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
  saveCourse() {

  }


}




























