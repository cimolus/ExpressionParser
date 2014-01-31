package com.kassirov.ExpressionParser.evaluators;

public class PowerEvaluator implements IEvaluator {

	public double evaluate(double param1, double param2) {
		return Math.pow(param1, param2);
	}
	
}
