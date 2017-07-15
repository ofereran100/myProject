//define the math window
var xMin = -10, xMax = 10, yMin = -10, yMax = 10;
var canvas, ctx;
// Hold the expression to draw
var drawExpr = 'x';
var stopAnimation, toAnimate;
// used for animation
var scope = {};
var rootsArray = [];
var coefficients = [];

function asymptotes() {
	var simplified, denominator;
	var numerator;
	var func = $('#exprField').val();
	simplified = math.simplify(func);
	func = simplified.toString();
	console.log("simplified: " + func);
	// clean roots array
	cleanArr();
	// horizontalAsymptotes(func);
	numerator = getNumerator(func);
	console.log("numerator: " + numerator);

	// console.log("Horizontal asymptotes: ");
}
// A function to find the Ã—â€�Ã—Â§Ã—Â¨Ã—ï¿½Ã—Å¸Ã—â€˜Ã—Â©Ã—Å¡ asymptote
function VerticalAsymptotes(func) {
	var denominator, txt = "";
	var isThereAnyRoot = -1;
	func = $('#exprField').val();
	cleanArr();
	// console.log("func: "+func);
	// printToTextField("The function is defined for all x");
	txt += "Vertical asymptotes: ";
	// console.log("Vertical asymptotes: ");
	denominator = getDenominator(func);
	if (denominator !== -1) {
		// update rootsArray
		isThereAnyRoot = showRoots(denominator);
		// console.log(rootsArray);
		if (isThereAnyRoot !== -1) {
			showRoots(denominator);
			txt += rootsArray;
			printToTextField(txt);
			// console.log(rootsArray);
		} else
			printToTextField("No vertical asymptotes");

	} else {
		printToTextField("No vertical asymptotes");
	}

}

