import { proxyActivities, sleep } from '@temporalio/workflow'
import type * as activities from './activities'

const { greet } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
})

export async function example(name: string, delay: number): Promise<string> {
  await sleep(delay * 1000)
  return await greet(name)
}
