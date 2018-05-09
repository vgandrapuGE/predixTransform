
package com.predix.transform.hackathon.eg.message;

import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import javax.annotation.Generated;
import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Generated("org.jsonschema2pojo")
@JsonPropertyOrder({
    "tagId",
    "errorCode",
    "errorMessage",
    "data"
})
public class TagList {

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("tagId")
    private String tagId;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("errorCode")
    private String errorCode;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("errorMessage")
    private String errorMessage;
    @JsonProperty("data")
    @JsonDeserialize(as = java.util.LinkedHashSet.class)
    private Set<Datum> data = new LinkedHashSet<Datum>();
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    /**
     * 
     * (Required)
     * 
     * @return
     *     The tagId
     */
    @JsonProperty("tagId")
    public String getTagId() {
        return tagId;
    }

    /**
     * 
     * (Required)
     * 
     * @param tagId
     *     The tagId
     */
    @JsonProperty("tagId")
    public void setTagId(String tagId) {
        this.tagId = tagId;
    }

    /**
     * 
     * (Required)
     * 
     * @return
     *     The errorCode
     */
    @JsonProperty("errorCode")
    public String getErrorCode() {
        return errorCode;
    }

    /**
     * 
     * (Required)
     * 
     * @param errorCode
     *     The errorCode
     */
    @JsonProperty("errorCode")
    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    /**
     * 
     * (Required)
     * 
     * @return
     *     The errorMessage
     */
    @JsonProperty("errorMessage")
    public String getErrorMessage() {
        return errorMessage;
    }

    /**
     * 
     * (Required)
     * 
     * @param errorMessage
     *     The errorMessage
     */
    @JsonProperty("errorMessage")
    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    /**
     * 
     * @return
     *     The data
     */
    @JsonProperty("data")
    public Set<Datum> getData() {
        return data;
    }

    /**
     * 
     * @param data
     *     The data
     */
    @JsonProperty("data")
    public void setData(Set<Datum> data) {
        this.data = data;
    }

    @JsonAnyGetter
    public Map<String, Object> getAdditionalProperties() {
        return this.additionalProperties;
    }

    @JsonAnySetter
    public void setAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
    }

}
