import { Button } from "../ui/button";

export default function InterfacePrincipal({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute bottom-0 md:top-0  md:bottom-auto left-0 md:w-max w-full flex flex-col z-20 gap-4 position-fixed">
      
      {children}
    </div>
  );
}