// --------------------------test---------------------
// var res;
// var exp = "3x^5/(4x^5)";
// var exp = "(tan(x))/8x^2)";
// res = verticalAsymptotes(exp);
// console.log("result: "+res);
// --------------------------test---------------------
// A function to find the horizontal asymptote
function horizontalAsymptotes(func) {
	var numerator, denominator;
	var tmp, tmp2, txt = "";
	var numeratorExpo, denominatorExpo;
	var coefficientNumerator, coefficientDenominator;
	var simpleCoefficientNumerator, simpleCoefficientDenominator;
	func = $('#exprField').val();
	// elicit denominator and numerator
	denominator = getDenominator(func);
	numerator = getNumerator(func);

	// no denominator no limit
	if (denominator == -1) {

		if (evaluateMathExpr(1e5) < 1 && evaluateMathExpr(1e5) > -1)
			printToTextField("The horizontal asymptotic boundary is: Zero");
		else if (evaluateMathExpr(-1e5) < 1 && evaluateMathExpr(-1e5) > -1)
			printToTextField("The horizontal asymptotic boundary is: Zero");
		else
			printToTextField("The horizontal asymptotic boundary is: infinity");
		return;

	}
	// remove trigo expr that doesn't affect on limit calculation.
	denominator = denominator
			.replace(
					/((sin\(([\d]|x|\+|\-|\/|\*)*\))|(cos\(([\d]|x|\+|\-|\/|\*)*\))|(tan\(([\d]|x|\+|\-|\/|\*)*\)))/g,
					"1");
	numerator = numerator
			.replace(
					/((sin\(([\d]|x|\+|\-|\/|\*)*\))|(cos\(([\d]|x|\+|\-|\/|\*)*\))|(tan\(([\d]|x|\+|\-|\/|\*)*\)))/g,
					"1");
	// -------------------------------------------------------------------------------------
	// if other then inside trigo expr there no 'x'.
	if (denominator.search('x') == -1) {
		// expr as : (x+3)/4
		if (numerator.search('x') !== -1) {
			printToTextField("The horizontal asymptotic boundary is: infinity");
			return;
		}
		// both numerator and denonator no consist x : 4/3 or sin(x)/(cos(x)+1)
		tmp = parseInt(math.simplify(numerator).toString())
				/ parseInt(math.simplify(denominator).toString());
		return tmp;

	}
	// -------------------------------------------------------------------------------------
	// if we got here, denominator cosist 'x' : (expr)/(x^2+3x)
	// no 'x' in numerator other than trigo: limit is 0: (sin(x)+3)/(x+4)
	if (numerator.search('x') == -1) {
		printToTextField("The horizontal asymptotic boundary is: zero");
		return;
	}

	// is there 'x' in numerator that doesn't relate to trigo expr?
	// if so, we need to divide the highest exponent: (x^22+3x^2)/(x^2+3x)

	numeratorExpo = findMaxDegOfX(numerator);
	denominatorExpo = findMaxDegOfX(denominator);
	/*
	 * Scenarios: ('infinity',-1),('infinity',number),('infinity','infinity'),
	 * (number,-1),(number,'infinity'),(number,number)
	 * (-1,-1),(-1,number),(-1,'infinity')
	 */
	switch (denominatorExpo) {
	case 'infinity':
		// exp eaxample: 3x^(5x)/3x^(3x)
		if (numeratorExpo == 'infinity') {
			printToTextField("The horizontal asymptotic boundary is: infinity");
			return;
		}
		// exp eaxample: 3x/3x^(3x)
		if (numeratorExpo == -1) {
			printToTextField("The horizontal asymptotic boundary is: zero");
			return;
		}
		// numeratorExpo is a number: 3x^3/3x^(3x)
		printToTextField("The horizontal asymptotic boundary is: zero");
		return;
		break;
	// denominator have no exponent
	case -1:
		if (denominatorExpo == 'infinity') {
			printToTextField("The horizontal asymptotic boundary is: zero");
			return;
		}
		// exp like: (3x+5)/(4x+2)
		if (numeratorExpo == -1) {
			tmp = denominator.search("\\d*x");
			tmp2 = denominator.search("x");
			tmp = denominator.slice(tmp, tmp2);
			simpleCoefficientDenominator = parseInt(tmp);

			tmp = numerator.search("\\d*x");
			tmp2 = numerator.search("x");
			tmp = numerator.slice(tmp, tmp2);
			simpleCoefficientNumerator = parseInt(tmp);
			printToTextField("The horizontal asymptotic boundary is: "
					+ simpleCoefficientNumerator / simpleCoefficientDenominator);
			// return simpleCoefficientNumerator/simpleCoefficientDenominator;
			// return;
		} else {
			printToTextField("The horizontal asymptotic boundary is: infinity");

		}
		break;
	// number
	default:
		// expr as : (x^22+3x^2)/(x^2+3x)
		if (numeratorExpo > denominatorExpo) {
			printToTextField("The horizontal asymptotic boundary is: infinity");
			return;
		}
		if (numeratorExpo < denominatorExpo) {
			printToTextField("The horizontal asymptotic boundary is: zero");
			return;
		}

		coefficientNumerator = getcoefficientsOfMaxDegreeOfX(numerator);
		// clear arr
		coefficients.splice(0, coefficients.length);
		coefficientDenominator = getcoefficientsOfMaxDegreeOfX(denominator);
		printToTextField("The horizontal asymptotic boundary is: "
				+ parseInt(coefficientNumerator)
				/ parseInt(coefficientDenominator));
		// return
		// parseInt(coefficientNumerator)/parseInt(coefficientDenominator);
		coefficients.splice(0, coefficients.length);
		return;
	}

}
// ------------------------------test---------------------------------
// var exp = "3x^4+(4x)^22";
// setCoefficient("4x^3+3x^3");
// console.log("arr: "+arr);
// console.log("coefficients: "+coefficients);
// ------------------------------test---------------------------------
// set first Coefficient
function setCoefficient(func) {
	var indexStart, indexEnd, tmp = '';

	indexStart = func.search(/(\(.*\)\^|\(.*\)x)/);
	indexEnd = func.search(/\^/);

	if (indexStart !== -1 && parseInt(indexEnd) > parseInt(indexStart)) {
		func = func.slice(indexStart, indexEnd);
		tmp = func;
		if (func == "")
			return;
		func = math.parse(func);
		func = math.simplify(func);
		func = Math.round(func.eval({
			x : 1
		}));
		// in case of(4x+sin(x))^expr don't add trigo as 1
		if ((tmp.search('(sin|cos|tan)') !== -1) && (tmp.search('x') !== -1)) {
			coefficients.push(parseInt(func) - 1);
			return;
		}

		// coefficients
		coefficients.push(parseInt(func));

		// return func.eval({x: 4});
		return parseInt(func);
	}
	// regular Coefficient
	indexStart = func.search(/\d*x\^/);
	// in case the coeofficens 1
	if (func.charAt(indexStart) == 'x') {
		// CoefficientsArr.push(1);
		coefficients.push(1);
		return 1;
	}
	indexEnd = func.search(/x/);
	func = func.slice(indexStart, indexEnd);
	coefficients.push(parseInt(func));
	return parseInt(func);

}
// -----------------------------test-------------------------
// var exp = "5x+3";
// setCoefficient(exp);
// console.log("coefficients: "+coefficients);
// var d = findMaxDegOfX(exp);
// console.log("findMaxDegOfX: "+d);
// save in the order of the exponent
// console.log("coefficients: "+coefficients);
// console.log("coefficient of max degree: "+
// getcoefficientsOfMaxDegreeOfX(exp));
// -----------------------------test-------------------------

