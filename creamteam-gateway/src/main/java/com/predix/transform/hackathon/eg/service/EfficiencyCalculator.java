package com.predix.transform.hackathon.eg.service;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.AbstractMap.SimpleEntry;
import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.predix.transform.hackathon.eg.message.Datum;
import com.predix.transform.hackathon.eg.message.TagList;
import com.predix.transform.hackathon.eg.message.Timeseries;
import com.predix.transform.hackathon.eg.utils.AuthToken;
import com.predix.transform.hackathon.eg.utils.JSONUtils;
import com.predix.transform.hackathon.eg.utils.SecurityHelper;

@Controller
public class EfficiencyCalculator {

	private static final String TIMESERIES_URL = "https://apm-timeseries-services-hackapm.run.aws-usw02-pr.ice.predix.io/v1/data";
	private static final String TENANT = "EBEF3763E5784244A217299524AF8F64";
	private static final String SECRET = "predixdecoded16";
	private static final String CLIENT_ID = "EBEF3763E5784244A217299524AF8F64_ingestor";
	private static final String TAG_SEGMENT_NV_EFFICIENCY = "TAG_SEGMENT_NV_EFFICIENCY";
	private static final String TAG_GRACIA_HEATRATE = "TAG_GRACIA_HEATRATE";
	private static final String KNOWN_ASSET = "/assets/0810c85a-e867-4e78-8bf6-c7bf6e5ac9ff";

	private static double _EFFICIENCY_COEFF = 3412;

	private final SimpMessagingTemplate messagingTemplate;

	@Autowired
	public EfficiencyCalculator(SimpMessagingTemplate messagingTemplate) {
		this.messagingTemplate = messagingTemplate;
	}

	@Autowired
	SecurityHelper security;

	@Value("${assetId}")
	private String edgeNodeId;

	private static Map<String, String[]> assetTags() {
		return Collections
				.unmodifiableMap(Stream
						.of(new SimpleEntry<>(KNOWN_ASSET,
								new String[] { TAG_GRACIA_HEATRATE, TAG_SEGMENT_NV_EFFICIENCY }))
						.collect(Collectors.toMap((e) -> e.getKey(), (e) -> e.getValue())));
	}

	@MessageMapping("/efficiency")
	@Scheduled(fixedDelay = 10000,initialDelay=1000)
	public void calculateEfficiency() {
		double efficiency;
		try {
			ZonedDateTime start = ZonedDateTime.now(ZoneOffset.UTC);
			ZonedDateTime end = start.plusSeconds(10);

			String[] inouts = assetTags().get(edgeNodeId);

			Set<Datum> datapoints = getTimeseries(inouts[0], start.toInstant().toEpochMilli(), end.toInstant().toEpochMilli());
			double heatrateAverage = datapoints.stream().mapToLong(a -> a.getV().longValue()).average().getAsDouble();
			efficiency = (_EFFICIENCY_COEFF / heatrateAverage) * 100;
			System.out.println("efficiency % "+efficiency);
			messagingTemplate.convertAndSend("/topic/efficiency", efficiency);
		} catch (Exception e) {
			System.out.println("no data found");
			//efficiency = 0;
		}
	}

	public Set<Datum> getTimeseries(String tags, long startTime, long endTime) {
		AuthToken authToken = security.requestAuthToken(CLIENT_ID, SECRET);

		HttpHeaders headers = new HttpHeaders();
		headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
		headers.add(HttpHeaders.AUTHORIZATION, "bearer " + authToken.getAccessToken());
		headers.add(HttpHeaders.CONTENT_TYPE, "application/json");
		headers.add("tenant", TENANT);

		String TAGLIST = "tagList";
		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(TIMESERIES_URL).queryParam(TAGLIST, tags)
				.queryParam("operation", "raw").queryParam("startTime", startTime).queryParam("endTime", endTime);
		HttpEntity<?> entity = new HttpEntity<>(headers);
		RestTemplate rest = new RestTemplate();
		HttpEntity<String> response = rest.exchange(builder.build().toUri(), HttpMethod.GET, entity, String.class);
		Timeseries timeseries = JSONUtils.fromJson(response.getBody(), Timeseries.class);
		TagList tagData = timeseries.getTagList().iterator().next();
		return tagData.getData();

	}

}
