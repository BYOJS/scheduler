export default Scheduler;


// ***********************

function Scheduler(initialDelay,maxDelay = Infinity,leading = false) {
	maxDelay = Math.max(initialDelay,maxDelay);
	var entries = new WeakMap();

	return schedule;


	// ***********************

	function schedule(fn) {
		var entry;

		if (entries.has(fn)) {
			entry = entries.get(fn);
		}
		else {
			entry = {
				last: 0,
				timer: null,
			};
			entries.set(fn,entry);
		}

		var now = Date.now();

		if (entry.timer == null) {
			entry.last = now;
		}

		// fire first, then debounce?
		if (leading) {
			if (
				// no timer running yet?
				entry.timer == null ||

				// NO room left to debounce while still under the throttle-max?
				!((now - entry.last) <= maxDelay)
			) {
				clearTimer(entry);
				fn();
				entry.timer = setTimeout(clearTimer,initialDelay,entry);
			}
			else {
				setTimer(fn,entry,now);
			}
		}
		// fire first only *after* at least debounce minimum
		else if (
			// no timer running yet?
			entry.timer == null ||

			// room left to debounce while still under the throttle-max?
			(now - entry.last) < maxDelay
		) {
			setTimer(fn,entry,now);
		}

		if (!entry.cancelFn) {
			entry.cancelFn = function cancel(){
				clearTimer(entry);
				entry.cancel = null;
			};
		}
		return entry.cancelFn;
	}

	function setTimer(fn,entry,now) {
		clearTimer(entry);
		var time = Math.min(initialDelay,Math.max(0,(entry.last + maxDelay) - now));
		entry.timer = setTimeout(run,time,fn,entry);
	}

	function run(fn,entry) {
		clearTimer(entry);
		entry.cancelFn = null;
		entry.last = Date.now();
		fn();
	}

	function clearTimer(entry) {
		if (entry.timer != null) {
			clearTimeout(entry.timer);
		}
		entry.timer = null;
	}
}
