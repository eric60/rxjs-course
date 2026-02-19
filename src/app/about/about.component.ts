import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  concat,
  fromEvent,
  interval,
  noop,
  observable,
  Observable,
  of,
  timer,
  merge,
  Subject,
  BehaviorSubject,
  AsyncSubject,
  ReplaySubject
} from 'rxjs';
import {delayWhen, filter, map, take, timeout} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';


@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  standalone: false
})
export class AboutComponent implements OnInit {

  /*
  stream of values
  example: every click is a stream of values of the click event

  almost everything is asynchronous in angular

  1. requests from network bringing in data from backend,
  2. timeouts in frontend
  3. user interaction with clicks/mouse over events

  need to combine all these async events in 1 program with rxjs operators


   */
  ngOnInit() {
    /*
    document.addEventListener('click', clickEvent => {
      console.log(clickEvent);
    })

    // may use intervals with timeouts on frontend if doing long polling, waiting on backend response

    let counter = 0
    setInterval(() => {
      console.log(counter)
      counter++
    }, 1000)

    // now have 2 streams of values that might want to combine together (clicks + intervals)
    // these are multi-value streams that continue to emit value over time and never complete
    // Important: CAN they be completely, WHEN are they completed?


    // setTimeout IS a special type of stream because it only contains and emits 1 value and then completes, similar to request to a backend that returns a values via a callback like ajax, with exception that setTimeout can't go wrong
    setTimeout(() => {
      console.log("setTimeout stream finished")
    }, 3000)
*/

    // ================================================
    // ========= Avoid Callback hell: WHY use rxjs operators?
    // ================================================
    // Answer: To combine multiple streams in a simple way and avoid the PROBLEM of callback hell like this below using native callback api making it harder and harder to understand with each nested callback

    // if you click twice, you will get TWO streams of data
    document.addEventListener('cancel', clickEvent => {
      console.log(clickEvent);

      setTimeout(() => {
        console.log("setTimeout stream finished")
        let counter = 0

        setInterval(() => {
          console.log("setInterval val => " + counter)
          counter++
        }, 1000)

      }, 3000)

    })

    // ===============Stream vs Observable=================================

    // 1st Observable<number> you learned is a simple interval observable

    /**
     * The observable interval$ variable is NOT a stream of values

     * Observable = blueprint for the stream
     * DEFINITION for a stream of values, like a blueprint/template for how the stream would behave IF we instantiated it

     * interval only becomes a stream IF we subscribe to it, THEN we have CREATED a stream of values, otherwise it STAYS as an observable not emitting any values
     */
    const interval$ = interval(1000)
    const subscription1 = interval$.subscribe(val => console.log("stream 1 val => " + val))
    const subscription2 = interval$.subscribe(val => console.log("stream 2 val => " + val))

    setTimeout(() => {
      subscription1.unsubscribe();
      subscription2.unsubscribe();
    }, 2000)

    const timer$ = timer(3000, 1000)

    // 3 core rxjs concepts: next, error, complete, subscriptions/unsubscribing
    // The 2nd Observable<Event> is a click observable
    const click$ = fromEvent(document, 'click')
    click$.subscribe(
      evt => console.log("stream 3: " + evt),
      err => console.error(err),
      () => console.log("Stream 3 completed")
    )

// ===============concat operator - observable concatenation=================================
    // concat subscribes to each observable sequentially one-by-one when it completes.

    // the KEY of concat is it only starts source2$ observable when source1$ COMPLETES
    // if it never completes e.g. if it was an interval(1000) then source2$ would never start
    const source1$ = of(1, 2, 3)
    const source2$ = of(4, 5, 6)
    const source3$ = of(7, 8, 9)
    const result$ = concat(source1$, source2$, source3$)
    result$.subscribe(val => {
      console.log("concat() val:" + val)
    })


// ===============merge operator=================================
    console.log("=> merge operator")
    const interval1$ = interval(1000)
    const interval2$ = interval1$.pipe(map(val => 10 * val))
    const intervalResult$ = merge(interval1$, interval2$)
    // intervalResult$.subscribe(val => {
    //   console.log(val)
    // })

    // ===============unsubscribe feature=================================
    const intervalx1$ = interval(1000);
    const sub = intervalx1$.subscribe(val => console.log(val));
    setTimeout(() => {
      sub.unsubscribe();
      console.log("unsubscribed intervalx1$")
    }, 5000)

// ===============unsubscribe feature on createHttpObservable fetch call=================================
    console.log("trying to subscribe to http2$")
    const http2$: Observable<any> = createHttpObservable("/api/courses")

    // Problem: Previous Error: Cannot read properties of undefined (reading 'subscribe')
    // Solution: Error cause was due to not actually returning the observable!
    // const sub2 = http2$.subscribe(value => console.log(value));
    // console.log("subscribed to http2$")

    // To demonstrate aborting, unsubscribe after a delay to allow the fetch call to be made first
    setTimeout(() => {
      console.log('Unsubscribing from the observable.')
      // sub2.unsubscribe()
      // console.log("unsubscribed to http2$")
    }, 50)

    // ===================== Subject ================================
    // subject is at the same time both an observable and observer for multicasting same stream of values to multiple observers/subscribers
    const subject = new BehaviorSubject(0);
    // BehaviorSubject most used because late subscribers still receive the latest value in the stream whereas regular Subject would not have late subscribers receiving that latest value
    // subject meant to be private the part of the application emitting certain data and should not be shared as a public variable

    // derive an observable as variable from the subject
    const series1$ = subject.asObservable(); // emitting values of the subject, OK to share this series1$ observable with other parts of the application because unlike the subject, the observable does not have the next, complete, error methods that could cause tight coupling, so other parts of application can only subscribe to the observable but cannot emit values on behalf of the observable itself

    // prove that subject is very convenient way to produce a custom observable, easier to understand then observable.create -- but don't have unsubscribe logic , and risk sharing subject with other parts of application
    // prefer use subject less,
    // (1) derive observable from the source itself using fromPromise()
    // (2) derive observable from a promise like fetch(),
    // (3) derive observable from a browser event like from(document, 'keyup)
    console.log("====== Subject logs =======")
    series1$.subscribe(val => console.log("early sub: " + val))

    subject.next(1)
    subject.next(2)
    subject.next(3)
    // subject.complete()

    setTimeout(() => {
        series1$.subscribe(val => console.log("late sub: " + val))
        subject.next(4);
      }, 3000
    )
  }

}






