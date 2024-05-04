import { ReactNode } from 'react';
import clsx from 'clsx';

type Prop = {
  children: ReactNode;
  color?: string;
};

export const McFrame = ({ children, color }: Prop) => {
  return (
    // <div className='flex flex-col max-w-screen-sm sm min-h-screen bg-mcred justify-between mx-auto p-20'>
    <div
      className={clsx(
        'flex flex-col max-w-screen-sm sm min-h-screen justify-between mx-auto p-20',
        {
          'bg-mcred': color == 'red',
          'bg-mcyellow': color == 'yellow',
        }
      )}
    >
      <div className='flex flex-col gap-2 bg-white rounded-3xl px-2 py-10 pt-2'>
        {children}
      </div>
    </div>
  );
};
