package com.kassirov.ExpressionParser;

import java.util.HashMap;
import java.util.Map;

import com.kassirov.ExpressionParser.evaluators.AdditionEvaluator;
import com.kassirov.ExpressionParser.evaluators.DivisionEvaluator;
import com.kassirov.ExpressionParser.evaluators.IEvaluator;
import com.kassirov.ExpressionParser.evaluators.MultiplicationEvaluator;
import com.kassirov.ExpressionParser.evaluators.PowerEvaluator;
import com.kassirov.ExpressionParser.evaluators.SubtractionEvaluator;

public class EvaluatorRegistry {
	
	private static EvaluatorRegistry evaluatorRegistry = new EvaluatorRegistry();
	
	private Map<String, IEvaluator> evaluators = new HashMap<String, IEvaluator>();
	
	private EvaluatorRegistry() {
		init();
	}
	
	private void init() {
		evaluators.put("+", new AdditionEvaluator() );
		evaluators.put("-", new SubtractionEvaluator() );
		evaluators.put("*", new MultiplicationEvaluator() );
		evaluators.put("/", new DivisionEvaluator() );
		evaluators.put("^", new PowerEvaluator() );
	}
	
	public static EvaluatorRegistry getInstance() {
		return evaluatorRegistry;
	}
	
	public IEvaluator getEvaluator(String command) {
		return evaluators.get(command);
	}
	
	public boolean isContainCommand(String command) {
		return evaluators.containsKey(command);
	}
	
}
