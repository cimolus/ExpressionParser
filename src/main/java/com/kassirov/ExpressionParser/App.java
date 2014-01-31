package com.kassirov.ExpressionParser;

import java.util.List;
import java.util.Scanner;

import com.kassirov.ExpressionParser.evaluators.ExpressionEvaluator;
import com.kassirov.ExpressionParser.model.Node;
import com.kassirov.ExpressionParser.parsers.ExpressionParser;

/**
 * Hello world!
 *
 */
public class App 
{
    public static void main( String[] args ) throws Exception
    {
        ExpressionParser expressionParser = new ExpressionParser();
        List<Node> nodes = expressionParser.parse("15.7^2+(10+5*3.2)");
        
        ExpressionEvaluator expressionEvaluator = new ExpressionEvaluator();
        System.out.println( expressionEvaluator.evaluate(nodes) );
        
        
        for( Node node: nodes) {
        	System.out.println(node.getValue() + node.getType() );
        }
    }
}
