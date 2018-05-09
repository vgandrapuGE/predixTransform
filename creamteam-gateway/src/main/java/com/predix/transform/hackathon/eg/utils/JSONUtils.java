package com.predix.transform.hackathon.eg.utils;

import java.io.IOException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JSONUtils {
    private static Log _logger      = LogFactory.getLog(JSONUtils.class);
	private static ObjectMapper mapper = new ObjectMapper();
	public static final String EMPTY = "";

	public static String toJson(Object obj) {
		if(null != obj) {
			try {
				return mapper.writeValueAsString(obj);
			} catch (IOException e) {
				_logger.error("Error writing Entitiy to Json"+ e.getMessage());
			}
		}
		return null;
	}

	public static <T> T fromJson(String json, Class<T> clazz) {
		if (isNullOrEmpty(json)) {
			_logger.error("Error converting Json to Object");
			return null;
		}
		try {
			return mapper.readValue(json, clazz);
		} catch (IOException e) {
			_logger.error("Error writing Entitiy to Json"+ e.getMessage());
		}
		return null;
	}

	public static <T> T fromJson(String json, TypeReference<?> typeReference) {
		if (null == json) {
			_logger.error("Error converting Json to TypeReference<Object>");
			return null;
		}
		try {
			return mapper.readValue(json, typeReference);
		} catch (IOException e) {
			_logger.error("Error writing Entitiy to Json"+ e.getMessage());
		}
		return null;
	}
	
	private static boolean isNullOrEmpty(String s) {
		boolean b = (null == s || EMPTY.equals(s.trim()));
		return b;
	}
}
