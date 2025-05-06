import React, { useState, useEffect } from 'react'
import { SITE_URL, isAuthenticated } from '../Auth/Define'
import axios from 'axios'

const PrivacyPolicy = () => {

    const [webSettings, setWebSettings] = useState(null);

    useEffect(() => {
        axios.post(`${SITE_URL}/api/get-api/policy.php`).then(resp => {
            setWebSettings(resp.data.privacy)
        })
    }, [])

    return (
        <div className='section'>
            <div className="card mt-2">
                <div className="card-body" dangerouslySetInnerHTML={{ __html: webSettings }} />
            </div>
        </div>
    )
}

export default PrivacyPolicy
