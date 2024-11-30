

const BotMutedVisualizer = ({ small }: { small?: boolean }) => {

	return (
		<div className={"flex justify-center items-center bg-gradient-to-r from-[#0284C7] to-[#77BAAA] overflow-hidden p-px rounded-lg " + (small ? "w-[76px] h-[76px]" : "w-full h-20")}>
			<div className='w-full border-y-[1px] border-white'></div>
		</div>
	)
}

export default BotMutedVisualizer