package com.ge.predix.solsvc.workshop.dto;

import java.util.Date;

/*
 * Incident class to generate body for APM Alerts REST call
 */
public class Incident {

	private Date firstOccurance;

	private Date lastOccurance;

	private String incidentEventCount;

	public Date getFirstOccurance() {
		return firstOccurance;
	}

	public void setFirstOccurance(Date firstOccurance) {
		this.firstOccurance = firstOccurance;
	}

	public Date getLastOccurance() {
		return lastOccurance;
	}

	public void setLastOccurance(Date lastOccurance) {
		this.lastOccurance = lastOccurance;
	}

	public String getIncidentEventCount() {
		return incidentEventCount;
	}

	public void setIncidentEventCount(String incidentEventCount) {
		this.incidentEventCount = incidentEventCount;
	}
	
}
