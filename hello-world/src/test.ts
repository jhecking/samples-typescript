import assert from 'assert'

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

  const result = await worker.runUntil(async () => {
    return client.execute(example, {
      args: ['Temporal'],
      taskQueue: 'hello-world',
      workflowId: 'test-workflow'
    })
  })

  assert.equal(result, 'Hello, Temporal!')
  
  await env.teardown()
}

test().catch(console.error)
