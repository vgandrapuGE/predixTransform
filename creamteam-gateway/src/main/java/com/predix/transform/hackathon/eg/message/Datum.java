
package com.predix.transform.hackathon.eg.message;

import java.util.HashMap;
import java.util.Map;
import javax.annotation.Generated;
import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Generated("org.jsonschema2pojo")
@JsonPropertyOrder({
    "ts",
    "v",
    "q"
})
public class Datum {

    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("ts")
    private String ts;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("v")
    private Double v;
    /**
     * 
     * (Required)
     * 
     */
    @JsonProperty("q")
    private String q;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    /**
     * 
     * (Required)
     * 
     * @return
     *     The ts
     */
    @JsonProperty("ts")
    public String getTs() {
        return ts;
    }

    /**
     * 
     * (Required)
     * 
     * @param ts
     *     The ts
     */
    @JsonProperty("ts")
    public void setTs(String ts) {
        this.ts = ts;
    }

    /**
     * 
     * (Required)
     * 
     * @return
     *     The v
     */
    @JsonProperty("v")
    public Double getV() {
        return v;
    }

    /**
     * 
     * (Required)
     * 
     * @param v
     *     The v
     */
    @JsonProperty("v")
    public void setV(Double v) {
        this.v = v;
    }

    /**
     * 
     * (Required)
     * 
     * @return
     *     The q
     */
    @JsonProperty("q")
    public String getQ() {
        return q;
    }

    /**
     * 
     * (Required)
     * 
     * @param q
     *     The q
     */
    @JsonProperty("q")
    public void setQ(String q) {
        this.q = q;
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
