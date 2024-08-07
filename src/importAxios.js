import axios from "axios";

export const checkToken = async () => {
  const token = localStorage.getItem("token"); // Giả sử token được lưu trong localStorage

  if (!token) {
    return false;
  }

  try {
    const response = await axios.get(
      "http://localhost:3003/api/user/verify-token",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

const axiosInstance = axios.create({
  baseURL: "192.168.1.123:3003/api",
});

export const defaultHost = "http://192.168.1.123:3003/api";

// axiosInstance.interceptors.request.use((config) => {
//   config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
//   return config;
// });

// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response.status === 401) {
//       console.log("Error 401: Unauthorized");
//       localStorage.removeItem("token");
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
