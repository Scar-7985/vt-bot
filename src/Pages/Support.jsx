import React, { useEffect, useState } from 'react';
import { SITE_URL, isAuthenticated } from '../Auth/Define';
import axios from 'axios';

const Support = () => {

    const [supportData, setSupportData] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            axios.post(`${SITE_URL}/api/get-api/support.php`).then(resp => {
                setSupportData(resp.data);
            })
        }
    })


    return (
        <div>
            Support
        </div>
    )
}

export default Support
