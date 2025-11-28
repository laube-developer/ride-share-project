import Link from "next/link";
import { IconType } from "react-icons";

export default function Button({
    children,
    onClick,
    outline,
    className,
    icon: Icon,
    href,
    highlighted,
}: Readonly<{
    children: React.ReactNode;
    onClick?: () => void;
    outline?: boolean;
    className?: string;
    icon?: IconType;
    href?: string;
    highlighted?: boolean;
}>) {
  return (
    <Link
      onClick={onClick}
      className={`${className} ${(outline && highlighted) ? 'ring-2 ring-black ring-inset ring-inset-black text-black hover:bg-linear-to-br hover:from-[#fadf8e] hover:via-[#ffcb2c] hover:to-[#fdc426]' : ' bg-black text-white hover:bg-linear-to-br hover:from-slate-500 hover:to-black transition duration-150'} rounded-md px-4 py-2 transition duration-100 cursor-pointer relative`}
      href={href || ''}
    >
      
      {!outline && <span className="absolute w-[calc(100%+.3rem)] h-[calc(100%+.3rem)] -top-[.15rem] -left-[.15rem] rounded-md hover:ring-2 ring-black p-4 transition duration-150"></span> }
      {outline && <span className="absolute w-[100%] h-[100%] top-0 left-0 rounded-md hover:shadow-xl p-4 transition duration-150"></span> }
      
      {Icon && <Icon className="inline mr-2" />}
      {children}
    </Link>
  );
}