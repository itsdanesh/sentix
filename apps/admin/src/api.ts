import axios from "axios";

const httpClient = axios.create({
	baseURL: "http://127.0.0.1:8000/",
	headers: {
		"cache-control": "no-store",
	},
});

const modelStatuses = ["good", "train", "stale"] as const;

const sentiments = ["Positive", "Negative", "Neutral", "Irrelevant"] as const;

export type ModelStatus = (typeof modelStatuses)[number];

export type Sentiment = (typeof sentiments)[number];

export type SentimentEntry = {
	text: string;
	sentiment: Sentiment;
	id: number;
};

export type UserReport = {
	text: string;
	sentiment: Sentiment;
	id: number;
};

export const api = {
	modelStatuses,
	sentiments,
	getStatus: async (): Promise<ModelStatus> =>
		(await httpClient.get("/status")).data.status,
	startTraining: async () => await httpClient.post("/train"),
	revert: async () => await httpClient.get("/revert"),
	predict: async (text: string): Promise<Sentiment> => {
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
	approveReport: async (data: { text: string; sentiment: Sentiment }) =>
		await httpClient.put("/report", { ...data, accept: true }),
	getAccuracy: async (): Promise<[number, number]> =>
		(await httpClient.get("/accuracy")).data,
	explainText: async (text: string): Promise<string> => {
		const response = await httpClient.post("/explain", { text });
		return response.data;
	},
	deleteData: async (data: Pick<SentimentEntry, "sentiment" | "text">) => {
		try {
			await httpClient.delete("/data", {
				data,
			});

			return true;
		} catch (err) {
			return false;
		}
	},
	getData: async (matcher: string): Promise<SentimentEntry[]> => {
		try {
			const response = await httpClient.get("/data", {
				params: { text: matcher },
			});

			return response.data;
		} catch (err) {
			return [];
		}
	},
	addData: async (
		data: Pick<SentimentEntry, "sentiment" | "text">,
	): Promise<boolean> => {
		try {
			await httpClient.post("/data", data);

			return true;
		} catch (err) {
			return false;
		}
	},
};
