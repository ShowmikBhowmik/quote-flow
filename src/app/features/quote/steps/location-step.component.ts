import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { US_STATES } from '../../../core/data/states';
import { QuoteStore } from '../../../core/services/quote-store.service';
import { Icon } from '../../../shared/ui/icon.component';
import { invalid, revealErrors, toNumber } from './step-form';

@Component({
  selector: 'app-location-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, Icon],
  template: `
    <form class="step" [formGroup]="form" (ngSubmit)="submit()" novalidate>
      <header class="step-head">
        <h1 tabindex="-1">Where you work and who works for you</h1>
        <p class="lede">Location sets the territory rate. Payroll drives workers' comp. Revenue drives liability. Watch the ledger as you type.</p>
      </header>

      <div class="grid-2">
        <div class="field">
          <label for="state">State</label>
          <select id="state" class="select" formControlName="state" autocomplete="address-level1" [attr.aria-invalid]="invalid('state')" aria-describedby="state-error">
            <option value="" disabled>Choose a state</option>
            @for (s of states; track s.code) { <option [value]="s.code">{{ s.name }}</option> }
          </select>
          <p id="state-error" class="error" role="alert" [hidden]="!invalid('state')"><app-icon name="alert" [size]="14" /> Choose the state your business operates in.</p>
        </div>
        <div class="field">
          <label for="zip">ZIP code</label>
          <input id="zip" class="input tnum" type="text" inputmode="numeric" maxlength="5" autocomplete="postal-code" formControlName="zip" placeholder="97201" [attr.aria-invalid]="invalid('zip')" aria-describedby="zip-error" />
          <p id="zip-error" class="error" role="alert" [hidden]="!invalid('zip')"><app-icon name="alert" [size]="14" /> Enter a five-digit ZIP code.</p>
        </div>
      </div>

      <div class="grid-2">
        <div class="field">
          <label for="employees">Employees</label>
          <input id="employees" class="input tnum" type="number" inputmode="numeric" min="0" max="500" step="1" formControlName="employees" [attr.aria-invalid]="invalid('employees')" aria-describedby="employees-hint employees-error" />
          <p id="employees-hint" class="hint">Not counting yourself. Enter 0 if it is just you.</p>
          <p id="employees-error" class="error" role="alert" [hidden]="!invalid('employees')"><app-icon name="alert" [size]="14" /> Enter a whole number between 0 and 500.</p>
        </div>
        <div class="field">
          <label for="annualPayroll">Annual payroll</label>
          <div class="input-affix">
            <span class="affix" aria-hidden="true">$</span>
            <input id="annualPayroll" class="input tnum" type="number" inputmode="numeric" min="0" step="1000" formControlName="annualPayroll" placeholder="0" [attr.aria-invalid]="invalid('annualPayroll')" aria-describedby="payroll-hint payroll-error" />
          </div>
          <p id="payroll-hint" class="hint">{{ payrollHint() }}</p>
          <p id="payroll-error" class="error" role="alert" [hidden]="!invalid('annualPayroll')"><app-icon name="alert" [size]="14" /> Enter payroll in whole dollars, or 0 with no employees.</p>
        </div>
      </div>

      <div class="grid-2">
        <div class="field">
          <label for="annualRevenue">Annual revenue</label>
          <div class="input-affix">
            <span class="affix" aria-hidden="true">$</span>
            <input id="annualRevenue" class="input tnum" type="number" inputmode="numeric" min="1" step="1000" formControlName="annualRevenue" placeholder="250000" [attr.aria-invalid]="invalid('annualRevenue')" aria-describedby="revenue-hint revenue-error" />
          </div>
          <p id="revenue-hint" class="hint">Your best estimate for the next twelve months.</p>
          <p id="revenue-error" class="error" role="alert" [hidden]="!invalid('annualRevenue')"><app-icon name="alert" [size]="14" /> Enter expected revenue greater than $0.</p>
        </div>
        <div class="field">
          <label for="propertyValue">Equipment and inventory</label>
          <div class="input-affix">
            <span class="affix" aria-hidden="true">$</span>
            <input id="propertyValue" class="input tnum" type="number" inputmode="numeric" min="0" step="1000" formControlName="propertyValue" placeholder="0" [attr.aria-invalid]="invalid('propertyValue')" aria-describedby="property-hint property-error" />
          </div>
          <p id="property-hint" class="hint">What it would cost to replace everything in your space. Used for property coverage only.</p>
          <p id="property-error" class="error" role="alert" [hidden]="!invalid('propertyValue')"><app-icon name="alert" [size]="14" /> Enter a value of $0 or more.</p>
        </div>
      </div>

      <div class="actions">
        <a class="btn btn-secondary" routerLink="/quote/business"><app-icon name="arrowLeft" [size]="18" />Back</a>
        <button type="submit" class="btn btn-primary">Continue to coverage<app-icon name="arrowRight" [size]="18" /></button>
      </div>
    </form>
  `,
  styleUrl: './steps.scss',
})
export class LocationStep {
  private readonly store = inject(QuoteStore);
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);
  protected readonly states = US_STATES;
  protected readonly submitted = signal(false);

  protected readonly form = new FormGroup({
    state: new FormControl(this.store.draft().state, { nonNullable: true, validators: [Validators.required] }),
    zip: new FormControl(this.store.draft().zip, { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{5}$/)] }),
    employees: new FormControl<number | null>(this.store.draft().employees, { validators: [Validators.required, Validators.min(0), Validators.max(500), Validators.pattern(/^\d+$/)] }),
    annualPayroll: new FormControl<number | null>(this.store.draft().annualPayroll || null, { validators: [Validators.required, Validators.min(0)] }),
    annualRevenue: new FormControl<number | null>(this.store.draft().annualRevenue || null, { validators: [Validators.required, Validators.min(1)] }),
    propertyValue: new FormControl<number | null>(this.store.draft().propertyValue || null, { validators: [Validators.required, Validators.min(0)] }),
  });

  private readonly employees = signal(this.store.draft().employees);
  protected readonly payrollHint = computed(() =>
    this.employees() > 0
      ? `Gross wages for all ${this.employees()} employee${this.employees() === 1 ? '' : 's'} over a year, before tax.`
      : 'Gross wages for the year. With no employees, enter 0 and skip workers’ comp.',
  );

  constructor() {
    this.form.valueChanges.pipe(debounceTime(80), takeUntilDestroyed()).subscribe(() => this.commit());
  }

  /** Writes the form into the store. Called debounced on change and synchronously on submit so a fast Enter never races the guard. */
  private commit(): void {
    const v = this.form.getRawValue();
    this.employees.set(toNumber(v.employees));
    this.store.patch({
      state: v.state ?? '',
      zip: v.zip ?? '',
      employees: toNumber(v.employees),
      annualPayroll: toNumber(v.annualPayroll),
      annualRevenue: toNumber(v.annualRevenue),
      propertyValue: toNumber(v.propertyValue),
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
    this.router.navigateByUrl('/quote/coverage');
  }
}
