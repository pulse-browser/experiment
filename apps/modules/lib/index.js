const Operator = {
  EQUAL: 'equal',
  NOT_EQUAL: 'notEqual',
  IS: 'is',
  OK: 'ok',
  NOT_OK: 'notOk',
  IS_NOT: 'isNot',
  FAIL: 'fail',
  THROWS: 'throws',
};

const specFnRegexp = /zora_spec_fn/;
const zoraInternal = /zora\/dist/;
const filterStackLine = (l) =>
  (l && !zoraInternal.test(l) && !l.startsWith('Error')) ||
  specFnRegexp.test(l);

const getAssertionLocation = () => {
  const err = new Error();
  const stack = (err.stack || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(filterStackLine);
  const userLandIndex = stack.findIndex((l) => specFnRegexp.test(l));
  const stackline =
    userLandIndex >= 1 ? stack[userLandIndex - 1] : stack[0] || 'N/A';
  return stackline.replace(/^at|^@/, '');
};

const decorateWithLocation = (result) => {
  if (result.pass === false) {
    return {
      ...result,
      at: getAssertionLocation(),
    };
  }
  return result;
};

// do not edit .js files directly - edit src/index.jst



var fastDeepEqual = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }



    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0;)
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      var key = keys[i];

      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a!==a && b!==b;
};

var eq = fastDeepEqual;

const equal = (
  actual,
  expected,
  description = 'should be equivalent'
) => ({
  pass: eq(actual, expected),
  actual,
  expected,
  description,
  operator: Operator.EQUAL,
});

const notEqual = (
  actual,
  expected,
  description = 'should not be equivalent'
) => ({
  pass: !eq(actual, expected),
  actual,
  expected,
  description,
  operator: Operator.NOT_EQUAL,
});

const is = (actual, expected, description = 'should be the same') => ({
  pass: Object.is(actual, expected),
  actual,
  expected,
  description,
  operator: Operator.IS,
});

const isNot = (
  actual,
  expected,
  description = 'should not be the same'
) => ({
  pass: !Object.is(actual, expected),
  actual,
  expected,
  description,
  operator: Operator.IS_NOT,
});

const ok = (actual, description = 'should be truthy') => ({
  pass: Boolean(actual),
  actual,
  expected: 'truthy value',
  description,
  operator: Operator.OK,
});

const notOk = (actual, description = 'should be falsy') => ({
  pass: !Boolean(actual),
  actual,
  expected: 'falsy value',
  description,
  operator: Operator.NOT_OK,
});

const fail = (description = 'fail called') => ({
  pass: false,
  actual: 'fail called',
  expected: 'fail not called',
  description,
  operator: Operator.FAIL,
});

const throws = (func, expected, description = 'should throw') => {
  let caught;
  let pass;
  let actual;
  if (typeof expected === 'string') {
    [expected, description] = [void 0, expected];
  }
  try {
    func();
  } catch (err) {
    caught = { error: err };
  }
  pass = caught !== undefined;
  actual = caught?.error;

  if (expected instanceof RegExp) {
    pass = expected.test(actual) || expected.test(actual && actual.message);
    actual = actual?.message ?? actual;
    expected = String(expected);
  } else if (typeof expected === 'function' && caught) {
    pass = actual instanceof expected;
    actual = actual.constructor;
  } else {
    actual = pass ? 'error thrown' : 'no error thrown';
  }

  return {
    pass,
    actual,
    expected: expected ?? 'any error thrown',
    description: description,
    operator: Operator.THROWS,
  };
};

const Assert$1 = {
  equal,
  equals: equal,
  eq: equal,
  deepEqual: equal,
  same: equal,
  notEqual,
  notEquals: notEqual,
  notEq: notEqual,
  notDeepEqual: notEqual,
  notSame: notEqual,
  is,
  isNot,
  ok,
  truthy: ok,
  notOk,
  falsy: notOk,
  fail,
  throws,
};

