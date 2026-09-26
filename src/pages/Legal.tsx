import React, { useState } from "react";
import AppLayout from "../components/Layout";
import { FileText, ShieldCheck, Scale, Lock, AlertCircle, Building2, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="pb-3 border-b border-[#e5e2da] dark:border-[#212c24] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#181c19] dark:text-[#eff3ef]">
              Legal Governance: Terms of Service & Privacy Policy
            </h1>
            <p className="text-xs text-[#58615a] dark:text-[#95a398] mt-0.5">
              Statutory terms, cadastral data governance, and privacy disclosures for the Bro Foresee Land Acquisition Intelligence System.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center p-0.5 bg-[#eeeae0] dark:bg-[#1a251e] rounded-xs border border-[#dedad1] dark:border-[#25342a] self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("terms")}
              className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
                activeTab === "terms"
                  ? "bg-[#1f4230] text-white font-semibold"
                  : "text-[#58615a] dark:text-[#95a398] hover:text-[#181c19] dark:hover:text-white"
              }`}
            >
              Terms of Service
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
                activeTab === "privacy"
                  ? "bg-[#1f4230] text-white font-semibold"
                  : "text-[#58615a] dark:text-[#95a398] hover:text-[#181c19] dark:hover:text-white"
              }`}
            >
              Privacy Policy
            </button>
          </div>
        </div>

        {/* Regulatory Banner */}
        <div className="p-3 rounded-xs border border-[#dedad1] dark:border-[#25342a] bg-[#f8f8f5] dark:bg-[#111813] text-xs text-[#444d46] dark:text-[#abb6ad] flex items-start gap-2.5">
          <Scale className="w-4 h-4 text-[#1f4230] dark:text-[#82c499] flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-[#181c19] dark:text-[#eff3ef]">
              Statutory Alignment:
            </span>{" "}
            Bro Foresee operates in conformity with the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (RFCTLARR Act), state land revenue codes, cadastral survey norms, and applicable data security guidelines.
          </div>
        </div>

        {activeTab === "terms" ? (
          /* Terms of Service */
          <div className="rounded-xs border border-[#e5e2da] dark:border-[#222f26] bg-white dark:bg-[#141d17] p-5 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-[#eeebe3] dark:border-[#1d2920]">
              <FileText className="w-4 h-4 text-[#1f4230] dark:text-[#82c499]" />
              <h2 className="text-sm font-bold text-[#181c19] dark:text-[#eff3ef] uppercase tracking-wide">
                Land Acquisition Platform Terms of Service
              </h2>
            </div>

            <div className="text-xs text-[#363e38] dark:text-[#cad6cd] space-y-5 leading-relaxed">
              <section className="space-y-1.5">
                <h3 className="font-semibold text-xs text-[#181c19] dark:text-[#eff3ef]">
                  1. Scope of Service & Platform Purpose
                </h3>
                <p>
                  Bro Foresee is a dedicated land acquisition risk intelligence and cadastral workflow system designed for government authorities, implementing infrastructure agencies, project directors, field surveyors, and registered landowners. The platform provides predictive delay scoring, cadastral record linkage, statutory milestone monitoring, and public inquiry access.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-semibold text-xs text-[#181c19] dark:text-[#eff3ef]">
                  2. Authorized Operational Roles & Clearances
                </h3>
                <p>
                  Platform access is governed by strict administrative clearance tiers:
                </p>
                <div className="pl-3 border-l-2 border-[#1f4230] space-y-1 text-[11px] text-[#58615a] dark:text-[#95a398]">
                  <p>
                    <strong>(a) Administrators:</strong> Authorized revenue and land acquisition officers who manage user approvals, assign divisional roles, and oversee cadastral database revisions.
                  </p>
                  <p>
                    <strong>(b) Field Operators & Surveyors:</strong> Authorized personnel permitted to upload joint measurement survey records, update physical boundary verifications, and submit dispute flags.
                  </p>
                  <p>
                    <strong>(c) Landowners & Claimants:</strong> Citizens and khatedars accessing public survey lookups, compensation estimations, and formal objection lodgment mechanisms.
                  </p>
                </div>
                <p>
                  Attempting unauthorized access, bypassing administrative approval gates, or altering cadastral records without statutory delegation is strictly prohibited and subject to legal prosecution.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-semibold text-xs text-[#181c19] dark:text-[#eff3ef]">
                  3. Predictive Scoring & Risk Analysis Limitations
                </h3>
                <p>
                  Delay projections, risk ratings (0 to 100), and bottle-neck estimations represent computational statistical models derived from survey complexity, historical court litigation timelines, land parcel partition status, and tree/structure inventories. These ratings serve as decision-support indicators for project scheduling.
                </p>
                <p>
                  Predictive scores do not constitute formal judicial findings, binding decrees of competent courts, or final statutory awards under Section 23 of the RFCTLARR Act. Official land possession and disbursement depend exclusively on signed awards issued by the Competent Land Acquisition Authority (CALA / SLAO).
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-semibold text-xs text-[#181c19] dark:text-[#eff3ef]">
                  4. Landowner Compensation Estimates
                </h3>
                <p>
                  Calculations displayed in the Farmer Portal (including Ready Reckoner rates, rural multiplication factors, and 100% Solatium under Section 30(1)) are indicative estimates based on current public gazette tariffs. Official compensation awards are finalized only after physical joint measurement, verification of 7/12 satbara extracts, structural valuation by competent engineers, and hearing of objections under Section 15.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-semibold text-xs text-[#181c19] dark:text-[#eff3ef]">
                  5. Ingestion of Data & Field Records
                </h3>
                <p>
                  Users uploading batch CSV or spatial data files are responsible for verifying data source authenticity, survey sheet coordinates, and landowner names. Knowingly introducing falsified survey records or fabricated encroachment data into the platform violates administrative governance protocols.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-semibold text-xs text-[#181c19] dark:text-[#eff3ef]">
                  6. Grievance Lodgment & Dispute Redressal
                </h3>
                <p>
                  Formal objections submitted through the system generate immutable audit tokens (e.g., GRV-2026-XXXX). Submission of an objection initiates procedural forwarding to the competent Sub-Divisional Officer. Claimants retain full rights to appear at scheduled Section 15 public hearings with original land records.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-semibold text-xs text-[#181c19] dark:text-[#eff3ef]">
                  7. Amendments & Institutional Jurisdiction
                </h3>
                <p>
                  These operational terms are periodically updated to reflect amendments in statutory land regulations and municipal infrastructure directives. Continued use constitutes acceptance of revised terms.
                </p>
              </section>
            </div>
          </div>
        ) : (
          /* Privacy Policy */
          <div className="rounded-xs border border-[#e5e2da] dark:border-[#222f26] bg-white dark:bg-[#141d17] p-5 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-[#eeebe3] dark:border-[#1d2920]">
              <ShieldCheck className="w-4 h-4 text-[#1f4230] dark:text-[#82c499]" />
              <h2 className="text-sm font-bold text-[#181c19] dark:text-[#eff3ef] uppercase tracking-wide">
                Cadastral Data Protection & Privacy Policy
              </h2>
            </div>

            <div className="text-xs text-[#363e38] dark:text-[#cad6cd] space-y-5 leading-relaxed">
              <section className="space-y-1.5">
                <h3 className="font-semibold text-xs text-[#181c19] dark:text-[#eff3ef]">
                  1. Information We Collect & Process
                </h3>
                <p>
                  Bro Foresee collects and processes cadastral and user data exclusively for statutory land acquisition purposes:
                </p>
                <div className="pl-3 border-l-2 border-[#1f4230] space-y-1 text-[11px] text-[#58615a] dark:text-[#95a398]">
                  <p>
                    <strong>(a) Cadastral Land Records:</strong> Land survey numbers, Gat numbers, village, taluka, sub-division coordinates, area acreages, ready reckoner rates, and statutory milestone progress.
                  </p>
                  <p>
                    <strong>(b) Landowner Identifiers:</strong> Khatedar names as recorded in 7/12 extracts, contact numbers provided during grievance lodgment, and hearing participation records.
                  </p>
                  <p>
                    <strong>(c) Operator Credentials:</strong> System account email addresses, institutional clearance levels, access authorization status, and cryptographic audit log signatures.
                  </p>
                </div>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-semibold text-xs text-[#181c19] dark:text-[#eff3ef]">
                  2. Purpose & Legal Basis of Data Processing
                </h3>
                <p>
                  Data processing is conducted strictly under lawful governmental and public infrastructure mandates:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-[#58615a] dark:text-[#95a398]">
                  <li>Executing transparent joint measurement surveys and public notification schedules.</li>
                  <li>Facilitating equitable solatium and compensation calculations under RFCTLARR Section 26.</li>
                  <li>Processing Direct Benefit Transfer (DBT) bank verification for compensation awards.</li>
                  <li>Recording formal objections and public hearing notices under statutory procedural rules.</li>
                  <li>Preventing fraudulent dual-claim compensation submissions across municipal corridors.</li>
                </ul>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-semibold text-xs text-[#181c19] dark:text-[#eff3ef]">
                  3. Non-Commercialization & AI Model Isolation
                </h3>
                <p>
                  Landowner personal data, revenue records, and dispute documentation are never commercialized, rented, or transferred to third-party data brokers.
                </p>
                <p>
                  Proprietary survey records uploaded to Bro Foresee are strictly isolated. No private cadastral survey data is used to train public machine learning foundation models.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-semibold text-xs text-[#181c19] dark:text-[#eff3ef]">
                  4. Security Standards & Data Integrity
                </h3>
                <p>
                  All database transactions, user tokens, and cadastral registries are protected by rigorous security practices:
                </p>
                <div className="pl-3 border-l-2 border-[#1f4230] space-y-1 text-[11px] text-[#58615a] dark:text-[#95a398]">
                  <p>
                    <strong>(a) Encryption:</strong> End-to-end transport layer security (TLS 1.3) for all web communications and AES-256 encryption for data at rest.
                  </p>
                  <p>
                    <strong>(b) Role-Based Access Control (RBAC):</strong> Granular Firestore security rules restrict write operations exclusively to approved administrative and operator accounts.
                  </p>
                  <p>
                    <strong>(c) Audit Trails:</strong> Sensitive modifications to compensation records or parcel stages are permanently logged in administrative audit ledgers.
                  </p>
                </div>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-semibold text-xs text-[#181c19] dark:text-[#eff3ef]">
                  5. Landowner Rights & Record Rectification
                </h3>
                <p>
                  Under state land revenue provisions and fair compensation guidelines, registered landowners retain the right to:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-[#58615a] dark:text-[#95a398]">
                  <li>Inspect their survey acreage, tree count, and preliminary valuation records in the public portal.</li>
                  <li>Submit documentary rectifications (such as updated partition deeds or mutation entries).</li>
                  <li>Lodge formal grievances regarding boundary discrepancies or valuation errors.</li>
                </ul>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-semibold text-xs text-[#181c19] dark:text-[#eff3ef]">
                  6. Institutional Contact & Data Protection Officer
                </h3>
                <p>
                  For data protection inquiries, record verification requests, or official communications, stakeholders may contact the Special Land Acquisition Office (SLAO), Haveli Sub-Division, New Administrative Building, Pune.
                </p>
              </section>
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="pt-2 flex justify-between items-center text-xs text-[#6e7770] dark:text-[#8c9c90]">
          <Link to="/" className="text-[#1f4230] dark:text-[#82c499] hover:underline font-medium">
            Return to Command Dashboard
          </Link>
          <span>Effective: September 2026 | Bro Foresee Institutional Cadastre</span>
        </div>
      </div>
    </AppLayout>
  );
}
