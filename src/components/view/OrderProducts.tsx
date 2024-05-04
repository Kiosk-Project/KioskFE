import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { useStorage } from '../context/storage-context';
import { useNavigate } from 'react-router-dom';
import { Product } from './AdminPageList';
import { useCount } from '../util/use-count';
import { ProductBox } from '../util/ProductBox';
import { getTotalPrice } from '../util/getTotalPrice';
import { getStorage } from '../util/getStorage';

enum CATEGORY {
  BURGER_SET = 'BURGER_SET',
  BURGER_SINGLE = 'BURGER_SINGLE',
  DESSERT = 'DESSERT',
  DRINK = 'DRINK',
  HAPPY_MEAL = 'HAPPY_MEAL',
  RECOMMENDED = 'RECOMMENDED',
}

interface Message {
  status: string;
  code: string;
  message: string;
  result: Product[];
}

const OrderProducts = () => {
  const navigation = useNavigate();
  const {
    storage: { token, cart },
    setOrders,
    emptyCart,
  } = useStorage();

  const [products, setProducts] = useState<Product[] | null>(null);
  const [category, setCategory] = useState<CATEGORY>(CATEGORY.BURGER_SET);
  const [page, setPage] = useState<number>(0);
  const [myCart, setMyCart] = useState<Order[]>([]);
  const [totalCount, updateCount] = useCount(0);

  useEffect(() => {
    if (category == CATEGORY.RECOMMENDED) {
      fetchRecommendData();
    } else {
      fetchData();
    }
  }, [category, page]);

  useEffect(() => {
    const stored = getStorage<Order[]>('cart', []);
    setMyCart(stored);
  }, [cart, navigation]);

  // 카테고리 별 메뉴 출력
  const fetchData = () => {
    fetch('http://localhost:8080/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: category,
        page: page,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        const message: Message = json;
        const { status, result: products } = message;
        if (status == 'PRODUCT_CHECK_SUCCESS') {
          setProducts(products);
        }
      })
      .catch((err) => console.error(err));
  };

  // 추천 메뉴 눌렀을 때 랜덤 메뉴 출력
  const fetchRecommendData = () => {
    fetch('http://localhost:8080/order/recommend', {
      method: 'POST',
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        console.log(json.result);
        setProducts(json.result);
      });
  };

  const addItem = (product: Product) => {
    const newOrder: Order = {
      orderId: totalCount,
      product: { ...product },
      productAmount: 1,
      totalPrice: product.productPrice,
    };

    setMyCart((pre) => [...pre, newOrder]);
    updateCount(1);
  };

  const addAmount = (orderIndex: number) => {
    const order: Order = myCart[orderIndex];

    const newAmount = ++order.productAmount;
    const newOrder: Order = { ...order, productAmount: newAmount };

    setMyCart((pre) => [
      ...pre.slice(0, orderIndex),
      newOrder,
      ...pre.slice(orderIndex + 1),
    ]);
  };

  const subAmount = (orderIndex: number) => {
    const order: Order = myCart[orderIndex];

    if (order.productAmount == 1) {
      setMyCart((pre) => [
        ...pre.slice(0, orderIndex),
        ...pre.slice(orderIndex + 1),
      ]);
      return;
    }
    const newAmount = --order.productAmount;
    const newOrder: Order = { ...order, productAmount: newAmount };

    setMyCart((pre) => [
      ...pre.slice(0, orderIndex),
      newOrder,
      ...pre.slice(orderIndex + 1),
    ]);
  };

  const emptyMyCart = () => {
    setMyCart([]);
  };

  return (
    <div className='flex flex-col max-w-screen-sm sm min-h-screen  justify-between mx-auto pb-2'>
      <div>
        <img
          src='https://img.insight.co.kr/static/2021/04/13/700/img_20210413151511_h3uakchh.webp'
          alt='title'
          className='object-fill w-full h-20'
        ></img>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2 className='text-md my-3'>
          {token && <span style={{ color: 'red' }}>{token.userId}</span>}{' '}
          {token &&
            `님
          환영합니다`}
        </h2>
        <button
          onClick={() => {
            navigation('/placeselection');
          }}
          className='bg-mcblack text-white text-md font-bold rounded-lg px-8 m-2'
        >
          이전
        </button>
      </div>

      <div>
        <div className='grid grid-cols-12'>
          <div className='flex flex-col col-span-3 gap-2'>
            <span className=' text-mcblack font-sans rounded-lg py-1 '>
              You are here with{' '}
              <strong className='text-xl text-mcyellow'>Mcdonald</strong>
            </span>
            <span className='bg-mcred h-0.5'></span>
            <button
              onClick={() => {
                setCategory(CATEGORY.RECOMMENDED);
                setPage(0);
              }}
              className={clsx('font-bold rounded-lg py-3 text-sm', {
                'drop-shadow-lg bg-white': category != CATEGORY.RECOMMENDED,
                'bg-mcred text-white ': category == CATEGORY.RECOMMENDED,
              })}
            >
              추천 메뉴
            </button>
            <button
              onClick={() => {
                setCategory(CATEGORY.BURGER_SET);
                setPage(0);
              }}
              className={clsx('font-bold rounded-lg py-3 text-sm', {
                'drop-shadow-lg bg-white': category != CATEGORY.BURGER_SET,
                'bg-mcred text-white ': category == CATEGORY.BURGER_SET,
              })}
            >
              버거 & 세트
            </button>
            <button
              onClick={() => {
                setCategory(CATEGORY.BURGER_SINGLE);
                setPage(0);
              }}
              className={clsx('font-bold rounded-lg py-3 text-sm', {
                'drop-shadow-lg bg-white': category != CATEGORY.BURGER_SINGLE,
                'bg-mcred text-white ': category == CATEGORY.BURGER_SINGLE,
              })}
            >
              단품
            </button>
            <button
              onClick={() => {
                setCategory(CATEGORY.HAPPY_MEAL);
                setPage(0);
              }}
              className={clsx('font-bold rounded-lg py-3 text-sm', {
                'drop-shadow-lg bg-white': category != CATEGORY.HAPPY_MEAL,
                'bg-mcred text-white ': category == CATEGORY.HAPPY_MEAL,
              })}
            >
              해피밀
            </button>
            <button
              onClick={() => {
                setCategory(CATEGORY.DESSERT);
                setPage(0);
              }}
              className={clsx('font-bold rounded-lg py-3 text-sm', {
                'drop-shadow-lg bg-white': category != CATEGORY.DESSERT,
                'bg-mcred text-white ': category == CATEGORY.DESSERT,
              })}
            >
              디저트
            </button>
            <button
              onClick={() => {
                setCategory(CATEGORY.DRINK);
                setPage(0);
              }}
              className={clsx('font-bold rounded-lg py-3 text-sm', {
                'drop-shadow-lg bg-white': category != CATEGORY.DRINK,
                'bg-mcred text-white ': category == CATEGORY.DRINK,
              })}
            >
              음료
            </button>
          </div>
          <div className='col-span-9 border-2 border-mcred p-2 rounded-lg ml-2'>
            <div className='grid grid-cols-3 gap-2 p-2 '>
              {!products ? (
                <span className='self-center'>isloading</span>
              ) : (
                products?.map((product, index) => (
                  <button
                    key={product.productCode}
                    className='flex flex-col items-center shadow-md shadow-slate-200 bg-white rounded-lg w-32 h-32'
                    onClick={() => {
                      addItem(product);
                    }}
                  >
                    <ProductBox product={product} key={index} id={index} />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='flex justify-center m-2 gap-5'>
        <button
          className='border border-stone-300 px-5 py-1 rounded-lg text-sm'
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          이전
        </button>
        <span>{page}</span>
        <button
          className='border border-stone-300 px-5 py-1 rounded-lg text-sm'
          onClick={() => setPage(page + 1)}
        >
          다음
        </button>
      </div>

      <div
        className='my-1'
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'green',
          color: 'white',
          fontSize: '20px',
          fontWeight: 'bold',
        }}
      >
        <div>
          <p className='mx-3 text-md'>주문 내역</p>
        </div>
        <div>
          <p className='mx-3 text-md'>
            총 가격: 원 수량: {getTotalPrice(myCart).toLocaleString()}
          </p>
        </div>
      </div>

      <div
        style={{ textAlign: 'right' }}
        className='px-5 h-24 overflow-y-scroll'
      >
        <table className='min-w-full text-start text-sm'>
          <tbody>
            {myCart?.map((item, index) => (
              <tr key={item.orderId} className='flex justify-between'>
                <td>{index + 1}</td>
                <td>{item.product.productName}</td>
                <td>{item.product.productPrice} 원</td>
                <td>
                  <button
                    className='border border-slate-300 rounded-lg px-2'
                    onClick={() => subAmount(index)}
                  >
                    -
                  </button>
                  <span className='mx-2'>{item.productAmount}</span>
                  <button
                    className='border border-slate-300 rounded-lg px-2'
                    onClick={() => addAmount(index)}
                  >
                    +
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type='button'
          className='font-bold text-sm'
          onClick={() => {
            navigation('/order/detail');
          }}
        >
          주문 상세보기
        </button>
        <br />
        <button
          className='bg-mcblack text-white px-5 rounded-lg text-sm'
          onClick={() => emptyMyCart()}
        >
          비우기
        </button>
      </div>

      <div className='grid grid-cols-2 mt-1 gap-1'>
        <button
          className='bg-red-500 text-white font-bold rounded-lg w-full'
          onClick={() => {
            emptyCart();
            navigation('/placeselection');
          }}
        >
          주문 취소
        </button>
        <button
          className='bg-green-700 text-white font-bold rounded-lg w-full'
          onClick={() => {
            setOrders(myCart);
            if (myCart.length == 0) {
              alert('상품을 선택해주세요');
              return;
            }
            navigation('/order/recommend');
          }}
        >
          주문 완료
        </button>
      </div>
    </div>
  );
};

export default OrderProducts;
