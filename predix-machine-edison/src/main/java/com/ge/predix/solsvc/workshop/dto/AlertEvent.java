package com.ge.predix.solsvc.workshop.dto;

import java.util.Date;
import java.util.Map;

/*
 * AlertEvent class to generate body for APM Alerts REST call
 */
public class AlertEvent {

	private String associatedMonitoredEntityUuid;

	private Date eventStart;

	private Incident incident;
	
	private String name;
	
	private int severity;
	
	private Date storageReceiveTime;
	
	private Map<String,String> scanGroupData;

	public String getAssociatedMonitoredEntityUuid() {
		return associatedMonitoredEntityUuid;
	}

	public void setAssociatedMonitoredEntityUuid(String associatedMonitoredEntityUuid) {
		this.associatedMonitoredEntityUuid = associatedMonitoredEntityUuid;
	}

	public Date getEventStart() {
		return eventStart;
	}

	public void setEventStart(Date eventStart) {
		this.eventStart = eventStart;
	}

	public Incident getIncident() {
		return incident;
	}

	public void setIncident(Incident incident) {
		this.incident = incident;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getSeverity() {
		return severity;
	}

	public void setSeverity(int severity) {
		this.severity = severity;
	}

	public Date getStorageReceiveTime() {
		return storageReceiveTime;
	}

	public void setStorageReceiveTime(Date storageReceiveTime) {
		this.storageReceiveTime = storageReceiveTime;
	}

	public Map<String, String> getScanGroupData() {
		return scanGroupData;
	}

	public void setScanGroupData(Map<String, String> scanGroupData) {
		this.scanGroupData = scanGroupData;
	}
	
}
