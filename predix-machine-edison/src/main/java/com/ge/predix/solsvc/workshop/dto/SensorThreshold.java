package com.ge.predix.solsvc.workshop.dto;

/*
 * SensorThreshold class to store all sensor threshold information from configuration
 */
public class SensorThreshold {

	private String sensorName;

	private float thresholdValue;

	private boolean thresholdAbove;
	
	private int eventSeverityCounts;
	
	public int getEventSeverityCounts() {
		return eventSeverityCounts;
	}

	public void setEventSeverityCounts(int eventSeverityCounts) {
		this.eventSeverityCounts = eventSeverityCounts;
	}

	private String eventMessage;

	public String getEventMessage() {
		return eventMessage;
	}

	public void setEventMessage(String eventMessage) {
		this.eventMessage = eventMessage;
	}

	public String getSensorName() {
		return sensorName;
	}

	public void setSensorName(String sensorName) {
		this.sensorName = sensorName;
	}

	public float getThresholdValue() {
		return thresholdValue;
	}

	public void setThresholdValue(float thresholdValue) {
		this.thresholdValue = thresholdValue;
	}

	public boolean isThresholdAbove() {
		return thresholdAbove;
	}

	public void setThresholdAbove(boolean thresholdAbove) {
		this.thresholdAbove = thresholdAbove;
	}

}
