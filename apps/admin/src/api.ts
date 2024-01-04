import axios from "axios";

const httpClient = axios.create({
	// TODO change this to a remote address when deployment setup
	baseURL: "http://localhost:8000/",
});

export type ModelStatus = "good" | "train" | "stale";

export type SentimentOutput =
	| "Positive"
	| "Neutral"
	| "Irrelevant"
	| "Negative";

export type UserReport = {
	text: string;
	sentiment: SentimentOutput;
	id: number;
};

export const api = {
	getStatus: async (): Promise<ModelStatus> =>
		(await httpClient.get("/status")).data.status,
	startTraining: async () => await httpClient.post("/train"),
	revert: async () => await httpClient.get("/revert"),
	predict: async (text: string): Promise<SentimentOutput> => {
		const res = await httpClient.post("/calc", { text });
		return res.data.sentiment;
	},
	getReports: async (): Promise<UserReport[]> => {
		const res = await httpClient.get("/report", {
			headers: {
				"Content-Type": "application/json",
			},
		});
		return res.data;
	},
	ignoreReport: async (data: { text: string }) =>
		await httpClient.put("/report", { ...data, accept: false }),
	approveReport: async (data: { text: string; sentiment: SentimentOutput }) =>
		await httpClient.put("/report", { ...data, accept: true }),
	getAccuracy: async (): Promise<[number, number]> =>
		(await httpClient.get("/accuracy")).data,
	explainText: async (text: string): Promise<string> => {
		const response = await httpClient.post("/explain", { text });
		return response.data;
	},
};
