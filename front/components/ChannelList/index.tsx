import { CollapseButton } from '@components/DMList/styles';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { FC, useCallback, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import useSWR from 'swr';
import { FaCaretRight } from "react-icons/fa";
import { NavLink } from 'react-router-dom';


interface Props {
  channelData?: IChannel[];
  userData?: IUser;
}

const ChannelList: FC = () => {
  const { workspace } = useParams<{ workspace?: string }>();
  const location = useLocation();
  
  const { data: userData,error } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: channelData } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);
  
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [countList, setCountList] = useState<{[key: string]: number|undefined}>({})

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);


console.log(channelData)

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i>
            <FaCaretRight/>
          </i>
        </CollapseButton>
        <span>Channels</span>
      </h2>
      <div>
        {!channelCollapse &&
          channelData?.map((channel) => {
            // return <EachChannel key={channel.id} channel={channel} />;
            return (
              <NavLink  key={channel.id} activeClassName='selected' to={`/workspace/${workspace}/channel/${channel.name}`} 
              >
                <span >{channel.name}</span>
                {channel.id === userData?.id && <span> (나)</span>}
                {/* {(count && count > 0 && <span className="count">{count}</span>)  */}
              </NavLink>
            )
          })}
      </div>
    </>
  );
};

export default ChannelList;