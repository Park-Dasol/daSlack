
import useInput from '@hooks/useInput';
import React , {useState, useCallback} from 'react'
import {Success, Form,Error, Label, Input, LinkContainer, Button, Header} from './styles'
import {Link, Redirect} from 'react-router-dom'
import axios from 'axios'
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const SignUp = () => {
  const { data, error, revalidate } = useSWR('/api/users', fetcher);

  const [email,onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] =  useInput('');
  const [password, , setPassword] = useInput('');
  const [passwordCheck, , setPasswordCheck] = useInput('');
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  

  // errors
  const [mismatchError,  ,setMismatchError] = useInput(false);

  const onChangePassword= useCallback((e)=>{
    setPassword(e.target.value)
    setMismatchError(e.target.value !== passwordCheck)
  }, [passwordCheck]);

  const onChangePasswordCheck= useCallback((e)=>{
    setPasswordCheck(e.target.value)
    setMismatchError(e.target.value !== password)
  }, [password]); // 함수 기준으로 외부 변수일때만 써준다. 함수바깥에서 선언한애들만 쓴다.
  // setPassword 같은것도 외부변수나 외부함수로 생각하지만 공식문서에 따르면 한번 선언하면 바뀌지 않는다고 한다.

  const onSubmit= useCallback((e)=>{
    e.preventDefault();
    setSignUpError('');
    setSignUpSuccess(false);
    console.log(email, nickname, password,passwordCheck)
    if (!mismatchError) {
      console.log('서버로 회원가입하기');
      axios.post('/api/users', {
          email, nickname, password,
        }).then((response) => {
          console.log(response)
          setSignUpSuccess(true);
        })
        .catch((error)=>{
          console.log(error.response.data)
          setSignUpError(error.response.data)
        })
        .finally(()=> {});
    }
  }, [email, nickname, password, passwordCheck, mismatchError]);


  if (data) {
    return <Redirect to="/workspace/channel" />
  }

  return (
    <div id="container">
      <Header>daSlack</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
        
      </LinkContainer>
    </div>
  )
}

export default SignUp;