/******************************************************************************
 * Copyright (c) 2016 GE Global Research. All rights reserved. * * The computer software herein is the property of GE
 * Global Research. The * software may be used and/or copied only with the written permission of * GE Global Research or
 * in accordance with the terms and conditions * stipulated in the agreement/contract under which the software has been
 * * supplied. *
 ******************************************************************************/

package com.predix.transform.hackathon.eg.utils;

import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;



/**
 * Helper class to get the OAuth REST Template and an oauth token based on the configuration setup
 * @author Vamshi Gandrapu, 212546754
 * @version 1.0 Mar 07, 2016
 * @since 1.0
 */
@Component
public class SecurityHelper {
    @Value("${accessTokenEndpointUrl}")
    private String accessTokenEndpointUrl;

    @Value("${clientId}")
    private String clientId;

    @Value("${clientSecret}")
    private String clientSecret;

    @Autowired
    OAuth2RestTemplate oauth2RestTemplate;

    /**
     * Method to return the auth token from UAA based on username and password passed.
     * 
     * @param username
     * @param password
     * 
     * @return AuthToken
     */
    public AuthToken requestAuthToken(String username, String password) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        headers.add(HttpHeaders.AUTHORIZATION, "Basic "+getEncodedClientId());
        headers.add(HttpHeaders.CONTENT_TYPE, "application/x-www-form-urlencoded");
                        
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(accessTokenEndpointUrl)
                        .queryParam("grant_type", "password")
                        .queryParam("client_id",clientId)
                        .queryParam("username", username)
                        .queryParam("password", password)
                        ;
        HttpEntity<?> entity = new HttpEntity<>(headers);
        RestTemplate rest = new RestTemplate();
        HttpEntity<AuthToken> response = rest.exchange(builder.build().toUri(), HttpMethod.POST, entity, AuthToken.class);
        
        return response.getBody();
    }
    
    
    private String getEncodedClientId() {
        String authString = clientId + ":" + clientSecret;
        byte[] encodedBytes = Base64.encodeBase64(authString.getBytes());
        return new String(encodedBytes);
    }

}
