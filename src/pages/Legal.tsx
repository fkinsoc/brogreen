import React from "react";
import AppLayout from "../components/Layout";
import { FileText, ShieldCheck, Lock } from "lucide-react";

export default function LegalPage() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div className="pb-3 border-b border-[#e5e2da] dark:border-[#212c24]">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#181c19] dark:text-[#eff3ef]">
            Terms & Privacy
          </h1>
          <p className="text-xs text-[#58615a] dark:text-[#95a398] mt-0.5">
            Operational terms, privacy policies, and compliance conditions for Bro Foresee.
          </p>
        </div>

        <div className="space-y-4">
          {/* Card 1: Terms */}
          <div className="rounded-lg border border-[#e5e2da] dark:border-[#222f26] bg-white dark:bg-[#141d17] p-5 shadow-2xs">
            <div className="flex items-center gap-2.5 mb-3 pb-2 border-b border-[#eeebe3] dark:border-[#1d2920]">
              <FileText className="w-4 h-4 text-[#1f4230] dark:text-[#82c499]" />
              <h2 className="text-sm font-semibold text-[#181c19] dark:text-[#eff3ef]">
                Terms of Service
              </h2>
            </div>

            <div className="text-xs text-[#444d46] dark:text-[#abb6ad] leading-relaxed space-y-2">
              <p>
                By accessing Bro Foresee, you agree to these operational terms. All predictions, risk scores, and geospatial overlays are provided for decision support in land acquisition workflows.
              </p>
              <h3 className="text-xs font-semibold text-[#181c19] dark:text-[#eff3ef] pt-1">
                1. Access Governance
              </h3>
              <p>
                Access credentials must remain confidential. Administrators retain full authority to grant or revoke divisional permissions.
              </p>
              <h3 className="text-xs font-semibold text-[#181c19] dark:text-[#eff3ef] pt-1">
                2. Data Integrity
              </h3>
              <p>
                Users are responsible for ensuring parcel data accuracy when uploading CSV/Excel sheets.
              </p>
            </div>
          </div>

          {/* Card 2: Privacy */}
          <div className="rounded-lg border border-[#e5e2da] dark:border-[#222f26] bg-white dark:bg-[#141d17] p-5 shadow-2xs">
            <div className="flex items-center gap-2.5 mb-3 pb-2 border-b border-[#eeebe3] dark:border-[#1d2920]">
              <ShieldCheck className="w-4 h-4 text-[#1f4230] dark:text-[#82c499]" />
              <h2 className="text-sm font-semibold text-[#181c19] dark:text-[#eff3ef]">
                Privacy Policy
              </h2>
            </div>

            <div className="text-xs text-[#444d46] dark:text-[#abb6ad] leading-relaxed space-y-2">
              <p>
                Landowner records, parcel identifiers, and dispute documentation are securely stored in isolated database collections with granular access rules.
              </p>
              <p>
                Uploaded proprietary data is processed securely and is never used to train public machine learning models.
              </p>
            </div>
          </div>

          {/* Card 3: Disclaimer */}
          <div className="rounded-lg border border-[#e5e2da] dark:border-[#222f26] bg-white dark:bg-[#141d17] p-5 shadow-2xs">
            <div className="flex items-center gap-2.5 mb-3 pb-2 border-b border-[#eeebe3] dark:border-[#1d2920]">
              <Lock className="w-4 h-4 text-[#5a412f] dark:text-[#c49870]" />
              <h2 className="text-sm font-semibold text-[#181c19] dark:text-[#eff3ef]">
                Disclaimer
              </h2>
            </div>

            <div className="text-xs text-[#444d46] dark:text-[#abb6ad] leading-relaxed">
              <p>
                Delay estimations and risk ratings represent statistical predictive models based on historical patterns and survey attributes. They do not constitute formal judicial findings or binding legal advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
