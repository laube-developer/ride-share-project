import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FaPerson } from "react-icons/fa6";

type PassageiroMarkerProps = {
    origem: {lat: number, lng: number, name?: string} | null;
}

export default function PassageiroMarker({origem}: PassageiroMarkerProps){
    const [isTruncated, setTruncated] = useState(false);

    return <AdvancedMarker position={origem} onClick={() => setTruncated(!isTruncated)}>
        
            <div className="relative"> 
                <FaPerson className="w-10 h-10"/>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-[80vw]">
                   <div className="min-h-12 bg-white text-black rounded-md shadow-xl text-sm whitespace-nowrap grid grid-cols-[3rem_minmax(0,_12rem)_1rem] pr-5 items-center gap-2 overflow-hidden">
                        <div className={`py-1 px-2 font-bold w-full flex items-center ${isTruncated ? 'truncate' : 'text-wrap'}`}>
                            {origem?.name ?? "Origem"}
                            
                        </div>

                        <MdOutlineKeyboardArrowRight size={20}/>

                    </div>
                </div>
            </div>
            </AdvancedMarker>
}