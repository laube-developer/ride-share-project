package programa;

import entidades.Motorista;
import parametricos.Cadastro;

public class TesteParametrico {

	public static void main(String[] args) {
		Cadastro<Motorista> cadMoto = new Cadastro<Motorista>(5);
		
		cadMoto.adicionar(new Motorista(
				"Rafael",
				"rafaellaube11@gmail.com",
				"Senha1234",
				"0000000000",
				"61999999999"
		));
		
		cadMoto.adicionar(new Motorista(
				"Luiz",
				"luis_ocara@gmail.com",
				"Senha12345",
				"0000000000",
				"61999999910"
		));
		
		cadMoto.adicionar(new Motorista(
				"Marco",
				"marco@gmail.com",
				"Senha12",
				"0000000000",
				"61999999910"
		));
		
		System.out.println(cadMoto.buscarPorId(1));
		
		System.out.println(cadMoto.getQuantidade());
		
		cadMoto.remover(cadMoto.buscarPorId(1));
		
		System.out.println(cadMoto.buscarPorId(1));
		
		System.out.println(cadMoto.getQuantidade());
		
		System.out.println(cadMoto.indexOf(cadMoto.getList()[0]));

	}

}
