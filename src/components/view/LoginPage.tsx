import { FormEvent, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useStorage } from '../context/storage-context';
import { McFrame } from '../util/mcFrame';

export const LoginPage = () => {
  const { login } = useStorage();
  const idRef = useRef<HTMLInputElement | null>(null);
  const pwRef = useRef<HTMLInputElement | null>(null);
  const navigation = useNavigate();

  const loginHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = String(idRef.current?.value);
    const pw = String(pwRef.current?.value);

    if (!id) {
      alert('아이디를 입력해주세요');
      idRef.current?.focus();
      return;
    }
    if (!pw) {
      alert('비밀번호를 입력해주세요');
      pwRef.current?.focus();
      return;
    }

    const data = new URLSearchParams();
    data.append('userId', id);
    data.append('userPw', pw);

    const res = await fetch('http://localhost:8080/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data,
    });

    const response: Message = await res.json();
    const { status, code, message, result: token } = response;

    //로그인 성공
    if (status == 'USER_LOGIN') {
      //type narrowing
      if (token && 'token' in token) {
        if (login(token.token!, token.userId!)) {
          alert(message);
          navigation('/placeselection');

          return;
        }
      }
    } else {
      alert('error code : ' + code + '\nmessage : ' + message);
      localStorage.clear();
      return;
    }
  };

  useEffect(() => {
    localStorage.clear();
  }, [navigation]);

  return (
    <McFrame color='red'>
      <button
        type='button'
        onClick={() => navigation('/')}
        className='text-mcred font-black w-fit px-3 py-2 rounded-3xl'
      >
        ◀️이전화면
      </button>
      <span className='font-bold text-4xl text-mcblack'>Log-in</span>
      <br></br>
      <form
        onSubmit={loginHandler}
        className='flex flex-col items-center justify-between'
      >
        <div className='flex flex-col gap-2 mb-5'>
          <input
            ref={idRef}
            type='text'
            placeholder='please ID를 입력해주세요'
            className='border-b-2 border-mcyellow h-11 w-56 px-1'
          />

          <input
            ref={pwRef}
            type='password'
            placeholder='please PW 입력해주세요'
            className='border-b-2 border-mcyellow h-11 w-56 px-1'
          />
        </div>
        <br></br>
        <div className='flex flex-col gap-2'>
          <div className='flex gap-3'>
            <button
              type='submit'
              className='bg-mcred rounded-xl text-white px-5 py-1'
            >
              Log-in
            </button>
            <button
              type='button'
              onClick={() => navigation('/register')}
              className='border-2 border-mcred text-mcred rounded-xl px-5 py-1'
            >
              Register
            </button>
          </div>
          <button
            type='button'
            onClick={() => navigation('/placeselection')}
            className='border  bg-mcred text-white rounded-xl px-5 py-1'
          >
            비회원 주문
          </button>
        </div>
      </form>
    </McFrame>
  );
};
