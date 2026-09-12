import React from "react";
import { Copy, AlertTriangle, Layers } from "lucide-react";
import { useAppSelector } from "../store";

export const DuplicateDetector: React.FC = () => {
  const analysisResult = useAppSelector((state) => state.complaint.analysisResult);

  if (!analysisResult) return null;

  const { duplicates } = analysisResult;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Copy className="w-5 h-5 text-amber-600" />
          <h3 className="text-base font-semibold text-slate-900">
            Duplicate Complaint & Recurring Defect Detector (Bonus AI Tool)
          </h3>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
          {duplicates.length} Matching Historical Records Found
        </span>
      </div>

      {duplicates.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-500">
          No duplicate complaints or recurring batch defects found in historical QMS database.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {duplicates.map((dup) => (
            <div
              key={dup.id}
              className="p-3.5 rounded-lg border border-amber-200/80 bg-amber-50/30 hover:bg-amber-50/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                    {dup.complaint_number}
                  </span>
                  <span className="font-semibold text-slate-800">{dup.product_name}</span>
                  <span className="text-slate-500">Lot: <span className="font-mono font-medium">{dup.batch_number}</span></span>
                </div>
                <p className="text-slate-600 text-[11px]">{dup.description}</p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  dup.severity === "Critical" ? "bg-rose-100 text-rose-800" : "bg-slate-100 text-slate-700"
                }`}>
                  {dup.severity}
                </span>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Similarity</span>
                  <span className="font-bold text-amber-700 font-mono text-sm">
                    {Math.round(dup.similarity_score * 100)}% Match
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
