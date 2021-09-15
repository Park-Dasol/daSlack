import axios from 'axios'
import React, {FC, useCallback, useState} from 'react'
import useSWR from 'swr'
import fetcher from '@utils/fetcher'
import { Redirect, Switch, Route } from 'react-router'
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import gravatar from 'gravatar'
import loadable from '@loadable/component'
import Menu from '@components/Menu'

const Channel = loadable(()=> import('@pages/Channel'))
const DirectMessage = loadable(()=> import('@pages/DirectMessage'))



const Workspace:FC = ({children})=> {
  const { data, error, revalidate, mutate} = useSWR('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  })
  const [showUserMenu, setShowUserMenu] = useState(false)

  const onLogout = useCallback(() => {
    axios.post('/api/users/logout', null, {
      withCredentials : true
    }).then(()=> {
      // revalidate()
      mutate(false, false) // revalidate 대신 mutate를 쓰면 요청을 안 보내도 된다.
    })
  }, [])

  // 토글함수
  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev) // 
  }, [])

  if (!data) { // return은 항상 hooks들 보다 아래에 있어야만 에러가 나지 않는다.
    return <Redirect to="/login"/>
  }


  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
          <ProfileImg src={gravatar.url(data.email, {s : '28px', d: 'retro'})} alt={data.nickname}/>
          {showUserMenu && (
            <Menu style={{ right: 0, top: 38}} show={showUserMenu} onCloseModal={onClickUserProfile}>
              <ProfileModal>
                <img src={gravatar.url(data.email, {s : '28px', d: 'retro'})} alt={data.nickname}/>
                <div>
                  <span id="profile-name">{data.nickname}</span>
                  <span id="profile-active">Active</span>
                </div>
              </ProfileModal>
              <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
            </Menu>
          )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>worksppace</Workspaces>
        <Channels>
          <WorkspaceName>workspacename</WorkspaceName>
          <MenuScroll>menuscroll</MenuScroll>
        </Channels>
         <Chats>
           <Switch>
            <Route path="/workspace/channel" component={Channel}/>
            <Route path="/workspace/dm" component={DirectMessage}/>
           </Switch>
         </Chats> 
      </WorkspaceWrapper>
    </div>
  )
}

export default Workspace