'use client';

import { usePrint } from '@/lib/print-context';

export default function PrintButton() {
  const { openPrintDialog } = usePrint();

  return (
    <button
      onClick={openPrintDialog}
      className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 no-print"
      title="Print portfolio (Ctrl+P)"
      aria-label="Print portfolio"
    >
      <span className="text-lg">🖨️</span>
      <span className="hidden sm:inline">Print</span>
    </button>
  );
}
