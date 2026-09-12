from .nodes import (
    ComplaintState,
    extract_complaint_node,
    completeness_check_node,
    duplicate_detection_node,
    risk_assessment_node,
    root_cause_capa_node,
    analyze_complaint_fallback
)

try:
    from langgraph.graph import StateGraph, START, END
    
    workflow = StateGraph(ComplaintState)
    workflow.add_node("extract", extract_complaint_node)
    workflow.add_node("completeness", completeness_check_node)
    workflow.add_node("duplicates", duplicate_detection_node)
    workflow.add_node("risk", risk_assessment_node)
    workflow.add_node("root_cause_capa", root_cause_capa_node)

    workflow.add_edge(START, "extract")
    workflow.add_edge("extract", "completeness")
    workflow.add_edge("completeness", "duplicates")
    workflow.add_edge("duplicates", "risk")
    workflow.add_edge("risk", "root_cause_capa")
    workflow.add_edge("root_cause_capa", END)

    complaint_graph = workflow.compile()
except Exception as e:
    print(f"Warning initializing StateGraph: {e}. Utilizing fallback pipeline.")
    complaint_graph = None

def run_complaint_workflow(raw_text: str) -> dict:
    initial_state = {
        "raw_input": raw_text,
        "extracted_data": {},
        "completeness": {},
        "duplicates": [],
        "risk_assessment": {},
        "root_cause": {},
        "capa": {},
        "executive_summary": "",
        "using_fallback": False
    }

    if complaint_graph:
        try:
            result = complaint_graph.invoke(initial_state)
            # Ensure complete dictionary structure
            if not result.get("extracted_data"):
                return analyze_complaint_fallback(raw_text)
            return {
                "extracted_data": result.get("extracted_data", {}),
                "completeness": result.get("completeness", {}),
                "duplicates": result.get("duplicates", []),
                "risk_assessment": result.get("risk_assessment", {}),
                "root_cause": result.get("root_cause", {}),
                "capa": result.get("capa", {}),
                "executive_summary": result.get("executive_summary", ""),
                "using_fallback": result.get("using_fallback", False)
            }
        except Exception as err:
            print(f"Workflow execution exception: {err}")
            return analyze_complaint_fallback(raw_text)
    else:
        return analyze_complaint_fallback(raw_text)
