import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type ConstructModalProps = {
	constructModalOpen: boolean
	setConstructModalOpen: (open: boolean) => void
	t: any;
}

const ConstructModal = ({ constructModalOpen, setConstructModalOpen, t }: ConstructModalProps) => {
  return (
		<Dialog open={constructModalOpen} onOpenChange={setConstructModalOpen}>
			<DialogContent className="bg-neutrals-secondary max-w-[1200px] mx-4 my-4">
				<DialogHeader>
					<DialogTitle className="text-lg">{t("choose_construct")}</DialogTitle>
				</DialogHeader>
				<DialogDescription className="w-full grid grid-cols-3 gap-2 flex-1">
					{/* cities */}
					<div className="h-full flex flex-col gap-2 justify-start">
						cities
					</div> 
					{/* constructs in a city */}
					<div className="h-full">
						constructs in a city
					</div>
					{/* already choosen constructs */}
					<div className="h-full">
						already choosen constructs
					</div>
				</DialogDescription>
				<DialogFooter>
					<Button>
						{t("cancel")}
					</Button>
					<Button>
						{t("save_chosen")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
  )
}

export default ConstructModal
