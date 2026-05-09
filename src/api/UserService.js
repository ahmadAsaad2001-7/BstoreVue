
import api from './axios.js';

// Export api for components that need it directly
export { api };

export const Login = async (email, password) => {
  console.log("Attempting login with email:", email);
  try {
    const response = await api.post("/user/login", { email, password });
    console.log("Login successful:", response.data);
    
    // Store user data if returned (token handled by cookies via withCredentials)
    if (response.data.user) {
      localStorage.setItem('authUser', JSON.stringify(response.data.user));
    }
    
    return response.data; 
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }   
};


export const Register = async (userData) => {
  console.log("Attempting registration:", userData.email);
  try {
    const response = await api.post("/user/register", {
      email: userData.email,
      password: userData.password,
      userName: userData.userName?.trim() || undefined,
      Name: userData.Name?.trim() || undefined,
      imageUrl: userData.imageUrl?.trim() || undefined
    });
    console.log("Registration successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error.response?.data || error.message);
    throw error; 
  }
};


export const applyForVendor = async () => {
  console.log("Applying for vendor role...");
  try {
   
    const response = await api.post("/user/apply-for-vendor"); 
    console.log("Application submitted:", response.data);
    return response.data; 
  } catch (error) {
    console.error("Failed to apply for vendor:", error.response?.data || error.message);
    throw error;
  }
};

export const Logout = async () => {
  try {
    await api.post("/user/logout");
  } catch (error) {
    console.error("Logout API call failed:", error);
  } finally {
    // Clear local storage on logout
    localStorage.removeItem('authUser');
  }
};


export const IsAuthenticated = async () => {
  try {
    const response = await api.get("/user/check-auth");
    return {
      authenticated: true,
      user: response.data.user 
    };
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('authUser');
      return { authenticated: false, user: null };
    }
    console.error("Auth check failed:", error.message);
    return { authenticated: false, user: null };
  }
};


export const ProfileInfo = async (id) => {
  try {
    const response = await api.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user info:", error.response?.data || error.message);
    throw error;
  }
};


export const myInfo = async () => {
  try {
    const response = await api.get("/user/myinfo");
    return response.data; 
  } catch (error) {
    console.error("Failed to fetch my info:", error.response?.data || error.message);
    if (error.response?.status === 401 || error.response?.status === 403) {
      window.location.href = '/#/login';
    }
    throw error;
  }   
};
export const GetNearestVendors =async()=>{
  try{
  const Vendors=await api.get("/user/GetNearbyVendors")
  return Vendors.data;
}catch(error){
  console.error("failed to fetch the vendors,", error.response?.data||error.message);
  if(error.response?.status===401||error.response?.status===403){
    window.location.href='/login';
  }
  throw error;
}
}

export const GetNearByUsers=async()=>{
  try{
  const Users=await api.get("/user/getNearbyUsers")
  return Users.data;
}catch(err)
{
  throw err;

}}
export const search = async (content) => {
  try {

    const response = await api.post("/user/GetSearchResults", { req: content }); 
    return response.data;
  } catch (error) {
    console.error("Search failed:", error.response?.data || error.message);
    throw error;
  }
};
export const getCurrentUserId = async () => {
  try {
    const userData = await myInfo();
    return userData?.id;
  } catch {
    return null;
  }
};
