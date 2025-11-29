// Collapsible
"use client"

import * as React from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function CollapsibleDemo({ children, aboveContent }: { children?: React.ReactNode, aboveContent?: React.ReactNode }) {
  return (
    <Collapsible className="w-full flex flex-col gap-2">
      <CollapsibleContent
        className="
          px-2
          w-full
          overflow-hidden
          
          // Aplica a transição
          transition-[height] // Define o que será animado
          duration-300 // Define a velocidade
          ease-in-out // Define a curva
          
          // Aplica a nova classe simplificada
          collapsible-height-transition // <-- CLASSE ÚNICA APLICADA
        "
      >
        {aboveContent}
      </CollapsibleContent>

      <CollapsibleTrigger asChild className="cursor-pointer">
        {children}
      </CollapsibleTrigger>
    </Collapsible>
  )
}