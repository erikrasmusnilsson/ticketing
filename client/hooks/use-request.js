import axios from 'axios';
import { useState } from 'react'; 

export default ({
    url,
    method,
    body,
    onSuccess
 }) => {
    const [errors, setErrors] = useState([]);

    const doRequest = async () => {
        try {
            const response = await axios[method](url, body);

            if (onSuccess) {
                onSuccess(response.data);
            }

            return response.data; 
        } catch (err) {
            setErrors(err.response.data);
        }
    };

    return [doRequest, errors];
}