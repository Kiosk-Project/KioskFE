import { Ref, RefObject, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type UserRole = 'ADMIN' | 'USER';

type User = {
  id: number;
  userId: string;
  userName: string;
  userPw: string;
  userJoinDate: Date;
  userPoint: number;
  userRole: UserRole;
};

interface Message {
  status: string;
  code: string;
  message: string;
  result: User | string;
}

export const AdminUserEditPage = () => {
  const navigation = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const idRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const joinDateRef = useRef<HTMLInputElement | null>(null);
  const pointRef = useRef<HTMLInputElement | null>(null);
  const roleRef = useRef<HTMLInputElement | null>(null);

  const fetchUser = async (userId: string) => {
    console.log('uri', `http://localhost:8080/admin/user/${userId}`);
    const response = await fetch(`http://localhost:8080/admin/user/${userId}`);
    const data: Message = await response.json();
    const user: User = data.result as User;
    setUser(user);
  };

  const onUpdateUser = async () => {
    try {
      const updated: User = {
        id: user!.id,
        userId: idRef.current!.value,
        userPw: user!.userPw,
        userJoinDate: new Date(joinDateRef.current!.value),
        userName: nameRef.current!.value,
        userPoint: +pointRef.current!.value,
        userRole: user!.userRole,
      };
      console.log(updated);

      const response = await fetch(
        `http://localhost:8080/admin/user/${updated.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        }
      );

      const message: Message = await response.json();
      const status = message.result as string;
      if (status == 'USER_UPDATE_SUCCESS') {
        alert(message.message);
        window.location.reload();
      } else {
        alert(message.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    console.log(userId);
    fetchUser(userId!);
  }, []);

  return (
    <>
      <div className='flex flex-col w-full sm min-h-screen items-center'>
        <button
          className='border border-mcblack self-start rounded-lg px-5'
          onClick={() => navigation('/admin/user')}
        >
          목록
        </button>
        {user ? (
          <>
            <form>
              <div className='grid grid-cols-2 items-start border-t border-b text-start divide-y divide-x'>
                <span>User Id</span>
                <input type='text' defaultValue={user?.userId} ref={idRef} />
                <span>User Name</span>
                <div>
                  <input
                    type='text'
                    defaultValue={user?.userName}
                    ref={nameRef}
                  />
                </div>
                <span>User Join Date</span>
                <input
                  type='date'
                  defaultValue={user?.userJoinDate.toString()}
                  ref={joinDateRef}
                />
                <span>Point</span>
                <input
                  type='number'
                  defaultValue={user?.userPoint}
                  ref={pointRef}
                />
                <span>User Role</span>
                <input
                  type='text'
                  defaultValue={user?.userRole}
                  ref={roleRef}
                />
              </div>
            </form>
            <br></br>
            <button
              className='bg-mcblack rounded-lg px-5 text-white'
              onClick={() => onUpdateUser()}
            >
              수정완료
            </button>
          </>
        ) : (
          ''
        )}
      </div>
    </>
  );
};
