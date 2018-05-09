/*
 * Copyright (c) 2016 General Electric Company. All rights reserved.
 *
 * The copyright to the computer software herein is the property of
 * General Electric Company. The software may be used and/or copied only
 * with the written permission of General Electric Company or in accordance
 * with the terms and conditions stipulated in the agreement/contract
 * under which the software has been supplied.
 */
 
package com.ge.predix.solsvc.workshop.processor;

import java.io.IOException;
import java.net.URI;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Dictionary;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.apache.http.Header;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.message.BasicHeader;
import org.codehaus.jackson.map.ObjectMapper;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.ge.dspmicro.hoover.api.processor.IProcessor;
import com.ge.dspmicro.hoover.api.processor.ProcessorException;
import com.ge.dspmicro.hoover.api.spillway.ITransferData;
import com.ge.dspmicro.httpclient.api.HttpResponseWrapper;
import com.ge.dspmicro.httpclient.api.IHttpClient;
import com.ge.dspmicro.httpclient.api.IHttpClientFactory;
import com.ge.dspmicro.machinegateway.types.ITransferable;
import com.ge.dspmicro.machinegateway.types.PDataCategory;
import com.ge.dspmicro.machinegateway.types.PDataValue;
import com.ge.dspmicro.machinegateway.types.PEnvelope;
import com.ge.dspmicro.machinegateway.types.PQuality;
import com.ge.dspmicro.machinegateway.types.PTimestamp;
import com.ge.dspmicro.security.admin.api.ISecurityUtils;
import com.ge.predix.solsvc.workshop.dto.AlertEvent;
import com.ge.predix.solsvc.workshop.dto.Incident;
import com.ge.predix.solsvc.workshop.dto.SensorThreshold;

import aQute.bnd.annotation.component.Activate;
import aQute.bnd.annotation.component.Component;
import aQute.bnd.annotation.component.ConfigurationPolicy;
import aQute.bnd.annotation.component.Deactivate;
import aQute.bnd.annotation.component.Reference;
import aQute.bnd.annotation.metatype.Configurable;
import aQute.bnd.annotation.metatype.Meta;

/**
 * This class provides a Processor implementation which will process the data as per configuration on the spillway.
 */
