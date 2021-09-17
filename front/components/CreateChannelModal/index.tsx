import Modal from "@components/Modal";
import useInput from "@hooks/useInput";
import { Button, Input, Label } from "@pages/SignUp/styles";
import React, {useCallback, VFC} from "react";


interface Props {
  show: boolean;
  onCloseModal: () => void;
}

const CreateChannelModal: VFC<Props> = ({show, onCloseModal}) => {
  const [newChannel, onChangeNewChannel] = useInput('')
  
  const onCreateChannel = useCallback(()=> {
  
  }, [])


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