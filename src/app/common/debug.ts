// higher order function = function that returns a function

import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

const debug = (loggingLevel: number, message: string) => (sourceObs: Observable<any>) => sourceObs

  .pipe(

    tap(val => console.log(message + val)),

  )
