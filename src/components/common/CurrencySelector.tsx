import React from 'react';
import { useCurrency, SUPPORTED_CURRENCIES, CurrencyCode } from '../../context/CurrencyContext';
import { Coins, ChevronDown } from 'lucide-react';

interface CurrencySelectorProps {
  compact?: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ compact = false }) => {
  const { currentCurrency, changeCurrency, activeConfig } = useCurrency();

  if (compact) {
    return (
      <div className="relative group inline-block text-xs font-mono">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 cursor-pointer transition-all">
          <span className="text-sm">{activeConfig.flag}</span>
          <span className="font-extrabold text-amber-400">{activeConfig.symbol}</span>
          <span className="font-bold">{activeConfig.code}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </div>

        {/* Dropdown Menu */}
        <div className="absolute right-0 mt-1 w-44 bg-zinc-950/90 border border-zinc-800/90 rounded-2xl shadow-2xl p-2 hidden group-hover:block z-50 backdrop-blur-2xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 border-b border-slate-800 mb-1">
            Display Currency
          </div>
          {SUPPORTED_CURRENCIES.map((curr) => (
            <button
              key={curr.code}
              onClick={() => changeCurrency(curr.code)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentCurrency === curr.code
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{curr.flag}</span>
                <span>{curr.code}</span>
              </span>
              <span className="font-extrabold text-amber-400 font-mono">{curr.symbol}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">Global Software Currency Settings</h3>
            <p className="text-slate-400 text-xs">Set the default display currency for leads, proposals, invoices, CRM revenues, and reports.</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          Active: {activeConfig.flag} {activeConfig.code} ({activeConfig.symbol})
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SUPPORTED_CURRENCIES.map((curr) => (
          <button
            key={curr.code}
            onClick={() => changeCurrency(curr.code)}
            className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
              currentCurrency === curr.code
                ? 'bg-gradient-to-br from-amber-500/20 to-slate-900 border-amber-500/50 shadow-lg text-white'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-lg">{curr.flag}</span>
              <span className="text-xs font-extrabold font-mono text-amber-400">{curr.symbol}</span>
            </div>
            <div>
              <div className="font-extrabold text-xs text-white">{curr.code}</div>
              <div className="text-[10px] text-slate-400 truncate">{curr.name}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
