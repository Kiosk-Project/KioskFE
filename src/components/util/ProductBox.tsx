import { Product } from '../view/AdminPageList';

type Prop = {
  product: Product;
  id?: undefined | number | string;
};
export const ProductBox = ({ product }: Prop) => {
  return (
    <div className='w-32 h-32'>
      <div style={{ height: '50%' }}>
        <img
          src={product.productImgUrl}
          alt={product.productName}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'fill',
          }}
        />
      </div>

      <div className='text-sm overflow-hidden'>
        <p>{product.productName}</p>
        <p>{product.productPrice}원</p>
      </div>
    </div>
  );
};
