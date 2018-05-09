
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


/**
 * 
 * 
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@Generated("org.jsonschema2pojo")
@JsonPropertyOrder({
    "errorCode",
    "errorMessage",
    "tagList"
})
public class Timeseries {

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
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("tagList")
    @JsonDeserialize(as = java.util.LinkedHashSet.class)
    private Set<TagList> tagList = new LinkedHashSet<TagList>();
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

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
     * (Required)
     * 
     * @return
     *     The tagList
     */
    @JsonProperty("tagList")
    public Set<TagList> getTagList() {
        return tagList;
    }

    /**
     * 
     * (Required)
     * 
     * @param tagList
     *     The tagList
     */
    @JsonProperty("tagList")
    public void setTagList(Set<TagList> tagList) {
        this.tagList = tagList;
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
