package programa;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import entidades.CNH;
import entidades.Motorista;

public class RideDrive{
    public static void main(String[] args) {
    	DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d/MM/u");
    	
    		Motorista m = new Motorista(
    				"Rafael",
    				"rafaellaube11@gmail.com",
    				"Senha1234*",
    				"000.000.000-00",
    				"(61)99999-9999"
    				);
    				
    		LocalDate validade = LocalDate.now().plusDays(600);
    		CNH cnhRafael = new CNH("1549166654", validade);
    		
    		m.setCNH(cnhRafael);
    		
    		System.out.println(m.getCNH().getValidade().format(formatter));
    }
}