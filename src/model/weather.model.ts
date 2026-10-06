export interface WeatherDaily {
  temperature_2m_min: number[];
  temperature_2m_max: number[];
  precipitation_probability_max: number[];
  time: string[];
  weather_code: number[];
}

export interface WeatherResponse {
  daily: WeatherDaily;
}

export interface WeatherUI {
  dateTime: string;
  maxTemp: string;
  minTemp: string;
  code: string;
  inPast: boolean;
  precipitation: string;
}

export interface WeatherCode {
  description: string;
  icon: string;
}

export type WmoCode = 0 | 1 | 2| 3 | 45 | 61 | 80;

export const NR_DAYS = 7;
export const NR_PAST_DAYS = 2;
export const WMO_CODE_MAPPING: Record<WmoCode, WeatherCode> = {
  0: {
    description: 'Clear sky',
    icon: 'featherSun',
  },
  1: {
    description: 'Mainly clear',
    icon: 'featherCloudRain',
  },
  2: {
    description: 'Partly cloudy',
    icon: 'featherCloud',
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
