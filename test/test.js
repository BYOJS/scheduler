// note: this module specifier comes from the import-map
//    in index.html; swap "src" for "dist" here to test
//    against the dist/* files
import Scheduler from "scheduler/src";


// ***********************

var testResultsEl;

if (document.readyState == "loading") {
	document.addEventListener("DOMContentLoaded",ready,false);
}
else {
	ready();
}


// ***********************

async function ready() {
	var runTestsBtn = document.getElementById("run-tests-btn");
	testResultsEl = document.getElementById("test-results");

	runTestsBtn.addEventListener("click",runTests,false);
}

async function runTests() {
	testResultsEl.innerHTML = "Running... please wait.";

	var [ leadingResult, trailingResult, ] = await Promise.all([
		runLeadingTests(),
		runTrailingTests(),
	]);

	testResultsEl.innerHTML = `${leadingResult}<br>${trailingResult}`;
}

async function runLeadingTests() {
	var results = [];
	var waiter = Scheduler(100,500,/*leading=*/true);

	waiter(logResult);
	await timeout(110);
	waiter(logResult);
	waiter(logResult);
	await timeout(50);
	waiter(logResult);
	waiter(logResult);
	waiter(logResult);
	await timeout(500);

	for (let i = 0; i < 12; i++) {
		waiter(logResult);
		await timeout(60);
	}

	await timeout(500);

	var EXPECTED = 7;
	var FOUND = results.length;
	return (
		`(Leading) ${
			results.length == EXPECTED ?
				"PASSED." :
				`FAILED: expected ${EXPECTED}, found ${FOUND}`
		}`
	);

	// ***********************

	function logResult() {
		results.push("result");
	}
}

async function runTrailingTests() {
	var results = [];
	testResultsEl.innerHTML = "Running... please wait.";

	try {
		let waiter = Scheduler(100,500,/*leading=*/false);

		waiter(logResult);
		await timeout(110);
		waiter(logResult);
		waiter(logResult);
		await timeout(50);
		waiter(logResult);
		waiter(logResult);
		waiter(logResult);
		await timeout(500);

		for (let i = 0; i < 30; i++) {
			waiter(logResult);
			await timeout(60);
		}

		await timeout(500);

		let EXPECTED = 6;
		let FOUND = results.length;
		return (
			`(Trailing) ${
				results.length == EXPECTED ?
					"PASSED." :
					`FAILED: expected ${EXPECTED}, found ${FOUND}`
			}`
		);
	}
	catch (err) {
		logError(err);
		console.log("results",results);
		testResultsEl.innerHTML = "FAILED (see console)";
	}

	// ***********************

	function logResult() {
		results.push("result");
	}
}

function timeout(ms) {
	return new Promise(res => setTimeout(res,ms));
}

function logError(err,returnLog = false) {
	var err = `${
			err.stack ? err.stack : err.toString()
		}${
			err.cause ? `\n${logError(err.cause,/*returnLog=*/true)}` : ""
	}`;
	if (returnLog) return err;
	else console.error(err);
}
