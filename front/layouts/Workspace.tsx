import axios from 'axios'
import React, {FC, useCallback} from 'react'
import useSWR from 'swr'
import fetcher from '@utils/fetcher'
import { Redirect } from 'react-router'

const Workspace:FC = ({children})=> {
  const { data, error, revalidate} = useSWR('http://localhost:3095/api/users', fetcher)

  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, {
      withCredentials : true
    }).then(()=> {
      revalidate()
    })
  }, [])

  if (!data) { // return은 항상 hooks들 보다 아래에 있어야만 에러가 나지 않는다.
    return <Redirect to="/login"/>
  }


  return (
    <div>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  )
}

export default Workspace