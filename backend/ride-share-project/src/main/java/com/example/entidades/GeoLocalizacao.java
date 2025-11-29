package com.example.entidades;

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
	
	private void setCoodenadas(double latitude, double longitude) {
		this.latitude = latitude;
		this.longitude = longitude;
	}
}
