import React, { useEffect } from "react";
import { Header } from "./components/Header";
import { ComplaintIntake } from "./components/ComplaintIntake";
import { ComplaintForm } from "./components/ComplaintForm";
import { RiskAssessment } from "./components/RiskAssessment";
import { CompletenessCard } from "./components/CompletenessCard";
import { RootCauseCapa } from "./components/RootCauseCapa";
import { DuplicateDetector } from "./components/DuplicateDetector";
import { ComplaintList } from "./components/ComplaintList";
import { useAppDispatch, useAppSelector } from "./store";
import { fetchComplaints } from "./store/complaintSlice";
import { Sparkles, Shield, Cpu, Award } from "lucide-react";

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeTab, analysisResult } = useAppSelector((state) => state.complaint);

  useEffect(() => {
    dispatch(fetchComplaints());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "intake" ? (
          <div>
            {/* Top Bar Banner */}
            <div className="mb-4 bg-gradient-to-r from-sky-900 to-indigo-950 rounded-xl p-4 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-white/10 text-sky-300">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-sm sm:text-base font-bold tracking-tight">
                    AIVOA AI Product Engineer — Pharma Complaint QMS Copilot
                  </h1>
                  <p className="text-xs text-slate-300">
                    Autonomous Multi-Node LangGraph Agent • Groq LLM (Gemma 2 / Llama 3.3) • ICH Q9 Risk Engine
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded bg-white/10 font-mono text-[11px] text-sky-200 border border-white/10">
                  21 CFR 211.198
                </span>
                <span className="px-2.5 py-1 rounded bg-white/10 font-mono text-[11px] text-indigo-200 border border-white/10">
                  ICH Q10
                </span>
              </div>
            </div>

            {/* Complaint Input & Presets */}
            <ComplaintIntake />

            {/* Core Workflow: Side-by-Side Log Complaint & Risk Assessment */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
              <div className="lg:col-span-7">
                <ComplaintForm />
              </div>
              <div className="lg:col-span-5">
                <RiskAssessment />
              </div>
            </div>

            {/* AI Bonus Tools: Completeness, Duplicates, Root Cause & CAPA */}
            {analysisResult && (
              <div className="space-y-6">
                <CompletenessCard />
                <DuplicateDetector />
                <RootCauseCapa />
              </div>
            )}
          </div>
        ) : (
          <div>
            <ComplaintList />
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-sky-600" />
            <span className="font-semibold text-slate-700">AIVOA PharmaQMS Intelligence</span>
            <span>• Customer Complaint Management System</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>FastAPI + LangGraph + React (Redux)</span>
            <span>Groq Cloud LLM Acceleration</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;
