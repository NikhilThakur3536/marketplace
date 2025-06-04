import LoginComponent from "@/app/components/Login";

export default function Login() {
    
    const DOMAINID = process.env.NEXT_PUBLIC_ELECDOMAIN_ID
    const DEVICEID = process.env.NEXT_ELEPUBLIC_DEVICE_ID || "asdadaw1b2c3d4-e5f6-7j890-g1h2-i3j4k5l6m7n95"
    const DEVICETOKEN = process.env.NEXT_PUBLIC_ELEDEVICE_TOKEN
    
    return(
        <LoginComponent showCredentialsLogin={false} redirectPath={"/electronicsmarketplace"} domainId={DOMAINID} deviceId={DEVICEID} deviceToken={DEVICETOKEN}/>
    )
}