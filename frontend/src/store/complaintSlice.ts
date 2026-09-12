import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface ExtractedComplaintData {
  product_name: string;
  batch_number: string;
  dosage_form: string;
  complaint_category: string;
  severity: string;
  complainant_name: string;
  complainant_type: string;
  complaint_date: string;
  description: string;
}

export interface CompletenessCheck {
  score: number;
  is_complete: boolean;
  missing_fields: string[];
  follow_up_questions: string[];
  completeness_details: string;
}

export interface DuplicateRecord {
  id: number;
  complaint_number: string;
  product_name: string;
  batch_number: string;
  complaint_category: string;
  severity: string;
  similarity_score: number;
  description: string;
}

export interface RiskAssessment {
  risk_score: number;
  rpn_severity: number;
  rpn_occurrence: number;
  rpn_detectability: number;
  calculated_rpn: number;
  patient_hazard_level: string;
  risk_classification: string;
  regulatory_reportable: boolean;
  regulatory_deadline: string;
  rationale: string;
  recall_risk: string;
}

export interface RootCauseAnalysis {
  fishbone_categories: Record<string, string>;
  five_whys: string[];
  probable_root_cause: string;
}

export interface CAPARecommendation {
  corrective_actions: string[];
  preventive_actions: string[];
  recommended_deadline_days: number;
  responsible_department: string;
}

export interface AIAnalysisResponse {
  extracted_data: ExtractedComplaintData;
  completeness: CompletenessCheck;
  duplicates: DuplicateRecord[];
  risk_assessment: RiskAssessment;
  root_cause: RootCauseAnalysis;
  capa: CAPARecommendation;
  executive_summary: string;
  using_fallback: boolean;
}

export interface ComplaintRecord extends ExtractedComplaintData {
  id: number;
  complaint_number: string;
  completeness_score?: number;
  risk_score?: number;
  patient_hazard_level?: string;
  regulatory_reportable?: boolean;
  status: string;
  created_at: string;
}

interface ComplaintState {
  rawInput: string;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveMessage: string | null;
  analysisResult: AIAnalysisResponse | null;
  formData: ExtractedComplaintData;
  complaintList: ComplaintRecord[];
  activeTab: "intake" | "history";
}

const initialFormData: ExtractedComplaintData = {
  product_name: "",
  batch_number: "",
  dosage_form: "FDF",
  complaint_category: "Physical Defect",
  severity: "Major",
  complainant_name: "",
  complainant_type: "Hospital",
  complaint_date: new Date().toISOString().split("T")[0],
  description: "",
};

const initialState: ComplaintState = {
  rawInput: "",
  isLoading: false,
  isSaving: false,
  error: null,
  saveMessage: null,
  analysisResult: null,
  formData: initialFormData,
  complaintList: [],
  activeTab: "intake",
};

export const analyzeComplaint = createAsyncThunk(
  "complaint/analyze",
  async (text: string, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/ai/analyze-complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, source_type: "text" }),
      });
      if (!response.ok) {
        throw new Error(`Analysis failed with status ${response.status}`);
      }
      const data: AIAnalysisResponse = await response.json();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to analyze complaint");
    }
  }
);

export const uploadComplaintFile = createAsyncThunk(
  "complaint/uploadFile",
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/ai/upload-file", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }
      const data: AIAnalysisResponse = await response.json();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to upload file");
    }
  }
);

export const fetchComplaints = createAsyncThunk(
  "complaint/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/complaints");
      if (!response.ok) throw new Error("Failed to fetch complaint history");
      return await response.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const saveComplaintToDb = createAsyncThunk(
  "complaint/save",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { complaint: ComplaintState };
      const { formData, analysisResult, rawInput } = state.complaint;

      const payload = {
        ...formData,
        raw_input: rawInput,
        completeness_score: analysisResult?.completeness.score || 80,
        risk_score: analysisResult?.risk_assessment.risk_score || 50,
        patient_hazard_level: analysisResult?.risk_assessment.patient_hazard_level || "Medium",
        regulatory_reportable: analysisResult?.risk_assessment.regulatory_reportable || false,
        regulatory_details: analysisResult?.risk_assessment.regulatory_deadline || "",
        root_cause_summary: analysisResult?.root_cause.probable_root_cause || "",
        capa_summary: (analysisResult?.capa.corrective_actions || []).join("; "),
        status: "Logged",
      };

      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to log complaint into QMS");
      return await response.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const complaintSlice = createSlice({
  name: "complaint",
  initialState,
  reducers: {
    setRawInput: (state, action: PayloadAction<string>) => {
      state.rawInput = action.payload;
    },
    updateFormField: (
      state,
      action: PayloadAction<{ field: keyof ExtractedComplaintData; value: string }>
    ) => {
      state.formData[action.payload.field] = action.payload.value;
    },
    setActiveTab: (state, action: PayloadAction<"intake" | "history">) => {
      state.activeTab = action.payload;
    },
    clearSaveMessage: (state) => {
      state.saveMessage = null;
    },
    loadPreset: (state, action: PayloadAction<string>) => {
      state.rawInput = action.payload;
    },
    resetForm: (state) => {
      state.rawInput = "";
      state.analysisResult = null;
      state.formData = initialFormData;
      state.saveMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Analyze
    builder.addCase(analyzeComplaint.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.saveMessage = null;
    });
    builder.addCase(analyzeComplaint.fulfilled, (state, action) => {
      state.isLoading = false;
      state.analysisResult = action.payload;
      state.formData = { ...action.payload.extracted_data };
    });
    builder.addCase(analyzeComplaint.rejected, (state, action) => {
      state.isLoading = false;
      state.error = (action.payload as string) || "Failed to analyze complaint";
    });

    // Upload
    builder.addCase(uploadComplaintFile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(uploadComplaintFile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.analysisResult = action.payload;
      state.formData = { ...action.payload.extracted_data };
      state.rawInput = `[Parsed from uploaded file] - ${action.payload.extracted_data.description}`;
    });
    builder.addCase(uploadComplaintFile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = (action.payload as string) || "Failed to process file";
    });

    // History
    builder.addCase(fetchComplaints.fulfilled, (state, action) => {
      state.complaintList = action.payload;
    });

    // Save
    builder.addCase(saveComplaintToDb.pending, (state) => {
      state.isSaving = true;
      state.error = null;
    });
    builder.addCase(saveComplaintToDb.fulfilled, (state, action) => {
      state.isSaving = false;
      state.saveMessage = `Complaint logged successfully with ID: ${action.payload.complaint_number}`;
      state.complaintList.unshift(action.payload);
    });
    builder.addCase(saveComplaintToDb.rejected, (state, action) => {
      state.isSaving = false;
      state.error = (action.payload as string) || "Could not save to QMS";
    });
  },
});

export const {
  setRawInput,
  updateFormField,
  setActiveTab,
  clearSaveMessage,
  loadPreset,
  resetForm,
} = complaintSlice.actions;

export default complaintSlice.reducer;
