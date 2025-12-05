import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Global error handlers for debugging runtime issues (render in console and localStorage)
window.addEventListener('error', (ev) => {
  try { console.error('[GlobalError]', ev); localStorage.setItem('lastAppError', JSON.stringify(ev.error || ev.message || ev)); } catch {};
});
window.addEventListener('unhandledrejection', (ev) => {
  try { console.error('[UnhandledRejection]', ev); localStorage.setItem('lastAppError', JSON.stringify(ev.reason || ev)); } catch {};
});

bootstrapApplication(App, appConfig)
  .catch((err) => { console.error('[BootstrapError]', err); try { localStorage.setItem('lastAppError', JSON.stringify(err)); } catch {} });
