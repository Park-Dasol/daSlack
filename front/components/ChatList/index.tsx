import { ChatZone, Section, StickyHeader } from "./styels";
import React, {useCallback, useRef, VFC, forwardRef} from "react";
import Chat from '@components/Chat';
import {IDM, IChat} from '@typings/db'
import {Scrollbars} from 'react-custom-scrollbars'

interface Props {
  chatSections : {[key:string]: IDM[]};
  setSize : (f:(size: number)=> number) => Promise<(IDM| IChat)[][]| undefined>;
  isEmpty : boolean;
  isReachingEnd : boolean;
}
// const scrollbarRef = useRef(null)

const ChatList = forwardRef<Scrollbars, Props>(({ chatSections , setSize, isReachingEnd, isEmpty}, ref ) => {
  const onScroll = useCallback((values)=> {
    if (values.scrollTop === 0 && !isReachingEnd){
      //데이터를 추가로 로딩하기
      setSize((prevSize) => prevSize + 1).then(()=> { })
    }
  }, [])
  return (
    <ChatZone>
      <Scrollbars autoHide ref={ref} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats])=> {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat) => (
                <Chat key={chat.id} data={chat} />
              ))}
            </Section> 
          )
        })}
        {/* {chatData?.map((chat)=> (
          <Chat key={chat.id} data={chat}/>
        ))} */}
      </Scrollbars>
    </ChatZone>
  )
})

export default ChatList