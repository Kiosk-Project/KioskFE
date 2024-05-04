import { useEffect, useState } from 'react';

type ProductCategory =
  | 'BURGER_SET'
  | 'BURGER_SINGLE'
  | 'HAPPY_MEAL'
  | 'DRINK'
  | 'DESSERT';

type Order = {
  orderListTime: Date;
  orderListTotalPrice: number;
  orderListStatus: string;
  userId: string;
};

interface Message {
  status: string;
  code: string;
  message: string;
  result: unknown;
}

export const AdminOrderListPage = () => {
  const [products, setProducts] = useState<Order[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://localhost:8080/admin/order`);
      const data: Message = await response.json();
      const { status, result } = data;
      if (status == 'ORDER_LIST_FOUND_SUCCESS') {
        console.log(result);
        setProducts(result);
      } else {
        alert('조회 실패');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onDelete = (productCode: string) => {
    alert(productCode + ' 상품을 삭제할 수 없습니다');
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <>
      <div className=' min-w-full'>
        <table className='text-left text-sm font-light text-surface dark:text-white'>
          <thead className='border-b border-neutral-200 font-medium dark:border-white/10'>
            <tr className='min-w-full '>
              <th className=' w-1/12 text-center pb-3'>#</th>
              <th className=' w-1/12 text-center pb-3'>USER</th>
              <th className=' w-2/12 text-center pb-3'>STATUS</th>
              <th className=' w-3/12 text-center pb-3'>ORDERED TIME</th>
              <th className=' w-1/12 text-center pb-3'>TOTAL PRICE</th>
              <th className=' w-1/12 text-center pb-3'>수정</th>
            </tr>
          </thead>
          <tbody className=' overflow-y-scroll'>
            {products?.map((item, index) => (
              <tr
                key={item.userId}
                className='border-b border-neutral-200 dark:border-white/10 h-16 text-center items-center even:bg-stone-50'
              >
                <td>{index + 1}</td>
                <td>{item.userId}</td>
                <td>
                  <div className=' max-w-30 truncate whitespace-nowrap'>
                    {item.orderListStatus}
                  </div>
                </td>
                <td>
                  <div className='max-w-30 truncate whitespace-nowrap'>
                    {item.orderListTime.toString()}
                  </div>
                </td>
                <td>
                  <div className='truncate'>
                    {item.orderListTotalPrice.toLocaleString()} 원
                  </div>
                </td>

                <td>
                  <div className='flex flex-col gap-1 min-h-full content-center'>
                    <button className='border border-stone-300 bg-white  rounded-lg'>
                      수정
                    </button>
                    <button
                      className='border border-stone-300 bg-white rounded-lg'
                      onClick={() => onDelete(item.userId)}
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
