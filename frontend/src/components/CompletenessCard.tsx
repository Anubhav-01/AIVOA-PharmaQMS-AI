import React from "react";
import { CheckSquare, AlertCircle, HelpCircle, CheckCircle2 } from "lucide-react";
import { useAppSelector } from "../store";

export const CompletenessCard: React.FC = () => {
  const analysisResult = useAppSelector((state) => state.complaint.analysisResult);

  if (!analysisResult) return null;

  const { completeness } = analysisResult;
  const { score, is_complete, missing_fields, follow_up_questions, completeness_details } = completeness;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-semibold text-slate-900">
            Complaint Completeness Checker (Bonus AI Tool)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Completeness:</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              score >= 80
                ? "bg-emerald-100 text-emerald-800"
                : score >= 50
                ? "bg-amber-100 text-amber-800"
                : "bg-rose-100 text-rose-800"
            }`}
          >
            {score}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Missing Fields Checklist */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            Identified Information Gaps:
          </h4>
          <ul className="space-y-1.5 text-xs">
            {missing_fields.map((field, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-700">
                <span className="text-rose-500 font-bold">•</span>
                <span>{field}</span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-slate-500 mt-3 border-t border-slate-200 pt-2">
            {completeness_details}
          </p>
        </div>

        {/* Follow-up Questions */}
        <div className="p-4 rounded-lg bg-sky-50/50 border border-sky-200">
          <h4 className="text-xs font-semibold text-sky-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-sky-600" />
            AI Recommended Customer Follow-up Questions:
          </h4>
          <ul className="space-y-2 text-xs">
            {follow_up_questions.map((q, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-800 bg-white p-2 rounded border border-sky-100 shadow-2xs">
                <span className="font-semibold text-sky-600 flex-shrink-0">Q{idx + 1}:</span>
                <span className="italic">{q}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
