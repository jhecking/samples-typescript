import { TestWorkflowEnvironment } from '@temporalio/testing'
import { Worker, DefaultLogger, Runtime } from '@temporalio/worker'
import { WorkflowClient } from '@temporalio/client'

import * as activities from './activities';
import { example } from './workflows';

const logger = new DefaultLogger('ERROR')
Runtime.install({ logger })

async function test () {
  const env = await TestWorkflowEnvironment.create({
    testServer: {
      stdio: 'ignore',
    },
    logger
  })
  const worker = await Worker.create({
    connection: env.nativeConnection,
    workflowsPath: require.resolve('./workflows'),
    activities,
    taskQueue: 'hello-world'
  })
  const client = new WorkflowClient({
    connection: env.connection,
  })

  await worker.runUntil(async () => {
    await client.start(example, {
      args: ['Temporal'],
      taskQueue: 'hello-world',
      workflowId: 'test-workflow'
    })
  })
  await env.teardown()
}

test().catch(console.error)
