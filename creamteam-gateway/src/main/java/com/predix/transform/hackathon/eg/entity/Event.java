package com.predix.transform.hackathon.eg.entity;

public class Event {

	private Integer Id;
	private String asset;
	private String name;
	private String description;
	private String sourceTag;
	private Long dateTime;
	public Integer getId() {
		return Id;
	}
	public void setId(Integer id) {
		Id = id;
	}
	public String getAsset() {
		return asset;
	}
	public void setAsset(String asset) {
		this.asset = asset;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getSourceTag() {
		return sourceTag;
	}
	public void setSourceTag(String sourceTag) {
		this.sourceTag = sourceTag;
	}
	public Long getDateTime() {
		return dateTime;
	}
	public void setDateTime(Long dateTime) {
		this.dateTime = dateTime;
	}
	
	
	
}
