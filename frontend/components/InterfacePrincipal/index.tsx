import { Button } from "../ui/button";

export default function InterfacePrincipal({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute bottom-2 md:top-2 md:bottom-auto left-0 right-0 w-full flex flex-col z-20 gap-4 position-fixed">
      
      {children}
    </div>
  );
}