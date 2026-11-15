"""
CLINICO 360 — Curated seed drug dataset.
All information sourced from NFI (National Formulary of India), standard clinical pharmacology
references and approved product information. Dates verified as of 2026-02.
No clinical data has been invented.
"""

SEED_DRUGS = [
  {
    "generic_name": "Ramipril",
    "brand_names": ["Cardace", "Altace", "Ramace", "Hopace"],
    "pharmacological_class": "ACE Inhibitor",
    "subclass": "Non-sulfhydryl ACE Inhibitor",
    "therapeutic_category": "Antihypertensive / Cardioprotective",
    "available_strengths": ["1.25 mg", "2.5 mg", "5 mg", "10 mg"],
    "dosage_forms": ["Tablet", "Capsule"],
    "routes": ["Oral"],
    "moa_simple": "Ramipril blocks an enzyme called ACE (Angiotensin-Converting Enzyme) that normally converts angiotensin I into angiotensin II. Angiotensin II narrows blood vessels and raises blood pressure. By blocking this conversion, ramipril relaxes and widens blood vessels, reducing blood pressure and the workload on the heart.",
    "moa_advanced": "Ramipril is a prodrug converted by hepatic esterases to its active diacid form, ramiprilat. Ramiprilat competitively inhibits ACE (peptidyl-dipeptide hydrolase, kininase II), preventing conversion of angiotensin I to angiotensin II. This reduces angiotensin II-mediated vasoconstriction, aldosterone secretion, and sympathetic activation. Simultaneously, bradykinin degradation is reduced, further contributing to vasodilation via prostaglandin and nitric oxide pathways. Ramipril also exerts cardioprotective effects independent of blood pressure reduction, including attenuation of myocardial remodeling and anti-fibrotic actions.",
    "molecular_targets": ["Angiotensin-Converting Enzyme (ACE / Kininase II)"],
    "receptors": [],
    "enzymes": ["ACE (Kininase II)"],
    "cellular_pathways": ["Renin-Angiotensin-Aldosterone System (RAAS)", "Bradykinin-Nitric Oxide Pathway"],
    "organ_sites": ["Vascular endothelium", "Kidney", "Heart"],
    "pharmacological_effects": ["Vasodilation", "Reduction in aldosterone secretion", "Reduction in left ventricular hypertrophy", "Renoprotective (reduction in intraglomerular pressure)"],
    "approved_indications": ["Hypertension", "Heart failure post-MI", "Prevention of cardiovascular events in high-risk patients (HOPE trial)", "Diabetic nephropathy (nephroprotection)", "Proteinuric chronic kidney disease"],
    "off_label_indications": ["Prevention of new-onset diabetes in high-risk patients"],
    "clinical_considerations": "Requires monitoring of serum creatinine, potassium, and blood pressure after initiation and dose titration. Dry cough occurs in 10-30% of patients (commoner in Asian populations) due to bradykinin accumulation—a class effect of ACE inhibitors.",
    "onset": "1-2 hours (blood pressure effect)",
    "peak": "3-6 hours (ramiprilat)",
    "duration": "24 hours (supports once-daily dosing)",
    "bioavailability": "28% (ramipril); active metabolite ramiprilat ~44% relative bioavailability from oral ramipril",
    "protein_binding": "73% (ramiprilat)",
    "metabolism": "Hepatic esterase hydrolysis to active ramiprilat; further glucuronidation",
    "half_life": "Ramipril: ~1-2 hours; Ramiprilat: ~13-17 hours (effective half-life)",
    "excretion": "Renal (60%), Faecal (40%)",
    "contraindications": [
      "History of ACE inhibitor-induced angioedema",
      "Hereditary or idiopathic angioedema",
      "Bilateral renal artery stenosis",
      "Pregnancy (all trimesters — Black Box Warning)",
      "Hypersensitivity to ramipril or any ACE inhibitor",
      "Concurrent use with sacubitril/valsartan (within 36 hours)"
    ],
    "precautions": [
      "Hyperkalemia risk — especially with potassium-sparing diuretics, potassium supplements, or significant renal impairment",
      "Renal impairment — first-dose hypotension; monitor creatinine and potassium",
      "Volume depletion — risk of first-dose hypotension; correct before initiating",
      "Severe aortic stenosis",
      "Renovascular hypertension (bilateral or unilateral in solitary kidney)"
    ],
    "pregnancy_category": "Category D (All trimesters — contraindicated due to fetotoxicity, neonatal renal failure, skull ossification defects)",
    "lactation_safety": "Excreted in breast milk in small amounts; avoid use during lactation where possible; consult specialist",
    "renal_considerations": "Dose reduction required for eGFR <30 mL/min/1.73m²: start at 1.25 mg once daily. Avoid if eGFR <10 (anuria). Monitor creatinine and potassium closely in CKD. Despite renal dose adjustment, ACE inhibitors may exert renoprotective benefit in CKD with proteinuria under careful monitoring.",
    "hepatic_considerations": "Conversion to active ramiprilat reduced in hepatic impairment; use with caution in severe hepatic disease; monitor carefully.",
    "monitoring_requirements": ["Blood pressure (target < 130/80 mmHg in diabetes/CKD)", "Serum creatinine (at 1-2 weeks post-initiation and after each dose increase)", "Serum potassium (risk of hyperkalemia)", "Signs and symptoms of angioedema"],
    "evidence_citations": [
      {"source": "HOPE Trial (2000)", "publisher": "NEJM", "year": "2000", "note": "Ramipril 10mg reduced CV death, MI, and stroke in high-risk patients"},
      {"source": "National Formulary of India (NFI) 2011 Reprint", "publisher": "Ministry of Health, GOI", "year": "2011"},
      {"source": "BNF 86 (2023)", "publisher": "NICE/BMJ", "year": "2023"}
    ],
    "last_verified": "2026-02-15",
    "adrs": [
      {"reaction_name": "Dry cough", "organ_system": "Respiratory", "severity": "Common", "frequency": "10-30%", "dose_related": False, "time_to_onset": "Within 1-4 weeks", "mechanism": "Bradykinin and substance P accumulation in respiratory tract (class effect of ACE inhibitors)", "management": "Discontinue ramipril; switch to ARB (e.g., losartan, telmisartan) if intolerable"},
      {"reaction_name": "Angioedema", "organ_system": "Immunologic / Cutaneous", "severity": "Life-Threatening", "frequency": "<0.5%", "dose_related": False, "time_to_onset": "Within first dose to weeks after initiation; can occur after long-term use", "risk_factors": ["African-American ethnicity", "Prior ACE inhibitor angioedema", "Concurrent mTOR inhibitor use"], "mechanism": "Bradykinin-mediated increase in vascular permeability (non-allergic)", "management": "IMMEDIATE DISCONTINUATION. Secure airway. Adrenaline 0.5 mg IM if severe laryngeal oedema. NEVER rechallenge with any ACE inhibitor."},
      {"reaction_name": "Hyperkalaemia", "organ_system": "Metabolic / Renal", "severity": "Serious", "frequency": "5-10% (higher in CKD, diabetes)", "dose_related": True, "time_to_onset": "Days to weeks", "risk_factors": ["CKD", "Diabetes", "Concurrent potassium-sparing diuretics or potassium supplements", "High potassium diet"], "mechanism": "Reduced aldosterone secretion → reduced renal potassium excretion", "management": "Monitor serum potassium. Dietary counselling. Reduce or stop potassium supplements. Consider dose reduction or switching agent."},
      {"reaction_name": "First-dose hypotension", "organ_system": "Cardiovascular", "severity": "Serious", "frequency": "5-10%", "dose_related": True, "time_to_onset": "Within 1-3 hours of first or increased dose", "risk_factors": ["Volume depletion", "High-dose diuretics", "Severe hypertension", "Heart failure"], "mechanism": "Acute reduction in angiotensin II-mediated vasoconstriction", "management": "Start at lowest dose (1.25 mg). Correct volume depletion before initiation. Advise patient to lie down if dizzy after first dose."},
      {"reaction_name": "Acute kidney injury", "organ_system": "Renal", "severity": "Serious", "frequency": "1-5% in high-risk patients", "dose_related": True, "time_to_onset": "Days to weeks", "risk_factors": ["Bilateral renal artery stenosis", "CKD", "Volume depletion", "Concurrent NSAIDs"], "mechanism": "Reduction in efferent arteriolar tone → reduced intraglomerular pressure → acute decline in GFR (especially in flow-dependent states)", "management": "Monitor creatinine at 1-2 weeks. Hold if creatinine rises >30% from baseline (investigate cause). Avoid concurrent NSAIDs."}
    ]
  },
  {
    "generic_name": "Losartan",
    "brand_names": ["Losacar", "Losartas", "Repace", "Cozaar"],
    "pharmacological_class": "Angiotensin II Receptor Blocker (ARB)",
    "subclass": "Non-peptide AT1 receptor antagonist",
    "therapeutic_category": "Antihypertensive / Renoprotective",
    "available_strengths": ["25 mg", "50 mg", "100 mg"],
    "dosage_forms": ["Tablet"],
    "routes": ["Oral"],
    "moa_simple": "Losartan blocks angiotensin II from binding to its AT1 receptor on blood vessels and the adrenal gland. This prevents blood vessel narrowing and aldosterone release, lowering blood pressure without causing the cough seen with ACE inhibitors.",
    "moa_advanced": "Losartan is a selective, competitive antagonist of the AT1 (angiotensin II type 1) receptor. Unlike ACE inhibitors, it blocks angiotensin II (regardless of its synthesis pathway) directly at its receptor, preventing all AT1-mediated effects: vasoconstriction, aldosterone secretion, sympathetic activation, and renal sodium retention. Losartan has a mild uricosuric effect (inhibits URAT-1 transporter) which may be beneficial in patients with gout. The active metabolite EXP3174 is 10-40 times more potent than losartan at AT1 receptor blockade.",
    "molecular_targets": ["Angiotensin II AT1 Receptor"],
    "receptors": ["AT1 Receptor (Angiotensin II Type 1)"],
    "enzymes": [],
    "cellular_pathways": ["Renin-Angiotensin-Aldosterone System (RAAS)"],
    "organ_sites": ["Vascular smooth muscle", "Adrenal cortex", "Kidney"],
    "pharmacological_effects": ["AT1-mediated vasodilation", "Reduction in aldosterone secretion", "Reduction in sympathetic activation", "Mild uricosuric effect", "Renoprotection in Type 2 diabetic nephropathy"],
    "approved_indications": ["Hypertension", "Reduction of stroke risk in hypertensive patients with left ventricular hypertrophy (LIFE trial)", "Type 2 diabetic nephropathy with proteinuria", "Heart failure (when ACE inhibitor not tolerated)"],
    "off_label_indications": ["Marfan syndrome (aortic root dilation)", "ACE inhibitor-induced cough (alternative)"],
    "clinical_considerations": "Does NOT cause bradykinin-related dry cough — a critical advantage over ACE inhibitors. Preferred when ACE inhibitor cough is intolerable. May be less renoprotective than ACE inhibitors in some CKD subtypes (clinical debate remains).",
    "onset": "1-3 hours",
    "peak": "6 hours (EXP3174 active metabolite)",
    "duration": "24 hours",
    "bioavailability": "33% (losartan); active metabolite EXP3174 formed in liver",
    "protein_binding": ">98%",
    "metabolism": "CYP2C9 and CYP3A4 — conversion to active metabolite EXP3174",
    "half_life": "Losartan: 2 hours; EXP3174: 6-9 hours",
    "excretion": "Renal (35%), Faecal (58-60%)",
    "contraindications": [
      "Pregnancy (all trimesters — Black Box Warning, same fetal risk as ACE inhibitors)",
      "Hypersensitivity to losartan",
      "Concurrent use with aliskiren in patients with diabetes or renal impairment",
      "Bilateral renal artery stenosis"
    ],
    "precautions": [
      "Hyperkalemia (class effect — same caution as ACE inhibitors)",
      "Renal impairment (monitor creatinine and potassium)",
      "Volume depletion (first-dose hypotension)",
      "CYP2C9 poor metabolizers: EXP3174 formation may be reduced"
    ],
    "pregnancy_category": "Category D (Black Box Warning — contraindicated in pregnancy due to same fetotoxic mechanism as ACE inhibitors — reduced fetal renal perfusion)",
    "lactation_safety": "Not recommended during lactation; insufficient safety data",
    "renal_considerations": "No dose adjustment needed for mild-moderate renal impairment. Use caution in severe renal impairment (eGFR <30). Avoid in anuria. Monitor as for ACE inhibitors.",
    "hepatic_considerations": "Reduced CYP2C9 conversion to EXP3174 in hepatic impairment; start at 25 mg in hepatic impairment and titrate carefully.",
    "monitoring_requirements": ["Blood pressure", "Serum creatinine", "Serum potassium", "Uric acid (may decrease — monitor in gout context)"],
    "evidence_citations": [
      {"source": "LIFE Trial (2002)", "publisher": "Lancet", "year": "2002", "note": "Losartan vs atenolol — superior stroke reduction in LVH hypertension"},
      {"source": "RENAAL Trial (2001)", "publisher": "NEJM", "year": "2001", "note": "Losartan reduced composite renal endpoint in Type 2 diabetic nephropathy"},
      {"source": "NFI 2011", "publisher": "Ministry of Health, GOI", "year": "2011"}
    ],
    "last_verified": "2026-02-15",
    "adrs": [
      {"reaction_name": "Hyperkalaemia", "organ_system": "Metabolic", "severity": "Serious", "frequency": "5-10%", "dose_related": True, "mechanism": "Reduced aldosterone → impaired renal K+ excretion", "management": "Monitor potassium. Adjust dose or add potassium-lowering agent if needed."},
      {"reaction_name": "Hypotension (first-dose)", "organ_system": "Cardiovascular", "severity": "Moderate", "frequency": "5-10%", "dose_related": True, "time_to_onset": "1-3 hours", "management": "Start at 25 mg; correct volume depletion first."},
      {"reaction_name": "Dizziness", "organ_system": "Neurological", "severity": "Common", "frequency": "3-6%", "dose_related": True},
      {"reaction_name": "Angioedema", "organ_system": "Immunologic", "severity": "Life-Threatening", "frequency": "<0.1% (much rarer than ACE inhibitors)", "mechanism": "Non-bradykinin mediated — exact mechanism unclear; still a rare risk", "management": "Discontinue. Secure airway. This is significantly rarer than with ACE inhibitors."}
    ]
  },
  {
    "generic_name": "Metformin",
    "brand_names": ["Glycomet", "Glucophage", "Obimet", "Metlong"],
    "pharmacological_class": "Biguanide",
    "subclass": "Insulin Sensitizer",
    "therapeutic_category": "Antidiabetic / Metabolic Agent",
    "available_strengths": ["500 mg", "850 mg", "1000 mg"],
    "dosage_forms": ["Tablet (immediate release)", "Tablet (extended release / SR)"],
    "routes": ["Oral"],
    "moa_simple": "Metformin reduces glucose production in the liver (the main cause of fasting hyperglycaemia in Type 2 diabetes), improves insulin sensitivity in peripheral tissues (muscle, fat), and reduces intestinal glucose absorption. It does NOT stimulate insulin secretion from the pancreas — so it does not cause hypoglycaemia when used alone.",
    "moa_advanced": "Metformin's primary mechanism involves activation of AMP-activated protein kinase (AMPK) in hepatocytes via inhibition of mitochondrial Complex I (NADH dehydrogenase) of the respiratory chain. This leads to: (1) Inhibition of hepatic gluconeogenesis (reduces fasting blood glucose); (2) Increased peripheral glucose uptake and GLUT-4 translocation; (3) Reduced intestinal glucose absorption; (4) Reduced hepatic fatty acid oxidation. Additional proposed mechanisms include AMPK-independent effects on CREB-regulated transcription coactivator 2 (CRTC2) and activation of Protein Phosphatase 2A. The net effect is euglycaemic insulin sensitization without direct beta-cell stimulation.",
    "molecular_targets": ["AMP-Activated Protein Kinase (AMPK)", "Mitochondrial Complex I", "OCT1/OCT2 transporters (uptake into hepatocytes)"],
    "receptors": [],
    "enzymes": ["Mitochondrial Complex I (NADH:ubiquinone oxidoreductase) — inhibition"],
    "cellular_pathways": ["AMPK signalling pathway", "mTOR-S6K pathway (downstream AMPK effects)", "Hepatic gluconeogenesis (PEPCK, G6Pase inhibition)"],
    "organ_sites": ["Liver (primary)", "Skeletal muscle", "Intestine", "Adipose tissue"],
    "pharmacological_effects": ["Reduction in hepatic glucose production (gluconeogenesis)", "Enhanced peripheral insulin sensitivity", "Modest reduction in LDL cholesterol", "Weight neutral or modest weight loss", "No hypoglycaemia as monotherapy"],
    "approved_indications": ["Type 2 diabetes mellitus (first-line pharmacotherapy)", "Prediabetes (prevention of progression — off-label in some guidelines)", "Polycystic Ovary Syndrome (PCOS) — off-label"],
    "off_label_indications": ["PCOS (improves insulin sensitivity, menstrual regularity, reduces androgen levels)", "Prediabetes / prevention of T2DM", "Weight management in insulin resistance"],
    "clinical_considerations": "First-line pharmacotherapy for Type 2 DM in most international guidelines (ADA, IDF, RSSDI). Cardiovascular benefit demonstrated in overweight T2DM patients (UKPDS). Take with food to minimize GI adverse effects. Extended-release formulations generally better tolerated GI-wise.",
    "onset": "1-2 hours (immediate release)",
    "peak": "2-3 hours",
    "duration": "12 hours (IR); 24 hours (SR/XR)",
    "bioavailability": "50-60% (absorbed primarily in small intestine)",
    "protein_binding": "Negligible",
    "metabolism": "Not metabolized by cytochrome P450 enzymes; excreted unchanged in urine",
    "half_life": "Plasma: 4-9 hours; Blood: ~17 hours (accumulates in erythrocytes)",
    "excretion": "Renal (90% unchanged) — CRITICALLY important in renal impairment",
    "contraindications": [
      "eGFR < 30 mL/min/1.73m² (CONTRAINDICATED — risk of lactic acidosis)",
      "Acute or chronic metabolic acidosis (including DKA)",
      "Severe hepatic impairment",
      "Acute illness with risk of dehydration or renal impairment (hold during hospitalization for serious illness)",
      "IV iodinated contrast media use — hold 48 hours before and after if eGFR 30-60"
    ],
    "precautions": [
      "eGFR 30-45: Use with caution; consider dose reduction; more frequent monitoring",
      "Vitamin B12 deficiency — metformin impairs ileal B12-intrinsic factor complex absorption; monitor B12 annually after 4 years of use",
      "Alcohol — potentiates lactic acidosis risk; counsel patients",
      "Surgical procedures requiring general anaesthesia — typically hold on day of surgery"
    ],
    "pregnancy_category": "Safe in pregnancy — increasing evidence for safety in gestational diabetes; however metformin crosses the placenta; discuss individual risk/benefit",
    "lactation_safety": "Excreted in breast milk in small amounts; most guidelines consider safe during lactation",
    "renal_considerations": "eGFR ≥60: Full dose (up to 2550 mg/day). eGFR 45-60: Use with caution, maximum 1500 mg/day, more frequent monitoring. eGFR 30-45: Contraindicated or use only after careful risk-benefit with specialist guidance. eGFR <30: CONTRAINDICATED due to risk of lactic acidosis.",
    "hepatic_considerations": "Avoid in clinically significant hepatic impairment (increases lactic acidosis risk — hepatic lactate clearance is impaired).",
    "monitoring_requirements": ["HbA1c (3-monthly initially, 6-monthly when stable)", "Renal function (eGFR) — at least annually; more frequently in CKD", "Vitamin B12 levels (annually after 4 years, or if neuropathy suspected)", "LFTs at baseline"],
    "evidence_citations": [
      {"source": "UKPDS 34 (1998)", "publisher": "Lancet", "year": "1998", "note": "Metformin reduced macrovascular endpoints in overweight T2DM"},
      {"source": "ADA Standards of Medical Care in Diabetes 2026", "publisher": "American Diabetes Association", "year": "2026"},
      {"source": "NFI 2011", "publisher": "Ministry of Health, GOI", "year": "2011"}
    ],
    "last_verified": "2026-02-15",
    "adrs": [
      {"reaction_name": "Gastrointestinal upset (nausea, diarrhoea, abdominal discomfort)", "organ_system": "Gastrointestinal", "severity": "Common", "frequency": "20-30% (IR); 10-15% (XR)", "dose_related": True, "time_to_onset": "Within first few days to weeks", "mechanism": "Reduced intestinal glucose absorption; GLP-1 and serotonin effects on gut motility", "management": "Take with food. Start at low dose and titrate slowly. Switch to extended-release (XR) formulation if persistent."},
      {"reaction_name": "Lactic acidosis", "organ_system": "Metabolic / Life-Threatening", "severity": "Life-Threatening", "frequency": "<0.001% (very rare in appropriate use; risk dramatically increased if contraindications ignored)", "dose_related": False, "risk_factors": ["eGFR <30", "Hepatic impairment", "Dehydration", "Alcohol excess", "Hypoxia", "IV contrast use"], "mechanism": "Accumulation of metformin impairs lactate clearance via Complex I inhibition → lactic acidosis", "management": "MEDICAL EMERGENCY. Discontinue immediately. Haemodialysis to remove metformin. ICU care. Prevention: strict adherence to eGFR contraindications."},
      {"reaction_name": "Vitamin B12 deficiency", "organ_system": "Haematologic / Neurological", "severity": "Moderate", "frequency": "7-30% (depending on duration)", "dose_related": True, "time_to_onset": "Years of use", "mechanism": "Metformin interferes with calcium-dependent ileal B12-intrinsic factor complex absorption", "management": "Annual B12 monitoring. Supplementation if deficient. Particularly important if patient develops peripheral neuropathy."},
      {"reaction_name": "Hypoglycaemia", "organ_system": "Metabolic", "severity": "Rare", "frequency": "Only in combination with insulin or sulfonylurea", "mechanism": "Metformin alone does not stimulate insulin secretion and does not cause hypoglycaemia", "management": "Risk is from combination therapy — monitor when adding sulfonylurea or insulin."}
    ]
  },
  {
    "generic_name": "Amlodipine",
    "brand_names": ["Amlopress", "Stamlo", "Amlokind", "Norvasc"],
    "pharmacological_class": "Calcium Channel Blocker (CCB)",
    "subclass": "Dihydropyridine (DHP) CCB — Vascular-selective",
    "therapeutic_category": "Antihypertensive / Anti-anginal",
    "available_strengths": ["2.5 mg", "5 mg", "10 mg"],
    "dosage_forms": ["Tablet"],
    "routes": ["Oral"],
    "moa_simple": "Amlodipine blocks calcium channels in blood vessel walls (arteries), preventing calcium from entering smooth muscle cells. Without calcium, smooth muscle relaxes and blood vessels widen — reducing blood pressure and improving blood flow to the heart.",
    "moa_advanced": "Amlodipine is a third-generation dihydropyridine L-type calcium channel blocker (Cav1.2 / CACNA1C). It binds selectively to the inactivated state of voltage-gated L-type calcium channels in vascular smooth muscle with high affinity and extremely slow offset kinetics (slow binding/unbinding). This selective vascular action produces: systemic arteriolar vasodilation (afterload reduction), coronary vasodilation (anti-anginal effect), and minimal negative chronotropic or inotropic effects (unlike non-DHP CCBs). The long half-life and gradual onset prevent reflex tachycardia.",
    "molecular_targets": ["L-type Voltage-Gated Calcium Channel (Cav1.2 / CACNA1C)"],
    "receptors": ["L-type Calcium Channel"],
    "enzymes": [],
    "cellular_pathways": ["Calcium-calmodulin-myosin light chain kinase pathway (smooth muscle)", "Excitation-contraction coupling"],
    "organ_sites": ["Vascular smooth muscle (arterioles)", "Coronary arteries"],
    "pharmacological_effects": ["Peripheral vasodilation (arteriolar)", "Coronary vasodilation", "Reduction in peripheral vascular resistance", "Reduction in afterload", "Minimal effect on heart rate (DHP selectivity)"],
    "approved_indications": ["Hypertension", "Stable angina pectoris", "Vasospastic angina (Prinzmetal angina)"],
    "off_label_indications": ["Raynaud's phenomenon", "Pulmonary arterial hypertension (specialist use)"],
    "clinical_considerations": "Excellent once-daily compliance due to very long half-life (~35-50 hours). No abrupt withdrawal hazard. Preferred over beta-blockers in asthmatic patients needing antihypertensive therapy. Well tolerated in elderly. ASCOT-LLA and ACCOMPLISH trials support amlodipine-based regimens.",
    "onset": "2-3 hours",
    "peak": "6-12 hours",
    "duration": "24+ hours (once-daily appropriate)",
    "bioavailability": "64-90%",
    "protein_binding": "97%",
    "metabolism": "Hepatic CYP3A4 — inactive metabolites",
    "half_life": "35-50 hours (allows once-daily dosing with minimal missed-dose effect)",
    "excretion": "Renal (10% unchanged, 60% as inactive metabolites), Faecal",
    "contraindications": [
      "Cardiogenic shock",
      "Severe aortic stenosis",
      "Hypersensitivity to dihydropyridines or amlodipine"
    ],
    "precautions": [
      "Peripheral oedema — dose-dependent (more common at 10 mg; 10-20%)",
      "Severe hepatic impairment — reduce dose (CYP3A4 impairment → increased exposure)",
      "Heart failure — use with caution; evidence from PRAISE-2 suggests no harm but no specific benefit",
      "Elderly patients — start at 2.5 mg due to increased sensitivity"
    ],
    "pregnancy_category": "Category C — animal studies show adverse effects; limited human data; discuss risk/benefit",
    "lactation_safety": "Excreted in breast milk; avoid if possible",
    "renal_considerations": "No dose adjustment required for renal impairment (not renally cleared). Safe to use in CKD.",
    "hepatic_considerations": "Reduce dose in severe hepatic impairment (start at 2.5 mg); CYP3A4 impairment increases drug exposure.",
    "monitoring_requirements": ["Blood pressure", "Ankle oedema (clinical assessment)", "LFTs if severe hepatic disease"],
    "evidence_citations": [
      {"source": "ASCOT-LLA / ASCOT-BPLA (2005)", "publisher": "Lancet", "year": "2005", "note": "Amlodipine-based regimen superior to atenolol-based in reducing CV events"},
      {"source": "ACCOMPLISH Trial (2008)", "publisher": "NEJM", "year": "2008", "note": "Amlodipine + benazepril superior to hydrochlorothiazide + benazepril"},
      {"source": "NFI 2011", "publisher": "Ministry of Health, GOI", "year": "2011"}
    ],
    "last_verified": "2026-02-15",
    "adrs": [
      {"reaction_name": "Peripheral oedema (dependent oedema / ankle swelling)", "organ_system": "Cardiovascular / Vascular", "severity": "Common", "frequency": "10-20% at 10 mg", "dose_related": True, "mechanism": "Arteriolar dilation without compensatory venodilation → increased capillary pressure → oedema", "management": "Reduce dose if tolerable. Add ACE inhibitor or ARB (counteracts amlodipine-induced oedema). Leg elevation. If severe, consider alternative agent."},
      {"reaction_name": "Flushing", "organ_system": "Vascular / Cutaneous", "severity": "Common", "frequency": "3-5%", "dose_related": True, "mechanism": "Peripheral vasodilation"},
      {"reaction_name": "Headache", "organ_system": "Neurological", "severity": "Common", "frequency": "7-12%", "dose_related": True, "time_to_onset": "Early, often improves with continued use"},
      {"reaction_name": "Reflex tachycardia", "organ_system": "Cardiovascular", "severity": "Moderate", "frequency": "<5% (less than older DHP CCBs due to slow onset)", "mechanism": "Vasodilation-triggered baroreceptor reflex"},
      {"reaction_name": "Gingival hyperplasia", "organ_system": "Oral / Dental", "severity": "Moderate", "frequency": "<1% (all calcium channel blockers)", "time_to_onset": "Months", "management": "Improved oral hygiene; may require dental review; consider drug change if troublesome."}
    ]
  },
  {
    "generic_name": "Furosemide",
    "brand_names": ["Lasix", "Frusenex", "Frusemide"],
    "pharmacological_class": "Loop Diuretic",
    "subclass": "Sulfonamide-derived loop diuretic",
    "therapeutic_category": "Diuretic / Antiedematous / Antihypertensive",
    "available_strengths": ["20 mg", "40 mg", "80 mg"],
    "dosage_forms": ["Tablet", "Injection (IV/IM)"],
    "routes": ["Oral", "IV", "IM"],
    "moa_simple": "Furosemide blocks a transporter in the kidney (called NKCC2) in the loop of Henle. This prevents the kidney from reabsorbing sodium, potassium, and chloride — causing the body to excrete large amounts of water and salt in the urine. This reduces fluid overload and blood pressure.",
    "moa_advanced": "Furosemide inhibits the Na-K-2Cl (NKCC2) cotransporter on the luminal membrane of the thick ascending limb (TAL) of the loop of Henle. This eliminates the medullary concentration gradient, preventing water reabsorption in the collecting duct. Net effect: profound natriuresis, chloruresis, kaliuresis, and water diuresis. Additionally, furosemide releases prostaglandins (PGE2, PGI2) from the renal cortex, contributing to initial venodilation (beneficial in acute pulmonary oedema before diuresis begins). It also increases urinary calcium and magnesium excretion.",
    "molecular_targets": ["Na-K-2Cl Cotransporter (NKCC2 / SLC12A1)"],
    "receptors": [],
    "enzymes": [],
    "cellular_pathways": ["Na-K-2Cl cotransport inhibition in TAL", "Prostaglandin release (venodilation effect in acute pulmonary oedema)"],
    "organ_sites": ["Kidney (Thick Ascending Limb of Loop of Henle)", "Vasculature (venodilation)"],
    "pharmacological_effects": ["Profound natriuresis (most potent diuretic class)", "Reduction of extracellular fluid volume", "Reduction in cardiac preload", "Reduction in pulmonary congestion", "Modest antihypertensive effect"],
    "approved_indications": ["Oedema associated with heart failure (acute and chronic)", "Oedema associated with renal impairment", "Oedema associated with hepatic cirrhosis (with spironolactone)", "Acute pulmonary oedema", "Hypertension (usually second-line or in combination)"],
    "off_label_indications": ["Hypercalcaemia (increases urinary calcium excretion)", "Nephrotic syndrome oedema"],
    "clinical_considerations": "Potent diuretic with rapid onset. For acute pulmonary oedema, IV furosemide is a cornerstone of management. In CKD, higher doses may be needed to overcome reduced tubular secretion (tubular secretion by OAT1/3 is required for access to luminal side). Oral bioavailability is variable (10-100%) and unpredictable in bowel oedema.",
    "onset": "30-60 min (oral); 5-15 min (IV)",
    "peak": "1-2 hours (oral); 30 min (IV)",
    "duration": "6-8 hours (oral); 2-3 hours (IV)",
    "bioavailability": "Variable: 10-100% orally; IV = 100%",
    "protein_binding": ">99% (albumin-bound — reduced in hypoalbuminaemia, e.g. nephrotic syndrome)",
    "metabolism": "Minimal hepatic; glucuronide conjugate formed",
    "half_life": "30-120 minutes (prolonged in renal failure)",
    "excretion": "Renal (primarily) — requires tubular secretion by OAT transporters",
    "contraindications": [
      "Anuria (no urine output)",
      "Hepatic coma or precoma",
      "Hypersensitivity to furosemide (note sulfonamide-related cross-sensitivity is rare but reported)",
      "Severe electrolyte depletion (severe hypokalaemia, hyponatraemia)"
    ],
    "precautions": [
      "Electrolyte monitoring essential — hypokalaemia (cardiac arrhythmia risk), hyponatraemia, hypomagnesaemia",
      "Volume depletion — titrate carefully; avoid precipitating AKI or pre-renal state",
      "Ototoxicity — especially with rapid IV administration and in renal impairment; enhanced risk with concurrent aminoglycosides",
      "Gout — hyperuricaemia (competes with uric acid for renal tubular secretion)",
      "Diabetes — may worsen glucose tolerance via hypokalaemia-induced reduction in insulin secretion",
      "Hepatic cirrhosis — use with spironolactone; monitor for hepatic encephalopathy (electrolyte imbalance trigger)"
    ],
    "pregnancy_category": "Category C — crosses placenta; risk of fetal electrolyte imbalance; use with caution; not teratogenic",
    "lactation_safety": "May suppress lactation. Excreted in breast milk. Caution advised.",
    "renal_considerations": "In CKD, higher doses required (tubular secretion is impaired, reducing access to loop). No strict dose ceiling but titrate to response. Very high doses may cause ototoxicity. NOT contraindicated in CKD (unlike certain nephrotoxic drugs). eGFR <30: Doses of 80-240 mg/day may be required.",
    "hepatic_considerations": "Increased risk of hepatic encephalopathy in cirrhosis (electrolyte disturbance). Monitor closely. Combine with spironolactone in cirrhotic ascites.",
    "monitoring_requirements": ["Serum electrolytes (Na, K, Mg, Cl) — regularly", "Renal function (creatinine, urea)", "Blood pressure (orthostatic symptoms)", "Weight (daily in acute HF management)", "Urine output", "Glucose (in diabetic patients)", "Uric acid (in gout-susceptible patients)"],
    "evidence_citations": [
      {"source": "ESC Heart Failure Guidelines 2021", "publisher": "European Society of Cardiology", "year": "2021"},
      {"source": "NFI 2011", "publisher": "Ministry of Health, GOI", "year": "2011"},
      {"source": "BNF 86", "publisher": "NICE/BMJ", "year": "2023"}
    ],
    "last_verified": "2026-02-15",
    "adrs": [
      {"reaction_name": "Hypokalaemia", "organ_system": "Metabolic", "severity": "Serious", "frequency": "10-20%", "dose_related": True, "mechanism": "Increased Na+ delivery to distal nephron → Na/K exchange → K+ excretion", "risk_factors": ["High doses", "Inadequate K+ replacement", "Concurrent digoxin"], "management": "Potassium supplementation or add potassium-sparing diuretic (spironolactone). Monitor ECG if severe. Dangerous if concurrent digoxin."},
      {"reaction_name": "Hyponatraemia", "organ_system": "Metabolic", "severity": "Serious", "frequency": "5-10%", "dose_related": True, "mechanism": "Excessive free water retention relative to sodium loss; loop diuretics dilute sodium", "management": "Reduce dose. Restrict free water intake. Treat underlying cause."},
      {"reaction_name": "Volume depletion and pre-renal AKI", "organ_system": "Renal", "severity": "Serious", "frequency": "5-15%", "dose_related": True, "management": "Titrate dose carefully. Daily weight monitoring. Hold or reduce dose if creatinine rises significantly."},
      {"reaction_name": "Ototoxicity (hearing loss, tinnitus, vertigo)", "organ_system": "Special Senses", "severity": "Serious", "frequency": "<1% (higher with rapid IV or in renal failure)", "dose_related": True, "risk_factors": ["Rapid IV administration", "Renal impairment", "Concurrent aminoglycosides"], "mechanism": "Inhibition of Na-K-2Cl cotransporter in stria vascularis of cochlea", "management": "Avoid rapid IV injection (max 4 mg/min). Avoid concurrent aminoglycosides. Use continuous infusion for high doses."},
      {"reaction_name": "Hyperuricaemia / Gout", "organ_system": "Metabolic / Musculoskeletal", "severity": "Moderate", "frequency": "5-10%", "mechanism": "Competition with uric acid for OAT-mediated renal tubular secretion → uric acid retention", "management": "Monitor uric acid. If gout occurs, consider alternative diuretic or add urate-lowering therapy."}
    ]
  }
]

