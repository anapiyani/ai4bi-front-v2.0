import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/ru'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { Protocol } from '../../types/types'
import Icons from '../Icons'

const ProtocolTable = ({ protocols }: { protocols: Protocol | null }) => {
	const t = useTranslations("dashboard");
	const locale = useLocale();
  dayjs.locale(locale);
	const [isEditing, setIsEditing] = useState<boolean>(false);

	console.log(protocols)

  return (
		<div className='h-[calc(100vh-200px)] overflow-y-auto'>
			<div className='flex justify-between px-4 py-3 items-center'>
				<h2 className='text-lg font-semibold text-brand-gray'>{t("technical_council_protocol")}</h2>
				<Button variant='outline' className='gap-2 hover:bg-brand-gray/5'>
					<Icons.Edit_protocol />
					<span className='font-medium text-sm text-brand-gray'>{t("make_changes")}</span>
				</Button>
			</div>
			<div className="overflow-hidden rounded-lg border border-gray-300 my-4">
				<Table className="w-full">
					<TableHeader>
						<TableRow className="bg-gray-50 border-b border-gray-300">
							<TableHead className="px-4 py-2">
								{t("project")}
							</TableHead>
							<TableHead className="px-4 py-2">
								{t("constructive")}
							</TableHead>
							<TableHead className="px-4 py-2">
								{t("date")}
							</TableHead>
							<TableHead className="px-4 py-2">
								{t("time")}
							</TableHead>
							<TableHead className="px-4 py-2">
								{t("place")}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow className="border-b border-gray-300 last:border-0">
							<TableCell className="px-4 py-2">{protocols?.project_name}</TableCell>
							<TableCell className="px-4 py-2">{protocols?.constructive}</TableCell>
							<TableCell className="px-4 py-2">{dayjs(protocols?.meeting_date).format("DD MMMM YYYY")}</TableCell>
							<TableCell className="px-4 py-2">{dayjs(`1970-01-01 ${protocols?.meeting_time}`).format('HH:mm')}</TableCell>
							<TableCell className="px-4 py-2">{protocols?.location}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
    	</div>
			<div className="overflow-hidden rounded-lg border border-gray-300 my-4">
				<Table className="w-full">
					<TableHeader>
						<TableRow className="bg-neutrals-secondary w-full">
							<TableCell colSpan={5} className="py-3 px-4">
								<div className='flex gap-2 text-brand-gray text-sm font-medium items-center justify-start w-full'>
									<Icons.Tool />
									{t("materials_and_technical_solutions")}
								</div>
							</TableCell>
						</TableRow>
						<TableRow className="bg-gray-50 border-b border-gray-300">
							<TableHead className="px-4 py-2">
								{t("name")}
							</TableHead>
							<TableHead className="px-4 py-2">
								{t("technical_characteristics")}
							</TableHead>
							<TableHead className="px-4 py-2">
								{t("made_by")}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{
							protocols?.materials_decisions.map((decision) => (
								<TableRow key={decision.name} className="border-b border-gray-300 last:border-0">
									<TableCell className="px-4 py-2">{decision.name}</TableCell>
									<TableCell className="px-4 py-2">{decision.technical_characteristics}</TableCell>
									<TableCell className="px-4 py-2">{decision.manufacturer}</TableCell>
								</TableRow>
							))
						}
					</TableBody>
				</Table>
    	</div>
			<div className="overflow-hidden rounded-lg border border-gray-300 my-4">
				<Table className="w-full">
					<TableHeader>
						<TableRow className="bg-neutrals-secondary w-full">
							<TableCell colSpan={5} className="py-3 px-4">
								<div className='flex gap-2 text-brand-gray text-sm font-medium items-center justify-start w-full'>
									<Icons.Message_plus />
									{t("notes")}
								</div>
							</TableCell>
						</TableRow>
						<TableRow className="bg-gray-50 border-b border-gray-300">
						</TableRow>
					</TableHeader>
					<TableBody>
						{
							protocols?.notes.map((note) => (
								<TableRow key={note} className="border-b border-gray-300 last:border-0">
									<TableCell className="px-4 py-2">{note}</TableCell>
								</TableRow>
							))
						}
					</TableBody>
				</Table>
    	</div>
			<div className="overflow-hidden rounded-lg border border-gray-300 my-4">
				<Table className="w-full">
					<TableHeader>
						<TableRow className="bg-neutrals-secondary w-full">
							<TableCell colSpan={5} className="py-3 px-4">
								<div className='flex gap-2 text-brand-gray text-sm font-medium items-center justify-start w-full'>
									<Icons.User_check />
									{t("technical_experts")}
								</div>
							</TableCell>
						</TableRow>
						<TableRow className="bg-gray-50 border-b border-gray-300">
							<TableHead className="px-4 py-2">
								{t("position")}
							</TableHead>
							<TableHead className="px-4 py-2">
								{t("full_name_short")}
							</TableHead>
							<TableHead className="px-4 py-2">
								{t("signature")}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{
							protocols?.project_team.map((expert) => (
								<TableRow key={expert.signature} className="border-b border-gray-300 last:border-0">
									<TableCell className="px-4 py-2">{expert.position}</TableCell>
									<TableCell className="px-4 py-2">{expert.full_name}</TableCell>
									<TableCell className="px-4 py-2">{expert.signature}</TableCell>
								</TableRow>
							))
						}
					</TableBody>
				</Table>
    	</div>
			<div className="overflow-hidden rounded-lg border border-gray-300 my-4">
				<Table className="w-full">
					<TableHeader>
						<TableRow className="bg-neutrals-secondary w-full">
							<TableCell colSpan={5} className="py-3 px-4">
								<div className='flex gap-2 text-brand-gray text-sm font-medium items-center justify-start w-full'>
									<Icons.Users_group />
									{t("suppliers")}
								</div>
							</TableCell>
						</TableRow>
						<TableRow className="bg-gray-50 border-b border-gray-300">
							<TableHead className="px-4 py-2">
								{t("company")}
							</TableHead>
							<TableHead className="px-4 py-2">
								{t("full_name_short")}
							</TableHead>
							<TableHead className="px-4 py-2">
								{t("contacts")}
							</TableHead>
							<TableHead className="px-4 py-2">
								{t("mail")}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{
							protocols?.suppliers.map((supplier) => (
								<TableRow key={supplier.company_name} className="border-b border-gray-300 last:border-0">
									<TableCell className="px-4 py-2">{supplier.company_name}</TableCell>
									<TableCell className="px-4 py-2">{supplier.representative}</TableCell>
									<TableCell className="px-4 py-2">{supplier.phone_number}</TableCell>
									<TableCell className="px-4 py-2">{supplier.email}</TableCell>
								</TableRow>
							))
						}
					</TableBody>
				</Table>
    	</div>
		</div>
	)
};

export default ProtocolTable;
