import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getStorage } from '../util/getStorage';
import { Product } from './admin/AdminUserListPage';
import { getTotalPrice } from '../util/getTotalPrice';
import { McFrame } from '../util/mcFrame';
import { useStorage } from '../context/storage-context';

interface OrderDetailItemDto {
  productName: string;
  orderPrice: number;
  orderAmount: number;
}

interface OrderDetailResDto {
  orderDetailItemDtoList: OrderDetailItemDto[];
  orderListTotalAmount: number;
  orderListTotalPrice: number;
}

type Order = {
  orderId: number;
  product: Product;
  productAmount: number;
  totalPrice: number;
};
type myState = {
  cart: Order[];
};
const OrderDetail = () => {
  const navigation = useNavigate();
  const { setOrders } = useStorage();
  const [data, setData] = useState<OrderDetailResDto | null>(null);
  const [orderListId, setOrderListId] = useState<number | null>(null);
  const [cart, setCart] = useState(() => getStorage<Order[]>('cart', []));

  // useEffect(() => {
  //   // Todo: orderListId 받아오기
  //   setOrderListId(20);

  //   if (orderListId !== null) {
  //     fetchData();
  //   }
  // }, [orderListId]);

  // const fetchData = () => {
  //   fetch('http://localhost:8080/order/detail', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       orderListId: orderListId,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((json) => {
  //       setData(json.result);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // };

  // if (!data) {
  //   return <div>Loading...</div>;
  // }

  const addAmount = (orderIndex: number) => {
    const order: Order = cart[orderIndex];

    const newAmount = ++order.productAmount;
    const newOrder: Order = { ...order, productAmount: newAmount };

    setCart((pre) => [
      ...pre.slice(0, orderIndex),
      newOrder,
      ...pre.slice(orderIndex + 1),
    ]);
  };

  const subAmount = (orderIndex: number) => {
    const order: Order = cart[orderIndex];

    if (order.productAmount == 1) {
      return;
    }
    const newAmount = --order.productAmount;
    const newOrder: Order = { ...order, productAmount: newAmount };

    setCart((pre) => [
      ...pre.slice(0, orderIndex),
      newOrder,
      ...pre.slice(orderIndex + 1),
    ]);
  };

  const removeItem = (orderIndex: number) => {
    setCart((pre) => [
      ...pre.slice(0, orderIndex),
      ...pre.slice(orderIndex + 1),
    ]);
  };

  return (
    <McFrame color='red'>
      <div className='flex flex-col items-center pt-7'>
        <h1 className='text-2xl font-bold'>주문을 확인하세요.</h1>
        <br />

        <div className='flex flex-col w-full divide-y-2 px-2'>
          {cart?.map((item, index) => (
            <div
              key={item.orderId}
              className='grid grid-cols-12 gap-3 py-3  even:bg-slate-100 '
            >
              <div className='col-span-4'>{item.product.productName}</div>
              <div className='flex col-span-3 gap-2'>
                <button
                  className='border-2 border-slate-200 rounded-lg px-2 h-7 bg-white'
                  onClick={() => subAmount(index)}
                >
                  -
                </button>
                {item.productAmount}
                <button
                  className='border-2 border-slate-200 rounded-lg px-2 h-7 bg-white'
                  onClick={() => addAmount(index)}
                >
                  +
                </button>
              </div>
              <div className='col-span-2'>{item.totalPrice}</div>
              <div className='col-span-3'>
                <button
                  className='border-2 border-mcred px-2 rounded-lg text-mcblack'
                  onClick={() => removeItem(index)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
        <br></br>
        <div className='text-lg font-bold'>
          총 금액 : {getTotalPrice(cart).toLocaleString()}
        </div>
        <br></br>

        <div className='flex gap-2'>
          <button
            className='bg-mcred px-2 rounded-lg text-white'
            onClick={() => {
              setOrders(cart);
              navigation('/order/products');
            }}
          >
            추가 주문
          </button>
          <button
            className='bg-mcred px-2 rounded-lg text-white'
            onClick={() => {
              navigation('/order/recommend');
            }}
          >
            결제하기
          </button>
        </div>
      </div>
    </McFrame>
  );
};

export default OrderDetail;
