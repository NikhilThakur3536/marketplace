"use client"

import LoginComponent from "@/app/components/Login";
import { useEffect, useState } from "react";

export default function Login() {
    
    const DOMAINID = process.env.NEXT_PUBLIC_DOMAIN_ID
    const DEVICEID = process.env.NEXT_PUBLIC_DEVICE_ID 
    const DEVICETOKEN = process.env.NEXT_PUBLIC_DEVICE_TOKEN
    const [redirectUrl,setRedirectUrl] = useState("")
    
    useEffect(()=>{
        const redirect=localStorage.getItem("lastRestaurantUrl")
        setRedirectUrl(redirect)
    })
    
    return(
        <LoginComponent showCredentialsLogin={true} redirectPath={redirectUrl} domainId={DOMAINID} deviceId={DEVICEID} deviceToken={DEVICETOKEN}/>
    )
}