const noop$1 = () => {};

const hook = (onResult) => (assert) =>
  Object.fromEntries(
    Object.keys(Assert$1).map((methodName) => [
      methodName,
      (...args) => onResult(assert[methodName](...args)),
    ])
  );

var assertFactory = (
  { onResult = noop$1 } = {
    onResult: noop$1,
  }
) => {
  const hookOnAssert = hook((item) => {
    const result = decorateWithLocation(item);
    onResult(result);
    return result;
  });

  return hookOnAssert(Object.create(Assert$1));
};

const Assert = Assert$1;

const MESSAGE_TYPE = {
  TEST_START: 'TEST_START',
  ASSERTION: 'ASSERTION',
  TEST_END: 'TEST_END',
  ERROR: 'ERROR',
  UNKNOWN: 'UNKNOWN',
};

const newTestMessage = ({ description, skip }) => ({
  type: MESSAGE_TYPE.TEST_START,
  data: { description, skip },
});

const assertionMessage = (data) => ({
  type: MESSAGE_TYPE.ASSERTION,
  data,
});

const testEndMessage = ({ description, executionTime }) => ({
  type: MESSAGE_TYPE.TEST_END,
  data: {
    description,
    executionTime,
  },
});

const errorMessage = ({ error }) => ({
  type: MESSAGE_TYPE.ERROR,
  data: {
    error,
  },
});

const isNode$1 = typeof process !== 'undefined';

const flatDiagnostic = ({ pass, description, ...rest }) => rest;

const createReplacer = () => {
  const visited = new Set();
  return (key, value) => {
    if (isObject(value)) {
      if (visited.has(value)) {
        return '[__CIRCULAR_REF__]';
      }

      visited.add(value);
    }

    if (typeof value === 'symbol') {
      return value.toString();
    }

    return value;
  };
};

const isObject = (candidate) =>
  typeof candidate === 'object' && candidate !== null;

const stringify = (value) => JSON.stringify(value, createReplacer());

const defaultSerializer = stringify;

const defaultLogger = (value) => console.log(value);

const isAssertionFailing = (message) =>
  message.type === MESSAGE_TYPE.ASSERTION && !message.data.pass;

const isSkipped = (message) =>
  message.type === MESSAGE_TYPE.TEST_START && message.data.skip;

const eventuallySetExitCode = (message) => {
  if (isNode$1 && isAssertionFailing(message)) {
    process.exitCode = 1;
  }
};

const compose = (fns) => (arg) =>
  fns.reduceRight((arg, fn) => fn(arg), arg);

const filter = (predicate) =>
  async function* (stream) {
    for await (const element of stream) {
      if (predicate(element)) {
        yield element;
      }
    }
  };

const idSequence = () => {
  let id = 0;
  return () => ++id;
};

const createCounter = () => {
  const nextId = idSequence();
  let success = 0;
  let failure = 0;
  let skip = 0;

  return Object.create(
    {
      increment(message) {
        const { type } = message;
        if (isSkipped(message)) {
          skip++;
        } else if (type === MESSAGE_TYPE.ASSERTION) {
          success += message.data.pass === true ? 1 : 0;
          failure += message.data.pass === false ? 1 : 0;
        }
      },
      nextId,
    },
    {
      success: {
        enumerable: true,
        get() {
          return success;
        },
      },
      failure: {
        enumerable: true,
        get() {
          return failure;
        },
      },
      skip: {
        enumerable: true,
        get() {
          return skip;
        },
      },
      total: {
        enumerable: true,
        get() {
          return skip + failure + success;
        },
      },
    }
  );
};

