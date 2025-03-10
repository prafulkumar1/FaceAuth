import axios, { AxiosInstance, Method, AxiosRequestConfig } from 'axios';

// Base API URL
const API_BASE_URL = 'https://your-api.com/api';

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to set Authorization token dynamically
export const setAuthToken = (token: string | null): void => {
    if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers.common['Authorization'];
    }
};

// Generic API request function (Supports FormData)
export const apiRequest = async (
    method: Method,
    endpoint: string,
    data: Record<string, any> | FormData = {},
    params: Record<string, any> = {},
    customHeaders: Record<string, string> = {}
): Promise<any> => {
    try {
        const isFormData = data instanceof FormData;
        const headers = {
            ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {}),
            ...customHeaders, // Add custom headers like Authorization token
        };

        const response = await apiClient({
            method,
            url: endpoint,
            data,
            params,
            headers,
        });

        return response.data;
    } catch (error: any) {
        console.error('API Error:', error.response?.data || error.message);
        throw error.response?.data || { message: 'An error occurred' };
    }
};

export default apiClient;
