import { CollapseButton } from '@components/DMList/styles';
import { IUser, IUserWithOnline } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { FaCaretRight } from 'react-icons/fa';

import useSocket from '@hooks/useSocket';
import EachDM from '@components/EachDM';

const DMList: FC = () => {
  const { workspace } = useParams<{ workspace?: string }>();

  const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });

  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
  );
  const [socket] = useSocket(workspace);

  const [channelCollapse, setChannelCollapse] = useState(false);
  const [onlineList, setOnlineList] = useState<number[]>([]);

  const toggleChannelCollapse = useCallback((e) => {
    setChannelCollapse((prev) => !prev);
  }, []);

  useEffect(() => {
    // console.log('DMList: workspace 바꼈다', workspace);
    setOnlineList([]);
  }, [workspace]);

  useEffect(() => {
    socket?.on('onlineList', (data: number[]) => {
      setOnlineList(data);
    });
    console.log('socket on dm', socket?.hasListeners('dm'), socket);
    return () => {
      socket?.off('onlineList');
    };
  }, [socket]);

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i>
            <FaCaretRight />
          </i>
        </CollapseButton>
        <span>Direct Messages</span>
      </h2>
      <div>
        {!channelCollapse &&
          memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            //   // const count = countList[member.id] ||0;
            //   return (
            //     <NavLink key={member.id} activeClassName="selected" to={`/workspace/${workspace}/dm/${member.id}`}>
            //       {isOnline ? <VscCircleFilled color="green" /> : <VscCircle />}
            //       <span>{member.nickname}</span>
            //       {member.id === userData?.id && <span> (나)</span>}
            //       {/* {(count && count > 0 && <span className="count">{count}</span>)  */}
            //     </NavLink>
            //   );
            return <EachDM key={member.id} member={member} isOnline={isOnline} />;
          })}
      </div>
      {/* <div>
        {channelCollapse &&
          memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            return <EachDM key={member.id} member={member} isOnline={isOnline} />;
          })}
      </div> */}
    </>
  );
};

export default DMList;
