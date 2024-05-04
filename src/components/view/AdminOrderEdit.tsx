import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const AdminOrderEdit = () => {
  const API = 'http://localhost:8080/admin/order';
  const [data, setData] = useState<OrderList | null>(null);
  const [order, setOrder] = useState<Order[] | null>(null);
  const { id } = useParams();

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = () => {
    fetch(`${API}/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        setData(json.result);
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <div className='mt-2 flex flex-col'>
        <div className='-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8'>
          <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
            <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
              <h3 className='font-semibold text-2xl'>주문 상세 조회</h3>
              <div className='m-4 grid grid-cols-3 gap-1 justify-evenly'>
                <div className='col-start-1 col-end-2 text-left'>
                  주문 번호 {data?.id}
                </div>
                <div className='col-start-3'>
                  <input
                    type='text'
                    value={data?.orderListTime.replace('T', ' ')}
                  />
                </div>
                <div className='col-start-3 font-semibold text-gray-500'>
                  총 주문금액:{' '}
                  <span className='text-xl font-bold text-black'>
                    {data?.orderListTotalPrice.toLocaleString()}
                  </span>{' '}
                  원
                </div>
                <div className='col-start-2'>
                  <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1'>
                    수정
                  </button>
                  <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded m-1'>
                    뒤로
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
