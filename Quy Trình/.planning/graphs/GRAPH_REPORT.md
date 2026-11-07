# Graph Report - Quy Trình  (2026-11-06)

## Corpus Check
- Corpus is ~23,212 words - fits in a single context window. You may not need a graph.

## Summary
- 188 nodes · 190 edges · 18 communities (14 shown, 4 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.91)
- Token cost: 54,600 input · 12,800 output

## Community Hubs (Navigation)
- Unlock AOR, Account ACA & Agent Offboarding
- Persona Biometric & ID Verification Flow
- ACA Consultation, Quote & Post-Enrollment Care
- HubSpot Tickets, PCP Update & Bill Claims
- Tele-Sales Coordination, Second Chance & P&C Referral
- NPN Allocation, Carrier Contracts & Override Bonus
- HealthSherpa Pre-Authorization & CRM Doctor Fields
- Payment Verification, Plan Changes & NIC Audit
- Quote/Enroll SOP, Income LOE & Other Party Handling
- HubSpot Contact/Deal Creation & New Agent Leads
- 2027 Renewal Master Plan & Special State Marketplaces
- CRM Owner Sync, Dental SSS & Company Grouping
- HR Time-Off Policy & Peak Season Block-Out
- Presidio 1099 Fortress & Wellness Plans
- Document Verification Deadlines & No-Extend Policy
- RingCentral Daily Sync Automation
- Disciplinary Violation & HR Penalty Process
- Staff & Agent Profile Assets

