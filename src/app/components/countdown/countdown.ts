import { Component, Input, signal } from '@angular/core';
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
  clock = signal({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  ngOnInit() {
    const target = new Date(this.targetIso).getTime();
    const tick = () => {
      const now = Date.now();
      const d = Math.max(target - now, 0);
      const days = Math.floor(d / (24*60*60*1000));
      const hours = Math.floor((d % (24*60*60*1000)) / (60*60*1000));
      const minutes = Math.floor((d % (60*60*1000)) / (60*1000));
      const seconds = Math.floor((d % (60*1000)) / 1000);
      this.clock.set({ days, hours, minutes, seconds });
    };
    tick();
    setInterval(tick, 1000);
  }
}