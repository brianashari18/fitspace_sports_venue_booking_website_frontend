import axios from 'axios';
import {Navigate, Outlet} from "react-router-dom";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(baseUrl + '/users/register', userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error during user registration:', error.response || error.message);
        throw new Error(
            error.response?.data?.message || 'Failed to register user. Please try again later.'
        );
    }
};

export const login = async (userData) => {
    try {
        const response = await axios.post(baseUrl + '/users/login',userData , {
            headers :{
                'Content-Type' : 'application/json',
            }
        });

        // console.log("Login response data:", response); // debugging
        // const token = response.data.token;
        localStorage.setItem("token", response.data.token);
        // localStorage.setItem("expired_at",response.data.data.expired_at);

        const expiredAt = Date.now() + 3600 * 1000; // 1 jam dari sekarang
        console.log(expiredAt)
        localStorage.setItem("expired_at", expiredAt);

        return response.data
    } catch (error){
        console.error('Error during Login ', error.response || error.message);
        throw new Error(
            error.response?.data?.message || 'Failed to login. Please try again later.')
    }
}

export const forgotPassword = async (email) => {
    console.log(`EMAIL: ${email}`);
    try {
        return await axios.post(baseUrl + "/auth/forgot-password",email, {
            headers :{
                'Content-Type': 'application/json'
            }
        })

    }catch (error){
        console.error(error.response || error.message);
        throw new Error(
            error.response?.data?.message )
    }
}

export const validateOtp = async (otp) => {
    try {
        const res = await axios.post(baseUrl + '/auth/validate-otp',otp ,{
            headers :{
                'Content-Type': 'application/json'
            }
        })
        localStorage.setItem("token",res.data.data.token)
    }catch (error) {
        console.error(error.response || error.message);
        throw new Error(
            error.response?.data?.message )
    }
}

export const resetPassword = async (userData) => {
    try {
        const token = localStorage.getItem("token");
        await axios.patch(baseUrl + '/auth/reset-password',userData ,{
            headers :{
                'Content-Type': 'application/json',
                'Reset-Token' : `Bearer ${token}`
            }
        })
        localStorage.removeItem("token")
    }catch (error) {
        console.error(error.response || error.message);
        throw new Error(
            error.response?.data?.message )
    }
}

export const changePassword = async (userData, userId) => {
    const token = localStorage.getItem("token");
    try {
        const response = axios.patch(baseUrl + `/users/changePassword/${userId}`, userData ,{
            headers :{
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        })

        console.log(`RESPONSE ${JSON.stringify(response)}`);
        return response;
    }catch (error) {
        console.error(error.response || error.message);
        throw new Error(
            error.response?.data?.message )
    }
}