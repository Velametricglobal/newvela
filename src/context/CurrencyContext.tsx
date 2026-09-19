import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'SAR' | 'CAD' | 'AUD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  rateVsINR: number; // Conversion factor relative to INR base
  locale: string;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)', flag: '🇮🇳', rateVsINR: 1, locale: 'en-IN' },
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)', flag: '🇺🇸', rateVsINR: 0.012, locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)', flag: '🇪🇺', rateVsINR: 0.011, locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)', flag: '🇬🇧', rateVsINR: 0.0094, locale: 'en-GB' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham (AED)', flag: '🇦🇪', rateVsINR: 0.044, locale: 'ar-AE' },
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal (SAR)', flag: '🇸🇦', rateVsINR: 0.045, locale: 'ar-SA' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CAD)', flag: '🇨🇦', rateVsINR: 0.016, locale: 'en-CA' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (AUD)', flag: '🇦🇺', rateVsINR: 0.018, locale: 'en-AU' },
];

interface CurrencyContextType {
  currentCurrency: CurrencyCode;
  activeConfig: CurrencyConfig;
  changeCurrency: (code: CurrencyCode) => void;
  formatAmount: (amountInINR: number, overrideCurrency?: CurrencyCode) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('vela_display_currency');
    return (saved as CurrencyCode) || 'INR';
  });

  const activeConfig = SUPPORTED_CURRENCIES.find(c => c.code === currentCurrency) || SUPPORTED_CURRENCIES[0];

  useEffect(() => {
    localStorage.setItem('vela_display_currency', currentCurrency);
  }, [currentCurrency]);

  const changeCurrency = (code: CurrencyCode) => {
    setCurrentCurrency(code);
  };

  const formatAmount = (amountInINR: number, overrideCurrency?: CurrencyCode): string => {
    const config = overrideCurrency 
      ? (SUPPORTED_CURRENCIES.find(c => c.code === overrideCurrency) || activeConfig)
      : activeConfig;

    const convertedAmount = amountInINR * config.rateVsINR;

    try {
      if (config.code === 'INR') {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
        }).format(convertedAmount);
      }

      return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.code,
        maximumFractionDigits: convertedAmount < 100 ? 2 : 0
      }).format(convertedAmount);
    } catch (e) {
      return `${config.symbol} ${Math.round(convertedAmount).toLocaleString()}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{
      currentCurrency,
      activeConfig,
      changeCurrency,
      formatAmount
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
