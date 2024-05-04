import { useEffect, useReducer, useRef } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { Nav, NavigationHandler } from '../../Nav';

export enum PAGE {
  USER = 'user',
  PRODUCT = 'product',
  ORDER = 'order',
}

type Action =
  | {
      type: PAGE.USER;
    }
  | {
      type: PAGE.PRODUCT;
    }
  | { type: PAGE.ORDER };

const reducer = (curretPage: PAGE, { type }: Action) => {
  let page: PAGE;
  switch (type) {
    case PAGE.ORDER:
      page = PAGE.ORDER;
      break;

    case PAGE.PRODUCT:
      page = PAGE.PRODUCT;
      break;

    case PAGE.USER:
      page = PAGE.USER;
      break;

    default:
      page = PAGE.USER;
      break;
  }

  return page;
};

export const AdminPage = () => {
  const [page, dispatch] = useReducer(reducer, PAGE.USER);
  const navigation = useNavigate();

  const onRoutePage = (page: PAGE) => {
    dispatch({ type: page });
    navigation(`/admin/${page}`);
  };

  useEffect(() => {
    dispatch({ type: PAGE.USER });
    navigation('/admin/user');
  }, []);

  const navigationHandlerRef = useRef<NavigationHandler>(null);
  return (
    <>
      <Nav ref={navigationHandlerRef} />

      <div className='flex flex-col w-full sm min-h-screen items-center'>
        <div className='grid grid-cols-12 mt-5 w-3/4 '>
          <div className='col-span-12 flex flex-col min-h-10 text-start py-7 pl-14 mb-5 border-b-2 border-mcblack'>
            <span className='text-2xl font-medium '>관리자 페이지</span>
            <span className='text-stone-300'>
              Mcdonald | Admin | <u>{page}</u>
            </span>
          </div>

          <div className='col-span-2 flex flex-col divide-y'>
            <span className='text-end px-3 py-2 font-semibold'>카테고리</span>
            <button
              type='button'
              onClick={() => {
                onRoutePage(PAGE.USER);
                navigationHandlerRef.current?.onSwitchCategory(PAGE.USER);
              }}
              className={clsx('py-2 px-3', 'font-thin text-end', 'rounded-md', {
                'bg-white text-mcred text-semibold  hover:bg-slate-200':
                  page != 'user',
                'bg-mcblack text-white': page == 'user',
              })}
            >
              User
            </button>
            <button
              type='button'
              onClick={() => {
                onRoutePage(PAGE.PRODUCT);
                navigationHandlerRef.current?.onSwitchCategory(PAGE.PRODUCT);
              }}
              className={clsx('py-2 px-3', 'font-thin text-end', 'rounded-md', {
                'bg-white text-mcred text-semibold  hover:bg-slate-200':
                  page != 'product',
                'bg-mcblack text-white ': page == 'product',
              })}
            >
              Product
            </button>
            <button
              type='button'
              onClick={() => {
                onRoutePage(PAGE.ORDER);
                navigationHandlerRef.current?.onSwitchCategory(PAGE.ORDER);
              }}
              className={clsx('py-2 px-3', 'font-thin text-end', 'rounded-md', {
                'bg-white text-mcred text-semibold  hover:bg-slate-200':
                  page != 'order',
                'bg-mcblack text-white': page == 'order',
              })}
            >
              Order
            </button>
          </div>
          <div className='col-span-10 bg-white ml-5 rounded-3xl p-5'>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};
