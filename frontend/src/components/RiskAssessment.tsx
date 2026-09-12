import React from "react";
import { ShieldAlert, AlertCircle, AlertOctagon, CheckCircle2, TrendingUp, HelpCircle } from "lucide-react";
import { useAppSelector } from "../store";

export const RiskAssessment: React.FC = () => {
  const analysisResult = useAppSelector((state) => state.complaint.analysisResult);

  if (!analysisResult) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-full flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-700">AI Copilot Risk Assessment</h3>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          Run the AI pipeline on a complaint to see the automated ICH Q9 risk matrix, patient safety hazard, and regulatory reportability evaluation.
        </p>
      </div>
    );
  }

  const { risk_assessment, using_fallback } = analysisResult;
  const {
    risk_score,
    rpn_severity,
    rpn_occurrence,
    rpn_detectability,
    calculated_rpn,
    patient_hazard_level,
    risk_classification,
    regulatory_reportable,
    regulatory_deadline,
    rationale,
    recall_risk
  } = risk_assessment;

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-rose-600 bg-rose-50 border-rose-200";
    if (score >= 40) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-emerald-600 bg-emerald-50 border-emerald-200";
  };

  const getProgressColor = (score: number) => {
    if (score >= 70) return "bg-rose-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-semibold text-slate-900">AI Copilot Risk Assessment</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              ICH Q9 Quality Risk Management & FMEA Matrix
            </p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getScoreColor(risk_score)}`}>
            {risk_classification} Severity
          </span>
        </div>

        {/* Score & Gauge */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700">Overall AI Risk Score</span>
            <span className="text-xl font-bold font-mono text-slate-900">{risk_score} <span className="text-xs text-slate-500 font-normal">/ 100</span></span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${getProgressColor(risk_score)}`}
              style={{ width: `${Math.min(risk_score, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
            <span>Low Risk (0-39)</span>
            <span>Medium Risk (40-69)</span>
            <span>Critical Risk (70-100)</span>
          </div>
        </div>

        {/* RPN Breakdown */}
        <div className="mt-4">
          <span className="text-xs font-semibold text-slate-700 block mb-2">
            FMEA Risk Priority Number (RPN) Breakdown:
          </span>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Severity (S)</span>
              <span className="text-sm font-bold text-slate-800">{rpn_severity}/10</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Occurrence (O)</span>
              <span className="text-sm font-bold text-slate-800">{rpn_occurrence}/10</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Detection (D)</span>
              <span className="text-sm font-bold text-slate-800">{rpn_detectability}/10</span>
            </div>
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900">
              <span className="text-[10px] text-indigo-600 block font-medium">Total RPN</span>
              <span className="text-sm font-bold text-indigo-700">{calculated_rpn}</span>
            </div>
          </div>
        </div>

        {/* Regulatory & Patient Hazard Badges */}
        <div className="mt-4 space-y-2.5">
          <div className="p-3 rounded-lg border border-slate-200 flex items-start justify-between gap-2">
            <div>
              <span className="text-[11px] font-semibold text-slate-700 block">Patient Health Hazard</span>
              <span className="text-xs text-slate-600">Assessed biological / therapeutic toxicity exposure</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold ${
                patient_hazard_level === "High"
                  ? "bg-rose-100 text-rose-800"
                  : patient_hazard_level === "Medium"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {patient_hazard_level} Hazard
            </span>
          </div>

          <div
            className={`p-3 rounded-lg border flex items-start justify-between gap-2 ${
              regulatory_reportable
                ? "bg-rose-50/70 border-rose-300"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div>
              <div className="flex items-center gap-1">
                {regulatory_reportable ? (
                  <AlertOctagon className="w-4 h-4 text-rose-600" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
                <span className="text-[11px] font-bold text-slate-800">
                  {regulatory_reportable ? "Regulatory Alert Required" : "Internal Standard Protocol"}
                </span>
              </div>
              <span className="text-xs text-slate-600 block mt-0.5">{regulatory_deadline}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-mono font-medium">
              21 CFR 211
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <span className="text-[11px] font-semibold text-slate-700 block mb-1">
              Field Action / Recall Probability:
            </span>
            <span className="text-slate-600 font-medium">{recall_risk}</span>
          </div>
        </div>

        {/* AI Rationale */}
        <div className="mt-4 p-3 rounded-lg bg-sky-50/60 border border-sky-200 text-xs">
          <span className="font-semibold text-sky-900 block mb-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
            AI Assessment Rationale
          </span>
          <p className="text-sky-800 text-[11px] leading-relaxed">{rationale}</p>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] text-slate-400">
        <span>Engine: {using_fallback ? "QMS Fallback Ruleset" : "Groq Llama-3.3-70B"}</span>
        <span>ICH Q9 Validated</span>
      </div>
    </div>
  );
};
