export interface PollOptions {
  /**
   * Total timeout in milliseconds before throwing an error.
   * @default 10000 (10 seconds)
   */
  timeoutMs?: number;

  /**
   * Interval in milliseconds between poll attempts.
   * @default 1000 (1 second)
   */
  intervalMs?: number;

  /**
   * Custom descriptive error message if timeout is reached.
   */
  message?: string;

  /**
   * Whether to suppress exceptions thrown during poll attempts.
   * If true, errors thrown by action() are retained until timeout.
   * @default true
   */
  suppressErrors?: boolean;
}

export class PollHelper {
  /**
   * Repeatedly executes an asynchronous action until the returned value satisfies
   * the predicate function or timeout is exceeded.
   *
   * @param action Asynchronous function returning value of type T
   * @param predicate Function evaluating whether the returned value satisfies the condition
   * @param options Polling configuration (timeoutMs, intervalMs, message, suppressErrors)
   * @returns The resolved value satisfying the predicate
   *
   * @example
   * ```ts
   * const email = await PollHelper.pollUntil(
   *   () => mailClient.getLatestEmail(userEmail),
   *   (mail) => mail !== null && mail.subject.includes('Activate Account'),
   *   { timeoutMs: 15000, intervalMs: 1000, message: 'Activation email not received' }
   * );
   * ```
   */
  static async pollUntil<T>(
    action: () => Promise<T>,
    predicate: (result: T) => boolean | Promise<boolean>,
    options: PollOptions = {}
  ): Promise<T> {
    const {
      timeoutMs = 10000,
      intervalMs = 1000,
      message = 'Condition was not met within the timeout period.',
      suppressErrors = true,
    } = options;

    const startTime = Date.now();
    let lastResult: T | undefined;
    let lastError: Error | undefined;

    while (Date.now() - startTime < timeoutMs) {
      try {
        const result = await action();
        lastResult = result;
        const isSatisfied = await predicate(result);

        if (isSatisfied) {
          return result;
        }
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (!suppressErrors) {
          throw lastError;
        }
      }

      const elapsed = Date.now() - startTime;
      const remaining = timeoutMs - elapsed;
      if (remaining <= 0) {
        break;
      }

      await this.sleep(Math.min(intervalMs, remaining));
    }

    const elapsedTotal = Date.now() - startTime;
    const errorDetails = [
      `[PollHelper] ${message}`,
      `Elapsed: ${elapsedTotal}ms (Timeout: ${timeoutMs}ms, Interval: ${intervalMs}ms)`,
      lastResult !== undefined ? `Last Result: ${JSON.stringify(lastResult)}` : undefined,
      lastError ? `Last Error: ${lastError.message}` : undefined,
    ]
      .filter(Boolean)
      .join(' | ');

    throw new Error(errorDetails);
  }

  /**
   * Polls an asynchronous boolean condition until it returns true or times out.
   *
   * @param condition Async function returning a boolean
   * @param options Polling configuration
   * @returns Resolves to true when condition passes
   *
   * @example
   * ```ts
   * await PollHelper.pollCondition(
   *   async () => (await orderApi.getOrderStatus(orderId)) === 'COMPLETED',
   *   { timeoutMs: 20000, intervalMs: 2000, message: 'Order was not completed' }
   * );
   * ```
   */
  static async pollCondition(
    condition: () => Promise<boolean>,
    options: PollOptions = {}
  ): Promise<boolean> {
    return await this.pollUntil(condition, (satisfied) => satisfied === true, options);
  }

  /**
   * Non-blocking delay helper
   * @param ms Milliseconds to wait
   */
  static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
