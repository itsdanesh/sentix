import axios from "axios";

const httpClient = axios.create({
	// TODO change this to a remote address when deployment setup
	baseURL: "http://localhost:8000",
});

export type ModelStatus = "good" | "train" | "stale";

export type SentimentOutput =
	| "Positive"
	| "Neutral"
	| "Irrelevant"
	| "Negative";

export const api = {
	getStatus: async (): Promise<ModelStatus> =>
		(await httpClient.get("/status")).data.status,
	startTraining: async () => await httpClient.post("/train"),
	predict: async (text: string): Promise<SentimentOutput> => {
		const res = await httpClient.post("/calc", { text });
		return res.data.sentiment;
	},
	explainText: async (text: string): Promise<string> => {
		const response = await httpClient.post("/explain", { text });
		return response.data;
	  },
};
