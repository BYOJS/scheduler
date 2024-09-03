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

The main purpose of **Scheduler** is to provide [debouncing and throttling](https://css-tricks.com/debouncing-throttling-explained-examples/) controls for managing async task scheduling. Both scheduling schemes reduce how many repeated calls to a single function will be processed, over a defined interval of time, but use different strategies for determining when to schedule those calls. And both strategies may operate in two forms: *leading* and *trailing*.

### Throttling

Throttling prevents a repeated function call from being processed more than once per defined interval of time (e.g., 100ms); an interval timer is started with the *first call* (which resets after each interval transpires).

With leading throttling, the initial call is processed immediately, and any subsequent call attempts, during the interval, will be ignored. With trailing throttling, only the last call is processed, *after* the full interval has transpired (since the first attempted call).

### Debouncing

Debouncing resets the delay interval with each attempted call of a function, meaning that the delay of processing an initial attempted call will continue to increase (unbounded), with each subsequent call attempt during the defined interval.

With leading debouncing, the initial call is immediately processed, after which subsequent calls are debounced; once a full interval transpires without attempted calls, the most recent call is processed. With trailing debouncing, no initial call is processed.

Debouncing could effectively delay a call being processed indefinitely, as long as at least one call attempt is made during each defined interval of time. So, you may optionally set an upper bound for the total debouncing delay, after which the most recent call will be processed and the debouncing interval reset.

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

To initialize an unbounded-debounce scheduler (in *leading* or *trailing* mode):

```js
// leading unbounded debounce
var debouncer1 = Scheduler(250);

// trailing unbounded debounce
var debouncer2 = Scheduler(250,Infinity,/*leading=*/false);
```

**Note:** The second argument represents the upper bound for total debouncing delay; `Infinity` (default) allows unbounded debouncing delay.

To initialize a bounded-debounce scheduler (in *leading* or *trailing* mode):

```js
// leading bounded (400ms) debounce
var debouncer3 = Scheduler(250,400);

// trailing bounded (400ms) debounce
var debouncer4 = Scheduler(250,400,/*leading=*/false);
```

To initialize a throttle scheduler (in *leading* or *trailing* mode):

```js
// leading throttle
var throttler1 = Scheduler(250,250);

// trailing throttle
var throttler2 = Scheduler(250,250,/*leading=*/false);
```

**Note:** As shown, the throttling strategy is activated by passing the same value for the first two arguments (delay and upper-bound).

----

Once you've setup a scheduler instance, you can schedule function calls by passing the (same) function value in (each time):

```js
debouncer1(someFunc);

// later (but within 250ms of previous call)
debouncer1(someFunc);

// later (but within 250ms of previous call)
debouncer1(someFunc);
```

In this snippet, `someFunc` will only be called once (with no arguments), ~250ms after the last call (within the interval) to `debouncer1()`.

The same scheduler instance can be used for debouncing/throttling as many different functions as desired, assuming the timing settings should apply for all of them.

**Warning:** The internal tracking of repeated and async scheduled calls is based on function reference identity. If you pass an inline function expression (such as an `=>` arrow), the function reference will be different each time, and will be treated as entirely separate functions -- thereby defeating the debouncing/throttling. Make sure to use the same stable function reference for all scheduling-related invocations of the scheduler instance function.

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
