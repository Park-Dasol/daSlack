import { Container,Header } from '@pages/Channel/styles'
import React, { useCallback, useState, useRef, useEffect } from 'react'
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
  
  const {data: chatData, mutate: mutateChat, revalidate, setSize} = useSWRInfinite<IDM[]>(
    (index)=> `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index +1}`,
    fetcher,
  )
  //infinite scrolling 에 필요한것
  // 데이터 요청했는데 더이상 가져올 데이터가 없을경우
  // const isEmpty = chatData?.[0]?.length === 0; 
  // 데이터를 요청했는데, 데이터가 있긴 하는데 가져오는 크기보다 작은 경우
  const isReachingEnd = (chatData&& chatData[chatData.length - 1]?.length < 20) || false; 

  const scrollbarRef = useRef<Scrollbars>(null);

  const onSubmitForm = useCallback((e)=> {
    e.preventDefault();
    if(chat?.trim() && chatData) {
      const savedChat = chat;
      mutateChat((prevChatData) => {
        prevChatData?.[0].unshift({
          id: (chatData[0][0]?.id || 0) + 1,
          content: savedChat,
          SenderId: myData.id,
          Sender: myData,
          ReceiverId: userData.id,
          Receiver: userData,
          createdAt: new Date(),
        })
        return prevChatData;
      }, false)
      .then(()=> {
        setChat('')
        scrollbarRef.current?.scrollToBottom();
      })
      axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
        content:chat,
      })
      .then(()=> {
        revalidate()
      })
      .catch((error)=> {
        console.dir(error)
      })
    }
  }, [chat, chatData, myData, userData, workspace, id])

  //로딩시 스크롤바 제일 아래로 붙이기
  useEffect(()=> {
    if (chatData?.length === 1) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData])


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
      <ChatList chatSections={chatSections} scrollRef={scrollbarRef} setSize={setSize} isReachingEnd={isReachingEnd}/>
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}/>
    </Container>
  )
}

export default DirectMessage