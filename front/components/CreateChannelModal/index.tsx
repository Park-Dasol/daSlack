import Modal from "@components/Modal";
import useInput from "@hooks/useInput";
import { Button, Input, Label } from "@pages/SignUp/styles";
import axios from "axios";
import { stringify } from "querystring";
import React, {useCallback, VFC} from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import fetcher from '@utils/fetcher'
import { IUser , IChannel} from '@typings/db'
import useSWR from 'swr'

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal :  (flag:boolean) =>void;
}

const CreateChannelModal: VFC<Props> = ({show, onCloseModal, setShowCreateChannelModal}) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('') 
  const {workspace, channel} = useParams<{workspace: string; channel: string}>(); // 주소로부터데이터를 가져오는것
  const { data : userData, error, revalidate, mutate} = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  })
  const {data: channelData, revalidate : revalidateChannel} = useSWR<IChannel[]>(
    userData? `/api/workspaces/${workspace}/channels`:null,
    fetcher
  )


  const onCreateChannel = useCallback((e)=> {
    e.preventDefault()
    axios.post(`/api/workspaces/${workspace}/channels`, {
      name: newChannel,
    }, {
      withCredentials: true,
    })
    .then(()=> {
      setShowCreateChannelModal(false)
      revalidateChannel()
      setNewChannel('')
    })
    .catch((error)=> {
      console.dir(error)
      toast.error(error.response?.data, {position: 'bottom-center'})
    })
  }, [newChannel])


  return (
    <Modal show={show} onCloseModal={onCloseModal}>
    <form onSubmit={onCreateChannel}>
      <Label id="workspace-label">
        <span>워크스페이스이름</span>
        <Input id="workspace" value={newChannel} onChange={onChangeNewChannel}/>
      </Label>
      <Button type="submit">생성하기</Button>
    </form>
  </Modal>
  )
}

export default CreateChannelModal