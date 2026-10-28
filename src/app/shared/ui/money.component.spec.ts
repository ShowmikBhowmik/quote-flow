import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Money } from './money.component';

@Component({
  imports: [Money],
  template: `<app-money [value]="value()" />`,
})
class Host {
  readonly value = signal(1234);
}

describe('Money', () => {
  it('formats whole dollars with a thousands separator and exposes the settled value to assistive tech', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.sr-only')?.textContent).toBe('$1,234');
    expect(el.querySelector('.digits')?.textContent).toBe('$1,234');
  });

  it('renders negative amounts with a minus sign', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.value.set(-485);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.sr-only')?.textContent).toBe('−$485');
  });
});
