import { ElementRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

/** Shared helpers for the step forms. */

export function invalid(control: AbstractControl | null, submitted: boolean): boolean {
  return !!control && control.invalid && (control.touched || submitted);
}

/** Marks everything touched and moves focus to the first invalid control. */
export function revealErrors(form: FormGroup, host: ElementRef<HTMLElement>): void {
  form.markAllAsTouched();
  const firstInvalid = Object.keys(form.controls).find((name) => form.controls[name].invalid);
  if (!firstInvalid) return;
  host.nativeElement.querySelector<HTMLElement>(`[formcontrolname="${firstInvalid}"]`)?.focus();
}

export const toNumber = (v: unknown): number => {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
};
