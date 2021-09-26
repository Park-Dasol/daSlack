import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Container, Header, DragOver } from '@pages/Channel/styles';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';
import { useParams } from 'react-router';
import fetcher from '@utils/fetcher';
import gravatar from 'gravatar'
import useSWR, { useSWRInfinite } from 'swr'
import useSocket from '@hooks/useSocket';
import { IChannel, IChat, IUser } from '@typings/db';
import Scrollbars from 'react-custom-scrollbars';
import axios from 'axios';
import InviteChannelModal from '@components/InviteChannelModal';
import makeSection from '@utils/makeSection';

const Channel = () => {
  const {workspace, channel} = useParams<{workspace: string; channel: string}>();
  const {data: myData}  = useSWR(`/api/users`, fetcher)
  const [chat, onChangeChat, setChat] = useInput('');
  const { data: channelData } = useSWR<IChannel>(`/api/workspaces/${workspace}/channels/${channel}`, fetcher);
  const {data: chatData, mutate: mutateChat, revalidate, setSize} = useSWRInfinite<IChat[]>(
    (index)=> `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${index +1}`,
    fetcher,
  )
  const { data: channelMembersData } = useSWR<IUser[]>(
    myData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );
  const [socket] = useSocket(workspace);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false)

  

  //infinite scrolling 에 필요한것
  // 데이터 요청했는데 더이상 가져올 데이터가 없을경우
  // const isEmpty = chatData?.[0]?.length === 0; 
  // 데이터를 요청했는데, 데이터가 있긴 하는데 가져오는 크기보다 작은 경우
  const isReachingEnd = (chatData&& chatData[chatData.length - 1]?.length < 20) || false; 

  const scrollbarRef = useRef<Scrollbars>(null);

  const onSubmitForm = useCallback((e)=> {
    e.preventDefault();
    if(chat?.trim() && chatData && channelData) {
      const savedChat = chat;
      mutateChat((prevChatData) => {
        prevChatData?.[0].unshift({
          id: (chatData[0][0]?.id || 0) + 1,
          content: savedChat,
          UserId: myData.id,
          User: myData,
          ChannelId: channelData.id,
          Channel: channelData,
          createdAt: new Date(),
        })
        return prevChatData;
      }, false)
      .then(()=> {
        setChat('')
        scrollbarRef.current?.scrollToBottom();
      })
      axios.post(`/api/workspaces/${workspace}/channels/${channel}/chats`, {
        content:chat,
      })
      .then(()=> {
        revalidate()
      })
      .catch((error)=> {
        console.dir(error)
      })
    }
  }, [chat, chatData, myData, channelData, workspace, channel])

  const onMessage = useCallback((data)=>{
    // id는 상대방 아이디
    if (data.SenderId === channel && data.UserId !== myData?.id) {
      mutateChat((chatData) => {
        chatData?.[0].unshift(data);
        return chatData;
      }, false).then(() => {
        if (scrollbarRef.current) {
          if (
            scrollbarRef.current.getScrollHeight() <
            scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
          ) {
            console.log('scrollToBottom!', scrollbarRef.current?.getValues());
            setTimeout(() => {
              scrollbarRef.current?.scrollToBottom();
            }, 50);
          }
        }
      });
    }
  }, [channel, myData])

  useEffect(()=> {
    socket?.on('dm', onMessage);
    return () =>  {
      socket?.off('dm', onMessage)
    }
  }, [socket, onmessage])


  const onClickInviteChannel = useCallback(() => {
    setShowInviteChannelModal(true);
  }, []);


  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(false);
  }, []);


  //로딩시 스크롤바 제일 아래로 붙이기
  useEffect(()=> {
    if (chatData?.length === 1) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData])


  // if(!userData || !myData) {
  //   return null;
  // }

  const chatSections = makeSection(chatData? chatData.flat().reverse() : [])





  return (
    <Container>
      <Header>
        <span>#{channel}</span>
        <div className="header-right">
          <span>{channelMembersData?.length}</span>
          <button
            onClick={onClickInviteChannel}
            className="c-button-unstyled p-ia__view_header__button"
            aria-label="Add people to #react-native"
            data-sk="tooltip_parent"
            type="button"
          >
             <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" />
          </button>
        </div>
      </Header>
      <ChatList chatSections={chatSections} scrollRef={scrollbarRef} setSize={setSize} isReachingEnd={isReachingEnd}/>
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}/>
      <InviteChannelModal 
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
        
    </Container>
  )
}

export default Channel