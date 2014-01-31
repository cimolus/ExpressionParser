package com.kassirov.ExpressionParser.parsers;

import java.util.ArrayList;
import java.util.List;

import com.kassirov.ExpressionParser.EvaluatorRegistry;
import com.kassirov.ExpressionParser.model.CloseBracket;
import com.kassirov.ExpressionParser.model.CommandNode;
import com.kassirov.ExpressionParser.model.Node;
import com.kassirov.ExpressionParser.model.NumberNode;
import com.kassirov.ExpressionParser.model.OpenBracket;

public class ExpressionParser {
	
	private boolean canRemoveSpace = true;
	private boolean isNumber = false;
	private boolean isCommand = false;
	
	private void clearParser() {
		canRemoveSpace = true;
		isNumber = false;
		isCommand = false;
	}
	
	
	public List<Node> parse(String expression) throws Exception {
		clearParser();
		List<Node> nodes = new ArrayList<Node>();
		Node node = new Node();
		
		for( int i = 0; i < expression.length(); i++ ) {
			char c = expression.charAt(i);
			if ( Character.isWhitespace(c) && canRemoveSpace ) 
				continue;
			else if ( Character.isWhitespace(c) ) 
				throw new Exception("Parse Exception");
			
			if ( Character.isDigit(c) || c == '.'  ) {
				canRemoveSpace = false;
				if ( !isNumber ) {
					nodes.add(node);
					node = new NumberNode();
					isNumber = true;
					isCommand = false;
				}
				node.incValue(String.valueOf(c)); 
			} else if ( c == '(' ) {
				nodes.add(node);
				isNumber = false;
				isCommand = false;
				node = new OpenBracket(String.valueOf(c));
			} else if ( c == ')') {
				nodes.add(node);
				isNumber = false;
				isCommand = false;
				node = new CloseBracket(String.valueOf(c));
			} else if ( Character.isLetter(c) ) {
				
				if ( !isCommand ) {
					nodes.add(node);
					node = new CommandNode();
					isNumber = false;
					isCommand = true;
				}
				node.incValue(String.valueOf(c));
				
			} else if ( EvaluatorRegistry.getInstance().isContainCommand(String.valueOf(c)) ) {
				nodes.add(node);
				isNumber = false;
				isCommand = false;
				node = new CommandNode(String.valueOf(c));
			}
			
		}
		
		nodes.add(node);
		List<Node> clearedNodes = new ArrayList<Node>();
		for ( Node n: nodes) {
			if ( !n.getValue().equals("") ) {
				clearedNodes.add(n);
			}
		}
		
		return clearedNodes;
	}
	
}
