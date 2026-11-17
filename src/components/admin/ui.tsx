'use client';

import React from 'react';
import { X } from 'lucide-react';

export const inputCls =
  'w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10 transition';

export const btnPrimary =
  'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition disabled:opacity-50';

export const btnGhost =
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-sm font-semibold transition';

export const btnDanger =
  'inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold transition';

export function Field({
  label,
  hint,
  children,
  className = '',
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-semibold text-zinc-700 mb-1.5">
        {label}
      </span>
      {children}
      {hint && <span className="block text-[11px] text-zinc-400 mt-1">{hint}</span>}
    </label>
  );
}

export function Card({
  title,
  description,
  actions,
  children,
}: {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs">
      {(title || actions) && (
        <div className="px-5 sm:px-6 py-4 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            {title && <h2 className="text-base font-bold text-zinc-900">{title}</h2>}
            {description && (
              <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
            )}
          </div>
          {actions}
        </div>
      )}
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

export function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-zinc-900/50 backdrop-blur-xs p-4 sm:p-8">
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full ${
          wide ? 'max-w-4xl' : 'max-w-2xl'
        } my-auto`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h3 className="text-base font-bold text-zinc-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100"
            aria-label="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function StatusBadge({
  label,
  tone = 'zinc',
}: {
  label: string;
  tone?: 'zinc' | 'red' | 'green' | 'amber' | 'blue';
}) {
  const map: Record<string, string> = {
    zinc: 'bg-zinc-100 text-zinc-700',
    red: 'bg-red-50 text-red-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-800',
    blue: 'bg-sky-50 text-sky-700',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${map[tone]}`}
    >
      {label}
    </span>
  );
}

export interface PanelProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  reload: () => Promise<void> | void;
  notify: (type: 'success' | 'error', text: string) => void;
}

export async function apiCall(
  url: string,
  method: string,
  body?: unknown
): Promise<{ ok: boolean; json: Record<string, unknown> }> {
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  let json: Record<string, unknown> = {};
  try {
    json = await res.json();
  } catch {
    // boş yanıt
  }
  return { ok: res.ok, json };
}
