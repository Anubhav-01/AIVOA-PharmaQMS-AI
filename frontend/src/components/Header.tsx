import React from "react";
import { ShieldCheck, Activity, Database, Sparkles, FileText, CheckCircle2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { setActiveTab } from "../store/complaintSlice";

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.complaint.activeTab);
  const complaintCount = useAppSelector((state) => state.complaint.complaintList.length);

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-100">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">AIVOA PharmaQMS</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
                  <Sparkles className="w-3 h-3 mr-1 text-sky-500" /> AI Copilot
                </span>
              </div>
              <p className="text-xs text-slate-500">Intelligent Customer Complaint & Risk Management (API & FDF)</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-xs text-slate-500 bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-200">
              <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>LangGraph + Groq LLM Pipeline</span>
            </div>

            <nav className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => dispatch(setActiveTab("intake"))}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === "intake"
                    ? "bg-white text-sky-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Intake & AI Copilot</span>
              </button>
              <button
                onClick={() => dispatch(setActiveTab("history"))}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === "history"
                    ? "bg-white text-sky-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <Database className="w-4 h-4" />
                <span>QMS Records</span>
                {complaintCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-sky-100 text-sky-800 text-xs rounded-full font-semibold">
                    {complaintCount}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
