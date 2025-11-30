import { Spinner } from "../ui/spinner";

export default function LoadingPage(){
    return <div className="w-screen h-dvh flex items-center justify-center">
        <Spinner />
    </div>
}