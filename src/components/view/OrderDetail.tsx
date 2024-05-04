import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const OrderDetail = () => {
  const navigation = useNavigate();
  const [data, setData] = useState<OrderDetailResDto | null>(null);
  const [orderListId, setOrderListId] = useState<number | null>(null);

  useEffect(() => {
    // Todo: orderListId 받아오기
    setOrderListId(20);

    if (orderListId !== null) {
      fetchData();
    }
  }, [orderListId]);

  const fetchData = () => {
    fetch('http://localhost:8080/order/detail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
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

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>주문을 확인하세요.</h1>
      <br />

      <div>
        {data.orderDetailItemDtoList.map((product, index) => (
          <div key={index}>
            <div className='my-3'>
              {product.productName} - {product.orderPrice}원{' '}
              <button className='mx-2'>-</button>
              {product.orderAmount}개<button className='mx-2'>+</button>
              <button>삭제</button>
              <hr />
            </div>
          </div>
        ))}
      </div>

      <br />
      <p>
        총 수량: {data.orderListTotalAmount}개 총 가격:{' '}
        {data.orderListTotalPrice}원
      </p>
      <hr />

      <div>
        <button
          className='mx-3'
          onClick={() => {
            navigation('/order/products');
          }}
        >
          추가 주문
        </button>
        <button
          onClick={() => {
            navigation('/order/recommend');
          }}
        >
          결제하기
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
