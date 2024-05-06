import { FormEvent, useEffect, useId, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const AdminOrderListPage = () => {
  const [data, setData] = useState<OrderList[] | null>(null);
  const [searchType, setSearchType] = useState('all');
  const navigate = useNavigate();
  const text = useId();
  const API = 'http://localhost:8080/admin/order';
  const location = useLocation();
  console.log(location);

  const searchTextRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, [location.search]);

  const fetchData = () => {
    fetch(`${API}${location.search}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        setData(json.result);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const selectSearchType = (e) => {
    const type = e.target.value;
    setSearchType(type);
    return;
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = searchTextRef.current?.value;
    if (!text) {
      alert('검색어를 정확히 입력하세요!');
      searchTextRef.current?.focus();
      return;
    }
    navigate(`/admin/order?text=${text}&type=${searchType}`);
  };

  const onDeleteClick = (order: OrderList) => {
    if (window.confirm('삭제하시겠습니까?')) {
      fetch(`${API}/${order.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          setData(json.result);
          alert(json.message);
          fetchData();
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      return false;
    }
  };

  const goOrderEdit = (order: OrderList) => {
    // TODO: 라우터 주문 상세 수정 구현
    navigate(`/admin/order2/${order.id}`);
  };

  return (
    <>
      <h3 className='font-bold text-2xl'>주문 목록</h3>
      <form onSubmit={submitHandler} className='mt-10'>
        <div>
          <label htmlFor={text}>검색: </label>
          <input
            type='text'
            name={text}
            id={text}
            ref={searchTextRef}
            placeholder='검색어..'
          />
          <button type='submit' className='bg-slate-300'>
            검색
          </button>
        </div>
        <div>
          <select value={searchType} onChange={selectSearchType}>
            <option value='all'>전체</option>
            <option value='status'>주문 상태</option>
          </select>
        </div>
      </form>
      <div>
        총 <span className='text-red-500'>{data?.length}</span>건의 주문이
        있습니다.
      </div>

      <div className='mt-2 flex flex-col'>
        <div className='-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8'>
          <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
            <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <td className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      번호
                    </td>
                    <td className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      주문 금액
                    </td>
                    <td className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      회원 아이디
                    </td>
                    <td className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      주문상태
                    </td>
                    <td className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      주문일시
                    </td>
                    <td className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      수정
                    </td>
                    <td className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      삭제
                    </td>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {data?.map((order, index) => (
                    <tr key={order.id}>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {index + 1}
                      </td>
                      <td className='text-right'>
                        ￦ {order.orderListTotatlPrice.toLocaleString()}
                      </td>
                      <td>{order.userId}</td>
                      <td>{order.orderListStatus}</td>
                      <td>{order.orderListTime}</td>
                      <td>
                        <button
                          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                          onClick={() => goOrderEdit(order)}
                        >
                          수정
                        </button>
                      </td>
                      <td>
                        <button
                          className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                          onClick={() => onDeleteClick(order)}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
