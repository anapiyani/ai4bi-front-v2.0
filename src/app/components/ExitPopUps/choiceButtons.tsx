import {Button} from "@/components/ui/button";

export function CallExitOptions({userRole, handleExit, setIsOpen, t}: { userRole: string, handleExit: () => void, setIsOpen: (isOpen: boolean) => void, t: any}) {
    return <div
        className={`flex justify-between ${userRole === "project_team" || userRole === "admin" ? "mx-4" : "mx-4"}`}>
        <div className='flex my-2 gap-2 w-1/2'>
            <Button
                variant="outline"
                onClick={() => {
                    setIsOpen(false)
                }}
                className="flex-1 rounded-md py-6 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
                {
                    userRole === "project_team" || userRole === "admin" ? t("stay") : t("not_exit")
                }
            </Button>
            <Button
                onClick={() => {
                    setIsOpen(false)
                    handleExit()
                }}
                className="flex-1 rounded-md py-6 text-sm font-medium bg-red-600 hover:bg-red-700 text-white"
            >
                {
                    userRole === "project_team" || userRole === "admin" ? t("leave-the-call") : t("quit-the-call")
                }
            </Button>
        </div>
    </div>;
}
