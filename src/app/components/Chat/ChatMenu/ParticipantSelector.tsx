import {AutoCompleteResponse} from "@/src/app/types/types";
import {Checkbox} from "@/components/ui/Checkbox";

export function ParticipantSelector(selectedParticipants: AutoCompleteResponse[], setSelectedParticipants: (value: (((prevState: AutoCompleteResponse[]) => AutoCompleteResponse[]) | AutoCompleteResponse[])) => void, results: AutoCompleteResponse[]) {
    console.log(results);
    return <div className='flex flex-col w-full justify-center items-start'>
        {
            selectedParticipants.map((participant) => (
                <div className='flex items-center gap-2 mt-1' key={participant.id}>
                    <Checkbox checked={true} onCheckedChange={(checked) => {
                        if (checked) {
                            setSelectedParticipants([...selectedParticipants, participant]);
                        } else {
                            setSelectedParticipants(selectedParticipants.filter((p) => p.id !== participant.id));
                        }
                    }}/>
                    <p>{participant.first_name} {participant.last_name}</p>
                </div>
            ))
        }
        {results.map((result) => (
            <div className='flex items-center mt-1' key={result.id}>
                {
                    selectedParticipants.some((participant) => participant.id === result.id) ? null : (
                        <div className='flex items-center gap-2'>
                            <Checkbox
                                checked={selectedParticipants.some((participant) => participant.id === result.id)}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setSelectedParticipants([...selectedParticipants, result]);
                                    } else {
                                        setSelectedParticipants(selectedParticipants.filter((participant) => participant.id !== result.id));
                                    }
                                }}/>
                            <p>{result.first_name} {result.last_name}</p>
                        </div>
                    )
                }
            </div>
        ))}
    </div>;
}