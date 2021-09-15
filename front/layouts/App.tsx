import React from 'react'
import loadable from "@loadable/component"
import {Switch, Route, Redirect} from 'react-router-dom'

const LogIn = loadable(()=> import('@pages/LogIn'))
const SignUp = loadable(()=> import('@pages/SignUp'))
const Workspace = loadable(()=> import('@layouts/Workspace'))

const App = () => {
  return (
    <Switch> 
      <Redirect exact path="/" to="/login"/>
      <Route path="/login" component={LogIn}/>
      <Route path="/signup" component={SignUp}/>
      <Route path="/workspace" component={Workspace}/>

    </Switch>
  )
}

// switch : 여러개 라우터 중에 하나만 화면에 표시해주는것
// redirect : 다른 페이지로 돌려주는 역할
// route : 컴포넌트를 화면에 띄워주는 역할


export default App;