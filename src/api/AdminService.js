import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5161/api",
  headers: { "Content-Type": "application/json" },
  timeout: 8000,
  withCredentials: false,
});

export const GenerateCoupons = async (content) => {
    const response = await api.post("/admin/coupons/generate", { content });
    return response.data;
};

export const GetAllCoupons = async () => {
  console.log("Fetching Coupons...");
  try {
    const response = await api.get("coupons/");
    return response.data; // أضفنا return هنا لكي تصل البيانات للـ component
  } catch (error) {
    console.error("Error fetching Coupons:", error);
    throw error;
  }
};
export const GetAllUsers = async () => {
  try {
    const response = await api.get("admin/users");
    return response.data; 
  } catch (err) {
    console.error("error fetching users ", err);
    throw err;   }
}

