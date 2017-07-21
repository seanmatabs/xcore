package com.operadev.model;

/**
 * Created by chrismipi on 2016/12/28.
 */
public enum Method {
	TERMINAL_NUMBER("terminal_number"),
	CARD_NUMBER("card_number"),
	ACCESS_GRANTED("access_granted"),
	SB_ID("sbi_id"),
	NAME_SURNAME("full_name"),
	COMPANY("company"),
	CARD_TYPE("card_type"),
	LOCATION("location"),
	NATIONALITY("nationality");

	private String method;

	Method(String method) {
		this.method = method;
	}

	public static boolean validate(String m) {
		for(Method mth : values()) {
			if(mth.method.equals(m)) return true;
		}
		return false;
	}

	public static Method fromString(String m) {
		for(Method mth : values()) {
			if(mth.method.equals(m)) return mth;
		}
		throw new RuntimeException("Method " + m + " is not supported.");
	}
}
