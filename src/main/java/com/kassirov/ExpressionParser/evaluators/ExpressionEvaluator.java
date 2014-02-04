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
				
				double a = ( nodes.get(i + 1).getType().equals(NUMBER_NODE) ) ? Double.parseDouble(nodes.get(i + 1).getValue()) : evaluate(nodes);
				
			}
		}
		
		return 0;
	}
}
