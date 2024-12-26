import UserTechnicalCouncilTalk from '@/src/app/components/Chat/UserTechnicalCouncilTalk'
import { useCallback, useMemo } from 'react'


const RenderUsers = ({ users, t }: { users: any[], t: any }) => {
	const memoizedUsers = useMemo(() => users, [users]);

  const renderUsers = useCallback(() => {
    return memoizedUsers.map((user) => (
      <div key={user.id} className='flex flex-col m-2 py-4 px-2 rounded-lg border-2 border-transparent'>
        <UserTechnicalCouncilTalk 
          t={t}
          name={user.name}
          pfp={user.pfp}
          isMicrophoneOn={user.isMicrophoneOn}
          turnOffTheMicrophone={() => {}}
          turnOnTheMicrophone={() => {}}
          isAbsent={user.isAbsent}
        />
      </div>
    ));
  }, [memoizedUsers, t]);

	return renderUsers();
}

export default RenderUsers;