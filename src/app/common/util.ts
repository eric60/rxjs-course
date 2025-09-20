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
export function createHttpObservable(url: string): any {
      // 1. Create an AbortController for this specific subscription
  return Observable.create(observer => {
    // need to create signal inside the observable creation to use in the fetch call
    const abortController = new AbortController();
    const signal = abortController.signal
    // observer.next();
    // observer.error();
    // observer.complete()

    // 2. Start the fetch request with the signal
    fetch(url, {signal: signal})
      .then(httpresponse => {
        console.log("createHttpObservable fetch made for url:", url);
        return httpresponse.json()
      })

      .then(jsonBody => {
        // 3. If successful, emit the data and complete the observable
        observer.next(jsonBody) // actually emit the jsonbody value to the stream
        observer.complete() // terminate http stream
        // observer.next() WARNING: this breaks observable contract!
      })

      .catch(err => {
         // 4. Check for and ignore an AbortError from cancellation
        if (err.name == 'AbortError') {
          console.log('Fetch request was aborted.');
          return;
        }
        // 5. If it's a different error, pass it to the subscriber
        observer.error(err)
      })

    /*
    The AbortController API, combined with AbortSignal, can be effectively used in Angular applications, particularly when dealing with asynchronous operations like HTTP requests, to manage their cancellation. This is especially relevant in scenarios where components might be destroyed or requests need to be aborted due to user interaction or other application logic.

Key benefits of using AbortController in Angular:
Resource Management: Prevents unnecessary network requests from completing and consuming resources if the component or operation is no longer relevant.
Improved User Experience: Allows for quick cancellation of long-running operations, enhancing responsiveness.
Cleaner Code: Centralizes the cancellation logic for multiple asynchronous operations associated with a single controller.

     */
    // This is a custom feature to abort the fetch call after unsubscribing to the observable
    // trigger abort if we unsubscribe on fetch http observable
    // return anon callback function
    // The signal read-only property of the AbortController interface returns an AbortSignal object instance, which can be used to communicate with/ abort an asynchronous operation as desired.
    // if observer is unsubscribed then abort

      // 6. Return the teardown logic function to be executed by the observer
    // This function runs automatically when the observer unsubscribes
    return () => {
      console.log('The Observer unsubscribed so Aborting fetch...');
      abortController.abort();
    };
  })
}