const createWriter = ({
  log = defaultLogger,
  serialize = defaultSerializer,
  version = 13,
} = {}) => {
  const print = (message, padding = 0) => {
    log(message.padStart(message.length + padding * 4)); // 4 white space used as indent
  };

  const printYAML = (obj, padding = 0) => {
    const YAMLPadding = padding + 0.5;
    print('---', YAMLPadding);
    for (const [prop, value] of Object.entries(obj)) {
      print(`${prop}: ${serialize(value)}`, YAMLPadding + 0.5);
    }
    print('...', YAMLPadding);
  };

  const printComment = (comment, padding = 0) => {
    print(`# ${comment}`, padding);
  };

  const printBailOut = () => {
    print('Bail out! Unhandled error.');
  };

  const printTestStart = (newTestMessage) => {
    const {
      data: { description },
    } = newTestMessage;
    printComment(description);
  };

  const printAssertion = (assertionMessage, { id, comment = '' }) => {
    const { data } = assertionMessage;
    const { pass, description } = data;
    const label = pass === true ? 'ok' : 'not ok';
    const directiveComment = comment ? ` # ${comment}` : '';
    print(`${label} ${id} - ${description}` + directiveComment);
    if (pass === false) {
      printYAML(flatDiagnostic(data));
    }
  };

  const printSummary = ({ success, skip, failure, total }) => {
    print('', 0);
    print(`1..${total}`);
    printComment(`tests ${total}`, 0);
    printComment(`pass  ${success}`, 0);
    printComment(`fail  ${failure}`, 0);
    printComment(`skip  ${skip}`, 0);
  };

  const printHeader = () => {
    print(`TAP version ${version}`);
  };

  return {
    print,
    printYAML,
    printComment,
    printBailOut,
    printTestStart,
    printAssertion,
    printSummary,
    printHeader,
  };
};

const isNotTestEnd = ({ type }) => type !== MESSAGE_TYPE.TEST_END;
const filterOutTestEnd = filter(isNotTestEnd);

const writeMessage = ({ writer, nextId }) => {
  const writerTable = {
    [MESSAGE_TYPE.ASSERTION](message) {
      return writer.printAssertion(message, { id: nextId() });
    },
    [MESSAGE_TYPE.TEST_START](message) {
      if (message.data.skip) {
        const skippedAssertionMessage = assertionMessage({
          description: message.data.description,
          pass: true,
        });
        return writer.printAssertion(skippedAssertionMessage, {
          comment: 'SKIP',
          id: nextId(),
        });
      }
      return writer.printTestStart(message);
    },
    [MESSAGE_TYPE.ERROR](message) {
      writer.printBailOut();
      throw message.data.error;
    },
  };
  return (message) => writerTable[message.type]?.(message);
};

var createTAPReporter = ({ log = defaultLogger, serialize = defaultSerializer } = {}) =>
  async (messageStream) => {
    const writer = createWriter({
      log,
      serialize,
    });
    const counter = createCounter();
    const write = writeMessage({ writer, nextId: counter.nextId });
    const stream = filterOutTestEnd(messageStream);

    writer.printHeader();
    for await (const message of stream) {
      counter.increment(message);
      write(message);
      eventuallySetExitCode(message);
    }
    writer.printSummary(counter);
  };

var createJSONReporter = ({
  log = defaultLogger,
  serialize = defaultSerializer,
} = {}) => {
  const print = compose([log, serialize]);
  return async (messageStream) => {
    for await (const message of messageStream) {
      eventuallySetExitCode(message);
      print(message);
    }
  };
};

const findConfigurationValue = (name) => {
  if (isNode) {
    return process.env[name];
  } else if (isDeno) {
    return Deno.env.get(name);
  } else if (isBrowser) {
    return window[name];
  }
};

const isNode = typeof process !== 'undefined';
const isBrowser = typeof window !== 'undefined';
const isDeno = typeof Deno !== 'undefined';

const DEFAULT_TIMEOUT = 5_000;
const defaultOptions = Object.freeze({
  skip: false,
  timeout: findConfigurationValue('ZORA_TIMEOUT') || DEFAULT_TIMEOUT,
});
const noop = () => {};

