'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useSession } from 'next-auth/react';
import { type Author } from '@/lib/definitions';

// Define what the context will provide
interface UserContextType {
  user: Author | null;
  setUser: (user: Author | null) => void;
  loadingUser: boolean;
  fetchUserInfo: () => Promise<void>;
}

// Create the actual context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component: wraps your app and provides `user` and `setUser`
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Author | null>(null);
  const [ loadingUser, setLoadingUser ] = useState<boolean>(true);
  const { data: session} = useSession();

  // Function to fetch user info from the API
  const fetchUserInfo = async () => {
    setLoadingUser(true);
    if (!session?.user?.username) return;

    try {
      const res = await fetch('/api/user/get-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: session.user.username }),
      });

      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setLoadingUser(false);
      } else {
        setUser(null);
        setLoadingUser(false);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setUser(null);
      setLoadingUser(false);
    }
  };

  // Fetch user info on first load when session is ready
  useEffect(() => {
    if (session?.user?.username) {
      fetchUserInfo();
    }
  }, [session?.user?.username]);

  const contextValue = React.useMemo(
    () => ({ user, setUser, loadingUser, fetchUserInfo }),
    [user, setUser, loadingUser, fetchUserInfo]
  );

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access the context safely
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
