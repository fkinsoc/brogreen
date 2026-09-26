import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'en' | 'mr' | 'hi';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
];

export const translations = {
  en: {
    // Navigation & Layout
    'nav.brand': 'Bro Foresee',
    'nav.brandSubtitle': 'Land Acquisition System',
    'nav.dashboard': 'Dashboard',
    'nav.parcels': 'Land Parcels',
    'nav.gisMap': 'GIS Map',
    'nav.alerts': 'Early Warnings',
    'nav.farmerPortal': 'Farmer Portal',
    'nav.upload': 'Data Upload',
    'nav.reports': 'Reports',
    'nav.logs': 'System Logs',
    'nav.settings': 'Settings',
    'nav.signOut': 'Sign Out',
    'nav.exportReport': 'Export Report',
    'nav.exporting': 'Exporting...',
    'nav.administrator': 'Administrator',
    'nav.landowner': 'Landowner',
    'nav.fieldOperator': 'Field Operator',
    'nav.termsPrivacy': 'Terms & Privacy',
    'nav.version': 'v2.4 Production',

    // Header
    'header.project': 'Pune Project',
    'header.searchPlaceholder': 'Search parcels, survey, owner...',
    'header.notifications': 'Notifications',
    'header.allWarnings': 'View all warnings →',
    'header.matchingParcels': 'Matching Parcels',
    'header.noMatches': 'No matching parcels for',
    'header.viewInRegistry': 'View all results in Land Registry →',

    // Dashboard
    'dashboard.title': 'Land Acquisition & Risk Command',
    'dashboard.subtitle': 'Overview of Pune Metro infrastructure corridor cadastral parcels and predictive risk factors.',
    'dashboard.totalParcels': 'Total Parcels',
    'dashboard.acquired': 'Acquisition Completed',
    'dashboard.highRisk': 'Critical Risk Parcels',
    'dashboard.avgDelay': 'Average Predicted Delay',
    'dashboard.days': 'days',
    'dashboard.riskDistribution': 'Delay Risk Distribution',
    'dashboard.disputeBottlenecks': 'Key Dispute Bottlenecks',
    'dashboard.milestones': 'Acquisition Milestone Progress',
    'dashboard.recentAlerts': 'Early Warning Feed',
    'dashboard.inspectDossier': 'Inspect Dossier',
    'dashboard.quickLinks': 'Operational Portals',
    'dashboard.lowRiskLabel': 'Low Risk',
    'dashboard.mediumRiskLabel': 'Medium Risk',
    'dashboard.highRiskLabel': 'High Risk',
    'dashboard.stage1': 'Joint Measurement Survey',
    'dashboard.stage2': 'Section 11(1) Notification',
    'dashboard.stage3': 'Section 15 Objections',
    'dashboard.stage4': 'Section 19(1) Declaration',
    'dashboard.stage5': 'Section 23 Award',
    'dashboard.stage6': 'Taking Possession',

    // Parcels Page
    'parcels.title': 'Cadastral Parcels Registry',
    'parcels.subtitle': 'Comprehensive inventory of surveyed land plots, titles, and legal proceedings.',
    'parcels.registerBtn': 'Register New Parcel',
    'parcels.searchPlaceholder': 'Search by ID, Survey No., Owner, Village...',
    'parcels.showingCount': 'Showing {count} of {total} parcels',
    'parcels.filterAll': 'All',
    'parcels.filterHigh': 'High',
    'parcels.filterMedium': 'Medium',
    'parcels.filterLow': 'Low',
    'parcels.colId': 'Parcel ID',
    'parcels.colSurvey': 'Survey / Gat No.',
    'parcels.colOwner': 'Landowner',
    'parcels.colVillage': 'Village',
    'parcels.colArea': 'Area (Acres)',
    'parcels.colStage': 'Acquisition Stage',
    'parcels.colRisk': 'Risk Level',
    'parcels.colActions': 'Action',
    'parcels.viewDossier': 'View Dossier',

    // GIS Map
    'map.title': 'GIS Parcel Map',
    'map.subtitle': 'Geographical distribution of land plots and identified risk zones.',
    'map.filter': 'Filter:',
    'map.allParcels': 'All Parcels',
    'map.riskLegend': 'Risk Legend',
    'map.highRiskLegend': 'High Risk (>75)',
    'map.medRiskLegend': 'Medium Risk (41-75)',
    'map.lowRiskLegend': 'Low Risk (≤40)',

    // Early Warnings / Alerts
    'alerts.title': 'Early Warnings & Risk Flags',
    'alerts.subtitle': 'Automated flags identifying acquisition delays, title disputes, and court objections.',
    'alerts.filterStatus': 'Status Filter:',
    'alerts.allAlerts': 'All Alerts',
    'alerts.inspect': 'Inspect Parcel Dossier',

    // Farmer Portal
    'farmer.portalTitle': 'Bro Foresee — Landowner Portal',
    'farmer.publicCadastre': 'Public Cadastre',
    'farmer.officerLogin': 'Officer Login →',
    'farmer.tagline': 'Farmer & Landowner Acquisition Status Lookup (RFCTLARR Act 2013)',
    'farmer.searchHeading': 'Check Your Survey Number & Acquisition Dossier',
    'farmer.searchPrompt': 'Enter your Land Survey Number, Gat Number, Village, or Landowner Name as recorded in the 7/12 extract to inspect status, hearing dates, and solatium award.',
    'farmer.searchPlaceholder': 'Search by Survey No. (e.g. 45/2A, 112/1), Village, or Landowner Name...',
    'farmer.popularSamples': 'Popular Sample Surveys:',
    'farmer.matchingRecords': 'Matching Cadastral Records',
    'farmer.inspectDossier': 'Inspect Dossier →',
    'farmer.stageTracker': 'Land Acquisition Statutory Milestone Tracker',
    'farmer.stageTrackerDesc': 'Mandatory procedural progression mandated by the Land Acquisition, Rehabilitation and Resettlement Act.',
    'farmer.registeredOwner': 'Registered Landowner',
    'farmer.acqArea': 'Acquisition Land Area',
    'farmer.estimatedAward': 'Estimated Solatium Award',
    'farmer.objectionStatus': 'Objection / Hearing Status',
    'farmer.compHeading': 'Fair Compensation Award Estimate',
    'farmer.readyReckonerRate': 'Base Ready Reckoner Rate',
    'farmer.ruralFactor': 'Rural Multiplication Factor',
    'farmer.solatiumBonus': '100% Solatium (Sec. 30(1))',
    'farmer.totalCompensation': 'Total Estimated Award',
    'farmer.dbtNotice': 'Payment Disbursal: Compensation awards are credited via Direct Benefit Transfer (DBT) directly into the landowner\'s Aadhaar-linked bank account upon verification of original 7/12 extract and KYC documents.',
    'farmer.hearings': 'Public Hearing & Notice Board',
    'farmer.hearingNotice': 'Section 15 Objections Hearing',
    'farmer.venue': 'Venue: Office of the Special Land Acquisition Officer (SLAO 2), New Administrative Building, Camp, Pune.',
    'farmer.reqDocs': 'Documents Required at Hearing:',
    'farmer.doc1': 'Original 7/12 Extract (Satbara Utara) dated within 3 months',
    'farmer.doc2': '8A Khatedar holding extract',
    'farmer.doc3': 'Aadhaar Card & PAN Card copy',
    'farmer.doc4': 'Cancelled Cheque / Bank Passbook for DBT compensation',
    'farmer.fileGrievance': 'File Objection or Grievance',
    'farmer.grievanceDesc': 'If there is any boundary dispute, uncounted trees/wells, or compensation disagreement for Survey No. {survey}, lodge your formal submission here.',
    'farmer.claimantName': 'Landowner / Claimant Name *',
    'farmer.mobilePhone': 'Mobile Phone Number *',
    'farmer.objectionCategory': 'Objection Category *',
    'farmer.detailedDescription': 'Detailed Grounds of Objection *',
    'farmer.submitBtn': 'Submit Formal Objection',
    'farmer.submitting': 'Lodging...',
    'farmer.successTitle': 'Grievance Registered Successfully',
    'farmer.successRef': 'Your Grievance Reference Token is:',
    'farmer.successNotice': 'A notice will be issued by the Competent Authority within 14 working days. You can present this token at the Sub-Divisional Office.',
    'farmer.submitAnother': 'Submit Another Inquiry',

    // Auth & Login
    'auth.signInTitle': 'Sign in to access Land Acquisition Intelligence',
    'auth.requestAccessTitle': 'Request operational system access',
    'auth.publicFarmerPortal': '🌾 Landowner & Farmer Portal',
    'auth.publicPortalDesc': 'Search survey records & compensation status',
    'auth.openPortal': 'Open Portal →',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.fullName': 'Full Name',
    'auth.signInBtn': 'Sign In',
    'auth.requestAccountBtn': 'Request Account',
    'auth.needAccount': 'Need an account? Request access',
    'auth.haveAccount': 'Already have an account? Sign in',
    'auth.orContinueWith': 'Or continue with',
    'auth.policyNotice': 'Access Policy Notice: To ensure government land records compliance, all new registrations require administrator authorization before full operational access is unlocked.',
    'auth.pendingTitle': 'Account Status: Pending Administrator Approval',
    'auth.pendingHeading': 'Authorization Required',
    'auth.pendingDesc': 'Thank you for registering with Bro Foresee. To protect sensitive land acquisition records, survey valuations, and cadastral datasets, your account is awaiting administrative clearance.',
    'auth.checkApproval': 'Check Approval Status',
    'auth.verifyingStatus': 'Verifying status...',
    'auth.farmerNotice': 'Need to look up your personal land parcel or compensation? You can access the public Farmer Portal directly without waiting for admin authorization.',

    // Settings
    'settings.title': 'Settings & Access Control',
    'settings.subtitle': 'Manage your account credentials and system authorization directory.',
    'settings.userProfile': 'Your Account Profile',
    'settings.pendingApprovals': 'Pending Registrations Awaiting Approval',
    'settings.directAccessBlocked': 'Direct access is blocked until approved below',
    'settings.approveOperator': 'Approve as Operator',
    'settings.approveLandowner': 'Approve as Landowner',
    'settings.reject': 'Reject',
    'settings.grantAccess': 'Grant Access',
    'settings.suspend': 'Suspend',
    'settings.userDirectory': 'User Access Directory & Governance',
    'settings.emailCol': 'Email',
    'settings.nameCol': 'Name',
    'settings.statusCol': 'Status',
    'settings.roleCol': 'Role',
    'settings.actionCol': 'Action',

    // Common
    'common.language': 'Language',
    'common.selectLanguage': 'Select Language',
    'common.close': 'Close',
    'common.status': 'Status',
    'common.actions': 'Actions',
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.acres': 'Acres',
  },

  mr: {
    // Navigation & Layout
    'nav.brand': 'ब्रो फोरसी',
    'nav.brandSubtitle': 'भूसंपादन नियंत्रण प्रणाली',
    'nav.dashboard': 'डॅशबोर्ड',
    'nav.parcels': 'भूखंड नोंदवही',
    'nav.gisMap': 'जीआयएस नकाशा',
    'nav.alerts': 'पूर्व सूचना',
    'nav.farmerPortal': 'शेतकरी पोर्टल',
    'nav.upload': 'डेटा अपलोड',
    'nav.reports': 'अहवाल',
    'nav.logs': 'सिस्टम नोंदी',
    'nav.settings': 'सेटिंग्ज',
    'nav.signOut': 'बाहेर पडा',
    'nav.exportReport': 'अहवाल निर्यात',
    'nav.exporting': 'निर्यात करत आहे...',
    'nav.administrator': 'प्रशासक',
    'nav.landowner': 'जमीनमालक',
    'nav.fieldOperator': 'क्षेत्रीय अधिकारी',
    'nav.termsPrivacy': 'अटी व गोपनीयता',
    'nav.version': 'v२.४ आवृत्ती',

    // Header
    'header.project': 'पुणे प्रकल्प',
    'header.searchPlaceholder': 'पार्सल, सर्व्हे नं., जमीनमालक शोधा...',
    'header.notifications': 'सूचना',
    'header.allWarnings': 'सर्व इशारे पहा →',
    'header.matchingParcels': 'जुळणारे पार्सल',
    'header.noMatches': 'या शोधासाठी कोणतेही पार्सल आढळले नाही:',
    'header.viewInRegistry': 'सर्व निकाल भूखंड यादीत पहा →',

    // Dashboard
    'dashboard.title': 'भूसंपादन व जोखीम नियंत्रण कक्ष',
    'dashboard.subtitle': 'पुणे मेट्रो पायाभूत सुविधा मार्गिकेतील भूखंड संपादन व अंदाजित विलंब घटकांचे थेट निरीक्षण.',
    'dashboard.totalParcels': 'एकूण पार्सल',
    'dashboard.acquired': 'संपादन पूर्ण',
    'dashboard.highRisk': 'अति-जोखीम पार्सल',
    'dashboard.avgDelay': 'सरासरी अंदाजित विलंब',
    'dashboard.days': 'दिवस',
    'dashboard.riskDistribution': 'विलंब जोखीम वर्गीकरण',
    'dashboard.disputeBottlenecks': 'प्रमुख वाद व अडथळे',
    'dashboard.milestones': 'संपादन टप्प्यांची प्रगती',
    'dashboard.recentAlerts': 'पूर्व सूचना फीड',
    'dashboard.inspectDossier': 'तपशील पहा',
    'dashboard.quickLinks': 'कार्यप्रणाली विभाग',
    'dashboard.lowRiskLabel': 'कमी जोखीम',
    'dashboard.mediumRiskLabel': 'मध्यम जोखीम',
    'dashboard.highRiskLabel': 'उच्च जोखीम',
    'dashboard.stage1': 'संयुक्त मोजणी सर्व्हेक्षण',
    'dashboard.stage2': 'कलम ११(१) प्राथमिक अधिसूचना',
    'dashboard.stage3': 'कलम १५ हरकती सुनावणी',
    'dashboard.stage4': 'कलम १९(१) अंतिम घोषणा',
    'dashboard.stage5': 'कलम २३ भरपाई निवाडा',
    'dashboard.stage6': 'ताबा व वितरण',

    // Parcels Page
    'parcels.title': 'भूसंपादन पार्सल नोंदवही',
    'parcels.subtitle': 'मोजणी झालेले भूखंड, कायदेशीर नोंदी आणि मालकी हक्कांची संपूर्ण यादी.',
    'parcels.registerBtn': 'नवीन पार्सल नोंदवा',
    'parcels.searchPlaceholder': 'आयडी, सर्व्हे नंबर, मालक, गावावरून शोधा...',
    'parcels.showingCount': '{total} पैकी {count} पार्सल दाखवत आहे',
    'parcels.filterAll': 'सर्व',
    'parcels.filterHigh': 'उच्च',
    'parcels.filterMedium': 'मध्यम',
    'parcels.filterLow': 'कमी',
    'parcels.colId': 'पार्सल आयडी',
    'parcels.colSurvey': 'सर्व्हे / गट क्र.',
    'parcels.colOwner': 'जमीनमालक',
    'parcels.colVillage': 'गाव',
    'parcels.colArea': 'क्षेत्र (एकर)',
    'parcels.colStage': 'संपादन टप्पा',
    'parcels.colRisk': 'जोखीम पातळी',
    'parcels.colActions': 'कृती',
    'parcels.viewDossier': 'तपशील पहा',

    // GIS Map
    'map.title': 'जीआयएस पार्सल नकाशा',
    'map.subtitle': 'भूखंडांची भौगोलिक स्थिती आणि जोखीम क्षेत्रांचे नकाशावर दर्शन.',
    'map.filter': 'फिल्टर:',
    'map.allParcels': 'सर्व पार्सल',
    'map.riskLegend': 'जोखीम सूची',
    'map.highRiskLegend': 'उच्च जोखीम (>७५)',
    'map.medRiskLegend': 'मध्यम जोखीम (४१-७५)',
    'map.lowRiskLegend': 'कमी जोखीम (≤४०)',

    // Early Warnings / Alerts
    'alerts.title': 'पूर्व सूचना व जोखीम इशारे',
    'alerts.subtitle': 'भूसंपादन विलंब, मालकी वाद आणि न्यायालयीन हरकती शोधणारी स्वयंचलित प्रणाली.',
    'alerts.filterStatus': 'स्थितीनुसार फिल्टर:',
    'alerts.allAlerts': 'सर्व इशारे',
    'alerts.inspect': 'पार्सल तपशील तपासा',

    // Farmer Portal
    'farmer.portalTitle': 'ब्रो फोरसी — शेतकरी व जमीनमालक पोर्टल',
    'farmer.publicCadastre': 'सार्वजनिक भूमी अभिलेख',
    'farmer.officerLogin': 'अधिकारी लॉगिन →',
    'farmer.tagline': 'शेतकरी व जमीनमालक भूसंपादन स्थिती माहिती (भूसंपादन कायदा २०१३)',
    'farmer.searchHeading': 'आपला सर्व्हे नंबर व भूसंपादन तपशील तपासा',
    'farmer.searchPrompt': '७/१२ उताऱ्यावरील सर्व्हे नंबर, गट नंबर, गाव किंवा जमीनमालकाचे नाव टाकून संपादनाची सद्यस्थिती, सुनावणी तारीख आणि भरपाई रक्कम पहा.',
    'farmer.searchPlaceholder': 'सर्व्हे क्र. (उदा. ४५/२अ, ११२/१), गाव किंवा मालकाचे नाव शोधा...',
    'farmer.popularSamples': 'नमुना सर्व्हे क्रमांक:',
    'farmer.matchingRecords': 'जुळणारे भूमी अभिलेख',
    'farmer.inspectDossier': 'तपशील उघडा →',
    'farmer.stageTracker': 'भूसंपादन वैधानिक टप्पा ट्रॅकर',
    'farmer.stageTrackerDesc': 'भूसंपादन, पुनर्वसन व पुनर्स्थापना कायदा २०१३ नुसार बंधनकारक कायदेशीर टप्पे.',
    'farmer.registeredOwner': 'नोंदणीकृत जमीनमालक',
    'farmer.acqArea': 'संपादन क्षेत्र',
    'farmer.estimatedAward': 'अंदाजित सोलेशियम भरपाई',
    'farmer.objectionStatus': 'हरकत / सुनावणी स्थिती',
    'farmer.compHeading': 'रास्त भरपाई निवाडा अंदाज',
    'farmer.readyReckonerRate': 'पायाभूत रेडी रेकनर दर',
    'farmer.ruralFactor': 'ग्रामीण गुणांक घटक',
    'farmer.solatiumBonus': '१००% सोलेशियम (कलम ३०(१))',
    'farmer.totalCompensation': 'एकूण अंदाजे भरपाई रक्कम',
    'farmer.dbtNotice': 'भरपाई वाटप: मूळ ७/१२ उतारा आणि कागदपत्रांच्या पडताळणीनंतर थेट बँक हस्तांतरणाद्वारे (DBT) जमीनमालकाच्या आधार-संलग्न खात्यात रक्कम जमा केली जाते.',
    'farmer.hearings': 'सार्वजनिक सुनावणी व सूचना फलक',
    'farmer.hearingNotice': 'कलम १५ हरकती सुनावणी',
    'farmer.venue': 'स्थळ: विशेष भूसंपादन अधिकारी कार्यालय (SLAO 2), नवीन प्रशासकीय इमारत, कॅम्प, पुणे.',
    'farmer.reqDocs': 'सुनावणीसाठी आवश्यक कागदपत्रे:',
    'farmer.doc1': 'मूळ ७/१२ उतारा (मागील ३ महिन्यांतील)',
    'farmer.doc2': '८-अ खातेदार नोंद उतारा',
    'farmer.doc3': 'आधार कार्ड व पॅन कार्ड प्रत',
    'farmer.doc4': 'थेट भरपाई हस्तांतरणासाठी बँक पासबुक / रद्द केलेला धनादेश',
    'farmer.fileGrievance': 'तक्रार किंवा आक्षेप नोंदवा',
    'farmer.grievanceDesc': 'सर्व्हे क्र. {survey} बाबत सीमा विवाद, न मोजलेली फळझाडे/विहीर किंवा भरपाई तफावतीबाबत अधिकृत अर्ज येथे नोंदवा.',
    'farmer.claimantName': 'जमीनमालक / अर्जदाराचे नाव *',
    'farmer.mobilePhone': 'भ्रमणध्वनी (मोबाईल) क्रमांक *',
    'farmer.objectionCategory': 'आक्षेपाचा प्रकार *',
    'farmer.detailedDescription': 'तक्रारीचे सविस्तर वर्णन *',
    'farmer.submitBtn': 'अधिकृत आक्षेप नोंदवा',
    'farmer.submitting': 'नोंदवत आहे...',
    'farmer.successTitle': 'तक्रार यशस्वीरित्या नोंदवली गेली',
    'farmer.successRef': 'आपला तक्रार संदर्भ टोकन क्रमांक:',
    'farmer.successNotice': 'सक्षम प्राधिकाऱ्याकडून १४ कामकाजाच्या दिवसांत नोटीस जारी केली जाईल. उपविभागीय कार्यालयात आपण हा संदर्भ दाखवू शकता.',
    'farmer.submitAnother': 'दुसरा अर्ज दाखल करा',

    // Auth & Login
    'auth.signInTitle': 'भूसंपादन माहिती प्रणालीत प्रवेश करा',
    'auth.requestAccessTitle': 'प्रणाली प्रवेशासाठी विनंती नोंदवा',
    'auth.publicFarmerPortal': '🌾 शेतकरी व जमीनमालक पोर्टल',
    'auth.publicPortalDesc': 'सर्व्हे नोंदी आणि भरपाई स्थिती तपासा',
    'auth.openPortal': 'पोर्टल उघडा →',
    'auth.email': 'ईमेल पत्ता',
    'auth.password': 'पासवर्ड',
    'auth.fullName': 'पूर्ण नाव',
    'auth.signInBtn': 'प्रवेश करा',
    'auth.requestAccountBtn': 'खात्याची विनंती करा',
    'auth.needAccount': 'खाते हवे आहे? प्रवेश विनंती करा',
    'auth.haveAccount': 'आधीच खाते आहे? प्रवेश करा',
    'auth.orContinueWith': 'किंवा याद्वारे सुरू ठेवा',
    'auth.policyNotice': 'प्रवेश नियम सूचना: शासकीय भूमी अभिलेखांच्या सुरक्षेसाठी, नवीन नोंदणी केलेल्या सर्व खात्यांना प्रशासकीय मंजुरी मिळाल्यानंतरच पूर्ण प्रवेश दिला जातो.',
    'auth.pendingTitle': 'खाते स्थिती: प्रशासक मंजुरी प्रलंबित',
    'auth.pendingHeading': 'प्रशासकीय मंजुरी आवश्यक',
    'auth.pendingDesc': 'ब्रो फोरसी मध्ये नोंदणी केल्याबद्दल धन्यवाद. संवेदनशील भूसंपादन नोंदी आणि मोजणी माहितीच्या सुरक्षेसाठी आपले खाते प्रशासकीय मान्यतेच्या प्रतीक्षेत आहे.',
    'auth.checkApproval': 'मंजुरी स्थिती तपासा',
    'auth.verifyingStatus': 'स्थिती तपासत आहे...',
    'auth.farmerNotice': 'आपल्या वैयक्तिक जमिनीची स्थिती किंवा भरपाई पाहायची असल्यास, आपण थेट सार्वजनिक शेतकरी पोर्टल वापरू शकता.',

    // Settings
    'settings.title': 'सेटिंग्ज आणि प्रवेश नियंत्रण',
    'settings.subtitle': 'आपले खाते आणि कर्मचारी मंजुरी सूची व्यवस्थापित करा.',
    'settings.userProfile': 'आपले खाते तपशील',
    'settings.pendingApprovals': 'मंजुरीच्या प्रतीक्षेतील नोंदणी',
    'settings.directAccessBlocked': 'प्रशासक मंजुरी मिळेपर्यंत थेट प्रवेश प्रतिबंधित आहे',
    'settings.approveOperator': 'ऑपरेटर म्हणून मंजूर करा',
    'settings.approveLandowner': 'जमीनमालक म्हणून मंजूर करा',
    'settings.reject': 'नाकारा',
    'settings.grantAccess': 'प्रवेश मंजूर करा',
    'settings.suspend': 'निलंबित करा',
    'settings.userDirectory': 'वापरकर्ता प्रवेश यादी व नियमन',
    'settings.emailCol': 'ईमेल',
    'settings.nameCol': 'नाव',
    'settings.statusCol': 'स्थिती',
    'settings.roleCol': 'भूमिका',
    'settings.actionCol': 'कृती',

    // Common
    'common.language': 'भाषा',
    'common.selectLanguage': 'भाषा निवडा',
    'common.close': 'बंद करा',
    'common.status': 'स्थिती',
    'common.actions': 'कृती',
    'common.loading': 'लोड होत आहे...',
    'common.save': 'जतन करा',
    'common.cancel': 'रद्द करा',
    'common.acres': 'एकर',
  },

  hi: {
    // Navigation & Layout
    'nav.brand': 'ब्रो फोरसी',
    'nav.brandSubtitle': 'भूमि अधिग्रहण नियंत्रण प्रणाली',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.parcels': 'भूमि पार्सल रजिस्टर',
    'nav.gisMap': 'जीआईएस नक्शा',
    'nav.alerts': 'पूर्व चेतावनी',
    'nav.farmerPortal': 'किसान पोर्टल',
    'nav.upload': 'डेटा अपलोड',
    'nav.reports': 'रिपोर्ट',
    'nav.logs': 'सिस्टम लॉग्स',
    'nav.settings': 'सेटिंग्स',
    'nav.signOut': 'साइन आउट',
    'nav.exportReport': 'रिपोर्ट निर्यात',
    'nav.exporting': 'निर्यात हो रहा है...',
    'nav.administrator': 'प्रशासक',
    'nav.landowner': 'भूस्वामी',
    'nav.fieldOperator': 'फील्ड ऑपरेटर',
    'nav.termsPrivacy': 'नियम और गोपनीयता',
    'nav.version': 'v2.4 उत्पादन',

    // Header
    'header.project': 'पुणे परियोजना',
    'header.searchPlaceholder': 'पार्सल, सर्वे नंबर, भूस्वामी खोजें...',
    'header.notifications': 'सूचनाएं',
    'header.allWarnings': 'सभी चेतावनियां देखें →',
    'header.matchingParcels': 'मिलते-जुलते पार्सल',
    'header.noMatches': 'इस खोज के लिए कोई पार्सल नहीं मिला:',
    'header.viewInRegistry': 'भूमि रजिस्ट्री में सभी परिणाम देखें →',

    // Dashboard
    'dashboard.title': 'भूमि अधिग्रहण एवं जोखिम नियंत्रण केंद्र',
    'dashboard.subtitle': 'पुणे मेट्रो बुनियादी ढांचा गलियारे के भूखंड अधिग्रहण और संभावित देरी कारकों की रीयल-टाइम निगरानी।',
    'dashboard.totalParcels': 'कुल पार्सल',
    'dashboard.acquired': 'अधिग्रहण पूर्ण',
    'dashboard.highRisk': 'उच्च जोखिम पार्सल',
    'dashboard.avgDelay': 'औसत अनुमानित देरी',
    'dashboard.days': 'दिन',
    'dashboard.riskDistribution': 'देरी जोखिम वितरण',
    'dashboard.disputeBottlenecks': 'प्रमुख विवाद और बाधाएं',
    'dashboard.milestones': 'अधिग्रहण मील के पत्थर की प्रगति',
    'dashboard.recentAlerts': 'पूर्व चेतावनी फीड',
    'dashboard.inspectDossier': 'विवरण देखें',
    'dashboard.quickLinks': 'संचालन पोर्टल',
    'dashboard.lowRiskLabel': 'कम जोखिम',
    'dashboard.mediumRiskLabel': 'मध्यम जोखिम',
    'dashboard.highRiskLabel': 'उच्च जोखिम',
    'dashboard.stage1': 'संयुक्त माप सर्वेक्षण',
    'dashboard.stage2': 'धारा 11(1) प्रारंभिक अधिसूचना',
    'dashboard.stage3': 'धारा 15 आपत्ति सुनवाई',
    'dashboard.stage4': 'धारा 19(1) अंतिम घोषणा',
    'dashboard.stage5': 'धारा 23 मुआवजा पंचाट',
    'dashboard.stage6': 'कब्जा और वितरण',

    // Parcels Page
    'parcels.title': 'भूमि पार्सल रजिस्टर',
    'parcels.subtitle': 'सर्वेक्षित भूखंडों, स्वामित्व और कानूनी कार्यवाही की विस्तृत सूची।',
    'parcels.registerBtn': 'नया पार्सल दर्ज करें',
    'parcels.searchPlaceholder': 'आईडी, सर्वे नंबर, मालिक, गांव से खोजें...',
    'parcels.showingCount': '{total} में से {count} पार्सल दिखाए जा रहे हैं',
    'parcels.filterAll': 'सभी',
    'parcels.filterHigh': 'उच्च',
    'parcels.filterMedium': 'मध्यम',
    'parcels.filterLow': 'कम',
    'parcels.colId': 'पार्सल आईडी',
    'parcels.colSurvey': 'सर्वे / गट सं.',
    'parcels.colOwner': 'भूस्वामी',
    'parcels.colVillage': 'गांव',
    'parcels.colArea': 'क्षेत्रफल (एकड़)',
    'parcels.colStage': 'अधिग्रहण चरण',
    'parcels.colRisk': 'जोखिम स्तर',
    'parcels.colActions': 'कार्रवाई',
    'parcels.viewDossier': 'विवरण देखें',

    // GIS Map
    'map.title': 'जीआईएस पार्सल नक्शा',
    'map.subtitle': 'भूखंडों का भौगोलिक वितरण और पहचाने गए जोखिम क्षेत्र।',
    'map.filter': 'फ़िल्टर:',
    'map.allParcels': 'सभी पार्सल',
    'map.riskLegend': 'जोखिम सूची',
    'map.highRiskLegend': 'उच्च जोखिम (>75)',
    'map.medRiskLegend': 'मध्यम जोखिम (41-75)',
    'map.lowRiskLegend': 'कम जोखिम (≤40)',

    // Early Warnings / Alerts
    'alerts.title': 'पूर्व चेतावनी और जोखिम संकेत',
    'alerts.subtitle': 'अधिग्रहण में देरी, स्वामित्व विवाद और अदालती आपत्तियों की पहचान करने वाली स्वचालित प्रणाली।',
    'alerts.filterStatus': 'स्थिति फ़िल्टर:',
    'alerts.allAlerts': 'सभी चेतावनियां',
    'alerts.inspect': 'पार्सल विवरण देखें',

    // Farmer Portal
    'farmer.portalTitle': 'ब्रो फोरसी — किसान एवं भूस्वामी पोर्टल',
    'farmer.publicCadastre': 'सार्वजनिक भूमि रिकॉर्ड',
    'farmer.officerLogin': 'अधिकारी लॉगिन →',
    'farmer.tagline': 'किसान एवं भूस्वामी अधिग्रहण स्थिति खोज (भूमि अधिग्रहण अधिनियम 2013)',
    'farmer.searchHeading': 'अपना सर्वे नंबर और भूमि अधिग्रहण विवरण जांचें',
    'farmer.searchPrompt': '7/12 खतौनी में दर्ज अपना सर्वे नंबर, गट नंबर, गांव या भूस्वामी का नाम दर्ज करके अधिग्रहण की स्थिति, सुनवाई की तारीख और मुआवजा राशि देखें।',
    'farmer.searchPlaceholder': 'सर्वे सं. (उदा. 45/2A, 112/1), गांव या मालिक का नाम खोजें...',
    'farmer.popularSamples': 'नमूना सर्वे नंबर:',
    'farmer.matchingRecords': 'मिलते-जुलते भूमि रिकॉर्ड',
    'farmer.inspectDossier': 'विवरण खोलें →',
    'farmer.stageTracker': 'भूमि अधिग्रहण वैधानिक चरण ट्रैकर',
    'farmer.stageTrackerDesc': 'भूमि अधिग्रहण, पुनर्वास और पुनर्स्थापन अधिनियम 2013 के तहत अनिवार्य प्रक्रियात्मक कदम।',
    'farmer.registeredOwner': 'पंजीकृत भूस्वामी',
    'farmer.acqArea': 'अधिग्रहण क्षेत्रफल',
    'farmer.estimatedAward': 'अनुमानित सोलेशियम पुरस्कार',
    'farmer.objectionStatus': 'आपत्ति / सुनवाई स्थिति',
    'farmer.compHeading': 'उचित मुआवजा अनुमान',
    'farmer.readyReckonerRate': 'आधार रेडी रेकनर दर',
    'farmer.ruralFactor': 'ग्रामीण गुणन कारक',
    'farmer.solatiumBonus': '100% सोलेशियम (धारा 30(1))',
    'farmer.totalCompensation': 'कुल अनुमानित मुआवजा राशि',
    'farmer.dbtNotice': 'मुआवजा वितरण: मूल 7/12 खतौनी और दस्तावेजों के सत्यापन के बाद प्रत्यक्ष लाभ अंतरण (DBT) द्वारा राशि सीधे भूस्वामी के आधार-लिंक्ड बैंक खाते में जमा की जाती है।',
    'farmer.hearings': 'सार्वजनिक सुनवाई और सूचना पट्ट',
    'farmer.hearingNotice': 'धारा 15 आपत्ति सुनवाई',
    'farmer.venue': 'स्थान: विशेष भूमि अधिग्रहण अधिकारी कार्यालय (SLAO 2), नया प्रशासनिक भवन, कैंप, पुणे।',
    'farmer.reqDocs': 'सुनवाई के लिए आवश्यक दस्तावेज:',
    'farmer.doc1': 'मूल 7/12 खतौनी (पिछले 3 महीनों की)',
    'farmer.doc2': '8-ए खातेदार उद्धरण',
    'farmer.doc3': 'आधार कार्ड और पैन कार्ड की प्रति',
    'farmer.doc4': 'मुआवजा अंतरण के लिए बैंक पासबुक / रद्द चेक',
    'farmer.fileGrievance': 'आपत्ति या शिकायत दर्ज करें',
    'farmer.grievanceDesc': 'सर्वे सं. {survey} के लिए सीमा विवाद, बिना गिने पेड़/कुएं या मुआवजे में अंतर के लिए अपनी औपचारिक आपत्ति यहां दर्ज करें।',
    'farmer.claimantName': 'भूस्वामी / आवेदक का नाम *',
    'farmer.mobilePhone': 'मोबाइल फोन नंबर *',
    'farmer.objectionCategory': 'आपत्ति की श्रेणी *',
    'farmer.detailedDescription': 'आपत्ति का विस्तृत विवरण *',
    'farmer.submitBtn': 'औपचारिक आपत्ति दर्ज करें',
    'farmer.submitting': 'दर्ज हो रहा है...',
    'farmer.successTitle': 'शिकायत सफलतापूर्वक दर्ज की गई',
    'farmer.successRef': 'आपका शिकायत संदर्भ टोकन है:',
    'farmer.successNotice': 'सक्षम प्राधिकारी द्वारा 14 कार्य दिवसों के भीतर नोटिस जारी किया जाएगा। आप उप-मंडलीय कार्यालय में यह टोकन प्रस्तुत कर सकते हैं।',
    'farmer.submitAnother': 'दूसरा आवेदन दर्ज करें',

    // Auth & Login
    'auth.signInTitle': 'भूमि अधिग्रहण सूचना प्रणाली में प्रवेश करें',
    'auth.requestAccessTitle': 'सिस्टम एक्सेस के लिए अनुरोध करें',
    'auth.publicFarmerPortal': '🌾 किसान एवं भूस्वामी पोर्टल',
    'auth.publicPortalDesc': 'सर्वे रिकॉर्ड और मुआवजा स्थिति देखें',
    'auth.openPortal': 'पोर्टल खोलें →',
    'auth.email': 'ईमेल पता',
    'auth.password': 'पासवर्ड',
    'auth.fullName': 'पूरा नाम',
    'auth.signInBtn': 'साइन इन करें',
    'auth.requestAccountBtn': 'खाते का अनुरोध करें',
    'auth.needAccount': 'खाता चाहिए? एक्सेस का अनुरोध करें',
    'auth.haveAccount': 'पहले से खाता है? साइन इन करें',
    'auth.orContinueWith': 'या इसके साथ जारी रखें',
    'auth.policyNotice': 'प्रवेश नीति सूचना: सरकारी भूमि रिकॉर्ड की सुरक्षा के लिए, सभी नए पंजीकरणों को प्रशासनिक स्वीकृति मिलने के बाद ही पूर्ण एक्सेस दिया जाता है।',
    'auth.pendingTitle': 'खाता स्थिति: प्रशासक अनुमोदन लंबित',
    'auth.pendingHeading': 'प्रशासनिक स्वीकृति आवश्यक',
    'auth.pendingDesc': 'ब्रो फोरसी में पंजीकरण के लिए धन्यवाद। संवेदनशील भूमि अधिग्रहण रिकॉर्ड और सर्वेक्षण डेटा की सुरक्षा के लिए आपका खाता प्रशासनिक मंजूरी की प्रतीक्षा कर रहा है।',
    'auth.checkApproval': 'अनुमोदन स्थिति जांचें',
    'auth.verifyingStatus': 'स्थिति जांची जा रही है...',
    'auth.farmerNotice': 'अपनी व्यक्तिगत भूमि की स्थिति या मुआवजा देखने के लिए, आप सीधे सार्वजनिक किसान पोर्टल का उपयोग कर सकते हैं।',

    // Settings
    'settings.title': 'सेटिंग्स और एक्सेस नियंत्रण',
    'settings.subtitle': 'अपनी खाता साख और कर्मचारी अनुमोदन निर्देशिका प्रबंधित करें।',
    'settings.userProfile': 'आपका खाता विवरण',
    'settings.pendingApprovals': 'अनुमोदन की प्रतीक्षा में पंजीकरण',
    'settings.directAccessBlocked': 'प्रशासक अनुमोदन मिलने तक सीधा प्रवेश अवरुद्ध है',
    'settings.approveOperator': 'ऑपरेटर के रूप में स्वीकृत करें',
    'settings.approveLandowner': 'भूस्वामी के रूप में स्वीकृत करें',
    'settings.reject': 'अस्वीकार करें',
    'settings.grantAccess': 'एक्सेस प्रदान करें',
    'settings.suspend': 'निलंबित करें',
    'settings.userDirectory': 'उपयोगकर्ता एक्सेस निर्देशिका और शासन',
    'settings.emailCol': 'ईमेल',
    'settings.nameCol': 'नाम',
    'settings.statusCol': 'स्थिति',
    'settings.roleCol': 'भूमिका',
    'settings.actionCol': 'कार्रवाई',

    // Common
    'common.language': 'भाषा',
    'common.selectLanguage': 'भाषा चुनें',
    'common.close': 'बंद करें',
    'common.status': 'स्थिति',
    'common.actions': 'कार्रवाई',
    'common.loading': 'लोड हो रहा है...',
    'common.save': 'सहेजें',
    'common.cancel': 'रद्द करें',
    'common.acres': 'एकड़',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: TranslationKey) => key,
  languages: SUPPORTED_LANGUAGES,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('app_language');
    if (saved === 'mr' || saved === 'hi' || saved === 'en') {
      return saved;
    }
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const langDict = translations[language] || translations.en;
    let text = (langDict as any)[key] || (translations.en as any)[key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
