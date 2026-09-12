import React, { useEffect, useState } from "react";
import { Database, Filter, ExternalLink, ShieldAlert, CheckCircle, Clock } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchComplaints } from "../store/complaintSlice";

export const ComplaintList: React.FC = () => {
  const dispatch = useAppDispatch();
  const complaints = useAppSelector((state) => state.complaint.complaintList);
  const [filterSeverity, setFilterSeverity] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  useEffect(() => {
    dispatch(fetchComplaints());
  }, [dispatch]);

  const filtered = complaints.filter((c) => {
    if (filterSeverity !== "All" && c.severity !== filterSeverity) return false;
    if (filterStatus !== "All" && c.status !== filterStatus) return false;
    return true;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "Major":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Logged":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "Under Investigation":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Closed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-sky-600" />
            Pharmaceutical QMS Complaint Log & Audit Trail
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Full 21 CFR Part 11 compliant audit registry of all API & FDF product complaints
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Severity:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="p-1 border border-slate-300 rounded text-xs bg-slate-50"
            >
              <option value="All">All</option>
              <option value="Critical">Critical</option>
              <option value="Major">Major</option>
              <option value="Minor">Minor</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 ml-2">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-1 border border-slate-300 rounded text-xs bg-slate-50"
            >
              <option value="All">All</option>
              <option value="Logged">Logged</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-[10px] tracking-wider border-y border-slate-200">
            <tr>
              <th className="py-3 px-3">Complaint #</th>
              <th className="py-3 px-3">Product Name</th>
              <th className="py-3 px-3">Lot / Batch</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3">Defect Category</th>
              <th className="py-3 px-3">Severity</th>
              <th className="py-3 px-3">Risk Score</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-3 font-mono font-bold text-sky-700">{c.complaint_number}</td>
                <td className="py-3 px-3 font-medium text-slate-900 max-w-[200px] truncate">
                  {c.product_name}
                </td>
                <td className="py-3 px-3 font-mono text-slate-700">{c.batch_number}</td>
                <td className="py-3 px-3">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                    {c.dosage_form}
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-700">{c.complaint_category}</td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getSeverityBadge(c.severity)}`}>
                    {c.severity}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono font-bold">
                  {c.risk_score || 50}/100
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusBadge(c.status)}`}>
                    {c.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{c.complaint_date}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  No complaint records matching the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
