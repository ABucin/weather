import { httpResource, HttpResourceRef } from '@angular/common/http';
import { Service } from '@angular/core';
import { WeatherResponse } from '../model/weather.model';

@Service()
export class WeatherService {
  public weatherResponse: HttpResourceRef<WeatherResponse | undefined> = httpResource<WeatherResponse>(() => ({
    url: `https://api.open-meteo.com/v1/forecast`,
    params: {
      latitude: '46.7614',
      longitude: '23.6138',
      daily: 'temperature_2m_max,temperature_2m_min,weather_code'
    }
  }));
}
