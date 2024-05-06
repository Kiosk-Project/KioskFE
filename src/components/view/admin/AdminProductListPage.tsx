import { useEffect, useState } from 'react';

type ProductCategory =
  | 'BURGER_SET'
  | 'BURGER_SINGLE'
  | 'HAPPY_MEAL'
  | 'DRINK'
  | 'DESSERT';

type Product = {
  productName: string;
  productPrice: number;
  productCode: string;
  productImgUrl: string;
  category: ProductCategory;
};

interface Message {
  status: string;
  code: string;
  message: string;
  result: unknown;
}

export const AdminProductListPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://localhost:8080/admin/product/list`);
      const data: Message = await response.json();
      const { status, result } = data;
      if (status == 'PRODUCT_CHECK_SUCCESS') {
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
              <th className=' w-2/12 text-center pb-3'>NAME</th>
              <th className=' w-1/12 text-center pb-3'>CODE</th>
              <th className=' w-1/12 text-center pb-3'>IMG</th>
              <th className=' w-1/12 text-center pb-3'>PRICE</th>
              <th className=' w-1/12 text-center pb-3'>CATEGORY</th>
              <th className=' w-1/12 text-center pb-3'>수정</th>
            </tr>
          </thead>
          <tbody className=' overflow-y-scroll'>
            {products?.map((item, index) => (
              <tr
                key={item.productCode}
                className='border-b border-neutral-200 dark:border-white/10 h-16 text-center items-center even:bg-stone-50'
              >
                <td>{index + 1}</td>
                <td>{item.productName}</td>
                <td>
                  <div className='max-w-20 truncate whitespace-nowrap'>
                    {item.productCode}
                  </div>
                </td>
                <td>
                  <div className='max-w-20 truncate whitespace-nowrap'>
                    {item.productImgUrl}
                  </div>
                </td>
                <td>
                  <div className='truncate'>
                    {item.productPrice.toLocaleString()} 원
                  </div>
                </td>
                <td>{item.category}</td>
                <td>
                  <div className='flex flex-col gap-1 min-h-full content-center'>
                    <button className='border border-stone-300 bg-white  rounded-lg'>
                      수정
                    </button>
                    <button
                      className='border border-stone-300 bg-white rounded-lg'
                      onClick={() => onDelete(item.productCode)}
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
