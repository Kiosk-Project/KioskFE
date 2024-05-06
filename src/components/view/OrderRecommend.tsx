import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { McFrame } from '../util/mcFrame';
import { ProductBox } from '../util/ProductBox';
import { Product } from './admin/AdminUserListPage';
import { useStorage } from '../context/storage-context';
import { getTotalPrice } from '../util/getTotalPrice';

const OrderRecommend = () => {
  const navigation = useNavigate();
  const [data, setData] = useState<Product[]>([]);

  const {
    storage: { cart },
    addOrder,
  } = useStorage();

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

  const addItem = (product: Product) => {
    addOrder(product, 1);
    const totalPrice = getTotalPrice(cart);
    alert(
      '상품 추가되었습니다.\n 총 결제 금액은 ' +
        (totalPrice + product.productPrice).toLocaleString() +
        ' 원 입니다'
    );
    navigation('/order/payment');
  };

  return (
    <McFrame color='yellow'>
      <span className='font-bold text-2xl text-mcblack'>
        함께 즐기시면 더욱 좋습니다!
      </span>
      <br />

      <div className='grid grid-cols-3 gap-2 place-items-center max-h-96'>
        {data ? (
          data.map((product, index) => (
            <button
              key={index}
              className='flex flex-col items-center shadow-md shadow-slate-200 bg-white rounded-lg w-32 h-32'
              onClick={() => {
                addItem(product);
              }}
            >
              <ProductBox product={product} key={index} />
            </button>
          ))
        ) : (
          <span>isLoading</span>
        )}
      </div>

      <br />
      <div className='flex gap-2 justify-center'>
        <button
          className='bg-mcblack px-8 text-white rounded-lg'
          onClick={() => history.back()}
        >
          이전
        </button>
        <button
          className='bg-mcred px-8 text-white rounded-lg'
          onClick={() => navigation('/order/payment')}
        >
          선택안함
        </button>
      </div>
    </McFrame>
  );
};

export default OrderRecommend;
