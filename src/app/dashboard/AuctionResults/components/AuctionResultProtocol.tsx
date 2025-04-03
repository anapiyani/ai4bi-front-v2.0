import {useTranslations} from "next-intl";
import RateItem from "@/src/app/dashboard/AuctionResults/components/RateItem";
import {Button} from "@/components/ui/button";

const AuctionResultProtocol = () => {
    const t = useTranslations("dashboard")
    return (
        <div className={"w-full h-full flex flex-col gap-4"}>
            <div className={"flex items-center justify-between"}>
                <div className={"flex flex-col w-full"}>
                    <h2 className={"text-brand-gray text-xl font-semibold"}>{t("rating")}</h2>
                    {/*<p className={"text-brand-gray text-sm"}>{t("proposal_edit_time_remaining", {hours: 12, minutes: 45})}</p> //when time is ready to use*/}
                    <p className={"text-brand-gray text-sm"}>{t("choose_winner_and_reserve_winner")}</p>
                </div>
                <div>
                    <Button variant={"default"}>
                        {t("approve_results")}
                    </Button>
                </div>
            </div>
            <div>
                <h1>{t("lot")} №1</h1>
                <div className={"grid grid-cols-12 gap-4 bg-white p-3 mt-3 rounded-lg text-center"}>
                    <div className={"col-span-2 text-brand-gray"}>
                        <h1>{t("partner_name")}</h1>
                    </div>
                    <div className={"col-span-2 flex flex-col gap-2"}>
                        <p>{t("overall_rating")}</p>
                    </div>
                    <div className={"col-span-1"}>
                        <p>{t("execution_time")}</p>
                    </div>
                    <div className={"col-span-1"}>
                        <p>{t("work_cost")}</p>
                    </div>
                    <div className={"col-span-2"}>
                        <p>{t("post_tender_amount")}</p>
                    </div>
                    <div className={"col-span-1"}>
                        <p>{t("advance_payment")}</p>
                    </div>
                </div>
                <div className={"p-3 mt-3 rounded-lg  text-center gap-4"}>
                    <RateItem t={t} name={"Наименование поставщика"} work_cost={"12 000 000"} advance_payment={"14%"} overall_rating={4.2} the_best_score={true} execution_time={"8 месяцев"} post_tender_amount={"12 000 000"} />
                </div>
            </div>
        </div>
    )
}

export default AuctionResultProtocol