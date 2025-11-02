import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3001/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    },
});

export const login = async(email , password)=>{
    try {
        console.log('oiuy');
        
        const response = await API.post('/auth/login', {email , password})
        console.log(response);
        return response.data.data;
        
    } catch (error) {
        console.log(error);
        
    }
}

export const logout = async()=>{
    try {
        const response =  await  API.post('/auth/logout', {}, {withCredentials : true})
        return;
    } catch (error) {
        console.log(error);
        
    }
}
export const AdminDashboard = async ()=>{
    try {
        const response = await API.get('/user/admin/dashboard', {withCredentials: true})

        return response.data;
    } catch (error) {
        console.log(error);
        
    }
}

export const SuperAdminDashboard = async ()=>{
    try {
        const response = await API.get('/user/superAdmin/dashboard', {withCredentials : true})

        return response.data;
    } catch (error) {
        console.log(error);
        
    }
}