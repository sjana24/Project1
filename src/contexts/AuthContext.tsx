// AuthContext.tsx
import React, { createContext, useCallback, useContext, useState } from "react";
import axios from "axios";

// Define the user shape
interface User {
  id:number;
  name:string;
  email: string;
  role: string;
}

// Define what the context provides
interface AuthType {
  user: User | null;
  checkSession: () => Promise<User | null>;
  logout: () => Promise<void>;
}

// Create the context (initial value is null)
const AuthContext = createContext<AuthType | undefined>(undefined);

// Hook for using the context
export const useAuth = (): AuthType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthUser provider");
  }
  return context;
};

// AuthUser provider
export const AuthUser: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const checkSession =useCallback( async (): Promise<User | null> => {
    try {
      const res = await axios.get("http://localhost/Git/Project1/Backend/getSession.php", {
        withCredentials: true,
      });

      if (res.data.loggedIn) {
        const sessionUser: User = {
          email: res.data.user_name,
          role: res.data.user_role,
          id:res.data.user_id,
          name:res.data.user_name,
        };
        setUser(sessionUser);
        return sessionUser;
      } else {
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error("Session check failed:", error);
      setUser(null);
      return null;
    }
  },[]);

    const logout = async (): Promise<void> => {
    try {
      await axios.get("http://localhost/Git/Project1/Backend/logout.php", {
        withCredentials: true,
      });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, checkSession,logout }}>
      {children}
    </AuthContext.Provider>
  );
};
