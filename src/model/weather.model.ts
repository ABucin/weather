export interface WeatherDaily {
  temperature_2m_min: number[];
  temperature_2m_max: number[];
  time: string[];
  weather_code: number[];
}

export interface WeatherResponse {
  daily: WeatherDaily;
}

export interface WeatherUI {
  date: string;
  maxTemp: number;
  minTemp: number;
  code: string;
}

export interface WeatherCode {
  description: string;
  icon: string;
}

export type WmoCode = 0 | 1 | 3 | 45 | 61 | 80;

export const WMO_CODE_MAPPING: Record<WmoCode, WeatherCode> = {
  0: {
    description: 'Clear sky',
    icon: 'featherSun',
  },
  1: {
    description: 'Mainly clear',
    icon: 'featherCloudRain',
  },
  3: {
    description: 'Overcast',
    icon: 'featherCloud',
  },
  45: {
    description: 'Fog',
    icon: 'featherCloudRain',
  },
  61: {
    description: 'Slight rain',
    icon: 'featherCloudDrizzle',
  },
  80: {
    description: 'Slight rain showers',
    icon: 'featherCloudDrizzle',
  },
};
