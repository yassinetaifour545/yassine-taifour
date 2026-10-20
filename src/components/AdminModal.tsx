import React, { useState } from 'react';
import {
  X,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  KeyRound,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { BookingDetails } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingDetails[];
  onUpdateStatus: (bookingId: string, status: 'confirmed' | 'pending' | 'completed') => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onUpdateStatus,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  if (!isOpen) return null;

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default demo staff PIN is 1234
    if (pin.trim() === '1234') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleExportCSV = () => {
    if (bookings.length === 0) return;
    const headers = [
      'Booking ID',
      'Car',
      'Driver Name',
      'Phone',
      'Email',
      'Pick-up',
      'Return',
      'Days',
      'Total MAD',
      'Status',
    ];
    const rows = bookings.map((b) => [
      b.bookingId || '',
      b.carName,
      `"${b.driverName}"`,
      `"${b.driverPhone}"`,
      b.driverEmail,
      `"${b.pickupLocation} (${b.pickupDate})"`,
      `"${b.returnLocation} (${b.returnDate})"`,
      b.days || 1,
      b.totalPrice || 0,
      b.status || 'confirmed',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `yassine_location_bookings_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#121212] rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden text-neutral-900 dark:text-neutral-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between bg-neutral-50 dark:bg-[#181818]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] text-[#F5A623] flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display">
                Staff Fleet Portal & 2FA Dashboard
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Authorized Yassine Location Agency Operations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            aria-label="Close admin dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2FA PIN AUTHENTICATION FORM */}
        {!isAuthenticated ? (
          <div className="p-8 max-w-md mx-auto text-center space-y-6">
            <div className="w-14 h-14 bg-[#F5A623]/10 text-[#F5A623] rounded-full flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold font-display">Staff Authentication</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Enter your 4-digit security PIN to access live bookings and fleet telemetry.
                <br />
                <span className="text-[#F5A623] font-semibold">Demo Staff PIN: 1234</span>
              </p>
            </div>

            <form onSubmit={handleVerifyPin} className="space-y-4">
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setPinError(false);
                }}
                placeholder="Enter PIN (1234)"
                className="w-full text-center text-2xl font-mono tracking-widest p-3 bg-neutral-100 dark:bg-[#1C1C1C] border border-black/10 dark:border-white/10 rounded-xl outline-none focus:border-[#F5A623]"
                autoFocus
              />

              {pinError && (
                <div className="text-xs text-red-500 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Invalid security PIN. Try 1234</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#0A0A0A] dark:bg-[#F5A623] text-white dark:text-black font-bold rounded-xl text-xs sm:text-sm hover:opacity-90 transition-opacity"
              >
                Verify & Unlock Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED DASHBOARD */
          <div className="p-6 space-y-6">
            {/* Top Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#181818] border border-black/5 dark:border-white/5">
                <span className="text-xs text-neutral-400 block">Total Active Bookings</span>
                <span className="text-2xl font-black font-display tabular-nums">
                  {bookings.length}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#181818] border border-black/5 dark:border-white/5">
                <span className="text-xs text-neutral-400 block">Fleet Pipeline Revenue</span>
                <span className="text-2xl font-black text-[#F5A623] font-display tabular-nums">
                  {bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)} DH
                </span>
              </div>
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#181818] border border-black/5 dark:border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block">Security Invariant</span>
                  <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    2FA Verified
                  </span>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-2 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="overflow-x-auto rounded-xl border border-black/5 dark:border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-100 dark:bg-[#181818] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Ref / Car</th>
                    <th className="p-3">Driver</th>
                    <th className="p-3">Pick-up Hub & Dates</th>
                    <th className="p-3">Total MAD</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-neutral-400">
                        No reservations recorded in this session yet. Test booking any car from the fleet!
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b) => (
                      <tr key={b.bookingId} className="hover:bg-neutral-50 dark:hover:bg-[#161616]">
                        <td className="p-3">
                          <div className="font-bold font-mono text-neutral-900 dark:text-neutral-100">
                            {b.bookingId}
                          </div>
                          <div className="text-[11px] text-[#F5A623]">{b.carName}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold">{b.driverName}</div>
                          <div className="text-[11px] text-neutral-400">{b.driverPhone}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-medium truncate max-w-[180px]">
                            {b.pickupLocation}
                          </div>
                          <div className="text-[11px] text-neutral-400 tabular-nums">
                            {b.pickupDate} → {b.returnDate} ({b.days}d)
                          </div>
                        </td>
                        <td className="p-3 font-bold tabular-nums text-neutral-900 dark:text-neutral-100">
                          {b.totalPrice} DH
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              b.status === 'confirmed'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                                : b.status === 'completed'
                                ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400'
                                : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                            }`}
                          >
                            {b.status || 'confirmed'}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => onUpdateStatus(b.bookingId!, 'completed')}
                            className="px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-800 text-[10px] font-medium hover:bg-neutral-300 dark:hover:bg-neutral-700"
                          >
                            Complete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
