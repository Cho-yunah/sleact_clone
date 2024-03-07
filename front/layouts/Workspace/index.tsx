import React, { FC, useCallback, useState } from 'react'
import {AddButton, Channels, Chats, Header, LogOutButton, MenuScroll, ProfileImg, ProfileModal, RightMenu, WorkspaceButton, WorkspaceName, WorkspaceWrapper, Workspaces} from '@layouts/Workspace/styles'
import { Redirect, Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import fetcher from '@utils/fetcher';
import loadable from '@loadable/component';
import useSWR from 'swr';
import axios from 'axios';
import gravatar from 'gravatar';
import { Button, Input, Label } from '@pages/Signup/styles';
import Menu from '@components/Menu';
import Modal from '@components/Modal';
import { IUser } from '@typings/db';
import useInput from '@hooks/useInput';
import {toast} from 'react-toastify'

const Channel =loadable(() => import('@pages/Channel'))
const DirectMessage=loadable(() => import('@pages/DirectMessage'))

const Workspace:FC = ({children}) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal]= useState(false)
  const [newWorkspace,onChangeNewWorkspace, setNewWorkspace]= useInput('')
  const [newUrl, onChangeNewUrl ,setNewUrl] = useInput('')

  const {data: userData, error,revalidate, mutate }= useSWR<IUser|false>(
    '/api/users', fetcher, 
    { dedupingInterval:2000}
    );


  const onLogout= useCallback(() => {
    axios.post('/api/users/logout', null, {
      withCredentials: true
    })
    .then(() => {
      // revalidate()
      mutate(false, false) // OPTIMISTIC UI
    })
  },[])

  if(!userData) {
    return <Redirect to='/login' />
  }

  const onCloseUserProfile= useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu(false);
  },[])

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu(prev => !prev)
  },[])

  const onClickCreateWorkspace= useCallback(() => {
    setShowCreateWorkspaceModal(true)
  },[])

  const onCreateWorkspace = useCallback((e) => {
    e.preventDefault()
    if(!newWorkspace || !newWorkspace.trim()) return;
    if(!newUrl|| !newUrl.trim()) return;
    axios.post('/api/workspaces', { workspace: newWorkspace, url: newUrl})
      .then(() => {
        revalidate();
        setShowCreateWorkspaceModal(false)
        setNewWorkspace('');
        setNewUrl('')
      })
      .catch(error => {
        console.dir(error)
        toast.error(error.response?.data, {position: 'bottom-center'})
      })
  },[newWorkspace, newUrl])

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false)
  },[])

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
          <ProfileImg src={gravatar.url(userData.nickname, {s: '28px', d:'retro'})} alt={userData.nickname}/>
          {showUserMenu 
            && <Menu style={{right: 0,top: 38}} show={showUserMenu} onCloseModal={onCloseUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.nickname, {s: '38px', d:'retro'})} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>}
          </span>
        </RightMenu>
        </Header>
      <WorkspaceWrapper>
        <Workspaces>{userData?.Workspaces.map((ws) => {
          return (
            <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
              <WorkspaceButton>{ws.name.slice(0,1).toUpperCase()}</WorkspaceButton>
            </Link>
          )
        })}
        <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>menuscroll</MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route  path='/workspace/channel' component={Channel} />
            <Route  path='/workspace/dm' component={DirectMessage} />
          </Switch>

        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id='workspace-label' >
            <span>워크 스페이스 이름</span>
            <Input id='workspace' value={newWorkspace} onChange={onChangeNewWorkspace}/>
          </Label>
          <Label id='workspace-url-label' >
            <span>워크 스페이스 url</span>
            <Input id='workspace' value={newUrl} onChange={onChangeNewUrl}/>
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
    </div>
  )
}
export default Workspace;