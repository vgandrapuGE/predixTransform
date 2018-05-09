package com.predix.transform.hackathon.eg.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.predix.transform.hackathon.eg.utils.AuthToken;
import com.predix.transform.hackathon.eg.utils.SecurityHelper;

@RestController
@RequestMapping("/v1/alerts")
public class AlertsService {

	private static final Logger log = LoggerFactory.getLogger(AlertsService.class);
	
	@Autowired
	SecurityHelper security;
	
	@RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<String> saveAlerts(@RequestBody String payload) {
		AuthToken authToken = security.requestAuthToken("EBEF3763E5784244A217299524AF8F64_ingestor", "predixdecoded16");

		HttpHeaders headers = new HttpHeaders();
		headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
		headers.add(HttpHeaders.AUTHORIZATION, "bearer " + authToken.getAccessToken());
		headers.add(HttpHeaders.CONTENT_TYPE, "application/json");
		headers.add("tenant", "EBEF3763E5784244A217299524AF8F64");

		UriComponentsBuilder builder = UriComponentsBuilder
				.fromHttpUrl("https://apm-alarm-management-hackapm.run.aws-usw02-pr.ice.predix.io/v1/alarms");
		HttpEntity<?> entity = new HttpEntity<>(payload,headers);
		RestTemplate rest = new RestTemplate();
		ResponseEntity<String> response = rest.exchange(builder.build().toUri(), HttpMethod.POST, entity, String.class);
		return new ResponseEntity<>(response.getBody(), response.getStatusCode());
		
	}
}
