import * as axiosService from "./axiosService"; 

export const RegisterUser = async (payload) => {
    try {
        const response = await axiosService.Post("/Auth/register-user", payload);
        return response.data;
    } catch (error) {

        console.error("RegisterUser error:", error);
        throw error;
    }
};


export const LoginUser = async (payload) => {
    try {
        const response = await axiosService.Post("/Auth/login", payload)
        return response.data
    }
    catch (err) {
        console.log(err)
    }
}

export const sendOtp = async (phoneNumber) => {
    try {
        const response = await axiosService.Post("/Auth/send-otp", { phoneNumber });
        return response.data;
    } catch (err) {
        console.error("Send OTP failed:", err.response?.data || err.message);
        throw err;
    }
};


export const verifyOtp = async (phoneNumber, otp) => {
    try {
        const response = await axiosService.Post("/Auth/verify-otp", { phoneNumber, otp });
        return response.data;
    } catch (err) {
        console.error("Verify OTP failed:", err.response?.data || err.message);
        throw err;
    }
};