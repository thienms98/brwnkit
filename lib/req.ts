import axios from "axios";

const instance = axios.create({
  baseURL: "/api"
});

instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401 && !err.config._retry) {
      err.config._retry = true; // tránh loop vô tận nếu refresh cũng fail

      try {
        await axios.post("/api/refresh"); // cookie tự gửi, server rotate, set cookie mới
        return axios(err.config); // retry request gốc với cookie mới
      } catch {
        window.location.href = "/login"; // refresh fail → về login
        return Promise.reject(err);
      }
    }
    return Promise.reject(err);
  }
);

export default instance;
