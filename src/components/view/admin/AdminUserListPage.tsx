import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '../../util/Pagination';

type UserRole = 'USER' | 'ADMIN';

type ProductCategory =
  | 'BURGER_SET'
  | 'BURGER_SINGLE'
  | 'HAPPY_MEAL'
  | 'DRINK'
  | 'DESSERT';

type User = {
  id: number;
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
  const [users, setUsers] = useState<User[]>([]);
  const navigation = useNavigate();
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  // const [sort, setSort] = useState<string>('productName');
  const [totalPages, setTotalPages] = useState<number>(0);

  const onDelete = async (userId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/user/${userId}`,
        {
          method: 'DELETE',
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
      window.location.reload();
    }
  };

  const onEdit = (id: number) => {
    navigation(`${id}`);
  };

  const onSetPage = (page: number) => {
    setPage(page);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/user?page=${page}`
      );
      const data: Message = await response.json();
      const { status, message, result } = data;
      if (status == 'USER_LIST_FOUND_SUCCESS') {
        console.log('content : ', result);
        setUsers(result.content);
        setTotalPages(result.totalPages);
        setTotal(result.totalElements);
      } else {
        alert(message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  return (
    <>
      <div className='grid grid-cols-3 items-end mb-5'>
        <div className='col-start-2'>
          <h3 className='font-semibold text-3xl pb-10'>User</h3>
        </div>
        <div className='col-start-3 text-right mb-3'>
          <p>
            총 <span className='font-semibold text-red-500'>{total}</span>건
          </p>
        </div>
      </div>
      <div className=' min-w-full'>
        <table className='text-left text-sm font-light text-surface dark:text-white'>
          <thead className='border-b border-neutral-200 font-medium dark:border-white/10'>
            <tr className='min-w-full '>
              <th className=' w-1/12 text-center pb-3'>#</th>
              <th className=' w-2/12 text-center pb-3'>ID</th>
              <th className=' w-1/12 text-center pb-3'>PASSWORD</th>
              <th className=' w-2/12 text-center pb-3'>NAME</th>
              <th className=' w-1/12 text-center pb-3'>POINT</th>
              <th className=' w-1/12 text-center pb-3'>ROLE</th>
              <th className=' w-2/12 text-center pb-3'>JOIN</th>
              <th className=' w-1/12 text-center pb-3'>수정</th>
            </tr>
          </thead>
          <tbody className=' overflow-y-scroll'>
            {users?.map((item, index) => (
              <tr
                key={item.userId}
                className='border-b border-neutral-200 dark:border-white/10 h-16 text-center items-center even:bg-stone-50'
              >
                <td>{index + 1}</td>
                <td>{item.userId}</td>
                <td>
                  <div className='max-w-20 truncate whitespace-nowrap'>
                    {item.userPw}
                  </div>
                </td>
                <td>
                  <div className='truncate'>{item.userName}</div>
                </td>
                <td>
                  <div className='truncate'>{item.userPoint}</div>
                </td>
                <td>{item.userRole}</td>
                <td>{item.userJoinDate.toString()}</td>
                <td>
                  <div className='flex flex-col gap-1 min-h-full content-center'>
                    <button
                      className='border border-stone-300 bg-white  rounded-lg'
                      onClick={() => onEdit(item.id)}
                    >
                      수정
                    </button>
                    <button
                      className='border border-stone-300 bg-white rounded-lg'
                      onClick={() => onDelete(item.userId)}
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <br></br>
          <div className='flex justify-center'>
            <Pagination
              total={totalPages}
              page={page}
              setPage={onSetPage}
              limit={5}
            />
          </div>
        </div>
      </div>
    </>
  );
};
