import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../context/storage-context';

interface SuccessOrderResDto {
  userPoint: number;
  orderListId: number;
}

const OrderSubmit = () => {
  const navigation = useNavigate();
  const [data, setData] = useState<SuccessOrderResDto | null>(null);
  const {
    storage: { token },
  } = useStorage();
  const [orderListId, setOrderListId] = useState<number | null>(null);

  useEffect(() => {
    // Todo: 사용자 ID와 OrderList ID 받아오기
    setOrderListId(20);

    if (token?.userId !== null && orderListId !== null) {
      fetchData();
    }
  }, [orderListId]);

  const fetchData = () => {
    fetch('http://localhost:8080/order/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: token?.userId,
        orderListId: orderListId,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setData(json.result);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    localStorage.clear();
    setTimeout(() => {
      navigation('/');
    }, 7000);
  }, []);

  return (
    <div className='flex flex-col max-w-screen-sm sm min-h-screen  justify-center items-center mx-auto p-20'>
      <img
        src='https://i.namu.wiki/i/pYdtlj-fQNTInL7V6QVzRNAB_9Ip74fCiowUbuIEb03dzfy9olYTgA6-SLOD4GRe-Uub5_zWT-hocLHOcJDBxw.svg'
        alt='logo'
        className='size-64 m-10'
      ></img>
      {!data ? (
        ''
      ) : (
        <h1>
          고객님의 주문번호는{' '}
          <strong className='text-mcred text-xl'>{data.orderListId}</strong>번
          입니다.
        </h1>
      )}
      <h1>감사합니다.</h1>
      <br />
      {!data ? (
        ''
      ) : (
        <h1>
          회원님의 적립금은 <span className='underline'>{data.userPoint}</span>
          원입니다.
        </h1>
      )}
      <br></br>
      <button
        className='text-xl font-bold bg-mcred rounded-lg px-7 text-white'
        onClick={() => navigation('/')}
      >
        Home
      </button>
    </div>
  );
};

export default OrderSubmit;
