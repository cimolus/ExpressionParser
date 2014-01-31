package com.kassirov.ExpressionParser.model;

public class Node {
	protected String value;
	public Node() {
		this.value = "";
	}
	
	public Node(String value) {
		this.value = value;
	}
	
	public String getValue() {
		return value;
	}
	public void incValue(String value) {
		this.value += value;
	}
	public String getType() {
		return getClass().getSimpleName(); 
	}
	
}
