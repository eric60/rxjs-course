import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll, shareReplay, throttleTime
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createHttpObservable} from '../common/util';
import {Store} from '../common/store.service';


/*
One chatGPT notes

1. switchMap -> cancel old requests
2. mergeMap -> run multiple requests in parallel
3. concatMap -> queue requests
4. exhaustMap -> ignore new requests while one runs
 */
@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  standalone: false
})
export class CourseComponent implements OnInit, AfterViewInit {

  courseId: number;

  course$: Observable<Course[]>
  lesson$: Observable<Lesson[]>


  @ViewChild('searchInput', {static: true}) input: ElementRef;

  constructor(private route: ActivatedRoute, private store: Store) {

  }

  ngOnInit() {

    this.courseId = this.route.snapshot.params['id'];

    this.course$ = createHttpObservable(`/api/courses/${this.courseId}`)
      .tap(course => console.log("Course from backend: ", course))

    // concat 2 observables: (1) initialLessons$ loadLessons first and only then show (2) searchLessons$ search results
    // this.lesson$ = this.loadLessons()

  }

  ngAfterViewInit() {
   /* // search stream
    // convert stream of search terms strings into a stream of backend requests
    const searchLessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(searchTerm => this.loadLessons(searchTerm))
        // use switchMap instead of concatMap to cancel the previous http request (status code 0, prevent request from completing at all) when having a new search term in the typeahead feature
      )
    // .subscribe(console.log)

    const initialLessons$ = this.loadLessons()

    this.lesson$ = concat(initialLessons$, searchLessons$)*/

    // alternative simpler way without initialLessons$ or searchLessons$ and just having 1 lesson$
    this.lesson$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        startWith(''), // startWith emits a new observable based on the previous observable of search Terms
        // problem: sometimes it's not easy to understand what's going on in the observable chain with multipe operaters just by reading the chain, solution: debug by using the tap operator to produce debugging logging statements, can comment out as needed when too many logs
        tap((search) => console.log("Search: ", search)),
        debounceTime(400),
        // throttleTime(500),  // for typeahead search better use debounceTime instead of throttleTime because throttle does not take the latest value like debounceTime, it may just take the 1st value in the stream of values e.g. Hello (it only chose the "H" instead of the entire Hello
        distinctUntilChanged(),
        switchMap(searchTerm => this.loadLessons(searchTerm))
        // use switchMap instead of concatMap to cancel the previous http request (status code 0, prevent request from completing at all) when having a new search term in the typeahead feature
      )
  }

  loadLessons(searchTerm = ''): Observable<Lesson[]> {
    return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${searchTerm}`)
      .pipe(map(res => res['payload']))
  }

}











