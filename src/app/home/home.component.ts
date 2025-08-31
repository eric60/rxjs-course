import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';
import {Store} from '../common/store.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent implements OnInit {

  // OLD WAY: Imperative
  beginnerCourses: Course[];
  advancedCourses: Course[];

  // NEW WAY: Reactive
  beginnerCourses$: Observable<Course[]>
  advancedCourses$: Observable<Course[]>

  constructor() {

  }

  ngOnInit() {
    const http$: Observable<any> = createHttpObservable('/api/courses')

    // how to derive a NEW observables from existing observables?
    // need to use rxjs operator pipe
    /*
{
"payload": [
{id:1},
{id:2}
]
 */
    const courses$: Observable<Course[]> = http$
      .pipe(
        map(jsonRes => jsonRes['payload'])
      )

    // Option 1) Imperative Design
    // subscribe and getting and setting data within it
    // Simplest way to get and set courses is to just simply subscribe to the courses$ and in the success callback just get the data and set the courses and pass back to template
    // problem is putting all the logic in the subscribe block will not scale with complexity, it will quickly run into problem of nested subscribe calls (rxjs anti pattern) within each other causing callback hell,

    /*    courses$.subscribe(
          courses => {
            console.log("courses:", courses)
            this.beginnerCourses = courses.filter(course => course.category == 'BEGINNER')
            this.advancedCourses = courses.filter(course => course.category == 'ADVANCED')
          },
          noop, // ()  => {},
          () => console.log("courses$ completed")
        )*/

    // Option 2) Reactive design
    this.beginnerCourses$ = courses$.pipe(
      map(courses => courses.filter(course => course.category == 'BEGINNER'))
    )

    this.advancedCourses$ = courses$.pipe(
      map(courses => courses.filter(course => course.category == 'ADVANCED'))
    )


  }

}
