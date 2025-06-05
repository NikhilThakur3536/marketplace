import LoginComponent from "@/app/components/Login";

export default function Login() {
    
    const DOMAINID = process.env.NEXT_PUBLIC_DOMAIN_ID
    const DEVICEID = process.env.NEXT_PUBLIC_DEVICE_ID 
    const DEVICETOKEN = process.env.NEXT_PUBLIC_DEVICE_TOKEN
    
    return(
        <LoginComponent showCredentialsLogin={false} redirectPath={"/foodmarketplace"} domainId={DOMAINID} deviceId={DEVICEID} deviceToken={DEVICETOKEN}/>
    )
}