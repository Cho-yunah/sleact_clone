import React, { useCallback } from 'react'
import { Container,Header } from './styles'
import gravatar from 'gravatar';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';

const DirectMessage = () => {
  const {workspace, id} = useParams<{workspace: string, id: string}>();
  const {data: myData}= useSWR('/api/users', fetcher)
  const [chat, onChangeChat]= useInput('');
  
  const onSubmitForm = useCallback((e) => {
      e.preventDefault();
  },[])

  const {data: userData} = useSWR(`/api/workspaces/${workspace}/members/${id}`, fetcher)

  if(!userData || !myData) {
    return null
  }
  console.log(userData)
  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, {s:'24px', d:'retro'})} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList />
      <ChatBox chat="" onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  )
}

export default DirectMessage