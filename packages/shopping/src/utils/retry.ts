// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {HttpErrors} from '@loopback/rest';
import {promisify} from 'util';
import debugFactory from 'debug';
const debug = debugFactory('loopback:example:shopping');

export interface TaskStatus<T> {
  done: boolean;
  value?: T | null;
}

/**
 * A task that can be retried
 */
export interface Task<T> {
  run(): Promise<TaskStatus<T>>;
  description: string;
}

/**
 * Options for retry
 */
export interface RetryOptions {
  /**
   * Maximum number of tries including the first run.
   */
  maxTries?: number;
  /**
   * Milliseconds to wait after each try
   */
  interval?: number;
}

/**
 * Retry a task for number of times with the given interval in ms
 * @param task Task object {run, description}
 * @param maxTries Maximum number of tries (including the first run),
 * default to 10
 * @param interval Milliseconds to wait after each try, default to 100ms
 */
export async function retry<T>(
  task: Task<T>,
  {maxTries = 10, interval = 100}: RetryOptions = {},
): Promise<T> {
  if (maxTries < 1) maxTries = 1;
  let triesLeft = maxTries;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    debug(
      'Try %s (%d/%d)',
      task.description,
      maxTries - triesLeft + 1,
      maxTries,
    );
    const status = await task.run();
    if (status.done) return status.value!;
    if (--triesLeft > 0) {
      debug('Wait for %d ms', interval);
      await sleep(interval);
    } else {
      // No more retries, timeout
      const msg = `Failed to ${task.description} after ${
        maxTries * interval
      } ms`;
      debug('%s', msg);
      throw new HttpErrors.RequestTimeout(msg);
    }
  }
}

/**
 * Sleep for the given milliseconds
 * @param ms Number of milliseconds to wait
 */
export const sleep = promisify(setTimeout); // (ms: number) => Promise<void>
