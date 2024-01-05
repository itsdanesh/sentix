import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/utils/cn";
import React, { ChangeEventHandler, MouseEventHandler, useState } from "react";

export const LOGIN_PAGE_PATH = "/login";

export const ANONYMOUS_PATHS = [LOGIN_PAGE_PATH];

export const LoginPage: React.FC = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { login } = useAuth();

	const handleChangeUsername: ChangeEventHandler<HTMLInputElement> = (e) => {
		setUsername(e.currentTarget.value);
	};

	const handleChangePassword: ChangeEventHandler<HTMLInputElement> = (e) => {
		setPassword(e.currentTarget.value);
	};

	const handleClickLogin: MouseEventHandler = async () => {
		await login({ username, password });
	};

	return (
		<div className={cn("h-screen w-screen flex items-center justify-center")}>
			<div
				className={cn(
					"flex flex-col p-8 gap-4",
					"bg-slate-900 rounded-3xl shadow-lg shadow-slate-900/30",
				)}
			>
				<Input
					placeholder="Username"
					value={username}
					onChange={handleChangeUsername}
				/>
				<Input
					type="password"
					placeholder="Password"
					value={password}
					onChange={handleChangePassword}
				/>
				<Button onClick={handleClickLogin}>Login</Button>
			</div>
		</div>
	);
};
