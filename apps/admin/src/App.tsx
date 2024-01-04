import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LOGIN_PAGE_PATH, LoginPage } from "./pages/LoginPage";
import { DASHBOARD_PAGE_PATH, DashboardPage } from "./pages/DashboardPage";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "react-query";
import Modal from "react-modal";

const queryClient = new QueryClient();

Modal.setAppElement("#root");

export const App: React.FC = () => {
	return (
		<BrowserRouter>
			<AuthProvider>
				<QueryClientProvider client={queryClient}>
					<Routes>
						<Route path={DASHBOARD_PAGE_PATH} element={<DashboardPage />} />
						<Route path={LOGIN_PAGE_PATH} element={<LoginPage />} />
					</Routes>
				</QueryClientProvider>
			</AuthProvider>
		</BrowserRouter>
	);
};
