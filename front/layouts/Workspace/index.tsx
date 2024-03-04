import React, { FC, useCallback } from 'react'
import {Channels, Chats, Header, MenuScroll, ProfileImg, RightMenu, WorkspaceName, WorkspaceWrapper, Workspaces} from '@layouts/Workspace/styles'
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import axios from 'axios';
import { Redirect } from 'react-router';
import gravatar from 'gravatar';

const Workspace:FC = ({children}) => {
  const {data, error,revalidate, mutate }= useSWR('/api/users', fetcher, {
    dedupingInterval:2000
  });

  const onLogout= useCallback(() => {
    axios.post('/api/users/logout', null, {
      withCredentials: true
    })
    .then(() => {
      // revalidate()
      mutate(false, false) // OPTIMISTIC UI
    })
  },[])

  if(!data) {
    console.log('data 있니?', data)
    return <Redirect to='/login' />
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span>
            <ProfileImg src={gravatar.url(data.nickname, {s: '28px', d:'retro'})} alt={data.nickname}/>
          </span>
        </RightMenu>
        </Header>
      <button onClick={onLogout}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>menuscroll</MenuScroll>
        </Channels>
        <Chats>chats</Chats>
      </WorkspaceWrapper>
    </div>
  )
}
export default Workspace;