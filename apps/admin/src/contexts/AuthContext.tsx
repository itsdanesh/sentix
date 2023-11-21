import { DASHBOARD_PAGE_PATH } from "@/pages/DashboardPage";
import { ANONYMOUS_PATHS, LOGIN_PAGE_PATH } from "@/pages/LoginPage";
import React, {
	PropsWithChildren,
	useState,
	createContext,
	useEffect,
	useContext,
} from "react";
import { useNavigate } from "react-router-dom";

type AuthenticatedAuthContext = {
	isAuthenticated: true;
	username: string;
};

type UnauthenticatedAuthContext = {
	isAuthenticated: false;
};

export type AuthContext = (
	| AuthenticatedAuthContext
	| UnauthenticatedAuthContext
) & {
	login: (loginOptions: {
		username: string;
		password: string;
	}) => Promise<void>;
	logout: () => Promise<void>;
};

const AuthContext = createContext({} as AuthContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
	// TODO replace with react query polling backend for session
	const navigate = useNavigate();

	const [user, setUser] = useState<
		AuthenticatedAuthContext | UnauthenticatedAuthContext
	>({
		isAuthenticated: true,
		username: "Sentix-Admin",
	});

	const isOnAnonymousPage = ANONYMOUS_PATHS.includes(location.pathname);

	const shouldDisplayContent = user.isAuthenticated || isOnAnonymousPage;

	useEffect(() => {
		if (!isOnAnonymousPage && !user.isAuthenticated) {
			location.href = LOGIN_PAGE_PATH;
		}
	}, [user]);

	const login: AuthContext["login"] = async () => {
		setUser({ isAuthenticated: true, username: "Sentix-Admin" });
		navigate(DASHBOARD_PAGE_PATH);
	};

	const logout: AuthContext["logout"] = async () => {
		setUser({ isAuthenticated: false });
		navigate(LOGIN_PAGE_PATH);
	};

	return (
		<AuthContext.Provider
			value={{
				...user,
				login,
				logout,
			}}
		>
			{shouldDisplayContent && children}
		</AuthContext.Provider>
	);
};
