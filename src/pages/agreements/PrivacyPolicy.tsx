import {
  AgreementLayout,
  AgreementSection,
} from "@/components/agreements/AgreementLayout";
import { usePageTitle } from "@/hooks/use-page-title";
import { useTranslation } from "@/hooks/use-translation";

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  usePageTitle(t.agreements.pageTitlePrivacy);

  return (
    <AgreementLayout
      nomor="L02"
      label={t.agreements.pageTitlePrivacy}
      title={t.agreements.privacyTitle}
      intro={t.agreements.privacyIntro}
    >
      <AgreementSection
        title={t.agreements.privacySection1Title}
        body={t.agreements.privacySection1Body}
      />
      <AgreementSection
        title={t.agreements.privacySection2Title}
        body={t.agreements.privacySection2Body}
      />
      <AgreementSection
        title={t.agreements.privacySection3Title}
        body={t.agreements.privacySection3Body}
      />
      <AgreementSection
        title={t.agreements.privacySection4Title}
        body={t.agreements.privacySection4Body}
      />
      <AgreementSection
        title={t.agreements.privacySection5Title}
        body={t.agreements.privacySection5Body}
      />
    </AgreementLayout>
  );
}