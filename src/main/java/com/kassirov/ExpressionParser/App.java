package com.kassirov.ExpressionParser;

import java.util.List;
import java.util.Scanner;

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
        List<Node> nodes = expressionParser.parse("10+5*3");
        
        for( Node node: nodes) {
        	System.out.println(node.getValue());
        }
    }
}
