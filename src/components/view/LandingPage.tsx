import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
  const navigation = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);
  return (
    <div className='flex max-w-screen-sm sm min-h-screen bg-white justify-center mx-auto'>
      <button
        onClick={() => navigation('/login')}
        className='flex flex-col columns-1 bg-mcred text-white font-sans text-6xl min-w-full justify-center items-center p-14'
      >
        <img
          src='https://www.kimp.io/wp-content/uploads/2023/08/McD-logo-new.png'
          alt=''
          className='size-56 m-10'
        />

        <strong className='mb-2'>Welcome!</strong>
        <p className='text-xl mb-10'>We are here to support</p>
        <br></br>

        <p className='text-2xl text-mcyellow mt-5 animate-bounce'>
          Please click to order
        </p>
      </button>
    </div>
  );
};