// A function whose function is to find the coefficient of high holding
function getcoefficientsOfMaxDegreeOfX(func) {
	var maxDegree, coefficient, tmp2;
	var tmp, initValue, index = 0;
	var indexOfExponent = [];
	var tmpExpr = func;
	var j = 0;
	maxDegree = findMaxDegOfX(func);
	console.log("maxDegree: " + maxDegree);
	tmp = func.search('\\^');
	// insert the index of every exponent in array.
	while (tmpExpr.search('\\^') !== -1) {
		indexOfExponent.push(parseInt(tmp));
		tmpExpr = func.slice(tmp + 1);
		tmp += tmpExpr.search('\\^') + 1;
		j++;
		if (j > 20)
			break;// safty net.
	}
	j = 0;
	tmp = parseInt(func.search("\\^" + maxDegree));
	// probably x^(expo)
	if (tmp == -1) {
		tmp = parseInt(func.search(maxDegree));
		while (func.charAt(tmp) !== '^') {

			tmp -= 1;
			if (j > 10)
				break;
			j++;
		}
	}

	for (i = 0; i < indexOfExponent.length; i++) {
		// console.log("index of Exponent: "+indexOfExponent[i]);
		// tmp is index of max degree
		if (tmp == indexOfExponent[i])
			return coefficients[i];
	}

	return "no result ";
}

// description: function that find the maximum degree of X
function findMaxDegOfX(func) {
	var exponent, countExpo = 0;
	var exponentArr = [];
	var tmpFunc, tmpExpr;
	// no exponent found
	if (func.search('\\^') == -1)
		return -1;

	tmpFunc = func;
	// if exponent contain x, stop and sent 'infinity'
	// if exponent contain trigo replace with 1, which represent the higest
	// exponent of expr.
	while (tmpFunc.search('\\^') !== -1) {
		// push: number,trigo,or complex expr: (sin(x)+3x)
		tmpExpr = getExponent(tmpFunc);

		tmpExpr = tmpExpr
				.replace(
						/((sin\(([\d]|x|\+|\-|\/|\*)*\))|(cos\(([\d]|x|\+|\-|\/|\*)*\))|(tan\(([\d]|x|\+|\-|\/|\*)*\)))/g,
						"0");
		tmpExpr = math.simplify(tmpExpr).toString();

		// if exponent consisit x.
		if (tmpExpr.search('x') !== -1) {
			console.log('infinity');
			return 'infinity';
		}

		// if we got here, we get just a number
		exponentArr.push(parseInt(tmpExpr));

		tmpFunc = tmpFunc.slice(parseInt(tmpFunc.search('\\^') + 1));
		if (tmpFunc.charAt(tmpFunc.length - 1) == ')'
				&& tmpFunc.charAt(0) !== '(')
			tmpFunc = tmpFunc.slice(parseInt(tmpFunc.length - 1));
	}
	return Math.max.apply(null, exponentArr);
}

