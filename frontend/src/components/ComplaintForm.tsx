import React from "react";
import { ClipboardCheck, Save, CheckCircle, AlertTriangle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { updateFormField, saveComplaintToDb, clearSaveMessage } from "../store/complaintSlice";

export const ComplaintForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { formData, isSaving, saveMessage, analysisResult } = useAppSelector(
    (state) => state.complaint
  );

  const handleChange = (field: keyof typeof formData, value: string) => {
    dispatch(updateFormField({ field, value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(saveComplaintToDb());
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-sky-600" />
              <h3 className="text-base font-semibold text-slate-900">Log Customer Complaint</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              QMS Registration Form (ICH Q10 / 21 CFR 211.198)
            </p>
          </div>
          {analysisResult && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              AI Pre-filled
            </span>
          )}
        </div>

        {saveMessage && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between">
            <span className="font-medium">{saveMessage}</span>
            <button
              onClick={() => dispatch(clearSaveMessage())}
              className="text-emerald-600 hover:text-emerald-900 font-bold ml-2"
            >
              ×
            </button>
          </div>
        )}

        <form id="complaintForm" onSubmit={handleSave} className="mt-5 space-y-4 text-xs">
          {/* Row 1: Product Name & Dosage Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">
                Product Name / Chemical Molecule *
              </label>
              <input
                type="text"
                required
                value={formData.product_name}
                onChange={(e) => handleChange("product_name", e.target.value)}
                placeholder="e.g. Paracetamol Tablets 500mg"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Dosage Form *
              </label>
              <select
                value={formData.dosage_form}
                onChange={(e) => handleChange("dosage_form", e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white"
              >
                <option value="FDF">FDF (Finished Dosage Form)</option>
                <option value="API">API (Active Pharmaceutical Ingredient)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Batch Number & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Batch / Lot Number *
              </label>
              <input
                type="text"
                required
                value={formData.batch_number}
                onChange={(e) => handleChange("batch_number", e.target.value)}
                placeholder="e.g. PARA-2401 or MET-API-8812"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white uppercase font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Complaint Date *
              </label>
              <input
                type="date"
                required
                value={formData.complaint_date}
                onChange={(e) => handleChange("complaint_date", e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white"
              />
            </div>
          </div>

          {/* Row 3: Category & Severity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Defect Category *
              </label>
              <select
                value={formData.complaint_category}
                onChange={(e) => handleChange("complaint_category", e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white"
              >
                <option value="Physical Defect">Physical Defect (Capping, Friability, Chipping)</option>
                <option value="Contamination/Foreign Matter">Contamination / Foreign Matter (Particulates, Specks)</option>
                <option value="Dissolution/Efficacy">Dissolution / Efficacy / Caking</option>
                <option value="Packaging">Packaging & Blister Foil Integrity</option>
                <option value="Labeling/Artwork">Labeling / Artwork / Barcode Error</option>
                <option value="Adverse Event">Adverse Drug Event / Side Effect</option>
                <option value="Other">Other QMS Deviation</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Severity Level *
              </label>
              <select
                value={formData.severity}
                onChange={(e) => handleChange("severity", e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white font-medium"
              >
                <option value="Critical">Critical (Patient Safety / Sterile Compromise)</option>
                <option value="Major">Major (Regulatory / Therapeutic Deviation)</option>
                <option value="Minor">Minor (Cosmetic / Secondary Packaging)</option>
              </select>
            </div>
          </div>

          {/* Row 4: Complainant */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Complainant Name / Organization
              </label>
              <input
                type="text"
                value={formData.complainant_name}
                onChange={(e) => handleChange("complainant_name", e.target.value)}
                placeholder="e.g. Memorial Central Hospital Pharmacy"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Complainant Type
              </label>
              <select
                value={formData.complainant_type}
                onChange={(e) => handleChange("complainant_type", e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white"
              >
                <option value="Hospital">Hospital / Health System</option>
                <option value="Pharmacy">Retail Pharmacy</option>
                <option value="Distributor">Wholesale Distributor</option>
                <option value="Manufacturer">Secondary Manufacturer (B2B API)</option>
                <option value="Clinic">Outpatient Clinic</option>
                <option value="Patient">Consumer / Patient</option>
              </select>
            </div>
          </div>

          {/* Row 5: Detailed Description */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Quality Defect Summary / Detailed Description *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Provide technical description of the defect, affected quantity, and storage state..."
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white"
            />
          </div>
        </form>
      </div>

      <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
        <div className="flex items-center text-[11px] text-slate-500">
          <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-500" />
          <span>Mandatory QMS Audit Trail Logged</span>
        </div>
        <button
          type="submit"
          form="complaintForm"
          disabled={isSaving || !formData.product_name}
          className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-lg text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm"
        >
          <Save className="w-3.5 h-3.5 mr-1.5" />
          {isSaving ? "Registering in QMS..." : "Log & Save Complaint"}
        </button>
      </div>
    </div>
  );
};
