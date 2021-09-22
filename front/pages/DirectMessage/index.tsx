import { Container,Header } from '@pages/Channel/styles'
import React, { useCallback, useState, useRef } from 'react'
import gravatar from 'gravatar'
import useSWR, { useSWRInfinite } from 'swr'
import { useParams } from 'react-router'
import fetcher from '@utils/fetcher'
import ChatBox from '@components/ChatBox'
import ChatList from '@components/ChatList'
import useInput from '@hooks/useInput'
import axios from 'axios'
import { IDM } from '@typings/db'
import makeSection from '@utils/makeSection'
import Scrollbars from 'react-custom-scrollbars';


const DirectMessage = () => {
  const {workspace, id} = useParams<{workspace: string; id: string}>();
  const {data: userData} = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher)
  const {data: myData}  = useSWR(`/api/users`, fetcher)
  const [chat, onChangeChat, setChat] = useInput('')
  
  const {data: chatData, mutate: matateChat, revalidate, setSize} = useSWRInfinite<IDM[]>(
    (index)=> `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index +1}`,
    fetcher,
  )
  //infinite scrolling 에 필요한것
  // 데이터 요청했는데 더이상 가져올 데이터가 없을경우
  const isEmpty = chatData?.[0]?.length === 0; 
  // 데이터를 요청했는데, 데이터가 있긴 하는데 가져오는 크기보다 작은 경우
  const isReachingEnd = isEmpty || (chatData&& chatData[chatData.length - 1]?.length < 20) || false; 

  const scrollbarRef = useRef<Scrollbars>(null);

  const onSubmitForm = useCallback((e)=> {
    e.preventDefault();
    if(chat?.trim()) {
      console.log(chat)
      axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
        content:chat,
      })
      .then(()=> {
        revalidate()
        setChat('')
      })
      .catch((error)=> {
        console.dir(error)
      })
    }
  }, [chat])

  if(!userData || !myData) {
    return null;
  }

  const chatSections = makeSection(chatData? chatData.flat().reverse() : [])

  return ( 
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, {s: '24px', d: 'retro'})} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList chatSections={chatSections} ref={scrollbarRef} setSize={setSize} isEmpty={isEmpty} isReachingEnd={isReachingEnd}/>
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}/>
    </Container>
  )
}

export default DirectMessage