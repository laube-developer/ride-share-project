import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Motorista, Passageiro } from "@/types/types";
import { FaStar } from "react-icons/fa";

type UsuarioInfoProps = {
    usuario: Motorista | Passageiro;
    badge?: string;
    badgeSize?: "xl" | "lg";
    descricao?: string
}

export default function UsuarioInfo({ usuario, badge, badgeSize }: UsuarioInfoProps ) {
    return <div>
        <div className="flex justify-start gap-4">
            <Avatar className="w-10 h-10" >
                <AvatarImage src="https://github.com/laube-developer.png" />
            </Avatar>
            <div className="flex justify-between w-full">
                <div>
                    <h1 className="font-bold text-lg">{usuario.nome}</h1>
                    <span className="flex gap-2">
                        <FaStar />
                        {usuario.avaliacoes}
                    </span>
                </div>

                <Badge className={`bg-green-600 shadow-xl self-center ${badgeSize=="xl" ? "px-3" : "h-max"}`} hidden={!badge}>
                    <b className={badgeSize ? `text-${badgeSize}` : ""}>{badge}</b>
                </Badge>
            </div>

        </div>
    </div>
}