// description: return first exponent expression.
function getExponent(func) {
	var exponentIndex = 0;
	var charsHolder, index = 0;
	var bracket = [];
	var tmpFunc, tmp, str = '';
	// use inside while loop
	var i = 0, j = 0;
	// x^(expr+sin(x)+cos(x)) +cos(x)
	exponentIndex = parseInt(func.search('\\^'));
	// exponent exist
	if (exponentIndex !== -1) {

		// set Coefficient of first exponent
		setCoefficient(func);

		// -----------------------complex exponent---------------------
		// exponent consist complex expr,which must involve bracket.
		if (func.charAt(exponentIndex + 1) == '(') {
			// charsHolder start from the first '(' .
			func = func.slice(exponentIndex + 1);
			charsHolder = func.split("");// '(' first
			do {
				if (charsHolder[i] == '(' || charsHolder[i] == ')') {
					bracket.push(charsHolder[i]);
					if (bracket.length >= 2)
						if (bracket[bracket.length - 1] == ')'
								&& bracket[bracket.length - 2] == '(') {
							bracket.pop();
							bracket.pop();
						}
				}
				i++;
				if (i >= charsHolder.length)
					break;
			} while (bracket.length !== 0);
			return func.slice(0, i);
		}
		// -----------------------complex exponent---------------------
		else {
			index = parseInt(func.search('\\^')) + 1;
			// two cases: x^number, x^trigoExpr
			tmp = func.charAt(index);
			if (tmp == 's' || tmp == 'c' || tmp == 't') {
				// console.log("x^trigo");
				return '1';
			} else {

				j = index;
				tmp = func.charAt(j);
				var avoidJsBinInfinitLoopMechanizm = 0;

				// here a problem with js macanizm
				while (tmp !== "" && tmp !== '+' && tmp !== '-' && tmp !== '*'
						&& tmp !== '/' && tmp !== '(') {
					str += tmp;
					tmp = func.charAt(++j);
					if (avoidJsBinInfinitLoopMechanizm > 50)
						break;
					avoidJsBinInfinitLoopMechanizm++;
				}
				return str;

			}
		}
	} else {
		console.log("no exponent");
		return -1;

	}

}

// A function whose function is to find cutting points with the axes
function interactionWithAxis() {
	var simplified, txt = "", y;
	var func = $('#exprField').val();
	var flag = false;

	simplified = math.simplify(func);
	func = simplified.toString();
	// func.search("(\\^)")
	if (func.search("-") !== -1 || func.search("\\^") == -1) {
		txt += "The intersection points of the graph with the axes are:\n ";
		showRoots(func);
		// y = simplified.eval({x: 0});
		for (i = 0; i < rootsArray.length; i++) {
			y = simplified.eval({
				x : rootsArray[i]
			});
			// y = y.toFixed(2);
			y = parseFloat(y).toFixed(2).toString();
			txt += "(" + rootsArray[i] + "," + y + ')\n';
			if (Math.round(rootsArray[i].toString()) == 0)
				flag = true;
		}
		if (!flag) {
			y = simplified.eval({
				x : 0
			});
			y = parseFloat(y).toFixed(2).toString();
			txt += "(0," + y + ")";
		}
		printToTextField(txt);
	} else {
		txt = "The intersection points of the graph with the axes are:\n ";
		y = simplified.eval({
			x : 0
		});
		y = parseFloat(y).toFixed(2).toString();
		txt += "(0.00," + y + ")";
		if (y !== "NaN")
			printToTextField(txt);
		else
			printToTextField("No intersection with axes");
	}
}

