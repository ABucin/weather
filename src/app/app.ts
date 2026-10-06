import { HttpResourceRef } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  featherCloud,
  featherCloudDrizzle,
  featherCloudRain,
  featherLoader,
  featherSun,
  featherUmbrella,
} from '@ng-icons/feather-icons';
import { ChartComponent } from '../components/chart.component';
import {
  NR_DAYS,
  NR_PAST_DAYS,
  WeatherDaily,
  WeatherResponse,
  WeatherUI,
  WMO_CODE_MAPPING,
  WmoCode
} from '../model/weather.model';
import { WeatherService } from '../services/weather.service';

@Component({
  providers: [
    provideIcons({
      featherUmbrella,
      featherCloudDrizzle,
      featherSun,
      featherCloudRain,
      featherCloud,
      featherLoader
    })
  ],
  selector: 'app-root',
  styleUrl: './app.scss',
  imports: [
    NgIcon,
    ChartComponent
  ],
  templateUrl: './app.html'
})
export class App {
  private readonly weatherService = inject(WeatherService);

  private weatherResponse: HttpResourceRef<WeatherResponse | undefined> =
    this.weatherService.weatherResponse;

  protected weather = this.weatherResponse.value;
  protected isLoading = this.weatherResponse.isLoading;

  public dailyWeather = computed<WeatherUI[]>(() => this.mapWeatherData(this.weather()?.daily));

  private mapWeatherData(weather: WeatherDaily | undefined): WeatherUI[] {
    return Array(NR_DAYS + NR_PAST_DAYS)
      .fill(0)
      .map((_, i): WeatherUI => {
        const dateTimeMs = Number.parseInt(weather?.time[i] ?? '0') * 1000;
        const dateTime = Temporal.Instant.fromEpochMilliseconds(dateTimeMs).toLocaleString('en-UK', {
          month: 'short',
          day: 'numeric',
          weekday: 'short',
        });
        const now = Temporal.PlainDate.from(Temporal.Now.plainDateISO());
        const tz = Temporal.Now.timeZoneId();

        return {
          dateTime,
          inPast:
            Temporal.PlainDate.compare(
              Temporal.Instant.fromEpochMilliseconds(dateTimeMs)
                .toZonedDateTimeISO(tz)
                .toPlainDate(),
              now,
            ) === -1,
          maxTemp: weather?.temperature_2m_max[i]?.toFixed(0) || '',
          minTemp: weather?.temperature_2m_min[i]?.toFixed(0) || '',
          precipitation: `${weather?.precipitation_probability_max[i]}` || '',
          code: this.mapWmoCode(weather?.weather_code[i] as WmoCode),
        };
      });
  }

  private mapWmoCode(code: WmoCode): string {
    const entry = WMO_CODE_MAPPING[code];
    return entry?.icon;
  }

  protected readonly featherUmbrella = featherUmbrella;
}
