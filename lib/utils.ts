import { getUserLocale } from '@/src/services/locale'
import { clsx, type ClassValue } from "clsx"
import { format, formatDistanceToNow, Locale } from 'date-fns'
import { enUS, kk, ru } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toMoneyString = (number: number): string => {
  // add commas to separate thousands
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const getDateTimeLocale = (code: string): Locale => {
  switch (code) {
    case "en":
      return enUS;
    case "ru":
      return ru;
    case "kz":
      return kk;
    default:
      return enUS;
  }
}

export const formatAuctionDate = (date: Date, locale: Locale): string => {
  let formatPattern;

  switch (locale) {
    case enUS:
      formatPattern = "EEE, MMMM d, yyyy 'at' h:mm a";
      return format(date, formatPattern, { locale: enUS });

    case ru:
      formatPattern = "EEEE, d MMMM, yyyy 'в' HH:mm";
      return format(date, formatPattern, { locale: ru });

    case kk:
      formatPattern = "EEEE, d MMMM, yyyy 'сағат' HH:mm";
      return format(date, formatPattern, { locale: kk });

    default:
      throw new Error('Unsupported locale');
  }
};


export const formatEventTimeHour = (date: Date, locale: Locale): string => {
  let formatPattern;

  switch (locale) {
    case enUS:
      formatPattern = "hh:mm:ss";
      return format(date, formatPattern, { locale: enUS });

    case ru:
      formatPattern = "HH:mm:ss";
      return format(date, formatPattern, { locale: ru });

    case kk:
      formatPattern = "HH:mm:ss";
      return format(date, formatPattern, { locale: kk });

    default:
      throw new Error('Unsupported locale');
  }
};

export const getTimePassed = (date: Date, currentTime: Date, locale: Locale) => {
  return formatDistanceToNow(date, { locale });
};


export const useLocale = (dependency: any) => {
  const [locale, setLocale] = useState(enUS);

  useEffect(() => {
    const fetchLocale = async () => {
      const localeStr = await getUserLocale();
      setLocale(getDateTimeLocale(localeStr));
    };
    fetchLocale();
  }, [dependency]);

  return locale;
};

