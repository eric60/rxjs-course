import {Observable} from 'rxjs';


// ================================================
// Creating a Custom http observable
// ================================================
//   promise much different than observable
//   promise executes immediately and only emits once or fails
//   observable only executes in response to a subscription instantiation e.g. click$.subscribe()


// ================================================
// Why transform the fetch promise into an observable?
// Reason is an advanctage to THEN use ALL the rxjs operators to **COMBINE the httpstream with other stream of values** like clickhandlers, timeouts, other http requests
// by doing pipe(map(res => res['payload'] to emit array of courses instead of the raw json output

// all observables like interval created like this
// Creates a new cold Observable by calling the Observable constructor
// cannot emit the http observable values inside create method, can only subscribe to it to get the stream of values
// observer is private inside implementation of observable
/*
Example json response
{
  "payload": [
    {
      "id": 0,
      "description": "RxJs In Practice Course",
      "iconUrl": "https://s3-us-west-1.amazonaws.com/angular-university/course-images/rxjs-in-practice-course.png",
      "courseListIcon": "https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png",
      "longDescription": "Understand the RxJs Observable pattern, learn the RxJs Operators via practical examples",
      "category": "BEGINNER",
      "lessonsCount": 10
    },
    {
      "id": 1,
    },
 */
export function createHttpObservable(url: string): Observable<any> {
  const controller = new AbortController();
  const signal = controller.signal

  Observable.create(observer => {
    // observer.next();
    // observer.error();
    // observer.complete()

    fetch(url, {signal})
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

    // call abort on fetch http request ONLY if we call unsubscribe
  // can return a value OUTSIDE of the fetch function
    // return anon callback function
    return () => controller.abort()
  })


}

