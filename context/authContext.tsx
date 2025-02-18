import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  isAuthen: boolean | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isAuthen, setIsAuthen] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    await auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        console.error("Login error:", error);
      });
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    await auth()
      .signOut()
      .catch((error) => {
        console.error("Login error:", error);
      });
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
      setIsAuthen(!!user);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthen, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be wrapped inside AuthContextProvider");
  }

  return value;
};
