package com.predix.transform.hackathon.eg;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;


public class TestClient {

	final static String payload="{\"associatedMonitoredEntityUuid\":\"/assets/0810c85a-e867-4e78-8bf6-c7bf6e5ac9ff\",\"eventStart\":\"2016-07-24T11:22:00\",\"eventStartOffset\":-480,\"incident\":{\"firstOccurance\":\"2016-07-24T11:00:00\",\"incidentEventCount\":\"3\",\"lastOccurance\":\"2016-07-24T11:22:00\"},\"name\":\"LowTemp\",\"scanGroupData\":{\"BRG_1_VIB_1_1X_AMP\":\"59.19077386\",\"LUBE_OIL_TEMP\":\"38\",\"PUMP_SPEED\":\"6431.799805\"},\"severity\":3,\"storageReceiveTime\":\"2016-07-24T11:22:00\",\"tagsOfInterest\":[{\"uuid\":\"/tags/719c8bb8-26ff-4cc5-86b1-6a2ebf983136\",\"name\":\"ptransform_Tag_Temperature_Classification_name\"}]}";


	public static void main(String[] args) {
		System.out.println("TestClient.main()");
		HttpHeaders headers = new HttpHeaders();
		//headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
		headers.add(HttpHeaders.CONTENT_TYPE, "application/json");

		UriComponentsBuilder builder = UriComponentsBuilder
				.fromHttpUrl("https://creamteam-gateway.run.aws-usw02-pr.ice.predix.io/v1/alerts");
		HttpEntity<?> entity = new HttpEntity<>(payload, headers);
		RestTemplate rest = new RestTemplate();
		ResponseEntity<String> response = rest.exchange(builder.build().toUri(), HttpMethod.POST, entity, String.class);
		System.out.println("TestClient.main()"+response.getBody());

	}
}
