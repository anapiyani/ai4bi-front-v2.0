import {Spinner} from "@/components/ui/Spinner";


export function Loading() {
    return (
        <div className={"w-full h-screen flex items-center justify-center bg-neutrals-secondary"}>
            <Spinner className={"w-10 h-10 mx-auto text-primary"} />
        </div>
    )
}