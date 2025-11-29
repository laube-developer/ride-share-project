"use client"
import { Dispatch, SetStateAction, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

type AvaliacaoEstrelasProps = {
    state: 1 | 2 | 3 | 4 | 5,
    setState: Dispatch<SetStateAction<1 | 2 | 3 | 4 | 5>>
}

export default function AvaliacaoEstrelas({state, setState}: AvaliacaoEstrelasProps) {

    return (
        <span className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map(i => {
                const classname = "text-[#fdc426] cursor-pointer";
                if (i <= state) {
                    return <FaStar
                        size={30}
                        key={i}
                        className={classname}
                        onClick={() => setState(i as (1 | 2 | 3 | 4 | 5))}
                    />
                }

                return (
                    <FaRegStar
                        size={30}
                        key={i}
                        className={classname}
                        onClick={() => setState(i as (1 | 2 | 3 | 4 | 5))}
                    />
                )

            })}
        </span>
    )
}