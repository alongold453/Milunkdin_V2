import { createContext, useState } from "react";

export const UserContext = createContext();

const UserProvider = ( props ) => {
  const [userData, setUserData] = useState({
    roles: []
  });

  return (
    <UserContext.Provider value={[ userData, setUserData ]}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider
