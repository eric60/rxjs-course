// higher order function = function that returns a function

import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

export enum RxJSLoggingLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  ERROR= 3
}

let rxJSLoggingLevel: RxJSLoggingLevel = RxJSLoggingLevel.INFO;

export function setRxJSLoggingLevel(level: RxJSLoggingLevel) {
  rxJSLoggingLevel = level;
}

/**
 * It defines a custom RxJS operator named debug.
 * You can attach this operator inside a .pipe() to log values **passing through** an observable only when a certain logging level is high enough.

 * 1. export const debug = f1(...) => f2(...) => ... This is a higher-order function.
 * It returns another function.
 *  •	First function receives:
 *  •	loggingLevel → a number controlling if logging happens
 *  •	loggingMessage → the prefix for console logs
 *  •	That function returns another function that receives the observable (sourceObs) which then executes on that input observable
 *
 * This pattern is how custom RxJS operators are built.
 *
 * 2. (sourceObs: Observable<any>) => sourceObs.pipe(...)
 *
 * This is the operator function.
 *
 * Whatever observable is passed in, it returns a new observable that pipes through some logic.
 *
 * 3. Inside .pipe(), it uses the RxJS tap operator
 *
 * tap lets you look at the values flowing through the observable **without modifying** them.
 * tap(sourceObsStreamVal => { ... }) This callback runs every time the observable emits a value.
 *
 * 4. Logging condition
 * if (loggingLevel >= rxJSLoggingLevel) {
 *   console.log(loggingMessage + ': ',  sourceObsStreamVal);
 * }
 *  •	rxJSLoggingLevel → likely a global setting in your project
 *  •	If your provided loggingLevel is greater than or equal, it logs the value emitted by the observable.
 *
 * So:
 *  •	If loggingLevel is high enough → prints
 *  •	If not → does nothing
 */
export const debug = (loggingLevel: number, loggingMessage: string) =>
  (sourceObs: Observable<any>) =>
  sourceObs
  .pipe(
    tap(sourceObsStreamVal => {

      if (loggingLevel >= rxJSLoggingLevel) {
        console.log(loggingMessage + ': ',  sourceObsStreamVal)
      }

    }),
  )
