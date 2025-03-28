import axios from 'axios';

const formSubmitApi=async(userId,email,formData,token)=>{
    try {
        const response=await axios.post('/api/forms/submit',{ userId,email, formData },{
            headers:{
                Authorization:`Bearer ${token}`
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error submitting form: ',error);
        // return error.message;
        throw error;
    }
}

export default formSubmitApi;