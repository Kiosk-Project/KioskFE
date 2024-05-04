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

export type Product = {
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

export const AdminUserListPage = () => {
  const { category } = useParams();
  const [data, setData] = useState<User[]>([]);

  const onDelete = async (userId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/user/${userId}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: 'BURGER_SET', page: 0 }),
        }
      );

      const json: Message = await response.json();
      const { status, message } = json;
      if (status == 'USER_DELETE_SUCCESS') {
        alert(message);
      } else {
        alert(message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      fetchUsers();
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost:8080/admin/user`);
      const data: Message = await response.json();
      const { status, message, result } = data;
      if (status == 'USER_LIST_FOUND_SUCCESS') {
        console.log('content : ', result);
        setUsers(result.content);
      } else {
        alert(message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    console.log('cat', category);
    fetch(`http://localhost:8080/admin/user`)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        console.log(json.result);
        console.log(json.result.content);
        setData(json.result.content);
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
        {data?.map((item) => (
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