SEED_INTERACTIONS = [
  {
    "drug_a": "Ramipril",
    "drug_b": "Spironolactone",
    "severity": "Major",
    "interaction_type": "PD",
    "mechanism": "Both agents reduce aldosterone activity, reducing renal potassium excretion. Combined RAAS blockade with aldosterone antagonism significantly increases risk of life-threatening hyperkalaemia.",
    "clinical_effect": "Potentially life-threatening hyperkalaemia, particularly in patients with CKD or heart failure.",
    "management": "If combination is used (evidence supports ACE inhibitor + spironolactone in heart failure — RALES trial), monitor serum potassium very closely (at 1 week, 1 month, then 3-monthly). Avoid if eGFR <30 or baseline K+ >5.0 mEq/L.",
    "evidence_source": "RALES Trial / ESC HF Guidelines 2021"
  },
  {
    "drug_a": "Ramipril",
    "drug_b": "NSAIDs (e.g. Ibuprofen, Diclofenac, Naproxen)",
    "severity": "Major",
    "interaction_type": "PD",
    "mechanism": "NSAIDs inhibit prostaglandin-mediated afferent arteriolar vasodilation. Combined with ACE inhibitor-induced efferent arteriolar dilation, this reduces intraglomerular pressure and GFR acutely — particularly dangerous in volume-depleted or CKD patients.",
    "clinical_effect": "Acute kidney injury (AKI). Attenuation of antihypertensive effect of ACE inhibitor. Increased sodium retention (reduces diuretic efficacy).",
    "management": "Avoid regular NSAID use in patients on ACE inhibitors, especially in CKD, heart failure, or volume depletion. If analgesia required, prefer paracetamol. If NSAID essential, use lowest dose for shortest duration with close creatinine monitoring.",
    "evidence_source": "BNF 86 / Clinical Pharmacology Compendium"
  },
  {
    "drug_a": "Metformin",
    "drug_b": "IV Iodinated Contrast Media",
    "severity": "Major",
    "interaction_type": "PK",
    "mechanism": "Contrast-induced nephropathy can acutely reduce renal function, impairing metformin clearance. Metformin accumulation in the setting of renal impairment increases risk of lactic acidosis.",
    "clinical_effect": "Lactic acidosis (potentially fatal).",
    "management": "Hold metformin 48 hours before elective contrast procedures if eGFR 30-60. For eGFR >60, holding may be unnecessary but check local guidelines. Restart only after reassessment of renal function (minimum 48 hours post-contrast).",
    "evidence_source": "European Society of Urogenital Radiology (ESUR) Contrast Guidelines 2023"
  },
  {
    "drug_a": "Furosemide",
    "drug_b": "Gentamicin",
    "severity": "Major",
    "interaction_type": "PD",
    "mechanism": "Both agents inhibit Na-K-2Cl cotransporter in the cochlear stria vascularis (furosemide) and are independently ototoxic (gentamicin — cochlear hair cell toxicity). The combination dramatically amplifies ototoxicity risk.",
    "clinical_effect": "Irreversible sensorineural hearing loss, tinnitus, and vestibular toxicity.",
    "management": "Avoid concurrent use where possible. If unavoidable, use lowest doses, avoid rapid IV furosemide, monitor renal function and peak/trough gentamicin levels. Warn patient about hearing changes.",
    "evidence_source": "NFI 2011 / BNF 86"
  },
  {
    "drug_a": "Ramipril",
    "drug_b": "Losartan",
    "severity": "Major",
    "interaction_type": "PD",
    "mechanism": "Dual RAAS blockade — combined ACE inhibitor and ARB provides additive RAAS suppression but significantly increases risk of hyperkalaemia, hypotension, and acute kidney injury WITHOUT additional cardiovascular benefit in most populations.",
    "clinical_effect": "Hyperkalaemia, AKI, hypotension. The ONTARGET trial demonstrated no additional benefit of combination vs. either alone.",
    "management": "AVOID COMBINATION in most clinical scenarios. ONTARGET trial showed increased harm with dual RAAS blockade (more AKI, hyperkalaemia, hypotension) without additional CV benefit. Specialist assessment required for any exception.",
    "evidence_source": "ONTARGET Trial (2008), NEJM"
  }
]

