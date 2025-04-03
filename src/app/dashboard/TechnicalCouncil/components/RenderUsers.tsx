import { getCookie } from '@/src/app/api/service/cookie'
import { TechCouncilUser } from '@/src/app/types/types'
import { useCallback, useMemo } from 'react'
import { TechnicalCouncilUser } from './TechnicalCouncilUser'

const RenderUsers = ({ users, t }: { users: TechCouncilUser[], t: any }) => {
	const memoizedUsers = useMemo(() => users, [users]);

  const renderUsers = useCallback(() => {
    return (
      <div className='flex flex-col m-2 py-4 px-2 bg-white rounded-lg'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center w-full'>
            <h2 className='text-brand-gray font-bold text-base w-full max-w-[160px]'>{t("project_command")}</h2>
            <hr className='w-full border-neutrals-border'/>
          </div>
          <div className='flex flex-col gap-4 mx-1'>
            {memoizedUsers
              .filter(user => user.role === "project_team")
              .map((user) => (  
                <TechnicalCouncilUser
                  key={user.user_id}
                  name={`${user.first_name} ${user.last_name}`}
                  isMicrophoneOn={user.mic_on} 
                  turnOffTheMicrophone={() => {}}
                  turnOnTheMicrophone={() => {}}
                  isAbsent={!user.is_connected && user.user_id !== getCookie("user_id")}
                  t={t}
                  LocalUser={user.user_id === getCookie("user_id")}
                />
              ))}
          </div>
        </div>
        <div className='flex flex-col gap-2 mt-6'>
          <div className='flex items-center w-full'>
            <h2 className='text-brand-gray font-bold text-base w-full max-w-[100px]'>{t("partners")}</h2>
            <hr className='w-full border-neutrals-border'/>
          </div>
          <div className='flex flex-col gap-4 mx-1'>
            {memoizedUsers
              .filter(user => user.role === "user")
              .map((user) => (
                <TechnicalCouncilUser
                  key={user.user_id}
                  name={`${user.first_name} ${user.last_name}`}
                  isMicrophoneOn={user.mic_on}
                  turnOffTheMicrophone={() => {}}
                  turnOnTheMicrophone={() => {}}
                  isAbsent={!user.is_connected} // we dont know for now!
                  t={t}
                  LocalUser={user.user_id === getCookie("user_id")}
                />
              ))}
          </div>
        </div>
      </div>
    )
  }, [memoizedUsers, t]);

	return renderUsers();
}

export default RenderUsers;