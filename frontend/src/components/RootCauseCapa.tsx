import React, { useState } from "react";
import { GitPullRequest, CheckCircle, Clock, Users, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useAppSelector } from "../store";

export const RootCauseCapa: React.FC = () => {
  const analysisResult = useAppSelector((state) => state.complaint.analysisResult);
  const [activeTab, setActiveTab] = useState<"fishbone" | "5whys" | "capa" | "summary">("5whys");

  if (!analysisResult) return null;

  const { root_cause, capa, executive_summary } = analysisResult;
  const { fishbone_categories, five_whys, probable_root_cause } = root_cause;
  const { corrective_actions, preventive_actions, recommended_deadline_days, responsible_department } = capa;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2">
          <GitPullRequest className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Root Cause & CAPA Recommendation (Bonus AI Tool)
            </h3>
            <p className="text-xs text-slate-500">
              Automated 5-Whys, 6M Ishikawa Fishbone Analysis, and Corrective Action Protocols
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab("5whys")}
            className={`px-3 py-1 rounded transition-all ${
              activeTab === "5whys" ? "bg-white text-indigo-700 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            5-Whys Analysis
          </button>
          <button
            onClick={() => setActiveTab("fishbone")}
            className={`px-3 py-1 rounded transition-all ${
              activeTab === "fishbone" ? "bg-white text-indigo-700 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Ishikawa (6M)
          </button>
          <button
            onClick={() => setActiveTab("capa")}
            className={`px-3 py-1 rounded transition-all ${
              activeTab === "capa" ? "bg-white text-indigo-700 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            CAPA Action Plan
          </button>
          <button
            onClick={() => setActiveTab("summary")}
            className={`px-3 py-1 rounded transition-all ${
              activeTab === "summary" ? "bg-white text-indigo-700 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Executive Summary
          </button>
        </div>
      </div>

      <div className="mt-5 text-xs">
        {/* 5 Whys Tab */}
        {activeTab === "5whys" && (
          <div>
            <div className="space-y-2.5">
              {five_whys.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border flex items-start gap-3 transition-colors ${
                    idx === five_whys.length - 1
                      ? "bg-indigo-50/70 border-indigo-200 text-indigo-950 font-medium"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                    idx === five_whys.length - 1 ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3.5 bg-sky-50 border border-sky-200 rounded-lg">
              <span className="font-semibold text-sky-900 block text-[11px] uppercase tracking-wider mb-1">
                Concluded Primary Root Cause:
              </span>
              <p className="text-sky-950 text-xs font-medium">{probable_root_cause}</p>
            </div>
          </div>
        )}

        {/* Ishikawa Fishbone 6M Tab */}
        {activeTab === "fishbone" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(fishbone_categories).map(([category, explanation], idx) => (
              <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block text-indigo-700 mb-1">
                  {category} (Cause Factor)
                </span>
                <p className="text-slate-600 text-xs leading-relaxed">{explanation}</p>
              </div>
            ))}
          </div>
        )}

        {/* CAPA Action Plan Tab */}
        {activeTab === "capa" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Corrective Actions */}
              <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200">
                <h4 className="font-bold text-emerald-900 uppercase tracking-wider text-[11px] mb-2.5 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Immediate Corrective Actions (Containment):
                </h4>
                <ul className="space-y-2">
                  {corrective_actions.map((act, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-800 bg-white p-2.5 rounded border border-emerald-100">
                      <span className="text-emerald-600 font-bold text-xs">✓</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Preventive Actions */}
              <div className="p-4 rounded-lg bg-indigo-50/50 border border-indigo-200">
                <h4 className="font-bold text-indigo-900 uppercase tracking-wider text-[11px] mb-2.5 flex items-center gap-1.5">
                  <GitPullRequest className="w-4 h-4 text-indigo-600" />
                  Long-term Preventive Actions (Process Safeguard):
                </h4>
                <ul className="space-y-2">
                  {preventive_actions.map((act, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-800 bg-white p-2.5 rounded border border-indigo-100">
                      <span className="text-indigo-600 font-bold text-xs">→</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CAPA Metadata info */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Target Implementation Deadline: <strong className="text-slate-900">{recommended_deadline_days} Business Days</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-500" />
                <span>Assigned Responsible Department: <strong className="text-slate-900">{responsible_department}</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Executive Summary Tab */}
        {activeTab === "summary" && (
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-sky-600" />
              Executive QMS Briefing (Prepared for Quality Assurance Director):
            </h4>
            <p className="text-slate-700 leading-relaxed bg-white p-4 rounded border border-slate-200 shadow-2xs font-sans text-xs">
              {executive_summary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
