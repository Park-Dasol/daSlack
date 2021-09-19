import io from 'socket.io-client'
import { useCallback } from 'react'

const backUrl = 'http://localhost:3095'

const sockets: {[key:string]: SocketIOClient.Socket} = {} // typescript에서는 빈객체나 빈배열은 타이핑을 해주어야 한다.
const useSocket = (workspace?: string) => {
  const disconnect = useCallback(()=> {
    if (workspace) {
      sockets[workspace].disconnect()
      delete sockets[workspace]
    }
  }, [workspace])
  if (!workspace) {
    return [undefined, disconnect];
  }
  sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`)

  return [sockets[workspace], disconnect]
}

export default useSocket;