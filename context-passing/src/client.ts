import { Connection, Client } from '@temporalio/client'
import { example } from './workflows'
import { nanoid } from 'nanoid'
import { ClientContextInterceptor } from './clientInterceptors'
import { AppContext } from './appContext'

async function run() {
  const connection = await Connection.connect({ address: 'localhost:7233' })

  const client = new Client({
    connection,
    interceptors: { workflow: [new ClientContextInterceptor()] },
  })

  const orgs = ['borneo', 'securezapp', 'temporal']
  const workflows = orgs.map((org, idx) => AppContext.run({ org }, async () => {
    return client.workflow.execute(example, {
      taskQueue: 'hello-world',
      args: [org, orgs.length - idx],
      workflowId: 'workflow-' + nanoid(),
    })
  }))

  const results = await Promise.all(workflows)
  console.log(results)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