function cleanArr() {
	rootsArray.splice(0, rootsArray.length);
}
// A function whose function is to find a domain
function findDomain() {
	var simplified, txt = "";
	var func = $('#exprField').val();
	var denominator = -1;
	var rootIndex, valueInRoot;
	var isThereAnyRoots = -1;
	var funcInRoot = -1;

	simplified = math.simplify(func);
	func = simplified.toString();
	denominator = getDenominator(func);

	// derive the expression inside root if exist
	funcInRoot = getExprInRoot(func);

	// clean rootsArray
	rootsArray.splice(0, rootsArray.length);

	// check if expr consist denominator, if so
	// we should differ x from value that zero it
	if (denominator !== -1) {
		isThereAnyRoots = showRoots(denominator);
		if (isThereAnyRoots !== -1) {
			printToTextField("x differ from: " + rootsArray);
			return;
		}
		// now we need to check existent of even exponent
		// and verify that inside it there no value that give '-'
		if (funcInRoot !== -1) {
			rootsArray.splice(0, rootsArray.length);
			showRoots(funcInRoot);
			txt = "x > " + rootsArray;
			printToTextField(txt);
			return;
		}

	}
	// check again t=root but in case denominator does't exist
	if (funcInRoot !== -1) {
		rootsArray.splice(0, rootsArray.length);
		showRoots(funcInRoot);
		txt = "x > " + rootsArray;
		printToTextField(txt);
		return;
	}

	// we didn't find nothing
	printToTextField("The function is defined for all x");
}

function getRooteExpr(func, denominator) {
	var rootIndex, rooteExpr;
	// check if denominator exist.
	if (denominator !== -1) {

	} else
		rooteExpr = -1;

	return rooteExpr;
}

function getExprInRoot(func) {
	var powerIndex;
	var denominator;
	var hasPower = false;
	var hasDenominator = false;
	var isDenominatorEven = false;
	var isDenominatorconsistX = false;
	var isDenominatorNum = false;
	var exprUnderRoot = -1;
	var tmpFunc = '';
	// does the expr consist power?
	powerIndex = func.search("\\^");
	if (powerIndex !== -1) {
		denominator = getDenominator(func);
		// check if its root expr
		if (denominator !== -1) {
			isDenominatorconsistX = denominator.search('x');
			if ((isDenominatorconsistX != -1) || (isEven(denominator))) {
				if (isEven(denominator)) {
					// take the expr before '^' and check when is equal to '0'.
					tmpFunc = func.slice(0, powerIndex);
					// in case of (3x^3-4)^(expr)
					// we need to return all the expr in bracket
					// and not until the first '^'
					if (func.charAt(0) == '(') {
						powerIndex = func.search("\\)");
						tmpFunc = func.slice(0, powerIndex + 1);

					}
					// console.log("x > " + showRoots(func));
					return tmpFunc;
				}
			}
		}
	}
	return -1;
}

function isEven(n) {
	return n == parseFloat(n) ? !(n % 2) : void 0;
}

// Function that find the Numerator of Expression
function getNumerator(func) {
	var numerator, numeratorIndex;
	var dupBracketIndex, matchBracket, tmp, pos;

	numeratorIndex = func.search('/');
	if (numeratorIndex !== -1) {
		numerator = func.slice(0, numeratorIndex);
		// if it's not trigo expre, dissmiss all brackets.
		if (numerator.search('(sin|cos|tan)') == -1) {
			// remove all brackets
			numerator = numerator.replace(/(\)|\()/g, "");

		}
		// there is trigo expression
		else {
			dupBracketIndex = numerator.search('\\(.*\\(');
			matchBracket = numerator.search('\\)');
			if (matchBracket !== -1) {
				tmp = numerator.charAt(matchBracket - 1);
				// if the match ) relate to the sin or cos ignor
				if (tmp == "n" || tmp == "s")
					matchBracket = -1;
			}
			// if there is dup barcket but there isn't a match
			if (dupBracketIndex !== -1 && (matchBracket == -1)) {
				pos = getPosition(numerator, '(', 2);
				numerator = numerator.substring(0, pos) + ''
						+ numerator.substring(pos + 1);
			}

		}
		return numerator;
	} else
		return -1;
}
// Function that find the Denominator of Expression
function getDenominator(func) {
	var denominator, denominatorIndex, tmp;
	var dupBracketIndex, matchBracket, pos;

	denominatorIndex = func.search('/');
	if (denominatorIndex !== -1) {
		denominator = func.slice(denominatorIndex + 1, func.length);
		// if it's not trigo expre, dissmiss all brackets.
		if (denominator.search('(sin|cos|tan)') == -1)
			denominator = denominator.replace(/(\)|\()/g, "");
		else {
			dupBracketIndex = denominator.search('\\).*\\)');
			matchBracket = denominator.search('\\(');
			if (matchBracket !== -1) {
				tmp = denominator.charAt(matchBracket - 1);
				// if the match ( relate to the sin or cos ignor
				if (tmp == "n" || tmp == "s")
					matchBracket = -1;
			}
			// if there is dup barcket but there isn't a match
			if (dupBracketIndex !== -1 && (matchBracket == -1)) {
				pos = getPosition(denominator, ')', 2);
				denominator = denominator.substring(0, pos) + ''
						+ denominator.substring(pos + 1);
			}
		}
	} else
		denominator = -1;

	return denominator;
}
// get the nth occurrence in a string
function getPosition(string, subString, index) {
	return string.split(subString, index).join(subString).length;
}

