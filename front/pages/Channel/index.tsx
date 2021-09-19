import React, { useCallback } from 'react'
import { Container, Header, DragOver } from '@pages/Channel/styles';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';
import useSWR from 'swr';
import { useParams } from 'react-router';
import fetcher from '@utils/fetcher';
import gravatar from 'gravatar'

const Channel = () => {
  const {workspace, channel} = useParams<{workspace: string; channel: string}>();
  const {data: channelData} = useSWR(`/api/workspaces/${workspace}/channels/${channel}`, fetcher)
  const {data: myData}  = useSWR(`/api/users`, fetcher)
  const [chat, onChangeChat, setChat] = useInput('');
  const onSubmitForm = useCallback ((e)=> {
    e.preventDefault();
  }, [])

  return (
    <Container>
      <Header>
       {/* <img src={gravatar.url(userData.email, {s: '24px', d: 'retro'})} alt={userData.nickname} />
        <span>{userData.nickname}</span> */}
      </Header>
      <ChatList></ChatList>
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}></ChatBox>
    </Container>
   
  )
}

export default Channel