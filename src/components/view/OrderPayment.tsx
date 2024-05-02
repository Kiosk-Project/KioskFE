import React, { useEffect, useState } from 'react';

interface PaymentResDto {
  orderItemTotalAmount: number;
  orderListTotalPrice: number;
}

const OrderPayment = () => {
  const [data, setData] = useState<PaymentResDto | null>(null);
  const [orderListId, setOrderListId] = useState<number | null>(null);

  useEffect(() => {
    // Todo: OrderListID 받아오기
    setOrderListId(20);

    if (orderListId !== null) {
      fetchData();
    }
  }, [orderListId]);

  const fetchData = () => {
    fetch('http://localhost:8080/order/payment', {
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
      <p>
        총 수량: {data.orderItemTotalAmount}개 총 가격:{' '}
        {data.orderListTotalPrice}원
      </p>
      <br />
      <p>카드를 화살표 방향으로 투입구에 넣어주세요.</p>
      <p>결제 오류시, 카드를 긁어주세요.</p>
      <img
        src='https://media.licdn.com/dms/image/D4D12AQFym_70hWOyZg/article-cover_image-shrink_600_2000/0/1685446331482?e=2147483647&v=beta&t=fuITp9VITQaAdGNjomWZkykJGMIoho2qh2SIdDOD1eE'
        alt='pay'
      ></img>
    </div>
  );
};

export default OrderPayment;