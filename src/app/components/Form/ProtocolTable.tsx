import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useTranslations } from 'next-intl'
import Icons from '../Icons'


const ProtocolTable = () => {
	const t = useTranslations("dashboard");

  return (
		<div >
			<div className='flex justify-between px-4 py-3 items-center'>
				<h2 className='text-lg font-semibold text-brand-gray'>Протокол технического совета</h2>
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
							<TableCell className="px-4 py-2">1</TableCell>
							<TableCell className="px-4 py-2">Value</TableCell>
							<TableCell className="px-4 py-2">Value</TableCell>
							<TableCell className="px-4 py-2">Value</TableCell>
							<TableCell className="px-4 py-2">Value</TableCell>
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
						<TableRow className="border-b border-gray-300 last:border-0">
							<TableCell className="px-4 py-2">Value</TableCell>
							<TableCell className="px-4 py-2">Value</TableCell>
							<TableCell className="px-4 py-2">Value</TableCell>
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
						<TableRow className="border-b border-gray-300 last:border-0">
							<TableCell className="px-4 py-2">Value</TableCell>
							<TableCell className="px-4 py-2">Value</TableCell>
							<TableCell className="px-4 py-2">Value</TableCell>
						</TableRow>
					</TableBody>
				</Table>
    	</div>
		</div>
	)
};

export default ProtocolTable;
