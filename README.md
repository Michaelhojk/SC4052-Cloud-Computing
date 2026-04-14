# SC4052-Cloud-Computing
# Agentic Data Visualizer (ADV)

This repository contains the software components for the Agentic Data Visualizer, developed as part of the SC4052 Cloud Computing course project (Topic 6: SaaS-based Agentic Engineering).

## Project Overview
The ADV is an autonomous data visualization tool built within the NemoBot cloud environment. It utilizes a Decomposed State Machine architecture to interpret unstructured, conversational text and transform it into strictly formatted JSON payloads for the QuickChart API. 

## System Architecture
The software relies on a hybrid pipeline combining non-deterministic LLM reasoning with strict JavaScript execution heuristics:
* **Initialization:** `initialize.js` - Defines the system's entry point and sets the initial greeting prompt for the ADV.
* **State 1 (GateKeeper):** `is_data_present_prompt.txt` - A binary classifier that filters out non-quantitative conversational inputs to save computational overhead.
* **State 2 (Semantic Extractor):** `extract_chart_data_prompt.txt` - An LLM prompt designed to resolve dimensional mismatches, handle missing variables, and map messy text to a strict JSON schema.
* **Execution Layer:** `generateResponse.js` - Contains the defensive JavaScript heuristics (index scanning) to isolate JSON payloads from conversational wrapper text and handle API egress.
* **Egress Isolation Test:** `cloudflare_proxy_attempt.js` - An archived serverless worker script used to test NemoBot's VPC egress policies (referenced in Section 4.3 of the report).

## Deployment
As this tool was built natively within the NemoBot Virtual Private Cloud (VPC), these files represent the logic gates, system prompts, and execution scripts required to replicate the agent within a similar LLM-wrapper environment.
