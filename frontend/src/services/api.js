import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

export const googleAuth = (code) =>
  api.get(`/auth/google`, {
    params: { code },
  });

export const fetchEmails = () => api.get("/emails/fetch");

export const getAllEmails = () => api.get("/emails/all");

export const getSpamEmails = () => api.get("/emails/spam");

export const getImportantEmails = () => api.get("/emails/important");

// ✅ Added this for Remaining Emails page
export const getRemainingEmails = () => api.get("/emails/remaining");

export const getEmailsByScenario = (id) => api.get(`/emails/scenario/${id}`);

export const getAllScenarios = () => api.get("/scenarios");

export const createScenario = (data) => api.post("/scenarios/create", data);

export default api;