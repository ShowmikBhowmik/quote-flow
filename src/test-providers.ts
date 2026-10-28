import { provideZonelessChangeDetection } from '@angular/core';

/** The app runs zoneless; the test environment has to as well. */
export default [provideZonelessChangeDetection()];
