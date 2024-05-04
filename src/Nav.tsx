import clsx from 'clsx';
import { ForwardedRef, forwardRef, useImperativeHandle, useState } from 'react';
import { PAGE } from './components/view/AdminPage';

export interface NavigationHandler {
  onSwitchCategory: (category: PAGE) => void;
}

export const Nav = forwardRef((_, ref: ForwardedRef<NavigationHandler>) => {
  const [currentCategory, setCurrentCategory] = useState<PAGE>(PAGE.USER);

  const navHandler: NavigationHandler = {
    onSwitchCategory: (category: PAGE) => {
      setCurrentCategory(category);
    },
  };

  useImperativeHandle(ref, () => navHandler);
  return (
    <>
      <div className='flex sticky top-0 bg-white h-20  shadow-sm justify-center pb-3'>
        <div
          className={clsx(
            'grid grid-cols-4',
            ' w-3/4 h-full',
            'justify-center content-end'
          )}
        >
          <span
            className={clsx(
              'text-mcyellow text-xl',
              ' font-bold',
              'text-start'
            )}
          >
            Mcdonald
          </span>
          <div className={clsx('col-span-2', 'flex justify-evenly')}>
            <span
              className={clsx({
                underline: currentCategory === PAGE.USER,
              })}
            >
              User
            </span>
            <span
              className={clsx({
                underline: currentCategory === PAGE.PRODUCT,
              })}
            >
              Product
            </span>
            <span
              className={clsx({
                underline: currentCategory === PAGE.ORDER,
              })}
            >
              Orders
            </span>
          </div>
        </div>
      </div>
    </>
  );
});

Nav.displayName = 'Nav';
