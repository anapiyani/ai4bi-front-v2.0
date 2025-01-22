"use client";

import { Locale } from "@/src/config"
import { setUserLocale } from "@/src/services/locale"
import * as Select from "@radix-ui/react-select"
import clsx from "clsx"
import { useTranslations } from 'next-intl'
import { useTransition } from "react"
import Icons from '../Icons'

type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
  label: string;
};

export default function LocaleSwitcherSelect({
  defaultValue,
  items,
  label,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("dashboard");
  function onChange(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  return (
    <div className="relative">
      <Select.Root defaultValue={defaultValue} onValueChange={onChange}>
        <Select.Trigger
          aria-label={label}
          className={clsx(
            "rounded-sm p-2 transition-colors cursor-pointer",
            isPending && "pointer-events-none opacity-60"
          )}
        >
          <Select.Icon>
            <div className="flex items-center justify-center gap-1 flex-col">
              <Icons.Globe />
              <p className='text-[10px] text-white'>{t("language")}</p>
            </div>
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            align="end"
            className="min-w-[8rem] overflow-hidden rounded-sm bg-white shadow-md cursor-pointer py-4 px-4 w-52"
            position="popper"
          >
            <div>
              <h2 className="text-base font-medium text-primary text-start">{t("choose-language")}</h2>
            </div>
            <Select.Viewport className="border-none">
              {items.map((item) => (
                <Select.Item key={item.value} className="flex items-center py-2 text-base cursor-pointer hover:bg-transparent hover:border-none " value={item.value}>
                  <span className={`text-slate-900 flex items-center gap-4 px-7`}> 
                    {defaultValue === item.value && <span className="w-4 h-4 absolute left-0"><Icons.Check /></span>}
                     {item.label}</span>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.Arrow className="fill-white text-white" />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