SEED_IV_COMPATIBILITY = [
  {
    "drug_a": "Furosemide",
    "drug_b": "Gentamicin",
    "diluent": "0.9% Normal Saline",
    "status": "Incompatible",
    "physical_compatibility": "Physical precipitation reported",
    "chemical_compatibility": "Degradation potential in combined solution",
    "notes": "Physical incompatibility — do not mix in same IV line or bag. Administer separately and flush line between administrations. Additionally, concurrent use amplifies ototoxicity risk (pharmacodynamic interaction).",
    "source": "Trissel's Handbook on Injectable Drugs"
  },
  {
    "drug_a": "Furosemide",
    "drug_b": "Morphine",
    "diluent": "0.9% Normal Saline",
    "status": "Incompatible",
    "physical_compatibility": "Precipitation reported",
    "notes": "Physical incompatibility — do not administer together in IV line without documented evidence of compatibility at specific concentrations used.",
    "source": "Trissel's / King Guide to Parenteral Admixtures"
  },
  {
    "drug_a": "Furosemide",
    "drug_b": "Normal Saline (0.9% NaCl)",
    "diluent": "N/A (diluent itself)",
    "status": "Compatible",
    "physical_compatibility": "Stable",
    "chemical_compatibility": "Chemically stable",
    "notes": "Furosemide is compatible with 0.9% Normal Saline for IV infusion. Use within 24 hours of preparation. Protect from light.",
    "source": "Trissel's Handbook on Injectable Drugs"
  },
  {
    "drug_a": "Morphine",
    "drug_b": "Ondansetron",
    "diluent": "0.9% Normal Saline",
    "status": "Compatible",
    "physical_compatibility": "Physically compatible",
    "chemical_compatibility": "No significant degradation reported",
    "notes": "Compatible in NS for Y-site administration. Confirm specific concentrations used match documented compatibility data.",
    "source": "Trissel's Handbook on Injectable Drugs"
  }
]