function showIntegralCalc() {
	var func, leftBoundary, rightBoundary;
	var x, tmp = "", txt = "";
	// init boundery
	leftBoundary = 0;
	rightBoundary = 4;

	func = $('#exprField').val();
	bootbox
			.prompt(
					"Pleass insert left and right boundery,e.g: [2,4]!",
					function(result) {

						tmp = result.search("\\[\\-?\\d,\\-?\\d\\]");
						if (result == -1) {
							printToTextField("pleass insert the right format e.g [x1,x2]");
						} else {
							tmp = result.slice(tmp + 1, result.search("\\]"));
							tmp = tmp.split(",");
							console.log("tmp: " + tmp);
							leftBoundary = parseInt(tmp[0]);// parseInt("10")
							rightBoundary = parseInt(tmp[1]);
							console.log("leftBoundary: " + leftBoundary);
							console.log("rightBoundary: " + rightBoundary);

							x = clacIntegral(func, leftBoundary, rightBoundary);
							txt = "The area under the graph in the range "
									+ "[" + tmp[0] + "," + tmp[1] + "]: " + x;
							printToTextField(txt);
							// printToTextField('The area under the graph in the
							// range x[0,4]: '+x);
						}
					});

}
function clacIntegral(func, leftBoundary, rightBoundary) {
	// interval for precision
	var dx = 0.01, i, result = null;
	var valueExpr;
	var yArray = [];

	// simplify an expression
	func = math.simplify(func);

	for (i = leftBoundary; i <= rightBoundary; i += dx) {
		valueExpr = func.eval({
			x : i
		});
		yArray.push(valueExpr);
	}
	result = numerical_int(dx, yArray);
	return result;
}

function numerical_int(dx, y_array) {
	var profile_integral = 0;
	var dy_init, dy_end, darea;
	var n = y_array.length;
	for (i = 1; i < n; i++) {
		dy_init = y_array[i - 1];
		dy_end = y_array[i];
		darea = dx * (dy_init + dy_end) / 2.;
		profile_integral = profile_integral + darea;
	}
	return profile_integral.toFixed(2);
}

// if root not found return -1 else 1;
function showRoots(expr) {
	var y, inputExpre, i, j, tmp;
	inputExpre = expr;
	// clean array
	rootsArray.splice(0, rootsArray.length);

	var isThereAnyRoots = -1;
	// console.log("test-----in showroots");
	if (expr == undefined)
		inputExpre = $('#exprField').val();

	// the number represents number of roots to find.
	isThereAnyRoots = findRoots(inputExpre, 3);
	// only if roots where found, clean identical values.
	if (isThereAnyRoots != -1) {
		removeIdenticalValues(rootsArray);
		rootsArray.forEach(function(item, index) {
			rootsArray[index] = rootsArray[index].toFixed(2);
		});
		return 1;
	}
	return -1;

}

function removeIdenticalValues(arr) {
	for (j = 0; j < arr.length; j++)
		for (i = 0; i < arr.length; i++) {
			if (i !== j)
				if (Math.round(arr[j]) == Math.round(arr[i]))
					arr.pop();
		}
}

