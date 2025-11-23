import { intervalToDuration } from "date-fns";

export const formatarSegundos = (
  segundos: number
): { value: number | undefined; text: string } => {
  if (!segundos || segundos < 0) {
    return { value: undefined, text: "--" };
  }

  if (segundos <= 60) {
    return { value: 1, text: "min" };
  }

  const duracao = intervalToDuration({
    start: 0,
    end: segundos * 1000,
  });

  let { hours = 0, minutes = 0 } = duracao;

  if (hours > 0) {
    const textoHoras =
      minutes > 0 ? `${hours}h${minutes}` : `${hours}h`;

    return {
      value: undefined,
      text: textoHoras,
    };
  }

  return {
    value: minutes,
    text: "min",
  };
};
