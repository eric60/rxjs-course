import {Observable} from 'rxjs';


// ================================================
// ========= Custom http observable
// ================================================
//   promise much different than observable, promise executes immediately and only emits once or fails, observable only executes in response to a subscription instantiation click$.subscribe()


// WHY? transform the fetch promise into an observable?
// Advantage is can THEN use ALL the rxjs operators to **COMBINE the httpstream with other stream of values** like clickhandlers, timeouts, other http requests
// by doing pipe(map(res => res['payload'] to emit array of courses instead of the raw json output

// all observables like interval created like this
// Creates a new cold Observable by calling the Observable constructor
// cannot emit the http observable values inside create method, can only subscribe to it to get the stream of values, observer is private inside implementation of observable
export function createHttpObservable(url: string): Observable<any> {
  return Observable.create(observer => {
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
}

