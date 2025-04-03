import {Radio} from "lucide-react";

type Props = {
    name: string,
    overall_rating: number,
    execution_time: string,
    work_cost: string,
    post_tender_amount: string,
    advance_payment: string,
    the_best_score: boolean,
    t: any
}

const RateItem = ({name, overall_rating, execution_time, work_cost, post_tender_amount, advance_payment, the_best_score, t}: Props) => {
    return (
        <div className={"grid grid-cols-12 gap-4 py-4 bg-white rounded-lg text-center items-center"}>
            <div className={"col-span-2 text-brand-gray"}>
                <h1 className={"font-semibold text-brand-gray text-sm"}>{name}</h1>
            </div>
            <div className={"col-span-2 flex flex-col gap-1"}>
                <h1 className={`${the_best_score ? "text-green-600" : "text-neutrals-muted"} text-3xl font-bold`}>{overall_rating}</h1>
                {the_best_score && <p className={"text-green-600"}>{t("the_best_rating")}</p>}
            </div>
            <div className={"col-span-1"}>
                <p className={"text-brand-gray"}>{execution_time}</p>
            </div>
            <div className={"col-span-1"}>
                <p className={"text-brand-gray"}>{work_cost}</p>
            </div>
            <div className={"col-span-2"}>
                <p className={"text-brand-gray"}>{post_tender_amount}</p>
            </div>
            <div className={"col-span-1"}>
                <p className={"text-brand-gray"}>{advance_payment}</p>
            </div>
            <div className={"col-span-3"}>
            </div>
        </div>
    )
}

export default RateItem