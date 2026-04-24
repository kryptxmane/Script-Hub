import axios from "axios";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
    baseURL: API,
    timeout: 30000,
});

// Attach token if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("vx_token");
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const VYNTRIX_LOGO =
    "https://customer-assets.emergentagent.com/job_vyntrix-scripts/artifacts/qxh2q166_New%20Project.jpg";

export const UGPHONE_LOGO =
    "https://customer-assets.emergentagent.com/job_vyntrix-scripts/artifacts/51c6ss85_ug%20logo_transparant.png";

export const UGPHONE_URL =
    "https://www.ugphone.com/toc-page/promotion/#/r?partner_id=db5bfdfe-b35c-c6bb-9d4c-a6e19255ab35&invitation_code=vyntrx";
