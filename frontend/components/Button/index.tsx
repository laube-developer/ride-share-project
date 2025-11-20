export default function Button({
    children,
    onClick,
    outline
}: Readonly<{
    children: React.ReactNode;
    onClick?: () => void;
    outline?: boolean;
}>) {
  return (
    <button
      onClick={onClick}
      className={`${outline ? 'border-2 border-black text-black ' : 'bg-black text-white'}  px-4 py-2 rounded-md hover:bg-gray-800 transition duration-100 cursor-pointer`}
    >
      {children}
    </button>
  );
}