import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type OrderRevenueList = {
  orderListDate: string;
  orderListTotalPrice: number;
};

type OrderRevenue = {
  type: string;
  year: number;
  month: number;
  orderRevenueList: OrderRevenueList[];
};

type chart = {
  [key: number]: string;
};

const month: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const AdminOrderStatisticsChartPage = () => {
  const API = 'http://localhost:8080/admin/order/statistics/revenue';
  const [orders, setOrders] = useState<OrderRevenue>();
  const [chartHeight, setChartHeight] = useState<chart>();
  const [isLoading, setLoading] = useState(false);
  const [year, setYear] = useState('2024');
  const [searchMonth, setMonth] = useState('5');
  const navigation = useNavigate();

  useEffect(() => {
    setLoading(false);
    fetchOrders();
    setTimeout(() => {
      setLoading(true);
    }, 1000);
  }, [searchMonth]);
  const fetchOrders = () => {
    fetch(`${API}?type=month&year=${year}&month=${searchMonth}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        console.log(json.result);
        setOrders(json.result);
        const chart: chart = {};
        orders?.orderRevenueList.forEach((order, idx) => {
          chart[idx] = `${order.orderListTotalPrice / 1000}px`;
        });
        setChartHeight(chart);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <button
        type='button'
        className='border bg-red-500 text-white font-medium rounded-lg p-1 m-2'
      >
        일자별
      </button>
      <button className='border text-red-500 font-medium rounded-lg p-1 m-2'>
        년도별
      </button>
      <div className='grid grid-cols-3 flex-wrap items-center py-5 px-6'>
        <div className='col-start-1 text-left'>
          <button
            className='border-yellow-400 bg-yellow-400 text-white rounded-lg m-5 p-2 font-semibold'
            onClick={() => navigation('/admin/order/statistics')}
          >
            표 보기
          </button>
        </div>
        <h3 className='col-start-2 w-full md:w-auto mb-4 md:mb-0 text-2xl font-bold'>
          {orders?.year}. {orders?.month && orders?.month < 10 ? 0 : null}
          {orders?.month}
        </h3>
        <div className='col-start-3'>
          <div className='inline-block py-2 px-3 border rounded text-xs text-grey-500'>
            <select
              className='pr-1'
              onChange={(e) => setYear(e.currentTarget.value)}
            >
              <option value='2023'>2023</option>
              <option value='2024' selected>
                2024
              </option>
            </select>
          </div>
          <div className='ml-2 inline-block py-2 px-3 border rounded text-xs text-grey-500'>
            <select
              className='pr-1'
              onChange={(e) => setMonth(e.currentTarget.value)}
            >
              <option value='none'>month</option>
              {month.map((m) => (
                <option key={m} value={m}>
                  {m}월
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 그래프 */}
        {!isLoading ? (
          <h1>Loading...</h1>
        ) : (
          <div className='container mt-10 col-start-1 col-end-4'>
            <div className='flex flex-col items-center justify-center min-w-max px-3 py-5 text-gray-700 bg-gray-100'>
              <div className='flex flex-col items-center p-6 pb-6 bg-white rounded-lg shadow-xl sm:p-8 min-w-full'>
                <h2 className='text-xl font-bold'>Daily Revenue</h2>
                <span className='text-sm font-semibold text-gray-500'>
                  {orders?.year}.{' '}
                  {orders?.month && orders?.month < 10 ? 0 : null}
                  {orders?.month}
                </span>
                <div className='flex items-end flex-grow w-full mt-10 space-x-2 sm:space-x-3'>
                  {orders?.orderRevenueList.map((order, idx) => (
                    <div
                      key={idx}
                      className='relative flex flex-col items-center flex-grow pb-5 group'
                    >
                      <span className='absolute top-0 hidden -mt-6 text-xs font-bold group-hover:block'>
                        {order.orderListTotalPrice.toLocaleString()}￦
                      </span>
                      <div
                        className={`relative flex justify-center w-full bg-indigo-300`}
                        style={{ height: chartHeight[idx] }}
                      ></div>
                      <span className='absolute bottom-0 text-xs font-bold'>
                        {order.orderListDate}
                      </span>
                    </div>
                  ))}
                </div>
                {/* 라벨 */}
                <div className='mt-3'>
                  <div className='flex items-center ml-4'>
                    <span className='block w-4 h-4 bg-indigo-300'></span>
                    <span className='ml-1 text-xs font-medium'>매출액</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
