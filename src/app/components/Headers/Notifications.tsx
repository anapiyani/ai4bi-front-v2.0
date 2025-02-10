import * as Select from "@radix-ui/react-select"
import clsx from 'clsx'
import Icons from "../Icons"

const Notifications = () => {
	return (
		<div className='relative'>
			<Select.Root defaultValue={"all"} onValueChange={() => {}}>
        <Select.Trigger
          aria-label={"Notifications"}
          className={clsx(
            "rounded-sm p-2 transition-colors cursor-pointer",
          )}
        >
          <Select.Icon className="text-white">
            <div className="flex items-center justify-center gap-1 flex-col">
              <Icons.Notification_Bell />
            </div>
          </Select.Icon>
        </Select.Trigger>
				<Select.Portal>
					<Select.Content 
					align="end"
					className="min-w-[8rem] overflow-hidden rounded-sm bg-white shadow-md cursor-pointer py-4 px-4 w-52"
					position="popper"
					>
						Notifications
					</Select.Content>
				</Select.Portal>
			</Select.Root>
		</div>
	)
}

export default Notifications;