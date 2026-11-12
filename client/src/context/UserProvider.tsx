import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import type { User, NewUser, LoginForm, UserUpdateForm } from "../types/user";
import { getUsers, 
    requestLogin, 
    createUser, 
    modifyUser,
    getMe,
    requestLogout 
} from "../api/users";

const UserProvider = ({children}: {children: React.ReactNode}) => {
    const [users, setUsers] = useState<User[]>([]); //빈 배열
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

    // 회원 목록 조회
    useEffect(() => {
        getUsers()   //함수 호출
            .then(setUsers)
            .catch(err => console.log("회원목록 조회 오류!", err));
    }, []);

    // 회원가입 함수
    const signup = async ( newUser: NewUser) => {
        await createUser(newUser); // DB 저장
        setUsers(await getUsers()); // 회원 배열에 저장
    }

    // 로그인 함수 - loginForm(username, password)
    const login = async (loginForm: LoginForm) => {
       try{
          const user = await requestLogin(loginForm);
          setCurrentUser(user);  //로그인한 유저를 저장
          return true;
       }catch{
          return false;
       }
    }

    // 새로고침해도 로그인 유지: 서버 세션에 로그인 정보가 있는지 물어봅니다.
    useEffect(() => {
        getMe()
            .then(setCurrentUser)               // 세션이 있으면 로그인 상태
            .catch(() => setCurrentUser(null))  // 401이면 로그아웃 상태
            .finally(() => setIsAuthLoading(false));
    }, []);

    // 로그아웃 함수: 서버의 세션을 지운 뒤 화면에서도 로그아웃
    const logout = async () => {
        await requestLogout();
        setCurrentUser(null);
    }

    //회원정보 변경 함수
    const updateUser = async (form: UserUpdateForm) => {
        if(!currentUser) return;
        const updateUser = await modifyUser(currentUser?.id, form);
        setCurrentUser(updateUser); // 헤더의 이름이 바로 변경됨
        setUsers(await getUsers()); //회원 배열에 저장
    }


    return(
        <UserContext.Provider value={{ 
            users, 
            signup,
            currentUser,
            login,
            logout,
            updateUser,
            isAuthLoading
         }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;