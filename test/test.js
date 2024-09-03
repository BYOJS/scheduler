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
	var results = [];
	var waiter = Scheduler(100,500);

	testResultsEl.innerHTML = "Running... please wait.";

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

	var EXPECTED = 6;
	var FOUND = results.length;
	testResultsEl.innerHTML = (
		results.length == EXPECTED ? "PASSED." : `FAILED: expected ${EXPECTED}, found ${FOUND}`
	);

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
