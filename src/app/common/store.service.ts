import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject, timer} from 'rxjs';
import {Course} from '../model/course';
import {delayWhen, filter, map, retryWhen, shareReplay, tap, withLatestFrom} from 'rxjs/operators';
import {createHttpObservable} from './util';
import {fromPromise} from 'rxjs/internal-compatibility';


@Injectable({
  providedIn: 'root' // Angular registers this Store globally to be injectable anywhere
})
export class Store {

  private behaviorSubject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.behaviorSubject.asObservable();


  init() {

    const http$: Observable<any> = createHttpObservable('/api/courses')

    http$
      .pipe(
        tap(res => console.log("store service init() function: GET /api/courses executed. res: ", res)),
        map(res => Object.values(res['payload']) as Course[])
      )
      .subscribe(courses => {
        this.behaviorSubject.next(courses)
      })
  }

  selectBeginnerCourses() {
    return this.filterByCategory('BEGINNER');
  }

  selectAdvancedCourses() {
    return this.filterByCategory('ADVANCED');
  }

  selectCourseById(courseId: number) {
    return this.courses$
      .pipe(
        map(courses => courses.find(course => course.id == courseId)),
        filter(course => !!course)
      );
  }

  filterByCategory(category: string) {
    return this.courses$
      .pipe(
        map(courses => courses
          .filter(course => course.category == category))
      );
  }

  /*
  save course in memory and broadcast new course to all subscribers
  course saved optimistically in memory

  ✅ You update the UI immediately, before the server responds
  ❌ If the save fails, you rollback or show an error

This makes the app feel fast instead of “spinner-heavy”.

Normal save: click → wait → server → update UI
Optimistic save: click → update UI → server
                 ↳ rollback if error
   */
  saveCourse(courseId: number, changedCourseObj: Course ) {

    // part 1: optimistically update course on the frontend with in memory changes -- then update on backend later
    const courses: Course[] = this.behaviorSubject.getValue()

    /*
    🚨 Bug #1 (the big one): assignment instead of comparison
    const courseIndex = courses.findIndex(course => course.id = courseId)

    You’re using = (assignment) instead of === (comparison).

What this does
	•	Assigns courseId to every course.id
	•	Returns the first index (0) because assignment evaluates truthy
	•	Mutates your existing state ❌

	This alone can cause:
	•	Wrong item updating
	•	UI not reflecting expected changes
	•	Silent state corruption
     */
    const courseIndex = courses.findIndex(course => course.id === courseId)
    // debugging log
    console.debug("courseIndex: ", courseIndex);

    /*
    ⚠️ Issue #2: mutating the original state before cloning
        const courses: Course[] = this.behaviorSubject.getValue()

This gives you a reference to the internal array.
If ANYTHING mutates courses, you’ve already broken immutability.
Even though you later do slice(0), the damage may already be done (especially because of bug #1).
     */
    // copy courses into new array for the update request
  /*  const newCourses = courses.slice(0)

    newCourses[courseIndex] = {
      ...courses[courseIndex], // spread operator copy all other courses including desired course
      ...courseChanges // spread operator update that course with the updated changes
    }*/

    /*
    ✔ Best practice (single immutable flow)
    Why this works
    	•	No mutation
	•	No index math
	•	Guaranteed new array + new object
	•	Works perfectly with OnPush
	•	Optimistic UI updates instantly
     */
    const newCourses = courses.map(course =>
      course.id === courseId ? {...courses, ...changedCourseObj}: course
    )

    // part 1: broadcast changes in memory for UI to update optimistically
    this.behaviorSubject.next(newCourses)

    // debugging log
    this.behaviorSubject.subscribe(change => console.log("BehaviorSubject EMIT courses: {}", change))
    console.log("sanity check: this should be true: this.behaviorSubject.getValue !== courses (courses updated from original) ", this.behaviorSubject.getValue() !== courses) // sanity check this should be true
    /*
    ❌Problem:
    When frontend changes don’t update optimistically after this.behaviorSubject.next(newCourses), the issue is almost always how the data is being mutated or subscribed, not the .next() call itself.

1️⃣ Mutating the same array/object (most common)
❌ Problem
const courses = this.behaviorSubject.value;
courses.push(newCourse);
this.behaviorSubject.next(courses); // pushing same reference to same array so no new published message

or for object updates
this.behaviorSubject.next(
  this.behaviorSubject.value.map(c =>
    c.id === updated.id ? { ...c, ...updated } : c
  )
);

3️⃣ Component not subscribed correctly
If your template uses async, Angular will only update when it sees a new emission.
✅ Best practice
courses$ = this.subject.asObservable();
<div *ngFor="let c of courses$ | async">
<courses-card-list [courses]="beginnerCourses$ | async">
❌ Avoid manual subscriptions unless needed.

4️⃣ OnPush change detection
If your component uses changeDetection: ChangeDetectionStrategy.OnPush
Then immutability is mandatory.

✔ Always:
	•	Create new arrays
	•	Create new objects
	•	Never mutate nested properties directly

	5️⃣ HTTP request overwriting the optimistic update
	A very common gotcha:

	this.subject.next(newCourses); // optimistic
this.http.post(...).subscribe(response => {
  this.subject.next(response); // optimistic update accidentally overwritten
});

✅ Fix
Merge server response instead of replacing:
this.http.post(...).subscribe(saved => {
  this.subject.next(
    this.subject.value.map(c =>
      c.tempId === saved.tempId ? saved : c
    )
  );
});

6️⃣ Emitting inside a pipe incorrectly
If this is inside a stream:
❌tap(courses => this.subject.next(courses))
✔ Ensure subscribers are not resubscribing/resetting state elsewhere.

Quick debugging checklist
Add this log:
this.subject.subscribe(v => console.log('EMIT', v));
If it logs but UI doesn’t update → change detection / mutation issue
If it doesn’t log → .next() isn’t being hit

TL;DR (most likely fix)

👉 You are mutating the same array reference
✔ Always emit new arrays / new objects

     */


    // part 2: send request to backend, return promise to the dialog
    return fromPromise(fetch(`api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(changedCourseObj),
      headers: {
        'content-type': 'application/json'
      }
    }));


  }


}

/*
==============Example Data=======================
always have data in notes to reference

  12: {
    id: 12,
    titles: {
      description: 'Angular Testing Course',
      longDescription: 'In-depth guide to Unit Testing and E2E Testing of Angular Applications'
    },
    iconUrl: 'https://s3-us-west-1.amazonaws.com/angular-university/course-images/angular-testing-small.png',
    category: 'BEGINNER',
    seqNo: 0,
    url: 'angular-testing-course',
    lessonsCount: 10,
  },

  2: {
    id: 2,
 */


























