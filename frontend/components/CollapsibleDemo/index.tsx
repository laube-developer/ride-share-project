"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function AboveContent({children}:{children: React.ReactNode}){
    return <>{children}</>
}

export function CollapsibleDemo({children, aboveContent}: {children?:React.ReactNode, aboveContent?: React.ReactNode}) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex flex-col gap-2 w-full"
    >
        <CollapsibleTrigger asChild>
            {children}
        </CollapsibleTrigger>
      
        <CollapsibleContent className="flex flex-col gap-2">
            {aboveContent}
        </CollapsibleContent>
    </Collapsible>
  )
}
