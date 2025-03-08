import { TechCouncilUser } from '@/src/app/types/types'
import { useCallback, useEffect, useMemo, useState } from 'react'

const RenderUsers = ({ users, t }: { users: TechCouncilUser[], t: any }) => {
	const memoizedUsers = useMemo(() => users, [users]);
  const [projectCommand, setProjectCommand] = useState<TechCouncilUser[]>([]);
  const [partners, setPartners] = useState<TechCouncilUser[]>([]);

  useEffect(() => {
    const projectCommandUsers = memoizedUsers.filter((user) => user.role === "project_team");
    const partnersUsers = memoizedUsers.filter((user) => user.role === "user");
    setProjectCommand(projectCommandUsers);
    setPartners(partnersUsers);
  }, [memoizedUsers]);

  const renderUsers = useCallback(() => {
    return (
      <div className='flex flex-col m-2 py-4 px-2'>
        <div className='flex flex-col gap-2'>
          {
            memoizedUsers.map((user) => (
              <div key={user.user_id}>
                {user.role}, {user.first_name} {user.last_name}
              </div>
            ))
          }
          <div className='flex items-center gap-2'>
            <h2>{t("project_command")}</h2>
            <hr/>
          </div>
          <div className='flex flex-col gap-2'>
            {projectCommand.map((user) => (
              <div key={user.user_id}>{user.first_name} {user.last_name}</div>
            ))}
          </div>
        </div>
      </div>
    )
  }, [memoizedUsers, t]);

	return renderUsers();
}

export default RenderUsers;