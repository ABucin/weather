import { Component, computed, effect, ElementRef, input, viewChild } from '@angular/core';
import { WeatherResponse } from '../model/weather.model';

@Component({
  selector: 'wa-chart',
  templateUrl: 'chart.component.html',
  styleUrl: 'chart.component.scss',
})
export class ChartComponent {
  public weather = input<WeatherResponse>();

  protected chartRef = viewChild<ElementRef<HTMLCanvasElement>>('chart');
  protected maxTemperature = computed(() => this.weather()?.daily?.temperature_2m_max || []);
  protected minTemperature = computed(() => this.weather()?.daily?.temperature_2m_min || []);

  private readonly chartEffect = effect(() => {
    const chartElement = this.chartRef()?.nativeElement as HTMLCanvasElement;

    if (chartElement) {
      this.drawChart(chartElement);
    }
  });

  private drawChart(canvas: HTMLCanvasElement): void {
    // Get the device pixel ratio (usually 2 or 3 on high-res screens)
    const dpr = window.devicePixelRatio || 1;
    // Set the display size (CSS)
    const width = 600;
    const height = 400;
    const padding = 25;

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    // Set the actual rendering size (multiplied by DPR)
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    // Scale the context so your drawing coordinates remain unchanged
    ctx.scale(dpr, dpr);

    const minC = Math.min(...this.minTemperature(), ...this.maxTemperature(), -25);
    const maxC = Math.max(...this.minTemperature(), ...this.maxTemperature(), 40);
    const lowsScale = this.minTemperature()?.map((t) =>
      this.scaleCelsiusToPx(t, minC, maxC, padding, height - padding),
    );
    const highsScale = this.maxTemperature()?.map((t) =>
      this.scaleCelsiusToPx(t, minC, maxC, padding, height - padding),
    );

    this.drawLine(ctx, highsScale, this.maxTemperature(), padding, 'rgba(248,81,73,1)');
    this.drawLine(ctx, lowsScale, this.minTemperature(), padding, 'rgba(88,166,255,1)');
  }

  private drawLine(
    ctx: CanvasRenderingContext2D,
    source: number[] = [],
    labelSource: number[] = [],
    padding: number,
    color: string = 'white',
  ): void {
    // to display crisp lines
    const scaleFactor = 0.5;
    const xScale = (600 - padding) / source.length;

    ctx.strokeStyle = color;
    ctx.moveTo(xScale, 250 + scaleFactor - padding);
    ctx.arc(xScale, 250 + scaleFactor - padding, 3, 0, 180);
    ctx.fillStyle = color;
    ctx.beginPath();

    source.forEach((temperature, i) => {
      ctx.lineTo(xScale * (i + 1), temperature + scaleFactor);
      ctx.moveTo(xScale * (i + 1), temperature + scaleFactor);
      ctx.arc(xScale * (i + 1), temperature + scaleFactor, 3, 0, 180);
      ctx.fillStyle = color;
      ctx.fillText(labelSource[i].toString(), xScale * (i + 1), temperature + scaleFactor - 10);
    });

    ctx.stroke();
    ctx.fill();
  }

  private scaleCelsiusToPx(
    celsius: number,
    cMin: number,
    cMax: number,
    pxMin: number,
    pxMax: number,
  ): number {
    // 1. Normalize the Celsius value to a 0.0 - 1.0 percentage
    const percentage = (celsius - cMin) / (cMax - cMin);

    // 2. Map the percentage into the inverted pixel range
    // When percentage is 1 (hot), it yields pxMin (top). When 0 (cold), it yields pxMax (bottom).
    return pxMax + percentage * (pxMin - pxMax);
  }
}
