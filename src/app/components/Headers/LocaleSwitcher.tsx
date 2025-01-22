import { useLocale, useTranslations } from "next-intl"
import LocaleSwitcherSelect from "./LocaleSwitcherSelect"

export default function LocaleSwitcher() {
  const t = useTranslations("dashboard");
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={[
        {
          value: "en",
          label: t("en"),
        },
        {
          value: "ru",
          label: t("ru"),
        },
        {
          value: "kz",
          label: t("kz"),
        },
      ]}
      label={t("language")}
    />
  );
}
