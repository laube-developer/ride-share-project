import { formatarSegundos } from "@/lib/formatTime";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

type DestinoMarkerProps = {
    destino: {lat: number, lng: number, name?: string} | null;
    duracao?: number;

}

export default function DestinoMarker({destino, duracao}:DestinoMarkerProps){
    const [isTruncated, setTruncated] = useState(false);

    const duration = formatarSegundos(duracao || 60);

    return <AdvancedMarker position={destino} anchorTop={'-50%'} onClick={() => setTruncated(!isTruncated)}>
        
            <div className="relative"> 
                <div className="w-4 h-4 bg-[#fdc426] border-5 border-black"></div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-[80vw]">
                   <div className="min-h-12 bg-white text-black rounded-md shadow-xl text-sm whitespace-nowrap grid grid-cols-[3rem_minmax(7rem,12rem)_1rem] pr-5 items-center gap-2 overflow-hidden">
                        <div className="w-12 min-h-12 p-2 h-full flex bg-[#fdc426] flex flex-col items-center justify-center gap-0 ">
                            <p className="text-lg">{duration.value}</p>
                            <small><b>{duration.text}</b></small>
                        </div>

                        <div className={`py-1 px-2 font-bold w-full flex items-center ${isTruncated ? 'truncate' : 'text-wrap'}`}>
                            {destino?.name ?? "Destino"}
                            
                        </div>

                        <MdOutlineKeyboardArrowRight size={20}/>

                    </div>
                </div>
            </div>
            </AdvancedMarker>
}