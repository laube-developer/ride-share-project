package parametricos;

public class Cadastro <T> {
	
	private Object[] lista;
	private int tamanhoMax;
	private int tamanhoQnt=0;
	
	Cadastro(int tamanho){
		lista = new Object[tamanho];
			
		tamanhoMax = tamanho; 
	}

	public Object[] getList(){
		return lista;
	}
	
	public boolean adicionar(T t) {
		if(tamanhoQnt >= tamanhoMax) {
			System.out.println("Quantidade máxima atingida!");
			return false;
		}
		
		lista[tamanhoQnt] = t;
		
		tamanhoQnt++;
		
		return true;
	}
	
	
	public void remover(T t) {
		for(int i =0; i<tamanhoMax; i++) {
			if(lista[i] == t) {
				lista[i] = null;
				
				for(int j=i; j<tamanhoMax-1;j++) {
					lista[j] = lista[j+1];
				}
				for(int j=tamanhoMax-1; j>tamanhoQnt-1 ;j--) {
					lista[j] = null;
				}
				
				tamanhoQnt--;
				
				return;
			}
		}
		System.out.println("Nao foi encontrado o objeto a ser removido!");
		
	}
	
	public int getQuantidade() {
        return tamanhoQnt;
    }

}
