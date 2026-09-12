import React, { useRef } from "react";
import { Sparkles, UploadCloud, FileText, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  setRawInput,
  analyzeComplaint,
  uploadComplaintFile,
  loadPreset,
  resetForm
} from "../store/complaintSlice";

const PRESETS = [
  {
    title: "Paracetamol 500mg (FDF)",
    subtitle: "Tablet capping & laminating defect",
    badge: "FDF Formulation",
    text: "From: Memorial Central Hospital Pharmacy\nDate: 2026-03-11\nSubject: Defective Paracetamol 500mg Batch PARA-2401\n\nDear QA Team,\nWe opened three 1000-tablet commercial hospital bottles from Batch PARA-2401. Approximately 15% of tablets exhibited severe capping and laminating split surfaces upon dispensing. Two patient bottles were returned due to split halves. We have quarantined 18 unopened containers in our central pharmacy inventory pending your investigation. Defective retained tablets are available for your sample collection."
  },
  {
    title: "Metformin HCl API (Raw Material)",
    subtitle: "Foreign particulate black specks in drum",
    badge: "API Active Ingredient",
    text: "Vendor Quality Deviation Report\nProduct: Metformin Hydrochloride API Powder\nLot Number: MET-API-8812\nDiscovered by: Apex Formulations Unit 2 QC\nDate: 2026-03-10\n\nDuring routine dispensing under laminar air flow, operator noticed black particulate contamination (approx 0.5mm specks) embedded inside polyethylene liner of 25kg fiber drum #3. Visual analysis confirmed non-homogeneous foreign particles. Drum immediately quarantined. Retained samples taken for FT-IR microscopic analysis."
  },
  {
    title: "Amoxicillin Oral Suspension",
    subtitle: "Caking & failed reconstitution",
    badge: "Pediatric FDF",
    text: "Urgent Clinic Complaint: St. Jude Pediatric Outpatient Clinic\nProduct: Amoxicillin and Clavulanate Potassium 228.5mg/5mL\nLot # AMX-9943\n\nPharmacist reports that reconstitution with recommended 80mL purified water failed to disperse oral powder. Hard compacted caking formed at base of HDPE bottle that would not homogenize even after 2 minutes of vigorous manual shaking. Potential under-dosing hazard for pediatric patients."
  }
];

export const ComplaintIntake: React.FC = () => {
  const dispatch = useAppDispatch();
  const { rawInput, isLoading, error } = useAppSelector((state) => state.complaint);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = () => {
    if (!rawInput.trim()) return;
    dispatch(analyzeComplaint(rawInput));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch(uploadComplaintFile(file));
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-600" />
            Complaint Intake & AI Ingestion
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Input customer email, call transcript, or upload PDF/document. LangGraph AI agent extracts fields and evaluates risk.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".txt,.pdf,.doc,.docx,.csv"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <UploadCloud className="w-4 h-4 mr-1.5 text-slate-600" />
            Upload PDF / Document
          </button>
          <button
            onClick={() => dispatch(resetForm())}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Reset
          </button>
        </div>
      </div>

      {/* Preset Pickers for Instant Video Demo */}
      <div className="mt-4">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Quick Demo Scenarios (Click to Load):
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => dispatch(loadPreset(p.text))}
              className="text-left p-3 rounded-lg border border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 transition-all text-xs group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-800 group-hover:text-sky-700">{p.title}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 group-hover:bg-sky-100 group-hover:text-sky-800">
                  {p.badge}
                </span>
              </div>
              <p className="text-slate-500 text-[11px] line-clamp-1">{p.subtitle}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Text Area */}
      <div className="mt-4">
        <label className="block text-xs font-medium text-slate-700 mb-1">
          Raw Complaint Text / Email Content
        </label>
        <textarea
          rows={5}
          value={rawInput}
          onChange={(e) => dispatch(setRawInput(e.target.value))}
          placeholder="Paste raw customer complaint email, phone report, or regulatory notice here..."
          className="w-full text-sm font-sans p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-slate-50/50 text-slate-900 placeholder:text-slate-400"
        />
      </div>

      {error && (
        <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Trigger Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleAnalyze}
          disabled={isLoading || !rawInput.trim()}
          className="inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-md shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              <span>Running LangGraph Pipeline...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              <span>Run AI Copilot Pipeline</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
