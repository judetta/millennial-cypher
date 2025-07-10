import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CypherService } from './cypher.service';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type Mode = 'encrypt' | 'decrypt';
type Props = {
  pattern: string,
  tip: string,
};

const modeProps: Record<Mode, Props> = {
  encrypt: {
    pattern: '[a-z ]*',
    tip: 'Current MVP only supports encrypting lowercase a-z and space',
  },
  decrypt: {
    pattern: '[0-9]*',
    tip: 'You can decrypt only numbers',
  }
}

@Component({
  selector: 'app-cypher',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cypher.component.html',
  styleUrl: './cypher.component.scss'
})
export class CypherComponent implements OnDestroy {
  public inputForm = new FormGroup({
    input: new FormControl('', { validators: [Validators.required, Validators.pattern(modeProps.encrypt.pattern)]}),
    result: new FormControl(''),
  });

  public mode$: Observable<Mode>;
  public inputIsInvalid$: Observable<boolean>;
  public tipForInvalid$: Observable<string>;

  private _mode$ = new BehaviorSubject<Mode>('encrypt');
  private _inputIsInvalid$ = new BehaviorSubject<boolean>(false);
  private _tipForInvalid$ = new BehaviorSubject<string>(modeProps.encrypt.tip);

  constructor(private readonly cypherService: CypherService) {
    this.mode$ = this._mode$.asObservable();
    this.inputIsInvalid$ = this._inputIsInvalid$.asObservable();
    this.tipForInvalid$ = this._tipForInvalid$.asObservable();

    this.inputForm.controls.input.statusChanges.pipe(
      tap(status => {
        if (status === 'INVALID' && this.inputForm.controls.input.errors?.['pattern']) {
          this._inputIsInvalid$.next(true);
        } else {
          this._inputIsInvalid$.next(false);
        }
      }),
      takeUntilDestroyed()
    ).subscribe();

    this.inputForm.controls.input.valueChanges.pipe(
      tap(value => this.transform(value)),
      takeUntilDestroyed()
    ).subscribe();
  }

  public setMode(mode: Mode): void {
    this._mode$.next(mode);
    const pattern = modeProps[mode].pattern;
    this.inputForm.controls.input.setValidators([Validators.required, Validators.pattern(pattern)]);
    this.inputForm.updateValueAndValidity();
    this._tipForInvalid$.next(modeProps[mode].tip);
  }

  public ngOnDestroy(): void {
    this.inputForm.controls.input.reset();
    this.inputForm.controls.result.reset();
    this._mode$.next('encrypt');
    this._mode$.complete();
    this._inputIsInvalid$.next(false);
    this._inputIsInvalid$.complete();
    this._tipForInvalid$.next('');
    this._tipForInvalid$.complete();
  }

  private transform(value: string | null): void {
    if (value && this._inputIsInvalid$.value === false) {
      const result = this._mode$.value === 'decrypt' ? this.cypherService.decrypt(value) : this.cypherService.encrypt(value);
      this.inputForm.controls.result.patchValue(result);
    }
  }
}
