import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CypherService } from './cypher.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cypher',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cypher.component.html',
  styleUrl: './cypher.component.scss'
})
export class CypherComponent implements OnDestroy {
  public inputForm = new FormGroup({
    input: new FormControl('', { validators: [Validators.required, Validators.pattern('[a-z ]*')]}),
    result: new FormControl(''),
  });

  public showTip$: Observable<boolean>;

  private _showTip$ = new BehaviorSubject<boolean>(false);

  constructor(private readonly cypherService: CypherService) {
    this.showTip$ = this._showTip$.asObservable();
    this.inputForm.controls.input.statusChanges.pipe(
      tap(status => {
        if (status === 'INVALID' && this.inputForm.controls.input.errors?.['pattern']) {
          this._showTip$.next(true);
        } else {
          this._showTip$.next(false);
        }
      }),
      takeUntilDestroyed()
    ).subscribe();
  }

  public encrypt(): void {
    if (this.inputForm.value.input) {
      const result = this.cypherService.encrypt(this.inputForm.value.input);
      this.inputForm.controls.result.patchValue(result);
    }
  }

  public decrypt(): void {
    if (this.inputForm.value.input) {
      const result = this.cypherService.decrypt(this.inputForm.value.input);
      this.inputForm.controls.result.patchValue(result);
    }
  }

  public ngOnDestroy(): void {
    this.inputForm.controls.input.reset();
    this.inputForm.controls.result.reset();
    this._showTip$.next(false);
    this._showTip$.complete();
  }
}
