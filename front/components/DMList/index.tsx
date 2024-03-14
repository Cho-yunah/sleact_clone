import EachDM from '@components/EachDM';
import { CollapseButton } from '@components/DMList/styles';
import { IDM, IUser, IUserWithOnline } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import useSWR from 'swr';
import { FaCaretRight } from "react-icons/fa";



const DMList:FC = () => {
  const { workspace } = useParams<{ workspace?: string }>();

  const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });

  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
  );
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [countList, setCountList] = useState({})
  const [onlineList, setOnlineList] = useState<number[]>([]);


  const toggleChannelCollapse = useCallback((e) => {
    setChannelCollapse((prev) => !prev);
  }, []);

  // const onMessage = (data: IDM) => {
  //   console.log('dm 왔다.', data)
  // }

  useEffect(() => {
    // console.log('DMList: workspace 바꼈다', workspace);
    setOnlineList([]);
    setCountList({})
  }, [workspace]);

 

  return (
    <>
    
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i>
            <FaCaretRight/>
          </i>
        </CollapseButton>
        <span>Direct Messages</span>
      </h2>
      <div>
        {!channelCollapse &&
          memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            // const count = countList[member.id] ||0;
            return (
              <NavLink  key={member.id} activeClassName='selected' to={`/workspace/${workspace}/dm/${member.id}`} 
              >
                <span >{member.nickname}</span>
                {member.id === userData?.id && <span> (나)</span>}
                {/* {(count && count > 0 && <span className="count">{count}</span>)  */}
              </NavLink>
            )
          })
        }
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