import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LOGIN_PAGE_PATH, LoginPage } from "./pages/LoginPage";
import { DASHBOARD_PAGE_PATH, DashboardPage } from "./pages/DashboardPage";
import { AuthProvider } from "./contexts/AuthContext";

export const App: React.FC = () => {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path={DASHBOARD_PAGE_PATH} element={<DashboardPage />} />
					<Route path={LOGIN_PAGE_PATH} element={<LoginPage />} />
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
};
