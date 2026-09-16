import {
  AgreementLayout,
  AgreementSection,
} from "@/components/agreements/AgreementLayout";
import { usePageTitle } from "@/hooks/use-page-title";
import { useTranslation } from "@/hooks/use-translation";

export default function TermsOfService() {
  const { t } = useTranslation();
  usePageTitle(t.agreements.pageTitleTos);

  return (
    <AgreementLayout
      nomor="L01"
      label={t.agreements.pageTitleTos}
      title={t.agreements.tosTitle}
      intro={t.agreements.tosIntro}
    >
      <AgreementSection
        title={t.agreements.tosSection1Title}
        body={t.agreements.tosSection1Body}
      />
      <AgreementSection
        title={t.agreements.tosSection2Title}
        body={t.agreements.tosSection2Body}
      />
      <AgreementSection
        title={t.agreements.tosSection3Title}
        body={t.agreements.tosSection3Body}
      />
      <AgreementSection
        title={t.agreements.tosSection4Title}
        body={t.agreements.tosSection4Body}
      />
      <AgreementSection
        title={t.agreements.tosSection5Title}
        body={t.agreements.tosSection5Body}
      />
    </AgreementLayout>
  );
}