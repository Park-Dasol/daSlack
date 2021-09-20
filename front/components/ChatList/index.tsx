import { ChatZone } from "./styels";
import React, {useCallback, useRef, VFC} from "react";
import Chat from '@components/Chat';
import {IDM} from '@typings/db'
import {Scrollbars} from 'react-custom-scrollbars'

interface Props {
  chatData ?: IDM[];
}

const ChatList :VFC<Props> = ({ chatData }) => {
  const scrollbarRef = useRef(null)
  const onScroll = useCallback(()=> {}, [])
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {chatData?.map((chat)=> (
          <Chat key={chat.id} data={chat}/>
        ))}
      </Scrollbars>
    </ChatZone>
  )
}

export default ChatList