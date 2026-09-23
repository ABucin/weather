import { HttpResourceRef } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { WeatherResponse, WeatherUI, WMO_CODE_MAPPING, WmoCode } from '../model/weather.model';
import { WeatherService } from '../services/weather.service';
import {
  featherCloudDrizzle,
  featherSun,
  featherCloudRain,
  featherCloud,
  featherLoader,
} from '@ng-icons/feather-icons';

@Component({
  imports: [NgIcon],
  providers: [provideIcons({ featherCloudDrizzle, featherSun, featherCloudRain, featherCloud, featherLoader })],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly weatherService = inject(WeatherService);

  private readonly NR_DAYS = 7;

  private weatherResponse: HttpResourceRef<WeatherResponse | undefined> =
    this.weatherService.weatherResponse;

  protected weather = this.weatherResponse.value;
  protected isLoading = this.weatherResponse.isLoading;

  public dailyWeather = computed<WeatherUI[]>(() =>
    Array(this.NR_DAYS)
      .fill(0)
      .map((_, i) => ({
        time: this.weather()?.daily?.time[i] || '',
        maxTemp: this.weather()?.daily?.temperature_2m_max[i] || 0,
        minTemp: this.weather()?.daily?.temperature_2m_min[i] || 0,
        code: this.mapWmoCode(this.weather()?.daily?.weather_code[i] as WmoCode),
      })),
  );

  private mapWmoCode(code: WmoCode): string {
    const entry = WMO_CODE_MAPPING[code];
    return entry?.icon;
  }
}