@Component(name = SampleProcessor.SERVICE_PID, provide =
{
    IProcessor.class
}, designate = SampleProcessor.Config.class, configurationPolicy = ConfigurationPolicy.require)
public class SampleProcessor
        implements IProcessor
{
	// Meta mapping for configuration properties
    @Meta.OCD(name = "%component.name", localization = "OSGI-INF/l10n/bundle")
    interface Config
    {
    	@Meta.AD(name = "%assetUUID.name", description = "%assetUUID.description", id = ASSET_UUID, required = false, deflt = "")
        String assetUUID();
    	
        @Meta.AD(name = "%sensorNames.name", description = "%sensorNames.description", id = SENSOR_NAMES, required = false, deflt = "")
        String sensorNames();

        @Meta.AD(name = "%sensorThresholdValues.name", description = "%sensorThresholdValues.description", id = SENSOR_THRESHOLD_VALUES, required = false, deflt = "")
        String sensorThresholdValues();

        @Meta.AD(name = "%thresholdDirection.name", description = "%thresholdDirection.description", id = THRESHOLD_DIRECTION, required = false, deflt = "")
        String thresholdDirection();

        @Meta.AD(name = "%sensorEventSeverityCount.name", description = "%sensorEventSeverityCount.description", id = SENSOR_EVENT_SEVERITY_COUNT, required = false, deflt = "")
        String sensorEventSeverityCount();
        
        @Meta.AD(name = "%sensorEventDescription.name", description = "%sensorEventDescription.description", id = SENSOR_EVENT_DESCRIPTION, required = false, deflt = "")
        String sensorEventDescription();

        @Meta.AD(name = "%thresholdTime.name", description = "%thresholdTime.description", id = THRESHOLD_TIME, required = false, deflt = "")
        String thresholdTime();
        
        @Meta.AD(name = "%apmAlertServiceUri.name", description = "%apmAlertServiceUri.description", id = APM_ALERT_SERVICE_URI, required = false, deflt = "")
        String apmAlertServiceUri();
    }
    
	/**
     * Service PID
     */
    public static final String                SERVICE_PID      			= "com.ge.predix.solsvc.workshop.adapter.events";                  //$NON-NLS-1$
    /** Key for Node Configuration File*/
    public static final String 				  NODE_CONFI_FILE 	  		= SERVICE_PID+"configFile";                                    //$NON-NLS-1$
    /** Key for Sensor Names*/
    public static final String 				  ASSET_UUID 	  			= SERVICE_PID + ".AssetUUID";                                    //$NON-NLS-1$
    /** Key for Sensor Names*/
    public static final String 				  SENSOR_NAMES 	  			= SERVICE_PID + ".SensorNames";                                    //$NON-NLS-1$
    /** Key for Sensor Threshold Values*/
    public static final String                SENSOR_THRESHOLD_VALUES   = SERVICE_PID + ".SensorThresholdValues";                             //$NON-NLS-1$
    /** Key for Threshold Direction (above or below)*/
    public static final String                THRESHOLD_DIRECTION       = SERVICE_PID + ".ThresholdDirection";                              //$NON-NLS-1$
    /** Key for Sensor Event Severity Count*/
    public static final String                SENSOR_EVENT_SEVERITY_COUNT = SERVICE_PID + ".SensorEventSeverityCount";                              //$NON-NLS-1$
    /** Key for Sensor Event Message*/
    public static final String                SENSOR_EVENT_DESCRIPTION  = SERVICE_PID + ".SensorEventDescription";                              //$NON-NLS-1$
    /** key for Threshold Time*/
    public static final String                THRESHOLD_TIME       		= SERVICE_PID + ".ThresholdTime";                                       //$NON-NLS-1$
    /** key for APM Alert URI*/
    public static final String                APM_ALERT_SERVICE_URI     = SERVICE_PID + ".ApmAlertServiceUri";                                       //$NON-NLS-1$

    // Predix Machine Http Client
	private IHttpClientFactory cloudHttpClientFactory;
	private IHttpClient cloudHttpClient;
	private ISecurityUtils securityUtils;
	
	// Processor name
	public static final String eventFilter = "eventFilter";

    /** Create logger to report errors, warning massages, and info messages (runtime Statistics) */
    protected static Logger _logger = LoggerFactory.getLogger(SampleProcessor.class);

    // Private variables
    private String assetUUID;
    private String apmAlertsUri;
	private java.util.Map<String,SensorThreshold> sensorsThresholds;
	private ConcurrentMap<String, AtomicInteger> eventThresholdCountMap;
	private Long eventAggregateTime;
	private Integer eventThresholdTime;
	private java.util.Map<String,Float> sensorLatestEventValue;
	
	// Constants
	private static final int HIGH_SEVERITY = 1;
	private static final int NORMAL_SEVERITY = 3;
	private static final String ASSET_URI_PREFIX = "/assets/";
	private static final float NAT_GAS_LHV = 8200;
	private static final String HEATRATE_TAG = "TAG_GRACIA_HEATRATE";
	
	// For APM date formatting
	private DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
	private ObjectMapper mapper = new ObjectMapper();

    /**
     * @param ctx context of the bundle.
     */
    @Activate
    public void activate(ComponentContext ctx)
    {
        if ( _logger.isDebugEnabled() )
        {
            _logger.debug("Spillway service activated."); //$NON-NLS-1$
        }
        
        // Get configuration
        mapper.setDateFormat(df);
		this.securityUtils.bindConfigurationToBundle(SERVICE_PID, ctx.getBundleContext().getBundle().getLocation());
		Dictionary<?, ?> props = ctx.getProperties();
		Config config = Configurable.createConfigurable(Config.class, props);
		
		// Read from config file and process array config values
		assetUUID = config.assetUUID().toString();
		apmAlertsUri = config.apmAlertServiceUri().toString();
        String[] sensorNames = config.sensorNames().toString().split(",");
		String[] sensorThresholdValues = config.sensorThresholdValues().toString().split(",");
		String[] sensorThresholdDirections = config.thresholdDirection().toString().split(",");
		String[] sensorEventSeverityCounts = config.sensorEventSeverityCount().toString().split(",");
		String[] sensorEventDescription = config.sensorEventDescription().toString().split(",");
		eventThresholdTime = Integer.parseInt(config.thresholdTime())*1000;
		
		// Initialize variables
		sensorsThresholds = new HashMap<String,SensorThreshold>();
		eventThresholdCountMap = new ConcurrentHashMap<String,AtomicInteger>();
		eventAggregateTime = System.currentTimeMillis();
		sensorLatestEventValue = new HashMap<String,Float>();
		
		// Create sensor threshold objects based on config 
		for(int idx = 0; idx < sensorNames.length; idx++) {
			SensorThreshold sensor = new SensorThreshold();
			sensor.setSensorName(sensorNames[idx]);
			sensor.setThresholdValue(Float.parseFloat(sensorThresholdValues[idx]));
			sensor.setEventSeverityCounts(Integer.parseInt(sensorEventSeverityCounts[idx]));
			if (Integer.parseInt(sensorThresholdDirections[idx]) != 0) {
				sensor.setThresholdAbove(true);	
			} else {
				sensor.setThresholdAbove(false);
			}
			sensor.setEventMessage(sensorEventDescription[idx]);
			sensorsThresholds.put(sensorNames[idx],sensor);
			eventThresholdCountMap.put(sensorNames[idx],new AtomicInteger(0));
			sensorLatestEventValue.put(sensorNames[idx], null);
		}
    }
    

    /**
     * @param ctx context of the bundle.
     */
    @Deactivate
    public void deactivate(ComponentContext ctx)
    {
        if ( _logger.isDebugEnabled() )
        {
            _logger.debug("Spillway service deactivated."); //$NON-NLS-1$
        }
    }
 
	@Reference
	public void setSecurityUtils(ISecurityUtils securityUtils) {
		this.securityUtils = securityUtils;
	}

	/* Dependency injection for IHttpClientFactory */
	@Reference(type = '?')
	public void setPredixCloudHttpClientFactory(IHttpClientFactory clientFactory) {
		this.cloudHttpClientFactory = clientFactory;
		this.cloudHttpClient = this.cloudHttpClientFactory.createHttpClient();
	}

	/* Clear the injected IHttpClientFactory */
	public void unsetPredixCloudHttpClientFactory(IHttpClientFactory clientFactory) {
		if (this.cloudHttpClientFactory == clientFactory) {
			this.cloudHttpClientFactory.deleteHttpClient(this.cloudHttpClient);
			this.cloudHttpClient = null;
			this.cloudHttpClientFactory = null;
		}
	}
	
	/*
	 * Processor logic
	 */
    @Override
    public void processValues(String processType, List<ITransferable> values, ITransferData transferData)
            throws ProcessorException
    {    	
    	SensorThreshold sensThreshold;
    	Float powerValue = null;
    	Float fuelValue = null;
    	PTimestamp hrTimestamp = null;
    	
		switch (processType) {
			case eventFilter:
				_logger.debug("time diff: {}", System.currentTimeMillis()-eventAggregateTime);
				
				// If event threshold time has been reached, send event to APM Alerts
				if (System.currentTimeMillis()-eventAggregateTime > eventThresholdTime) {
					Map<String,String> scanGroupMap = new HashMap<String,String>();
					
					// Loop through each sensor in threshold map
					for (Entry<String, AtomicInteger> eventThresholdEntry : eventThresholdCountMap.entrySet()) {
						String sensorName = eventThresholdEntry.getKey();
						Integer eventCount = eventThresholdEntry.getValue().get();
						Long startTime = eventAggregateTime;
						
						// Don't send if no events occurred
						if (eventCount.equals(0)) {
							continue;
						}
						
						// New thread to send alert to APM via HTTP
						Thread apmAlarmThread = new Thread(new Runnable() {
							@Override
							public void run() {
								AlertEvent alertEvent = new AlertEvent();
								alertEvent.setAssociatedMonitoredEntityUuid(ASSET_URI_PREFIX+assetUUID);
								Calendar calendar = Calendar.getInstance();
								calendar.setTimeInMillis(startTime);
								alertEvent.setEventStart(calendar.getTime());
								Incident incident = new Incident();
								incident.setFirstOccurance(calendar.getTime());
								incident.setIncidentEventCount(Integer.toString(eventCount));
								incident.setLastOccurance(Calendar.getInstance().getTime());
								alertEvent.setIncident(incident);
								alertEvent.setName(sensorsThresholds.get(sensorName).getEventMessage());
								scanGroupMap.put(sensorName,Float.toString(sensorLatestEventValue.get(sensorName)));
								alertEvent.setScanGroupData(scanGroupMap);
								alertEvent.setStorageReceiveTime(Calendar.getInstance().getTime());
								if (eventCount >= sensorsThresholds.get(sensorName).getEventSeverityCounts()) {
									_logger.debug("Sending alert to APM with high severity for sensor: {}, count: {}", sensorName, eventCount);
									alertEvent.setSeverity(HIGH_SEVERITY);
								} else {
									alertEvent.setSeverity(NORMAL_SEVERITY);
									_logger.debug("Sending alert to APM for sensor: {}, count: {}", sensorName, eventCount);
								}
								try {
									// POST event
									SampleProcessor.this.postToApmAlerts(mapper.writer().writeValueAsString(alertEvent));
								} catch (IOException e) {
									_logger.error("ERROR WITH THREAD: " + e.getMessage());
								}
							}
						});
						// Call the thread
						apmAlarmThread.start();
						// Reset event count values
						eventThresholdCountMap.get(sensorName).updateAndGet(x -> 0);
						_logger.debug("Resetting event count for sensor: {}, count: {}", sensorName, eventThresholdCountMap.get(sensorName).get());
					}
					// Update event time
					eventAggregateTime = System.currentTimeMillis();
				}
				
				// Read all sensor values
		    	for (ITransferable value : values) {
					PDataValue subData = (PDataValue) value;
					Float dataValue = (Float) subData.getValue().getValue();
					
					// Store power and fuel flow values for heatrate calculation
					if (subData.getNodeName().equals("TAG_GRACIA_POWER")) {
						powerValue = dataValue;
						hrTimestamp = subData.getTimestamp();
					} else if (subData.getNodeName().equals("TAG_GRACIA_FUELFLOW")) {
						fuelValue = dataValue;
					}
					
					// Check threshold values for each sensor in config
					sensThreshold = sensorsThresholds.get(subData.getNodeName());
					try {
						if (sensThreshold != null) {
							if ((sensThreshold.isThresholdAbove() && (dataValue > sensThreshold.getThresholdValue()))
									|| (!sensThreshold.isThresholdAbove() && (dataValue < sensThreshold.getThresholdValue()))) {
								_logger.debug("Created Event for Sensor: {} - {}, Value: {} - {}", subData.getNodeName(), sensThreshold.getSensorName(), dataValue, sensThreshold.getThresholdValue());
								
								eventThresholdCountMap.get(subData.getNodeName()).incrementAndGet();
								sensorLatestEventValue.put(subData.getNodeName(), dataValue);
							}
						}
					} catch (Exception e) {
						_logger.error("No such sensor " + subData.getNodeName() + " in sensor threshold list. " + e.getMessage());
					}
				}
		    	
		    	// Calculate heatrate value only when fuel value and power value both exist
		    	_logger.debug("Power Value: {}, Fuel Value: {}, hrTimestamp: {}", powerValue, fuelValue, hrTimestamp.getTimeMilliseconds());
		    	if (powerValue != null && fuelValue != null && hrTimestamp != null) {
		    		PDataValue heatRateData = new PDataValue();
		    		heatRateData.setNodeName(HEATRATE_TAG);
		    		heatRateData.setQuality(PQuality.getPQualityFromIntegerMask(0));
		    		heatRateData.setCategory(PDataCategory.REAL);
		    		// Heatrate calculation
		    		Float hrFloat = (Float) (fuelValue * NAT_GAS_LHV) / (powerValue + 1); // +1 to avoid division by 0
		    		PEnvelope hrVal = new PEnvelope();
		    		hrVal.setValue(hrFloat);
		    		heatRateData.setValue(hrVal);
		    		heatRateData.setTimestamp(hrTimestamp);
		    		
					sensThreshold = sensorsThresholds.get(HEATRATE_TAG);
	
					// Create event if threshold config exists and criteria is met 
					if (sensThreshold != null 
							&& (sensThreshold.isThresholdAbove() && (hrFloat > sensThreshold.getThresholdValue()))
							|| (!sensThreshold.isThresholdAbove() && (hrFloat < sensThreshold.getThresholdValue()))) {
						_logger.debug("Created Event for Sensor: {} - {}, Value: {} - {}", HEATRATE_TAG, sensThreshold.getSensorName(), hrFloat, sensThreshold.getThresholdValue());
						
						eventThresholdCountMap.get(HEATRATE_TAG).incrementAndGet();
						sensorLatestEventValue.put(HEATRATE_TAG, hrFloat);
					}
					
		    		values.add(heatRateData);
		    	}
		    	break;
			default:
				break;
		}
    	_logger.debug("VALUES :" +values.toString());
    	// Send data to Predix Timeseries
		transferData.transferData(values);
    }
    
    /*
     * Method to send alert to APM via HTTP
     */
    private void postToApmAlerts(String body) {
	    try {
			// Sending a GET request to the test server.
			_logger.debug("Alerts POST body: {}", body);
			
			URI uri = new URI(apmAlertsUri);

			Header[] headers = {
				    new BasicHeader("Content-Type", "application/json")
				};
			
			HttpResponseWrapper httpResponse = this.cloudHttpClient.post(uri, new StringEntity(body, ContentType.APPLICATION_JSON), headers);
			
			if (httpResponse.getStatusCode() >= 200 && httpResponse.getStatusCode() < 300) {
				_logger.debug("Alerts POST success: {}", httpResponse.getContent());
				return;
			} else {
				_logger.error("Alerts POST failed. Code: {}, Body: {}", httpResponse.getStatusCode(), httpResponse.getContent());
			}
			
		} catch (Exception ee) {
			_logger.error("Alerts POST failed with exception.", ee);
		}
    }
}
