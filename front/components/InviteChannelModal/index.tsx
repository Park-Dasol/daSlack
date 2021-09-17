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
  setShowInviteChannelModal :  (flag:boolean) =>void;
}

const CreateChannelModal: VFC<Props> = ({show, onCloseModal, setShowInviteChannelModal}) => {
  const [newMember, onInviteNewMember, setNewMember] = useInput('') 
  const {workspace, channel} = useParams<{workspace: string; channel: string}>(); // 주소로부터데이터를 가져오는것
  const { data : userData, error, revalidate, mutate} = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  })
  const {data: channelData, revalidate : revalidateChannel} = useSWR<IChannel[]>(
    userData? `/api/workspaces/${workspace}/channels/${channel}/members`:null,
    fetcher
  )


  const onInviteMember = useCallback((e)=> {
    e.preventDefault()
    axios.post(`/api/workspaces/${workspace}/channels/${channel}/members`, {
      email: newMember,
    }, {
      withCredentials: true,
    })
    .then(()=> {
      setShowInviteChannelModal(false)
      revalidateChannel()
      setNewMember('')
    })
    .catch((error)=> {
      console.dir(error)
      toast.error(error.response?.data, {position: 'bottom-center'})
    })
  }, [newMember])


  return (
    <Modal show={show} onCloseModal={onCloseModal}>
    <form onSubmit={onInviteMember}>
      <Label id="member-label">
        <span>채널 멤버 초대</span>
        <Input id="member" type="email" value={newMember} onChange={onInviteNewMember}/>
      </Label>
      <Button type="submit">초대하기</Button>
    </form>
  </Modal>
  )
}

export default CreateChannelModal