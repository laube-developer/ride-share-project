import { Button } from "../ui/button";

export default function InterfacePrincipal({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute top-0 left-0 right-0 w-full h-dvh flex flex-col z-20 gap-4 position-fixed">
      
      {children}
    </div>
  );
}