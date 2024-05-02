import React, { useEffect, useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';

interface RecommendProductDto {
  id: number;
  productName: string;
  productPrice: number;
  productImgUrl: string;
}

const OrderRecommend = () => {
  const [data, setData] = useState<RecommendProductDto[] | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('http://localhost:8080/order/recommend', {
      method: 'POST',
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
      <h1>함께 즐기시면 더욱 좋습니다!</h1>
      <br />

      <Row>
        {data.map((product, index) => (
          <Col md={4} key={index}>
            <div className='text-center'>
              <img src={product.productImgUrl} alt={product.productName} />
              <p>{product.productName}</p>
              <p>{product.productPrice}원</p>
            </div>
          </Col>
        ))}
      </Row>

      <br />
      <Button className='mx-3'>이전</Button>
      <Button>선택안함</Button>
    </div>
  );
};

export default OrderRecommend;