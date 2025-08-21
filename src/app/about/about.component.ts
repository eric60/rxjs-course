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
  need to combine all these async events in 1 program


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
    // to combine multiple streams in a simple way and avoid the PROBLEM of callback hell like this using native callback api making it harder and harder to understand
    // if you click twice, you will get TWO streams of data
    document.addEventListener('click', clickEvent => {
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

    // 1st Observable<number> is interval observable
    /**
     * The observable interval$ variable is NOT a stream of values
     * Observable = It is the DEFINITION for a stream of values, like a blueprint/template for how the stream would behave IF we instantiated it
     * observable = blueprint for the stream
     * interval only becomes a stream if we subscribe to it, THEN we have CREATED a stream of values
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
    // 2nd Observable<Event> is click observable
    const click$ = fromEvent(document, 'click')
    click$.subscribe(
      evt => console.log("stream 3: " + evt),
      err => console.error(err),
      () => console.log("Stream 3 completed")
    )


    // ================================================
    // ========= Custom http observable
    // ================================================
    //   promise much different than observable, promise executes immediately and only emits once or fails, observable only executes in response to a subscription instantiation click$.subscribe()


    // all observables like interval created like this
    // Creates a new cold Observable by calling the Observable constructor
    // cannot emit the http observable values inside create method, can only subscribe to it to get the stream of values, observer is private inside implementation of observable
    const http$ = Observable.create(observer => {
      // observer.next();
      // observer.error();
      // observer.complete()
      fetch('/api/courses')
        .then(httpresponse => {
        return httpresponse.json()
      })
        .then(jsonBody => {
          observer.next(jsonBody) // actually emit the jsonbody value
          observer.complete() // terminate http stream
          // observer.next() WARNING: breaks observable contract!
        })
        .catch(err => {
          observer.error(err)
        })
    })

    http$.subscribe(
      courses => console.log("courses:", courses),
      noop,   // ()  => {},
      () => console.log("complete")
    )

    // why transform the fetch promise into an observable?
  //   advantage is can use ALL the rxjs operators to **combine the httpstream with other stream of valuesxx** like clickhandlers, timeouts, other http requests
  }

}






