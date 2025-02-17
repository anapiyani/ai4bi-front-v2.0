import { Checkbox } from '@/components/ui/Checkbox'
import { InterestsResponse } from '@/src/app/types/types'

type InterestsProps = {
	chosenConstructs: InterestsResponse[],
	setChosenConstructs: (constructs: InterestsResponse[]) => void,
	construct: InterestsResponse,
	no_border?: boolean,
	setChosenCities: (cities: string[]) => void,
	chosenCities: string[]
}

const Interests = ({chosenConstructs, setChosenConstructs, construct, no_border = false, setChosenCities, chosenCities}: InterestsProps) => {

	const handleCheckedChange = () => {
		setChosenConstructs(chosenConstructs.includes(construct) ? chosenConstructs.filter(c => c !== construct) : [...chosenConstructs, construct])
		if (!chosenConstructs.includes(construct)) {
			if (!chosenCities.includes(construct.city)) {
				setChosenCities([...chosenCities, construct.city]);
			}
		} else {
			const remainingConstructsInCity = chosenConstructs
				.filter(c => c !== construct)
				.some(c => c.city === construct.city);
			
			if (!remainingConstructsInCity) {
				setChosenCities(chosenCities.filter(c => c !== construct.city));
			}
		}
	}

	return (
		<div className={`flex gap-3 items-center rounded-md p-2 ${no_border ? "" : "border border-neutrals-border"}`}>
			<div className="flex gap-3 items-center">
				<div>
					<Checkbox 
						checked={chosenConstructs.includes(construct)} 
						onCheckedChange={handleCheckedChange} />
				</div>
				<div>
					<p className='text-sm text-brand-gray font-semibold'>{construct.name.replace(/ *\([^)]*\) */g, "")}</p>
					<p className='text-xs font-normal text-neutrals-muted'>{construct.name.match(/\(([^)]*)\)/)?.[1] || ""}</p>
				</div>
			</div>
		</div>
	)
}


export default Interests;