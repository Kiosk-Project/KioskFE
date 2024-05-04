import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { setStorage } from '../util/setStorage';
import { getStorage } from '../util/getStorage';
import { useCount } from '../util/use-count';
import { useNavigate } from 'react-router-dom';

enum ACTION {
  LOG_IN = 'login',
  LOG_OUT = 'logout',
  SET = 'set',
  EMPTY_CART = 'empty-cart',
  UPDATE_CART = 'update-cart',
  ADD_ORDER = 'add-order',
}
type providerProps = {
  children: ReactNode;
};

type Action =
  | {
      type: ACTION.LOG_IN | ACTION.LOG_OUT;
      payload: UserToken | null;
    }
  | { type: ACTION.SET; payload: Storage }
  | { type: ACTION.EMPTY_CART; payload: [] }
  | {
      type: ACTION.UPDATE_CART;
      payload: Order[];
    }
  | { type: ACTION.ADD_ORDER; payload: Order };

type Product = {
  productCode: string;
  productName: string;
  productPrice: number;
};

type Order = {
  orderId: number;
  product: Product;
  productAmount: number;
  totalPrice: number;
};

type Storage = {
  token: UserToken | null;
  cart: Order[];
};

type StorageContextProp = {
  storage: Storage;
  login: (token: string, userId: string) => boolean;
  logout: () => boolean;
  addOrder: (product: Product, productAmount: number) => boolean;
  removeOrder: (orderId: number) => void;
  emptyCart: () => boolean;
  getCount: () => number;
  updateProductAmount: (orderId: number, order: Order) => void;
  setOrders: (orders: Order[]) => void;
};

const SessionContext = createContext<StorageContextProp>({
  storage: { token: null, cart: [] },
  login: () => {
    return false;
  },
  logout: () => {
    return false;
  },
  addOrder: () => false,
  removeOrder: () => {},
  emptyCart: () => {
    return false;
  },
  getCount: () => 0,
  updateProductAmount: () => {},
  setOrders: () => {},
});

const DefaultStorage: Storage = {
  token: null,
  cart: [],
};

const reducer = (storage: Storage, { type, payload }: Action) => {
  console.log('reducer함수 : ', payload);
  let newer: Storage;
  switch (type) {
    case ACTION.LOG_IN:
      newer = { cart: [], token: payload };
      break;

    case ACTION.LOG_OUT:
      newer = { ...storage, token: payload };
      break;

    case ACTION.SET:
      newer = { ...payload };
      break;

    case ACTION.ADD_ORDER:
      newer = { ...storage, cart: [...storage.cart, payload] };
      break;

    case ACTION.EMPTY_CART:
      newer = { ...storage, cart: [] };
      break;

    case ACTION.UPDATE_CART:
      newer = { ...storage, cart: [...payload] };
      break;

    default:
      return storage;
  }

  setStorage<string | undefined>('AUTH-TOKEN', newer.token?.token);
  setStorage<string | undefined>('userId', newer.token?.userId);
  setStorage<Order[]>('cart', newer.cart);
  return newer;
};

export const StorageProvider = ({ children }: providerProps) => {
  const navigation = useNavigate();
  const [storage, dispatch] = useReducer(reducer, DefaultStorage);
  const [totalCount, updateCount] = useCount();

  const login = useCallback((token: string, userId: string) => {
    dispatch({ type: ACTION.LOG_IN, payload: { token, userId } });

    return true;
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: ACTION.LOG_OUT, payload: null });
    return true;
  }, []);

  const removeOrder = (orderId: number) => {
    const storedOrder = { ...storage.cart };
    const updatedOrder = {
      ...storedOrder.slice(0, orderId),
      ...storage.cart.slice(orderId + 1),
    };

    dispatch({ type: ACTION.UPDATE_CART, payload: updatedOrder });
    updateCount(-1);
  };
  const emptyCart = () => {
    dispatch({ type: ACTION.EMPTY_CART, payload: [] });
    return false;
  };

  const addOrder = (product: Product, amount: number) => {
    const order: Order = {
      orderId: totalCount,
      product: product,
      productAmount: amount,
      totalPrice: product.productPrice * amount,
    };
    updateCount(1);
    dispatch({ type: ACTION.ADD_ORDER, payload: order });
    return true;
  };

  const getCount = () => {
    const count = totalCount;
    return count;
  };

  const updateProductAmount = (orderId: number, order: Order) => {
    const newOrderList: Order[] = [
      ...storage.cart.slice(0, orderId),
      order,
      ...storage.cart.slice(orderId + 1),
    ];

    dispatch({ type: ACTION.UPDATE_CART, payload: newOrderList });
  };

  const setOrders = (orders: Order[]) => {
    dispatch({ type: ACTION.UPDATE_CART, payload: orders });
  };

  useEffect(() => {
    const storedToken = getStorage<string>('AUTH-TOKEN', '');
    const storedUserId = getStorage<string>('userId', '');
    const storedCart = getStorage<Order[]>('cart', []);

    const userToken: UserToken = { token: storedToken, userId: storedUserId };
    dispatch({
      type: ACTION.SET,
      payload: { token: userToken, cart: storedCart },
    });
  }, [navigation, totalCount]);

  return (
    <>
      <SessionContext.Provider
        value={{
          storage,
          login,
          logout,
          addOrder,
          removeOrder,
          emptyCart,
          getCount,
          updateProductAmount,
          setOrders,
        }}
      >
        {children}
      </SessionContext.Provider>
    </>
  );
};

export const useStorage = () => useContext(SessionContext);
