import { ChangeDetectionStrategy, Component, ElementRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { BUSINESS_CLASSES, CLASS_GROUPS } from '../../../core/data/business-classes';
import { QuoteStore } from '../../../core/services/quote-store.service';
import { Icon } from '../../../shared/ui/icon.component';
import { invalid, revealErrors, toNumber } from './step-form';

@Component({
  selector: 'app-business-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Icon],
  template: `
    <form class="step" [formGroup]="form" (ngSubmit)="submit()" novalidate>
      <header class="step-head">
        <h1 tabindex="-1">Tell us about your business</h1>
        <p class="lede">Three questions. The price starts posting on the next step.</p>
      </header>

      <div class="field">
        <label for="businessName">Business name</label>
        <input id="businessName" class="input" type="text" formControlName="businessName" autocomplete="organization" placeholder="e.g. Fernway Coffee Roasters" [attr.aria-invalid]="invalid('businessName')" aria-describedby="businessName-error" />
        <p id="businessName-error" class="error" role="alert" [hidden]="!invalid('businessName')"><app-icon name="alert" [size]="14" /> Enter the name you trade under (at least 2 characters).</p>
      </div>

      <div class="field">
        <label for="classCode">What kind of business is it?</label>
        <select id="classCode" class="select" formControlName="classCode" [attr.aria-invalid]="invalid('classCode')" aria-describedby="classCode-hint classCode-error">
          <option value="" disabled>Choose the closest match</option>
          @for (group of groups; track group) {
            <optgroup [label]="group">
              @for (cls of classesIn(group); track cls.code) { <option [value]="cls.code">{{ cls.name }}</option> }
            </optgroup>
          }
        </select>
        <p id="classCode-hint" class="hint">Your class sets the base rate for every coverage.</p>
        <p id="classCode-error" class="error" role="alert" [hidden]="!invalid('classCode')"><app-icon name="alert" [size]="14" /> Pick the category that fits best.</p>
      </div>

      <div class="field field-short">
        <label for="yearsInBusiness">Years in business</label>
        <input id="yearsInBusiness" class="input tnum" type="number" inputmode="numeric" min="0" max="100" step="1" formControlName="yearsInBusiness" [attr.aria-invalid]="invalid('yearsInBusiness')" aria-describedby="years-hint years-error" />
        <p id="years-hint" class="hint">Three or more years earns a credit. Ten or more earns a bigger one.</p>
        <p id="years-error" class="error" role="alert" [hidden]="!invalid('yearsInBusiness')"><app-icon name="alert" [size]="14" /> Enter a whole number between 0 and 100.</p>
      </div>

      <div class="actions">
        <button type="submit" class="btn btn-primary">Continue<app-icon name="arrowRight" [size]="18" /></button>
      </div>
    </form>
  `,
  styleUrl: './steps.scss',
})
export class BusinessStep {
  private readonly store = inject(QuoteStore);
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);
  protected readonly groups = CLASS_GROUPS;
  protected readonly submitted = signal(false);

  protected readonly form = new FormGroup({
    businessName: new FormControl(this.store.draft().businessName, { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    classCode: new FormControl(this.store.draft().classCode, { nonNullable: true, validators: [Validators.required] }),
    yearsInBusiness: new FormControl<number | null>(this.store.draft().yearsInBusiness, { validators: [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern(/^\d+$/)] }),
  });

  constructor() {
    this.form.valueChanges.pipe(debounceTime(80), takeUntilDestroyed()).subscribe(() => this.commit());
  }

  protected classesIn(group: string) {
    return BUSINESS_CLASSES.filter((c) => c.group === group);
  }

  /** Writes the form into the store. Called debounced on change and synchronously on submit so a fast Enter never races the guard. */
  private commit(): void {
    const v = this.form.getRawValue();
    this.store.patch({
      businessName: v.businessName ?? '',
      classCode: v.classCode ?? '',
      yearsInBusiness: toNumber(v.yearsInBusiness),
    });
  }

  protected invalid(name: keyof typeof this.form.controls): boolean {
    return invalid(this.form.get(name), this.submitted());
  }

  protected submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      revealErrors(this.form, this.host);
      return;
    }
    this.commit();
    this.router.navigateByUrl('/quote/location');
  }
}
