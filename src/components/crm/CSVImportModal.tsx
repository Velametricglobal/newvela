import React, { useState } from 'react';
import { leadService } from '../../services/leadService';
import { X, Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, ArrowRight, Download, RefreshCw, Layers, ShieldCheck, Check, Info } from 'lucide-react';

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CSVImportModal: React.FC<CSVImportModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [fileName, setFileName] = useState<string>('');
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<Record<string, string>[]>([]);
  
  // Mapping state: CRM Field Key -> CSV Column Header
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [duplicateHandling, setDuplicateHandling] = useState<'SKIP' | 'UPDATE' | 'CREATE'>('SKIP');
  const [defaultAssignee, setDefaultAssignee] = useState<string>('UNASSIGNED');

  // Import Results State
  const [importingProgress, setImportingProgress] = useState(0);
  const [importResult, setImportResult] = useState<{
    importedCount: number;
    skippedCount: number;
    failedCount: number;
    errors: { row: number; reason: string }[];
  } | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);
      if (lines.length < 2) {
        alert('CSV file must contain a header row and at least one data row.');
        return;
      }

      // Parse headers
      const headers = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim());
      setCsvHeaders(headers);

      // Parse rows
      const parsedRows: Record<string, string>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.replace(/^["']|["']$/g, '').trim());
        const rowObj: Record<string, string> = {};
        headers.forEach((h, index) => {
          rowObj[h] = values[index] || '';
        });
        parsedRows.push(rowObj);
      }

      setCsvRows(parsedRows);

      // Auto-detect mappings
      const initialMap: Record<string, string> = {};
      const crmFields = ['first_name', 'last_name', 'email', 'phone', 'whatsapp', 'company', 'service', 'source', 'status', 'budget', 'notes'];

      crmFields.forEach(field => {
        const matched = headers.find(h => {
          const lowerH = h.toLowerCase().replace(/[^a-z0-9]/g, '');
          const lowerF = field.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (lowerF === 'phone' && (lowerH.includes('mobile') || lowerH.includes('contact') || lowerH.includes('cell'))) return true;
          if (lowerF === 'company' && (lowerH.includes('business') || lowerH.includes('organization'))) return true;
          if (lowerF === 'first_name' && (lowerH === 'name' || lowerH.includes('firstname'))) return true;
          return lowerH.includes(lowerF);
        });
        if (matched) initialMap[field] = matched;
      });

      setColumnMapping(initialMap);
      setStep(2);
    };

    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    const csvContent = leadService.generateCSVTemplate();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Velametric_Leads_Import_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStartImport = async () => {
    setStep(4);
    setImportingProgress(25);

    setTimeout(async () => {
      setImportingProgress(65);
      const res = await leadService.importLeadsFromCSV({
        fileName,
        rows: csvRows,
        columnMapping,
        duplicateHandling,
        defaultAssignee,
        importedBy: 'Super Admin'
      });
      setImportingProgress(100);
      setImportResult(res);
      setStep(5);
    }, 600);
  };

  const handleDownloadErrorReport = () => {
    if (!importResult || importResult.errors.length === 0) return;
    const errorCsv = 'row,reason\n' + importResult.errors.map(e => `${e.row},"${e.reason}"`).join('\n');
    const blob = new Blob([errorCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Import_Errors_${fileName}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Wizard Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-mono text-[10px] uppercase font-bold tracking-widest">
              <FileSpreadsheet className="w-3.5 h-3.5" /> CSV LEAD IMPORT WIZARD • STEP {step} OF 5
            </div>
            <h3 className="text-xl font-bold text-white font-display">Bulk Import CRM Leads</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Progress Bar */}
        <div className="grid grid-cols-5 gap-1.5 font-mono text-[10px] font-bold text-center">
          {['1. Upload', '2. Mapping', '3. Validate', '4. Processing', '5. Results'].map((stLabel, idx) => {
            const stepNum = idx + 1;
            const isDone = step > stepNum;
            const isCurrent = step === stepNum;
            return (
              <div
                key={idx}
                className={`py-1.5 rounded-lg border transition-all ${
                  isCurrent
                    ? 'bg-amber-400 text-black border-amber-400 font-extrabold shadow-lg'
                    : isDone
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-950 text-slate-500 border-slate-800'
                }`}
              >
                {stLabel}
              </div>
            );
          })}
        </div>

        {/* STEP 1: UPLOAD CSV FILE */}
        {step === 1 && (
          <div className="space-y-6 py-4">
            <div className="border-2 border-dashed border-slate-800 hover:border-amber-400/50 rounded-3xl p-8 text-center space-y-4 bg-slate-950/60 transition-all">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-display">Upload CSV File</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">Select a CSV spreadsheet containing lead names, emails, phone numbers, and company details.</p>
              </div>

              <div>
                <label className="px-6 py-3 rounded-2xl bg-white text-black font-extrabold text-xs inline-flex items-center gap-2 cursor-pointer hover:bg-slate-200 transition-all shadow-xl">
                  <FileSpreadsheet className="w-4 h-4" /> Choose CSV File
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div className="flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Need an example file format? Download template.</span>
              </div>
              <button
                onClick={handleDownloadTemplate}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> CSV Template
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: COLUMN MAPPING */}
        {step === 2 && (
          <div className="space-y-6 text-xs">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 font-mono">File:</span> <strong className="text-white font-display">{fileName}</strong>
              </div>
              <span className="text-emerald-400 font-bold font-mono bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                {csvRows.length} Rows Detected
              </span>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white font-display uppercase tracking-wider text-[11px]">Map CSV Columns to CRM Lead Fields:</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {[
                  { field: 'first_name', label: 'First Name / Name *' },
                  { field: 'last_name', label: 'Last Name' },
                  { field: 'phone', label: 'Phone / Mobile Number *' },
                  { field: 'email', label: 'Email Address *' },
                  { field: 'company', label: 'Company / Business Name' },
                  { field: 'service', label: 'Service Interested In' },
                  { field: 'source', label: 'Lead Source' },
                  { field: 'status', label: 'Lead Status' },
                  { field: 'notes', label: 'Notes / Remarks' }
                ].map(({ field, label }) => (
                  <div key={field} className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-300 font-semibold">{label}</span>
                    <select
                      value={columnMapping[field] || ''}
                      onChange={(e) => setColumnMapping({ ...columnMapping, [field]: e.target.value })}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-amber-400 font-bold font-mono focus:outline-none"
                    >
                      <option value="">-- Do Not Import --</option>
                      {csvHeaders.map(h => (
                        <option key={h} value={h}>CSV Column: {h}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-800">
              <button onClick={() => setStep(1)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">
                Back
              </button>
              <button onClick={() => setStep(3)} className="px-6 py-2 rounded-xl bg-amber-400 text-black font-extrabold flex items-center gap-1.5">
                Next: Options & Validation <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DUPLICATE HANDLING & ASSIGNMENT OPTIONS */}
        {step === 3 && (
          <div className="space-y-6 text-xs">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="font-bold text-white font-display uppercase tracking-wider text-[11px]">Duplicate Lead Handling Strategy:</h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'SKIP', title: 'Skip Duplicates', desc: 'Ignore leads matching existing phone/email' },
                  { key: 'UPDATE', title: 'Update Existing', desc: 'Update matching leads with new data' },
                  { key: 'CREATE', title: 'Create Duplicates', desc: 'Force create new lead entries' }
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setDuplicateHandling(opt.key as any)}
                    className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                      duplicateHandling === opt.key
                        ? 'bg-amber-400/10 border-amber-400 text-amber-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold">{opt.title}</div>
                    <div className="text-[10px] opacity-80">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <label className="block font-bold text-white font-display uppercase tracking-wider text-[11px]">Assign Imported Leads To:</label>
              <select
                value={defaultAssignee}
                onChange={(e) => setDefaultAssignee(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white font-mono"
              >
                <option value="UNASSIGNED">Leave Unassigned (General Sales Pool)</option>
                <option value="Super Admin">Assign to Super Admin</option>
                <option value="Sales Manager">Assign to Sales Manager</option>
                <option value="Rahul Sharma (Sales)">Assign to Rahul Sharma (Sales Rep)</option>
              </select>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-800">
              <button onClick={() => setStep(2)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">
                Back
              </button>
              <button onClick={handleStartImport} className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold flex items-center gap-1.5 shadow-xl">
                Start Import Process ({csvRows.length} Rows) <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: IMPORTING PROGRESS BAR */}
        {step === 4 && (
          <div className="py-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto animate-pulse">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
            <h4 className="text-xl font-bold text-white font-display">Processing CSV Lead Import...</h4>
            <div className="max-w-md mx-auto space-y-2">
              <div className="w-full h-3 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300" style={{ width: `${importingProgress}%` }} />
              </div>
              <div className="text-xs text-slate-400 font-mono">{importingProgress}% Complete</div>
            </div>
          </div>
        )}

        {/* STEP 5: IMPORT RESULTS SUMMARY */}
        {step === 5 && importResult && (
          <div className="space-y-6 text-xs">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-2xl font-bold text-white font-display">Import Process Complete!</h4>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30 space-y-1">
                <div className="text-2xl font-black text-emerald-400 font-mono">{importResult.importedCount}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase font-mono">Leads Imported</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 space-y-1">
                <div className="text-2xl font-black text-amber-400 font-mono">{importResult.skippedCount}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase font-mono">Duplicates Skipped</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-rose-500/30 space-y-1">
                <div className="text-2xl font-black text-rose-400 font-mono">{importResult.failedCount}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase font-mono">Failed Rows</div>
              </div>
            </div>

            {importResult.errors.length > 0 && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-rose-300 font-bold font-mono">
                  <span>Failed Rows Summary ({importResult.errors.length}):</span>
                  <button onClick={handleDownloadErrorReport} className="text-xs text-amber-400 underline flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" /> Download Error Report
                  </button>
                </div>
                <div className="text-[11px] text-rose-300/80 font-mono max-h-24 overflow-y-auto space-y-1">
                  {importResult.errors.map((e, idx) => (
                    <div key={idx}>• Row {e.row}: {e.reason}</div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="px-8 py-3 rounded-2xl bg-white text-black font-extrabold text-xs hover:bg-slate-200 transition-all shadow-xl"
              >
                View Imported Leads in CRM
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