const isTest = (assertionLike) =>
  assertionLike[Symbol.asyncIterator] !== void 0;

Assert.test = (description, spec, opts = defaultOptions) =>
  test$1(description, spec, opts);

Assert.skip = (description, spec, opts = defaultOptions) =>
  test$1(description, spec, { ...opts, skip: true });

Assert.only = () => {
  throw new Error(`Can not use "only" method when not in "run only" mode`);
};

const createTimeoutResult = ({ timeout }) => ({
  operator: 'timeout',
  pass: false,
  actual: `test takes longer than ${timeout}ms to complete`,
  expected: `test takes less than ${timeout}ms to complete`,
  description:
    'The test did no complete on time. refer to https://github.com/lorenzofox3/zora/tree/master/zora#test-timeout for more info',
});

const test$1 = (description, spec, opts = defaultOptions) => {
  const { skip = false, timeout = DEFAULT_TIMEOUT } = opts;
  const assertions = [];
  let executionTime;
  let done = false;
  let error;

  const onResult = (assertion) => {
    if (done) {
      throw new Error(`test "${description}"
tried to collect an assertion after it has run to its completion.
You might have forgotten to wait for an asynchronous task to complete
------
${spec.toString()}`);
    }

    assertions.push(assertion);
  };

  const specFn = skip
    ? noop
    : function zora_spec_fn() {
        return spec(assertFactory({ onResult }));
      };

  const testRoutine = (async function () {
    try {
      let timeoutId;
      const start = Date.now();
      const result = await Promise.race([
        specFn(),
        new Promise((resolve) => {
          timeoutId = setTimeout(() => {
            onResult(createTimeoutResult({ timeout }));
            resolve();
          }, timeout);
        }),
      ]);
      clearTimeout(timeoutId);
      executionTime = Date.now() - start;
      return result;
    } catch (e) {
      error = e;
    } finally {
      done = true;
    }
  })();

  return Object.assign(testRoutine, {
    [Symbol.asyncIterator]: async function* () {
      yield newTestMessage({ description, skip });
      await testRoutine;
      for (const assertion of assertions) {
        if (isTest(assertion)) {
          yield* assertion;
        } else {
          yield assertionMessage(assertion);
        }
      }

      if (error) {
        yield errorMessage({ error });
      }

      yield testEndMessage({ description, executionTime });
    },
  });
};

const createAssert = assertFactory;

const createHarness$1 = ({ onlyMode = false } = {}) => {
  const tests = [];

  // WARNING if the "onlyMode is passed to any harness, all the harnesses will be affected.
  // However, we do not expect multiple harnesses to be used in the same process
  if (onlyMode) {
    const { skip, test } = Assert;
    Assert.test = skip;
    Assert.only = test;
  }

  const { test, skip, only } = createAssert({
    onResult: (test) => tests.push(test),
  });

  // for convenience
  test.only = only;
  test.skip = skip;

  return {
    only,
    test,
    skip,
    report({ reporter }) {
      return reporter(createMessageStream(tests));
    },
  };
};

async function* createMessageStream(tests) {
  for (const test of tests) {
    yield* test;
  }
}

let autoStart = true;

const harness = createHarness$1({
  onlyMode: findConfigurationValue('ZORA_ONLY') !== void 0,
});

const only = harness.only;

const test = harness.test;

const skip = harness.skip;

const report = harness.report;

const hold = () => !(autoStart = false);

const createHarness = (opts) => {
  hold();
  return createHarness$1(opts);
};

const start = async () => {
  if (autoStart) {
    const reporter =
      findConfigurationValue('ZORA_REPORTER') === 'json'
        ? createJSONReporter()
        : createTAPReporter();
    await report({ reporter });
  }
};

// on next tick start reporting
if (!isBrowser) {
  setTimeout(start, 0);
} else {
  window.addEventListener('load', start);
}

export { Assert, createHarness, createJSONReporter, createTAPReporter, hold, only, report, skip, test };