## God Nodes (most connected - your core abstractions)
1. `Cam Nang NPN Authorize Va Override Bonus 2027` - 8 edges
2. `HubSpot Ticket Pipelines (Client Support, Payment, Collect Document, Choose Doctor, Agent Support)` - 7 edges
3. `Danh Sach Hop Dong Contract List Va Payrate 2026` - 6 edges
4. `Huong Dan Xac Thuc Authorize HealthSherpa` - 6 edges
5. `QT26: Quy Trình Tạo Account Trên Healthcare.gov (ver 07/2025)` - 5 edges
6. `QT10: Quy Trình Payment (03/2026)` - 4 edges
7. `QT19: Quy Trình Đổi NPN & Xử Lý Hồ Sơ Bị Other Party (02/2025)` - 4 edges
8. `QT02: Quy Trình Tạo Contact và Deal (Revision 2025)` - 4 edges
9. `Quy Chuẩn Tạo & Cập Nhật Task (Default Due Date 3 Ngày, Thứ Tự Activity)` - 4 edges
10. `QT08: Quy Trình Ghi Nhận Thông Tin Trong Task, Note, Log Call (Updated 05/2025)` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Huong Dan Xac Thuc Authorize HealthSherpa` --semantically_similar_to--> `3 Ways to Authorize (Via Text, Via ID.me, Upload Document + Face Scan)`  [INFERRED] [semantically similar]
  Step Author/HUONG_DAN_XAC_THUC_AUTHORIZE_HEALTHSHERPA.md → graphify-out/converted/HOW TO WAY AUTHORIZE_1138ab27.md
- `Agent Tuyet Nguyen Portal Authorization vs AQP Routing Rule` --implements--> `HealthSherpa Pre-Authorization 2027 (CMS Compliance)`  [INFERRED]
  RingCentral_Summaries/Daily_Summary_2026-11-05.md → CAM_NANG_NPN_AUTHORIZE_VA_OVERRIDE_BONUS_2027.md
- `9 Standard Consent Form (CF) & SOA Templates Deployment (Pandadoc & CRM)` --conceptually_related_to--> `18 Special States (State-Based Marketplaces - ACA Only)`  [INFERRED]
  RingCentral_Summaries/Daily_Summary_2026-10-30.md → Danh_Sach_Hop_Dong_Contract_List_Va_Payrate_2026.md
- `5-Method Payment Verification & PTD Tracking (Make Payment -> Check Payment -> Payment Done)` --shares_data_with--> `HubSpot Ticket Pipelines (Client Support, Payment, Collect Document, Choose Doctor, Agent Support)`  [INFERRED]
  10. QUY TRÌNH PAYMENT - Chinh sua Bo sung - 03-2026w (1).pdf → 04. WP - Working with Tickets and Tasks in Hubspot.pdf
- `Huong Dan Xac Thuc Authorize HealthSherpa` --implements--> `HealthSherpa Pre-Authorization 2027 (CMS Compliance)`  [EXTRACTED]
  Step Author/HUONG_DAN_XAC_THUC_AUTHORIZE_HEALTHSHERPA.md → CAM_NANG_NPN_AUTHORIZE_VA_OVERRIDE_BONUS_2027.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **TBR Company & Special Agent NPN Hierarchy (AQP, ALP, PT, Hoa Dao, Nhi Tran)** — cam_nang_npn_authorize_va_override_bonus_2027_npn_aqp, cam_nang_npn_authorize_va_override_bonus_2027_npn_alp, cam_nang_npn_authorize_va_override_bonus_2027_npn_pt, cam_nang_npn_authorize_va_override_bonus_2027_npn_hoa_dao, cam_nang_npn_authorize_va_override_bonus_2027_npn_nhi_tran, danh_sach_hop_dong_contract_list_va_payrate_2026_contract_types [EXTRACTED 1.00]
- **HealthSherpa 2027 Pre-Authorization & Identity Verification Ecosystem** — cam_nang_npn_authorize_va_override_bonus_2027_hsp_pre_authorization, cam_nang_npn_authorize_va_override_bonus_2027_autho_by_aca, step_author_huong_dan_xac_thuc_authorize_healthsherpa_standard_1click_sms, step_author_huong_dan_xac_thuc_authorize_healthsherpa_persona_biometric_2a, step_author_huong_dan_xac_thuc_authorize_healthsherpa_id_me_2b, step_author_huong_dan_xac_thuc_authorize_healthsherpa_crm_pre_auth_field, graphify_out_converted_how_to_way_authorize_1138ab27_three_authorize_methods [EXTRACTED 1.00]
- **HubSpot CRM Owner Sync, Dental SSS & Contact/Company Linking Rules** — quy_dinh_deal_dental_sale_support_status_va_dong_bo_owner_crm_owner_sync, quy_dinh_deal_dental_sale_support_status_va_dong_bo_owner_dental_sss_matrix, quy_trinh_tao_company_va_contact_trong_contact_detail_company_community_group, quy_trinh_tao_company_va_contact_trong_contact_detail_company_change_agent, quy_trinh_tao_company_va_contact_trong_contact_detail_multi_household_contact [INFERRED 0.85]
- **2027 Open Enrollment Master Pipeline (Renewal, Consent/SOA, Verification & Payment)** — graphify_out_converted_plan_2027_6e30a1a8_call_to_renew_workflow, graphify_out_converted_plan_2027_6e30a1a8_payment_dec_and_2027_workflow, graphify_out_converted_plan_2027_6e30a1a8_cancel_auto_renew_workflow, quy_dinh_thoi_han_bo_sung_documents_va_renew_2027_no_extension_policy, ringcentral_summaries_daily_summary_2026_10_30_consent_soa_9_templates, ringcentral_summaries_daily_summary_2026_10_30_after_hours_help_desk [INFERRED 0.95]
- **HubSpot CRM Contact, Deal, Ticket & Task Operations** — sop_qt04_tickets_tasks, sop_qt02_create_contact_deal_2025, sop_qt02_create_contact_deal_2026, sop_qt18_assign_lead_new_agent, sop_qt20_agent_support [EXTRACTED 1.00]
- **ACA Policy Enrollment, Upload Verification, NPN Defense & NIC Monthly Audit** — sop_qt01_quote_enroll, sop_qt14_income_loe, sop_qt15_document_upload, sop_qt19_change_npn_other_party, sop_qt21_not_in_carrier_nic [EXTRACTED 1.00]
- **Post-Enrollment Policy Servicing: Payments, PCP, Plan Changes, Cancellations & Bill Claims** — sop_qt10_payment, sop_qt11_choose_update_pcp, sop_qt12_cancel_plan, sop_qt13_change_plan_obama, sop_qt16_medical_bill_processing, sop_qt17_claim_bill_dvh, sop_qt22_social_benefit_fee [EXTRACTED 1.00]
- **Chu Trình Tạo Tài Khoản ACA, Kéo AOR & Mở Khóa AOR Trên Marketplace/Carrier** — qt24_unlock_aor_sop, qt26_create_healthcare_gov_account_sop, sop_di_ho_so_enroll_guide, unlock_aor_3way_call, link_existing_marketplace_application, aca_sep_reasons_and_pull_aor_workflow, npn_anh_que_pham_20011862 [EXTRACTED 1.00]
- **Quy Trình Phối Hợp Tele-Sales & Support Xử Lý Deal Second Chance (Term & Lost)** — qt28_telesales_support_coord_v1_sop, qt28_telesales_support_coord_v3_sop, sop_chuyen_second_chance, monthly_second_chance_review_cycle, telesales_review_agent_approve_stage, deal_term_vs_deal_lost_second_chance, manager_only_second_chance_transition [EXTRACTED 1.00]
- **Hệ Thống Quản Trị Ticket, Task, Pin Note, Log Call & Chăm Sóc Khách Hàng Trên HubSpot** — qt04_ticket_and_task_workflow_sop, qt05_client_contact_sop, qt06_incident_escalation_sop, qt07_phone_call_handling_sop, qt08_logging_task_note_call_sop, qt09_obamacare_policy_tracking_sop, hubspot_pin_note_standard_attachments [EXTRACTED 1.00]
- **Quy Trình Thu Thập Thông Tin, Tư Vấn Chọn Plan ACA & Xác Định Sale Support Status** — guide_obamacare_plan_selection_for_agent, form_ob_collect_information_vn, sop_sale_support_status_calculation, silver_plan_csr_golden_rule, consent_form_collection_requirement, sss_none_partial_full_matrix [EXTRACTED 1.00]
- **HealthSherpa 10-Step Pre-Authorization & Persona Identity Verification Walkthrough** — step_author_1_sms_link, step_author_2_identity_unverified_options, step_author_3_persona_consent, step_author_4_select_id_country, step_author_5_choose_id_type, step_author_6_driver_license_prompt, step_author_7_texas_dl_preview, step_author_8_face_liveness_prompt, step_author_9_persona_done, step_author_10_verification_redirect [EXTRACTED 1.00]

## Communities (18 total, 4 thin omitted)

### Community 0 - "Unlock AOR, Account ACA & Agent Offboarding"
Cohesion: 0.11
Nodes (19): Phân Loại Lý Do SEP ACA (Move, Immigration, Adopt) & Quy Trình Kéo AOR Qua HSP + ACA, Admin Commission Truy Thu & Đối Soát AOR, Thống Kê Deal/Ticket/Commission & Bảo Lưu Data Trước Termination, Biên Bản Bàn Giao Trách Nhiệm & Lưu Trữ HR Agent Termination Record, Yêu Cầu Thu Thập Consent Form Trước Khi Ký Tên / Submit Hồ Sơ, Xác Minh Tài Khoản Healthcare.gov (Upload ID / Help Desk 833-985-0709), Trạng Thái Task ACA Trên HubSpot (PENDING / NEED CALL TO VERIFIED / DONE), Liên Kết Application Hiện Hữu (Find My Application & Add NPN 20011862) (+11 more)

### Community 1 - "Persona Biometric & ID Verification Flow"
Cohesion: 0.11
Nodes (20): Accepted Government ID Types (Driver License, State ID, Passport, Green Card, Work Permit), Agent Anh Pham (NPN 20011862) HealthSherpa Authorization Header, 45 CFR 155.220 & 155.260 Marketplace Privacy and Pre-Authorization Compliance, Driver License Front Photo Capture or File Upload, Government ID Issuing Country Selection, 2026 Marketplace Client Pre-Authorization Rule & Micropage Link, Persona Identity Verification Completion Confirmation, Persona Identity & Biometric Verification Service (+12 more)

### Community 2 - "ACA Consultation, Quote & Post-Enrollment Care"
Cohesion: 0.12
Nodes (14): Danh Mục Thông Tin Báo Giá & Ghi Danh ACA (ZIP, SSN, Di Trú, HH Income, PCP, Payment), Điều Kiện Chuyển Enrolled-Active, Tạo Member Portal Account & Quy Tắc Set Auto Pay, Biểu Mẫu Thu Thập Thông Tin Khách Hàng Obamacare (OB Collect Information VN), Hướng Dẫn Tư Vấn Chọn Plan Obamacare & Chăm Sóc Khách Hàng Dành Cho Agent, Chuẩn Pin Note Trên Deal & 3 File PDF Bắt Buộc (Plan Details, Current Plan, ERN), Quy Chuẩn Tạo & Cập Nhật Task (Default Due Date 3 Ngày, Thứ Tự Activity), 5 Ticket Pipelines & Phân Loại Mức Độ Ưu Tiên (High 24-48h, Medium 3-5d, Low >5d), Quy Tắc Log Call Cá Nhân & Cấu Trúc Note Ghi Danh (HH/Apply, Income, Need) (+6 more)

### Community 3 - "HubSpot Tickets, PCP Update & Bill Claims"
Cohesion: 0.12
Nodes (15): Admin, HR & Support Coordination for Agent Onboarding and Support Group Setup, PCP Selection, Provider Acceptance Verification & Immediate/24h Effective Date Request, Direct Bill Submission to Carrier & 2-4 Week Follow-up Cycle, HubSpot Ticket Pipelines (Client Support, Payment, Collect Document, Choose Doctor, Agent Support), Member ID Card Reissue & Reference Number Logging after PCP Change, Provider Bill Reprocessing Request & EOB Reconciliation, Social Benefit Payment Channels (Zelle payment@thebestrateins.com with CEO Confirmation, Payment Link, Direct Charge), QT04: Working with Tickets and Tasks in HubSpot (+7 more)

### Community 4 - "Tele-Sales Coordination, Second Chance & P&C Referral"
Cohesion: 0.12
Nodes (16): Phân Loại Nhóm Deal Term (Đã Từng Active) & Deal Lost (Chưa Từng Active) Second Chance, Phối Hợp Trong Group Support Cho Agent (Tele-Sales Làm Trợ Lý Agent), Quy Trình Xử Lý Cuộc Gọi Nhỡ Trên Group Customer Service (Cross Mark / Check Mark), Chu Kỳ Xử Lý Deal Lost/Terminated Second Chance (Ngày 1-15 & 15-30 Hàng Tháng), Chuẩn Gọi Ra Bằng Số Tổng Đài (833) 633-6868 & Xác Minh Chủ Hồ Sơ, Giới Thiệu Bảo Hiểm Nhà/Xe (P&C Pipeline) Chuyển Cho VEC, QT03: Quy Trình Giới Thiệu Dịch Vụ Phụ Tax Và P&C Cho Agent/Affiliate, QT05: Quy Trình Liên Hệ Với Khách Hàng (+8 more)

### Community 5 - "NPN Allocation, Carrier Contracts & Override Bonus"
Cohesion: 0.14
Nodes (14): Direct Healthcare.gov Enrollment (Autho by ACA), Cam Nang NPN Authorize Va Override Bonus 2027, NPN ALP (#19876750 - Anh Lan Pham), NPN AQP (#20011862 - Anh Que Pham), NPN Hoa Dao (#20664479 - FL Blue & FL Health Plans), NPN Nhi Tran (#20461483 - BCBS South Carolina), NPN PT (#18819956 - Phuc Trinh), Company NPN State Allocation Matrix (DE, MT, NH, WV, OK, NC, IN, TN, SD, WI, TX) (+6 more)

### Community 6 - "HealthSherpa Pre-Authorization & CRM Doctor Fields"
Cohesion: 0.17
Nodes (11): HealthSherpa Pre-Authorization 2027 (CMS Compliance), HOW TO WAY AUTHORIZE (Converted DOCX), 3 Ways to Authorize (Via Text, Via ID.me, Upload Document + Face Scan), BCBS Illinois (MyBlue Plus Gold) Mandatory PCP Selection Before Quote/Apply, RingCentral Daily Summary 2026-11-05, Agent Tuyet Nguyen Portal Authorization vs AQP Routing Rule, HubSpot CRM Pre-Authorization Field Sync (Pending/No -> Yes), Huong Dan Xac Thuc Authorize HealthSherpa (+3 more)

### Community 7 - "Payment Verification, Plan Changes & NIC Audit"
Cohesion: 0.18
Nodes (11): Carrier/State/Member Change Workflow (Terminate Old Deal, Refund Autopay & Create New Deal), Marketplace Plan Cancellation & Next-Day Post-Expiration Follow-up Task, Monthly NIC File Audit (Check Marketplace/AOR, Reconcile HubSpot Data, Check Payment & Member ID), NIC HubSpot Ticket Creation & Discrepancy Resolution between Carrier, Marketplace, and CRM, Payment Status Classification (No Value,  Plan, Selfpay, Need Autopay, Need Check Autopay, Autopay, Company Pay), 5-Method Payment Verification & PTD Tracking (Make Payment -> Check Payment -> Payment Done), Same-Carrier Plan or Income Update on Existing Deal (Pin Note & 1st Payment), QT10: Quy Trình Payment (03/2026) (+3 more)

### Community 8 - "Quote/Enroll SOP, Income LOE & Other Party Handling"
Cohesion: 0.18
Nodes (9): LOE Upload Ticket Lifecycle (Need Write LOE -> Waiting on Verification -> Need Extend -> Upload Verified), Team Manager Quote & Enroll Responsibility & Commission Split Pin Note, Other Party Detection (HealthSherpa Red Tick vs. Special State Broker Portal Delegation Loss), Other Party Deal Termination/Lost & Re-opening Deal with New Consent Form, QT01: Quy Trình Quote và Enroll (05/2025), QT14: Quy Trình Viết Thư Giải Trình Về Thu Nhập (Income LOE), QT15: Quy Trình Upload Giấy Tờ Xác Minh (06/2025), QT19: Quy Trình Đổi NPN & Xử Lý Hồ Sơ Bị Other Party (02/2025) (+1 more)

### Community 9 - "HubSpot Contact/Deal Creation & New Agent Leads"
Cohesion: 0.25
Nodes (7): Company Lead Ownership Mapping (Contact Owner: TBR, Share Owner & Deal Owner: New Agent), 2026 Deal & Contact Owner Synchronization and Support Agent Assignment, HubSpot Contact Sections (About Contact, Point of Contact, Household Tax Members), Pre-Creation Duplicate Search by Name, Email, and Phone Number in HubSpot, QT02: Quy Trình Tạo Contact và Deal (Revision 2025), QT02: Quy Trình Tạo Contact và Deal (Updated 02/2026), QT18: Quy Trình Gửi Khách Hàng Mới Cho New Agent

### Community 10 - "2027 Renewal Master Plan & Special State Marketplaces"
Cohesion: 0.22
Nodes (9): 18 Special States (State-Based Marketplaces - ACA Only), Plan 2027 Phase A: Call to Renew, Quote, RTE & Weekly Agent Follow-up, Plan 2027 Phase C: Cancel Auto-Renew Rules & Out-of-Season Deal Stage Confirmation, Plan 2027 Master Workflow (Converted XLSX), Plan 2027 Phase B: Dec Payment, Cancel Autopay (Before Dec 10) & 1st Payment 2027, After Hours Authorization / Consent Help Desk (6 PM - 12 AM Mon-Sun), TBR Workspace CRM Commission Statement Viewing Guide (Desktop Only), 9 Standard Consent Form (CF) & SOA Templates Deployment (Pandadoc & CRM) (+1 more)

### Community 11 - "CRM Owner Sync, Dental SSS & Company Grouping"
Cohesion: 0.29
Nodes (7): CRM 4-Module Owner Synchronization Rule (Contact, Deal, Ticket, Document Owner = Agent), Dental Deal Sale Support Status (SSS) & Split Matrix (NONE 0.7, PARTIAL 0.5, FULL 0.0), Quy Dinh Deal Dental Sale Support Status Va Dong Bo Owner, CRM Company Type 2: Confidential Change Agent Protocol & File Check Current Plan, CRM Company Type 1: Shared Workplace / Church / Community Association, Quy Trinh Tao Company Va Contact Trong Contact Detail (HubSpot CRM), CRM Linked Contact: Multi-Household Tax Family Grouping

### Community 12 - "HR Time-Off Policy & Peak Season Block-Out"
Cohesion: 0.50
Nodes (3): Chính Sách Phép Năm (10-12 Ngày) & Phép Bệnh (5 Ngày), Đăng Ký Time Off Request Trên Hubstaff & Bỏ Make Up Time, QT25: Quy Trình Về Việc Xin Nghỉ Phép (ver.08272025)

### Community 13 - "Presidio 1099 Fortress & Wellness Plans"
Cohesion: 1.00
Nodes (3): Presidio Fortress Core Plan ( Deductible, 50/50 Coinsurance, MOOP & Balance Rollover), Presidio Wellness Plan (Optional Preventive Care Add-on), Presidio 1099 Health Plan Guide (Tiger)

## Knowledge Gaps
- **55 isolated node(s):** `NPN ALP (#19876750 - Anh Lan Pham)`, `NPN Hoa Dao (#20664479 - FL Blue & FL Health Plans)`, `NPN Nhi Tran (#20461483 - BCBS South Carolina)`, `Direct Healthcare.gov Enrollment (Autho by ACA)`, `Company NPN State Allocation Matrix (DE, MT, NH, WV, OK, NC, IN, TN, SD, WI, TX)` (+50 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 68 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Quy Chuẩn Tạo & Cập Nhật Task (Default Due Date 3 Ngày, Thứ Tự Activity)` connect `ACA Consultation, Quote & Post-Enrollment Care` to `Tele-Sales Coordination, Second Chance & P&C Referral`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `HubSpot Ticket Pipelines (Client Support, Payment, Collect Document, Choose Doctor, Agent Support)` (e.g. with `5-Method Payment Verification & PTD Tracking (Make Payment -> Check Payment -> Payment Done)` and `Social Benefit Payment Channels (Zelle payment@thebestrateins.com with CEO Confirmation, Payment Link, Direct Charge)`) actually correct?**
  _`HubSpot Ticket Pipelines (Client Support, Payment, Collect Document, Choose Doctor, Agent Support)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `NPN ALP (#19876750 - Anh Lan Pham)`, `NPN Hoa Dao (#20664479 - FL Blue & FL Health Plans)`, `NPN Nhi Tran (#20461483 - BCBS South Carolina)` to the rest of the system?**
  _55 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Unlock AOR, Account ACA & Agent Offboarding` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Persona Biometric & ID Verification Flow` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `ACA Consultation, Quote & Post-Enrollment Care` be split into smaller, more focused modules?**
  _Cohesion score 0.12418300653594772 - nodes in this community are weakly interconnected._
- **Should `HubSpot Tickets, PCP Update & Bill Claims` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._