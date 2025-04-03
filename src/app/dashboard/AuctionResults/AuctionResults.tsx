"use client"

import {Button} from "@/components/ui/button";
import Icons from "@/src/app/components/Icons"
import {useTranslations} from "next-intl";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import ProtocolTable from "@/src/app/components/Form/ProtocolTable";
import {AuctionProtocol} from "@/src/app/dashboard/Auction/components/AuctionProtocol";
import AuctionResultProtocol from "@/src/app/dashboard/AuctionResults/components/AuctionResultProtocol";

const AuctionResults = ({goBack}: {goBack: () => void}) => {
	const t = useTranslations("dashboard");
	return (
		<div className={"h-screen w-full bg-[#FAFAFA]"}>
			<div className={"w-full h-full px-6 py-4 gap-4 flex flex-col"}>
				<div>
					<Button onClick={goBack} variant={"ghost"} className={"flex items-center gap-2"}>
						<Icons.ArrowLeft />
						<p>{t("back_to_chat")}</p>
					</Button>
				</div>
				<Tabs defaultValue={"technical-council"} className={"flex flex-col gap-4 "} >
					<div className={"flex w-full"}>
						<TabsList className={"flex gap-2 bg-white"}>
							<TabsTrigger value={"technical-council"}>{t("technical-council-protocol")}</TabsTrigger>
							<TabsTrigger value={"auction-protocol"}>{t("auction-protocol")}</TabsTrigger>
							<TabsTrigger value={"auction-results"}>{t("auction-results")}</TabsTrigger>
						</TabsList>
					</div>
					<TabsContent value={"technical-council"}>
						<ProtocolTable protocol={null} />
					</TabsContent>
					<TabsContent value={"auction-protocol"}>
						<AuctionProtocol t={t} />
					</TabsContent>
					<TabsContent value={"auction-results"}>
						<AuctionResultProtocol />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}

export default AuctionResults;