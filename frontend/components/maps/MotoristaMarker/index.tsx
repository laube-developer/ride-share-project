import { FaCar } from "react-icons/fa";

import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FaPerson } from "react-icons/fa6";

type MotoristaMarkerProps = {
    origem: { lat: number, lng: number, name?: string } | null;
    showPulse?: boolean;
}

export default function MotoristaMarker({ origem, showPulse}: MotoristaMarkerProps) {
    const [isTruncated, setTruncated] = useState(false);

    return <AdvancedMarker position={origem} anchorTop="-50%" onClick={() => setTruncated(!isTruncated)} className="relative">
        {showPulse && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#fdc426] opacity-75"></span>}

        <div className="relative">
            <FaCar className="w-10 h-10"/>
        </div>
    </AdvancedMarker>
}