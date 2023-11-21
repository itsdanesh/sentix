import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/utils/cn";
import React, { MouseEventHandler } from "react";
import { Button } from "./Button";

export const headerHeight = 70;

export const Header: React.FC = () => {
	const auth = useAuth();

	const handleClickLogout: MouseEventHandler = async () => {
		await auth.logout();
	};

	return (
		<header
			className={cn(
				"from-slate-800 to-slate-900 bg-gradient-to-br border-b border-b-slate-500/50",
			)}
			style={{ height: headerHeight }}
		>
			<div className={cn("flex items-center container h-full mx-auto px-8")}>
				<span>
					Hello,{" "}
					<span className="font-medium">
						{auth.isAuthenticated && auth.username}
					</span>
				</span>
				<div className="flex-grow" />
				<Button onClick={handleClickLogout}>Log out</Button>
			</div>
		</header>
	);
};
