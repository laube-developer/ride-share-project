package main.java.com.example.entidades;

public class GeoLocalizacao {
	private double latitude;
	private double longitude;
	
	public GeoLocalizacao(double latitude, double longitude) {
		setCoodenadas(latitude, longitude);
	}
	
	public double getLatitude() {
		return latitude;
	}
	
	public double getLongitude() {
		return longitude;
	}
	
	public void setCoodenadas(double latitude, double longitude) {
		this.latitude = latitude;
		this.longitude = longitude;
	}
}
