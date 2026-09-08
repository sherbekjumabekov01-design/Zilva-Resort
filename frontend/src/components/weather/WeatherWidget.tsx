'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface WeatherData {
  temperature: number;
  apparentTemp: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
  conditionText: {
    UZ: string;
    RU: string;
    EN: string;
  };
}

export default function WeatherWidget({ variant = 'banner' }: { variant?: 'banner' | 'card' | 'badge' }) {
  const { lang } = useLanguage();
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 22,
    apparentTemp: 21,
    humidity: 42,
    windSpeed: 8,
    weatherCode: 0,
    isDay: true,
    conditionText: {
      UZ: "Musaffo tog' havosi, quyoshli",
      RU: "Свежий горный воздух, ясно",
      EN: "Fresh alpine air, sunny"
    }
  });

  useEffect(() => {
    async function fetchChimganWeather() {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=41.5284&longitude=70.0152&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&timezone=Asia%2FTashkent'
        );
        if (!res.ok) throw new Error('Weather API error');
        const data = await res.json();
        const cur = data.current;

        const code = cur.weather_code || 0;
        let condUz = "Musaffo quyoshli havo";
        let condRu = "Ясно, горное солнце";
        let condEn = "Clear & sunny alpine air";

        if (code >= 1 && code <= 3) {
          condUz = "Qisman bulutli, yoqimli tog' havosi";
          condRu = "Переменная облачность, мягкий климат";
          condEn = "Partly cloudy, mild mountain breeze";
        } else if (code >= 51 && code <= 67) {
          condUz = "Iliq tog' yomg'iri";
          condRu = "Теплый горный дождь";
          condEn = "Gentle mountain rain";
        } else if (code >= 71 && code <= 86) {
          condUz = "Purviqor qorli tog' manzarasi";
          condRu = "Свежий снег на вершинах";
          condEn = "Snow on mountain peaks";
        }

        setWeather({
          temperature: Math.round(cur.temperature_2m),
          apparentTemp: Math.round(cur.apparent_temperature),
          humidity: Math.round(cur.relative_humidity_2m),
          windSpeed: Math.round(cur.wind_speed_10m),
          weatherCode: code,
          isDay: cur.is_day === 1,
          conditionText: {
            UZ: condUz,
            RU: condRu,
            EN: condEn
          }
        });
      } catch {
        // graceful fallback to default mountain weather
      }
    }

    fetchChimganWeather();
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code === 0) {
      return <Sun className="w-5 h-5 text-amber-300" />;
    } else if (code >= 1 && code <= 3) {
      return <Cloud className="w-5 h-5 text-sky-200" />;
    } else if (code >= 51 && code <= 67) {
      return <CloudRain className="w-5 h-5 text-cyan-300" />;
    } else if (code >= 71 && code <= 86) {
      return <CloudSnow className="w-5 h-5 text-white" />;
    }
    return <Sun className="w-5 h-5 text-amber-300" />;
  };

  const currentCondition = weather.conditionText[lang] || weather.conditionText.UZ;

  if (variant === 'badge') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white shadow-sm">
        {getWeatherIcon(weather.weatherCode)}
        <span className="font-semibold text-amber-300">{weather.temperature > 0 ? `+${weather.temperature}` : weather.temperature}°C</span>
        <span className="text-white/80 hidden sm:inline">• {currentCondition}</span>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="p-6 rounded-3xl bg-[#11271d]/90 backdrop-blur-xl border border-white/15 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              {getWeatherIcon(weather.weatherCode)}
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#d8aa62] font-semibold block">
                {lang === 'RU' ? 'Погода в Чимгане (1 850м)' : lang === 'EN' ? 'Chimgan Weather (1,850m)' : "Chimgan ob-havosi (1 850m)"}
              </span>
              <h4 className="text-sm font-medium text-white">{currentCondition}</h4>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-serif font-bold text-amber-300">
              {weather.temperature > 0 ? `+${weather.temperature}` : weather.temperature}°C
            </div>
            <span className="text-[10px] text-white/60">
              {lang === 'RU' ? `Ощущается: ${weather.apparentTemp}°C` : lang === 'EN' ? `Feels like: ${weather.apparentTemp}°C` : `His qilinadi: ${weather.apparentTemp}°C`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-white/80">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
            <Droplets className="w-4 h-4 text-sky-400" />
            <div>
              <span className="text-[10px] text-white/60 block">{lang === 'RU' ? 'Влажность' : lang === 'EN' ? 'Humidity' : 'Namlik'}</span>
              <span className="font-semibold text-white">{weather.humidity}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
            <Wind className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-[10px] text-white/60 block">{lang === 'RU' ? 'Ветер' : lang === 'EN' ? 'Wind' : 'Shamol'}</span>
              <span className="font-semibold text-white">{weather.windSpeed} km/h</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 text-white text-xs shadow-md">
      <div className="flex items-center gap-1.5">
        {getWeatherIcon(weather.weatherCode)}
        <span className="font-bold text-amber-300 text-sm">{weather.temperature > 0 ? `+${weather.temperature}` : weather.temperature}°C</span>
      </div>
      <span className="h-3 w-[1px] bg-white/20" />
      <span className="text-white/90 font-light">{currentCondition}</span>
      <span className="text-[10px] text-[#d8aa62] font-semibold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full">Chimgan 1850m</span>
    </div>
  );
}
