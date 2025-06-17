import LoginComponent from "../../components/Login";

export default function Login() {
    
    const DOMAINID = process.env.NEXT_PUBLIC_AUTODOMAIN_ID
    const DEVICEID = process.env.NEXT_AUTOPUBLIC_DEVICE_ID
    const DEVICETOKEN = process.env.NEXT_PUBLIC_AUTODEVICE_TOKEN
    
    return(
        <LoginComponent showCredentialsLogin={false} redirectPath={"/autopartsmarketplace"} domainId={DOMAINID} deviceId={DEVICEID} deviceToken={DEVICETOKEN}/>
    )
}