// if found insert to array
// if not found return -1 else 1;
function findRoots(equ, numberOfRoots) {
	// key point to start the search.
	var xInitailValue = -1;
	// the indent for the next root search point.
	var indent = 2, x0;
	var tmpVal = xInitailValue;
	var boundry = 100, asymptote = false;
	// clean root array before use
	rootsArray.splice(0, rootsArray.length);

	for (var i = 0; i < numberOfRoots; i++) {
		x0 = findRoot(equ, xInitailValue);

		// make sure we not confused with asymptote
		asymptote = (x0 < -boundry) || (x0 > boundry);

		// there is a root
		if (x0 !== "NaN" && !asymptote) {
			rootsArray.push(x0);
			asymptote = false;
			xInitailValue = rootsArray[rootsArray.length - 1] + (i + 1)
					* indent;
		} else
			xInitailValue = tmpVal + (i + 1) * indent;
	}

	if (rootsArray.length == 0)
		return -1;

	return 1;
}
// find the root of a function
function findRoot(equ, xInitailValue) {
	var x1 = xInitailValue, x2 = 1;
	var y, dy, dExpr;
	var noResult = "NaN";
	// console.log("found:xxx ");
	equ = math.simplify(equ);
	dExpr = math.derivative(equ, 'x');
	// console.log("equ: "+equ);
	for (var i = -100; i < 100; i++) {
		y = equ.eval({
			x : x1
		});
		dy = dExpr.eval({
			x : x1
		});
		x2 = x1 - y / dy;
		x1 = x2;

		if (Math.abs(y) < 1e-10) {
			// console.log("found: "+x2);
			return x2;
		}
	}
	return noResult;
}

// return derive expression
function getDeriveExpr(expr) {
	expr = math.simplify(expr);
	dExpr = math.derivative(expr, 'x');
	return dExpr;
}

function showDeriveExpr(numberOfDervision) {
	var expr;
	expr = $("#exprField").val();
	if (expr == "") {
		printToTextField("Pleass input expression");
		return;
	}
	expr = math.simplify(expr);
	expr = math.derivative(expr, 'x');
	if (numberOfDervision < 2 || numberOfDervision == undefined) {
		printToTextField("derive expr: " + expr);
	} else {
		expr = math.simplify(expr.toString());
		expr = math.derivative(expr, 'x');
		printToTextField("second derivation: " + expr);
	}

}

function showMaxMinPoint() {
	var expr, y, parsExpr, txt = "";
	var isThereAnyRoot = -1;
	var boundry = 100;
	expr = $("#exprField").val();
	if (expr == "") {
		printToTextField("Pleass input expression");
		return;
	}
	expr = math.simplify(expr);
	parsExpr = expr;
	expr = math.derivative(expr, 'x');
	txt += "max/min points: \n";
	cleanArr();
	isThereAnyRoot = showRoots(expr.toString());
	// if(isThereAnyRoot !== -1)

	if (isThereAnyRoot == -1) {
		printToTextField("no max/min points");
		return -1;
	}
	for (i = 0; i < rootsArray.length; i++) {
		console.log("rootsArray[i]: " + rootsArray[i]);
		y = parsExpr.eval({
			x : rootsArray[i]
		});
		y = parseFloat(y).toFixed(2);
		console.log(y);
		// if(rootsArray[i]<boundry && rootsArray[i]>-boundry)
		txt += "(" + rootsArray[i] + "," + y + ")";// 3x/(4x^2+5)

	}
	printToTextField(txt);
}

function animateExpr() {
	toAnimate = true;
	var expr;
	expr = $("#exprField").val();
	setExpre(expr);
	stopAnimation = setInterval(draw, 100);
	$('#animation').prop('disabled', true);
	$('#UserExprBTN').prop('disabled', true);
	$('#derivationBTN').prop('disabled', true);
}
// sin(x*t)
function draw() {
	var expr;

	clearCanvas(ctx);
	drawAxes(ctx);

	expr = $("#exprField").val();

	// verify input field not empty
	if (!isFieldEmpty("exprField")) {
		if (!toAnimate) {
			setExpre(expr);
		}
		drawFunction();

	}
}

