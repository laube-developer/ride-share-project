import { FaCar } from "react-icons/fa";

import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FaPerson } from "react-icons/fa6";

type MotoristaMarkerProps = {
    origem: { lat: number, lng: number, name?: string } | null;
}

export default function MotoristaMarker({ origem }: MotoristaMarkerProps) {
    const [isTruncated, setTruncated] = useState(false);

    return <AdvancedMarker position={origem} anchorTop="-50%" onClick={() => setTruncated(!isTruncated)}>

        <div className="relative">
            <FaCar className="w-10 h-10"/>
        </div>
    </AdvancedMarker>
}