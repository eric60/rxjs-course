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

    // how to derive a NEW observables from pre-existing observables?
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
        tap(() => console.log("tap operator produced this side effect of console.logging: HTTP request executed")), // tap operator used to PRODUCE SIDE EFFECT Sin our observable chain, update something outside of the observable chain or logging statement

        map(jsonRes => jsonRes['payload']),

        shareReplay(), // share replay operator makes the stream of values from the http$ observable shared across multiple subscriptions, same stream used only once
        catchError(err => {
          return of([
            {
              id: 0,
              description: "RxJs In Practice Course",
              iconUrl: 'https://s3-us-west-1.amazonaws.com/angular-university/course-images/rxjs-in-practice-course.png',
              courseListIcon: 'https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png',
              longDescription: "Understand the RxJs Observable pattern, learn the RxJs Operators via practical examples",
              category: 'BEGINNER',
              lessonsCount: 10
            }
          ])
        }) // error handling strategy 1: Recover from error by returning an ALTERNATIVE error observable that replaces the original http observable when it fails. when error observable completes/errors out then the outer Observable<Course[]> completes
      )
    // very common problem: multiple http requests when it could be 1
    // 2 observables, each subscribed to using async pipe,
    // 2 different subscriptions to 2 different observables derived from the SAME http observable, triggers 2 separate http requests
    // SOLUTION: avoid default behavior of complete new stream by subscription, instead want to share the same execution of http$ observable (i.e. the stream of values) shared across multiple subscribers, only once

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
