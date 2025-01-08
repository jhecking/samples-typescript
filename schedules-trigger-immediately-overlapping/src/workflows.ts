import { proxyActivities, sleep } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';

const { greet } = proxyActivities<typeof activities>({
  startToCloseTimeout: '10 minutes',
  retry: {
    initialInterval: '60 seconds',
    maximumAttempts: 2,
  }
});

export async function example(name: string) {
  await greet(name);
  await sleep('10s');
}