function drawDerivation() {
	var expr;

	clearCanvas(ctx);
	drawAxes(ctx);

	expr = $("#exprField").val();
	console.log("dfd: " + expr);

	// verify input field not empty
	if (!isFieldEmpty("exprField")) {
		if (!toAnimate) {
			expr = math.simplify(expr);
			expr = math.derivative(expr, 'x').toString();
			setExpre(expr);
		}
		drawFunction();

	}
}

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function drawFunction() {
	// used inside the loop
	var i, n = 100, x, y;
	// vary between 0 to 1
	var percentX, percentY;
	var xMath, yMath;

	if (toAnimate)
		scope.t++;

	ctx.beginPath();

	for (i = 0; i < n; i++) {
		// vary from 0 to 1
		percentX = i / (n - 1);
		// vary from xMin to xMax
		xMath = xMin + percentX * (xMax - xMin);
		yMath = evaluateMathExpr(xMath);
		percentY = 1 - (yMath - yMin) / (yMax - yMin);

		x = canvas.width * percentX;
		y = canvas.height * percentY;

		ctx.lineTo(x, y);
	}
	ctx.strokeStyle = "black";
	ctx.stroke();

}

function stopAnimat() {
	clearInterval(stopAnimation);
	toAnimate = false;
	$('#animation').prop('disabled', false);
	$('#UserExprBTN').prop('disabled', false);
	$('#derivationBTN').prop('disabled', false);
}

function evaluateMathExpr(mathX) {
	scope.x = mathX;
	return drawExpr.eval(scope);

}
// update global variable expression to treeNode
function setExpre(expr) {
	var node2 = math.parse(expr);
	drawExpr = node2.compile();
}

function clearCanvas(ctx) {
	ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}
// dy = dExpr.eval({x: x1});
function showYofX() {
	var expr, node, txt = "";
	// bootbox.prompt("hey", isFieldEmpty);
	bootbox.prompt("Pleass insert x: ", function(result) { // parseInt(y)
		expr = $("#exprField").val();
		if (isFieldEmpty("exprField"))
			printToTextField("please write an expression");
		else {
			txt = "f(" + result + ") = ";
			node = math.parse(expr);
			expr = node.compile();
			txt += expr.eval({
				x : parseInt(result)
			});
			printToTextField(txt);

		}

		console.log(result);
	});
}

function isFieldEmpty(id) {
	var field = $('#' + id).val();
	if (field == '')
		return true;
	return false;
}
// (x-2)^2-4
function drawAxesPoints(axes) {
	// points start from.
	var num = -10;
	// vary between 0 and 1
	var percentX, percentY;
	// used inside loop.
	var i, n = 20, x, y;
	var xIndent = -17, yIndent = -3;

	ctx.font = "10px arial";
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";

	ctx.beginPath();
	// for x and y axis ticks.
	for (i = 0; i < n; i++) {
		percentX = i / (n - 1);
		percentY = i / (n - 1);
		x = canvas.width * percentX;
		y = canvas.height * percentY;
		if (num !== 0) {
			ctx.fillText(num.toString(), x + xIndent, axes.y0 + 4.5);// x
			// axis
			ctx.fillText(-num.toString(), axes.x0 + 4.5, y + yIndent);// y
			// axis
		}
		num += 1;
	}
	ctx.stroke();
}

function drawAxes(ctx) {
	var axes = {};
	axes.x0 = 0.5 + 0.5 * canvas.width; // x0 pixels from left to x=0
	axes.y0 = 0.5 + 0.5 * canvas.height; // y0 pixels from top to y=0
	var x0 = axes.x0, w = ctx.canvas.width;
	var y0 = axes.y0, h = ctx.canvas.height;

	drawAxesPoints(axes);

	ctx.beginPath();
	ctx.strokeStyle = "rgb(0,0,228)";
	ctx.moveTo(0, y0);
	ctx.lineTo(w, y0); // X axis
	ctx.moveTo(x0, 0);
	ctx.lineTo(x0, h); // Y axis
	ctx.stroke();
}

function printToTextField(message) {
	$("#comment").text(message);
}

function init() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	toAnimate = false;
	scope = {
		x : 0,
		t : 0
	};
	drawAxes(ctx);
}