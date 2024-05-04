import { useReducer } from 'react';

export const useCount = (defaultVal: number = 0) => {
  const [count, updateCount] = useReducer(
    (pre: number, del: number) => pre + del,
    defaultVal
  );

  return [count, updateCount] as const;
};
