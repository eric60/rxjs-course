import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {debounceTime, distinctUntilChanged, map, startWith, switchMap, take, tap} from 'rxjs/operators';
import {combineLatest, forkJoin, fromEvent, Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createHttpObservable} from '../common/util';
import {Store} from '../common/store.service';
import {debug, RxJSLoggingLevel, setRxJSLoggingLevel} from "../common/debug";


/*
One chatGPT notes

1. switchMap -> cancel old requests
2. mergeMap -> run multiple requests in parallel
3. concatMap -> queue requests
4. exhaustMap -> ignore new requests while one runs

5. combineLatest -> get latest value
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
  lessons$: Observable<Lesson[]>


  @ViewChild('searchInput', {static: true}) input: ElementRef;

  constructor(private route: ActivatedRoute, private store: Store) {

  }

  ngOnInit() {
    this.courseId = this.route.snapshot.params['id'];

    this.course$ = createHttpObservable(`/api/courses/${this.courseId}`)
      .pipe(
        debug(RxJSLoggingLevel.INFO, `Debug Course value from backend request:`)
      )

    this.lessons$ = this.loadLessons();

    forkJoin(this.course$.pipe(take(1)), this.lessons$.pipe(take(1)))
      .pipe(
        tap(([course, lessons]) => {
          console.log(`forkjoin result: course: {},  lessons: {}`, course, lessons);
        })
      ).subscribe()

    combineLatest([this.course$, this.lessons$]).subscribe((res) => console.log("combine latest result: ", res));

    setRxJSLoggingLevel(RxJSLoggingLevel.TRACE)

  }

  /*
  ngAfterViewInit is an Angular lifecycle hook that runs after Angular has fully initialized the component’s view, including all child components and anything inside the template.

This makes it the perfect place to interact with:
	•	@ViewChild()
	•	@ViewChildren()
	•	template elements (DOM)
	•	child component instances
	•	view-related logic

	📌 Why It’s Important

If you try to access the DOM or a child component in ngOnInit, it often won’t exist yet.
ngAfterViewInit guarantees the template is fully available.

this.myInput.nativeElement.focus();
✔️ This works because Angular has already rendered the view.
this.childComponent.doSomething();
✔️ ChildComponent is fully created and ready.


🛑 Why Not Use ngOnInit for This?
ngOnInit is for inputs and initialization, but the DOM doesn’t exist yet.

Example that fails:
ngOnInit() {
  console.log(this.myInput); // undefined ❌
}

Simple mental model
  The order of the main lifecycle hooks:
	1.	ngOnInit --> Component created -- fetching data (DOM not needed)
	2.	ngAfterContentInit
	3.	ngAfterViewInit ← (this one) template/DOM created -- DOM manipulation, calling methods on child components, running animations, accessing @viewchild,
	4.	ngAfterViewChecked

ngAfterViewInit runs once — right after Angular has created your component’s view.
   */
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

     // concat 2 observables:
     // (1) initialLessons$ loadLessons first and only then show (2) searchLessons$ search results
     // this.lesson$ = this.loadLessons()

     const initialLessons$ = this.loadLessons()
     this.lesson$ = concat(initialLessons$, searchLessons$)*/

    // alternative simpler way without concat initialLessons$ and searchLessons$ and just having 1 lesson$ with startWith on search to just load all the lessons
    this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        startWith(''), // startWith emits a new observable based on the previous observable of search Terms
        // problem: sometimes it's not easy to understand what's going on in the observable chain with multiple operators just by reading the chain, solution: debug by using the tap operator to produce debugging logging statements, can comment out as needed when too many logs
        // tap((search) => console.log("Search: ", search)),
        debug(RxJSLoggingLevel.TRACE, "Debug Trace - Search Input Value: "),
        debounceTime(400),
        // throttleTime(500),  // for typeahead search better use debounceTime instead of throttleTime because throttle does not take the latest value like debounceTime, it may just take the 1st value in the stream of values e.g. Hello (it only chose the "H" instead of the entire Hello
        distinctUntilChanged(), // Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from the previous item. If a comparator function is provided, then it will be called for each item to test for whether or not that value should be emitted. // 1,1,2,2 => 1,2
        switchMap(searchTerm => this.loadLessons(searchTerm)),
        // use switchMap instead of concatMap to cancel the previous http request (status code 0, prevent request from completing at all) when having a new search term in the typeahead feature
        debug(RxJSLoggingLevel.DEBUG, "Debug lesson value from backend request: "), // log lessons from switchMap making backend call
      )
  }

  loadLessons(searchTerm = ''): Observable<Lesson[]> {
    return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${searchTerm}`)
      .pipe(map(res => res['payload']))
  }

}











