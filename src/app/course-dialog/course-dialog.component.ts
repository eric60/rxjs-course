import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import moment from 'moment';
import {fromEvent, noop} from 'rxjs';
import {concatMap, distinctUntilChanged, exhaustMap, filter, mergeMap, tap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Store} from '../common/store.service';

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css'],
  standalone: false
})
export class CourseDialogComponent implements AfterViewInit {

  form: FormGroup;

  course: Course;

  @ViewChild('saveButton', {static: true}) saveButton: ElementRef;

  @ViewChild('searchInput', {static: true}) searchInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    private store: Store) {

    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required]
    });

  }

  ngOnInit() {
    // value emitted is form inputs
    this.form.valueChanges.pipe(
      filter(() => this.form.valid),
      concatMap(changes => this.saveCourse(changes))
    )
      // don't need to subscribe anymore because concatMap is (1) creating observables by mapping each formChange to its own observable, subscrbing to them, and commpleting them, and concatenating them together
    .subscribe(changes => {

      // PROBLEM: constant saving constant waterfall
      // Old code is just combining 2 observables 1 after the other after each form.valid change from valueChanges observable causing constant http requests, need new code to combine all changesFormChanges into 1 http request saveCourse
     /*
      const saveCourses$ = this.saveCourse(changes)
      saveCourses$.subscribe()
      */
      // SOLUTION: sequential saving, backend 2 second delay - consistent waterfall
      // concatmap converts each value from observable into its OWN observable, maps each value to an observable then flattens all these inner observables using concatAll
    })
  }

  saveCourse(changesFormChanges) {
    const saveCourse$ = fromPromise(fetch(`/api/courses/${this.course.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(changesFormChanges),
          headers: {
            'content-type': 'application/json'
          }
        }));
    return saveCourse$;
  }

  ngAfterViewInit() {

  }

  save() {
    this.store.saveCourse(this.course.id, this.form.value)
      .subscribe(
        () => this.close(),
        err => console.log("Error saving course", err)
      );
  }


  close() {
    this.dialogRef.close();
  }


}
