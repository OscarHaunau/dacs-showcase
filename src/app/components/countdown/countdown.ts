import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './countdown.html',
  styleUrls: ['./countdown.css']
})
export class CountdownComponent {
  @Input() targetIso = '';
  clock = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  private intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    const target = new Date(this.targetIso).getTime();
    const tick = () => this.updateClock(target);

    tick();
    this.intervalId = setInterval(tick, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateClock(target: number) {
    const now = Date.now();
    const remaining = Math.max(target - now, 0);

    const DAY = 24 * 60 * 60 * 1000;
    const HOUR = 60 * 60 * 1000;
    const MINUTE = 60 * 1000;

    const days = Math.floor(remaining / DAY);
    const hours = Math.floor((remaining % DAY) / HOUR);
    const minutes = Math.floor((remaining % HOUR) / MINUTE);
    const seconds = Math.floor((remaining % MINUTE) / 1000);

    this.clock = { days, hours, minutes, seconds };
  }
}