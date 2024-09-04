# Scheduler

[![npm Module](https://badge.fury.io/js/@byojs%2Fscheduler.svg)](https://www.npmjs.org/package/@byojs/scheduler)
[![License](https://img.shields.io/badge/license-MIT-a1356a)](LICENSE.txt)

**Scheduler** is a tool to manage *async scheduling* (debouncing, throttling) of repeated tasks.

```js
var debouncer = Scheduler(100,500);
var throttler = Scheduler(300,300);

window.addEventListener("scroll",() => debouncer(onScroll));

button.addEventListener("click",() => throttler(onButtonClick));
```

----

[Library Tests (Demo)](https://byojs.dev/scheduler/)

----

## Overview

The main purpose of **Scheduler** is to provide [debouncing and throttling](https://css-tricks.com/debouncing-throttling-explained-examples/) controls for managing async task scheduling.

Both scheduling schemes reduce how many repeated calls to a single function will be processed, over a defined interval of time, but use different strategies for determining when to schedule those calls. And both strategies may operate in two forms: *leading* and *trailing*.

### Throttling

[Throttling](https://css-tricks.com/debouncing-throttling-explained-examples/#aa-throttle) prevents a repeated function call from being processed more than once per defined interval of time (e.g., 100ms); an interval timer is started with the *first call* (which resets after each interval transpires).

With leading throttling, the initial call is processed immediately, and any subsequent call attempts, during the interval, will be ignored. With trailing throttling, only the last call is processed, *after* the full interval has transpired (since the first attempted call).

### Debouncing

[Debouncing](https://css-tricks.com/debouncing-throttling-explained-examples/#aa-debounce) resets the delay interval with each attempted call of a function, meaning that the delay of processing an attempted call will continue to increase (unbounded), with each subsequent call attempt during the defined interval.

With leading debouncing, the initial call is immediately processed, after which subsequent calls are debounced; once a full interval transpires without attempted calls, the most recent call is processed. With trailing debouncing, no initial call is processed, and every call is debounced.

Debouncing *might* effectively delay a function call indefinitely, if at least one call attempt is made during each defined interval of time. This is usually not preferred, so you can set an upper bound for the total debouncing delay, after which the most recent call will be processed and the debouncing interval reset.

### Canceling

Any throttled or debounced call that has not yet happened yet, may be canceled before it is processed.

For example, you might debounce the initial display of a spinner (e.g., 500ms) for an async task that can vary in duration (like a network request); debouncing prevents the spinner from flashing visible and then being hidden very quickly -- if the network request finishes very quickly. But if the network request finishes even faster than the 500ms, you can cancel the scheduled display of the spinner.

**Tip:** Debouncing the spinner showing, as described, still risks a potential UX hiccup. The network request might finish shortly after the debounce interval delay has transpired, which still quickly flickers the spinner. And this gets even worse if a subsequent async operation might be triggered (debounced) right after, such that the user might see a series of spinner flickers (on and off). One solution is to *also* debounce the canceling of a previous operation's debounce. In other words, the spinner might delay in being shown, but once shown, delay in its hiding. This approach [is essentially a debounced toggle (see **byojs/Toggler**)](https://github.com/byojs/toggler).

## Deployment / Import

```cmd
npm install @byojs/scheduler
```

The [**@byojs/scheduler** npm package](https://npmjs.com/package/@byojs/scheduler) includes a `dist/` directory with all files you need to deploy **Scheduler** (and its dependencies) into your application/project.

**Note:** If you obtain this library via git instead of npm, you'll need to [build `dist/` manually](#re-building-dist) before deployment.

### Using a bundler

If you are using a bundler (Astro, Vite, Webpack, etc) for your web application, you should not need to manually copy any files from `dist/`.

Just `import` like so:

```js
import Scheduler from "@byojs/scheduler";
```

The bundler tool should pick up and find whatever files (and dependencies) are needed.

### Without using a bundler

If you are not using a bundler (Astro, Vite, Webpack, etc) for your web application, and just deploying the contents of `dist/` as-is without changes (e.g., to `/path/to/js-assets/scheduler/`), you'll need an [Import Map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) in your app's HTML:

```html
<script type="importmap">
{
    "imports": {
        "scheduler": "/path/to/js-assets/scheduler/scheduler.mjs"
    }
}
</script>
```

Now, you'll be able to `import` the library in your app in a friendly/readable way:

```js
import Scheduler from "scheduler";
```

**Note:** If you omit the above *scheduler* import-map entry, you can still `import` **Scheduler** by specifying the proper full path to the `scheduler.mjs` file.

## Scheduler API

The API provided by **Scheduler** is a single function -- the default export of the module.

This function receives one to three arguments, to initialize a scheduler instance -- represented by another function as its return value -- using either [the throttle strategy](#throttling) or [the debounce strategy](#debouncing).

### Configuring *unbounded* debouncing

To initialize an unbounded-debounce scheduler (in *leading* or *trailing* mode):

```js
import Scheduler from "..";

// leading unbounded debounce
var debouncer1 = Scheduler(250);

// trailing unbounded debounce
var debouncer2 = Scheduler(250,Infinity,/*leading=*/false);
```

**Note:** The second argument represents the upper bound for total debouncing delay; `Infinity` (default) allows unbounded debouncing delay.

### Configuring *bounded* debouncing

To initialize a bounded-debounce scheduler (in *leading* or *trailing* mode):

```js
import Scheduler from "..";

// leading bounded (400ms) debounce
var debouncer3 = Scheduler(250,400);

// trailing bounded (400ms) debounce
var debouncer4 = Scheduler(250,400,/*leading=*/false);
```

### Configuring throttling

To initialize a throttle scheduler (in *leading* or *trailing* mode):

```js
import Scheduler from "..";

// leading throttle
var throttler1 = Scheduler(250,250);

// trailing throttle
var throttler2 = Scheduler(250,250,/*leading=*/false);
```

**Note:** As shown, the throttling strategy is activated by passing the same value for the first two arguments (delay and upper-bound).

### Scheduling tasks

Once you've setup a scheduler instance, you can *schedule* repeated function calls by passing the (same) function value in (each time).

For example, with `debouncer1` (as configured above):

```js
debouncer1(someTask);

// later (but within 250ms of previous call)
debouncer1(someTask);

// later (but within 250ms of previous call)
debouncer1(someTask);
```

In this snippet, `someTask` will only be called once (with no arguments), ~250ms after the last call (within the interval) to `debouncer1()`.

You *can* share the same scheduler instance can for debouncing/throttling as many different functions as desired, assuming the same timing settings should apply for each of them.

**Warning:** The internal tracking of repeated and async scheduled calls is based on function reference identity. If you pass an inline function expression (such as an `=>` arrow), the function reference will be different each time, and will be treated as entirely separate functions -- thereby defeating the debouncing/throttling. Make sure to use the same stable function reference for all scheduling-related invocations of the scheduler instance function.

### Canceling a scheduled task

The scheduler instance (e.g., `debouncer1` from above) returns yet another function, which is a *canceller*:

```js
var canceller = debouncer1(someTask);

// later (but within 250ms of previous call)
canceller();
```

If `canceller()` (as shown) is called before the debounced `someTask()` function is actually called, that debounced scheduling will be canceled. The same *canceller* will be returned for all subsequent `debouncer1()` calls **within the same interval**:

```js
debouncer1(someTask) === debouncer1(someTask);      // true
```

Since the *canceller* function is stable (within the same interval), it's safe to preserve a reference to that function, to use at any time during that interval. Once the interval transpires, the function becomes *dead* (no-op), and should be discarded.

## Re-building `dist/*`

If you need to rebuild the `dist/*` files for any reason, run:

```cmd
# only needed one time
npm install

npm run build:all
```

## Tests

This library only works in a browser, so its test suite must also be run in a browser.

Visit [`https://byojs.dev/scheduler/`](https://byojs.dev/scheduler/) and click the "run tests" button.

### Run Locally

To instead run the tests locally, first make sure you've [already run the build](#re-building-dist), then:

```cmd
npm test
```

This will start a static file webserver (no server logic), serving the interactive test page from `http://localhost:8080/`; visit this page in your browser and click the "run tests" button.

By default, the `test/test.js` file imports the code from the `src/*` directly. However, to test against the `dist/*` files (as included in the npm package), you can modify `test/test.js`, updating the `/src` in its `import` statements to `/dist` (see the import-map in `test/index.html` for more details).

## License

[![License](https://img.shields.io/badge/license-MIT-a1356a)](LICENSE.txt)

All code and documentation are (c) 2024 Kyle Simpson and released under the [MIT License](http://getify.mit-license.org/). A copy of the MIT License [is also included](LICENSE.txt).
