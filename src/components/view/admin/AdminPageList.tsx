import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

type UserRole = 'USER' | 'ADMIN';

type ProductCategory =
  | 'BURGER_SET'
  | 'BURGER_SINGLE'
  | 'HAPPY_MEAL'
  | 'DRINK'
  | 'DESSERT';

type User = {
  userId: string;
  userJoinDate: Date;
  userName: string;
  userPoint: number;
  userPw: string;
  userRole: UserRole;
};

export interface Product {
  productName: string;
  productPrice: number;
  productCode: string;
  productImgUrl: string;
  category?: ProductCategory;
}

export const AdminPageList = () => {
  const { category } = useParams();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    console.log('cat', category);

    fetch(`http://localhost:8080/admin/user`)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        setUsers(json.result.content);
      });
  }, [category]);

  return (
    <table className='min-w-full text-left text-sm font-light text-surface dark:text-white'>
      <thead className='border-b border-neutral-200 font-medium dark:border-white/10'>
        <tr>
          <th>userId</th>
          <th>userPw</th>
          <th>userName</th>
          <th>userPoint</th>
          <th>userRole</th>
          <th>userJoinDate</th>
        </tr>
      </thead>
      <tbody>
        {users?.map((item) => (
          <tr
            key={item.userId}
            className='border-b border-neutral-200 dark:border-white/10 h-20'
          >
            <td>{item.userId}</td>
            <td>{item.userPw}</td>
            <td>{item.userName}</td>
            <td>{item.userPoint}</td>
            <td>{item.userRole}</td>
            <td>{item.userJoinDate.toString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
