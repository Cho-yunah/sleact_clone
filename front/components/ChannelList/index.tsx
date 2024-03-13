import { CollapseButton } from '@components/DMList/styles';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { FC, useCallback, useState } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { FaCaretRight } from "react-icons/fa";


interface Props {
  channelData?: IChannel[];
  userData?: IUser;
}

const ChannelList: FC<Props> = ({userData, channelData}) => {
  const { workspace } = useParams<{ workspace?: string }>();
  const [channelCollapse, setChannelCollapse] = useState(false);

  console.log(channelData)
  // const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
  //   dedupingInterval: 2000, // 2초
  // });
  // const { data: channelData } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  return (
    <>
    <span>{channelData}</span>
      <h2>
        <span className="p-channel_sidebar__section_heading_expand_container" aria-hidden="true"><i className="c-icon p-channel_sidebar__section_heading_expand c-icon--caret-right c-icon--inherit c-icon--inline" data-qa="channel-section-collapse" aria-hidden="true"></i></span>
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
            return <EachChannel key={channel.id} channel={channel} />;
            // <span>{channel}</span>
          })}
      </div>
    </>
  );
};

export default ChannelList;