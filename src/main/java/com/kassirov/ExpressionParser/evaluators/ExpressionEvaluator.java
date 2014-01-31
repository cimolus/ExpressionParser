package com.kassirov.ExpressionParser.evaluators;

import java.util.List;

import com.kassirov.ExpressionParser.model.Node;

public class ExpressionEvaluator {
	
	
	private final String COMMAND_NODE = "CommandNode";
	private final String NUMBER_NODE = "NumberNode";
	private final String OPEN_BRACKET = "OpenBracket";
	private final String CLOSE_BRACKET = "CloseBracket";
	
	
	public double evaluate(List<Node> nodes) {
		
		for( int i = 0; i < nodes.size(); i++ ) {
			if ( nodes.get(i).getType().equals(COMMAND_NODE) ) {
				
				
				
			}
		}
		
		return 0;
	}
}
