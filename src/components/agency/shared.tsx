'use client';

import React from 'react';

export function ConfirmDialog({ title, message, confirmLabel, danger, onConfirm, onCancel }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl">
        <h3 className="text-base font-black text-[#111111] mb-2">{title}</h3>
        <p className="text-xs text-gray-500 font-medium mb-5">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-extrabold text-gray-600">Cancel</button>
          <button onClick={onConfirm} className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold text-white ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function EmptyCard({ text }: { text: string }) {
  return <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center text-gray-400 text-xs font-bold col-span-full">{text}</div>;
}
