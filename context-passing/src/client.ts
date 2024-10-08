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

  const org = 'borneo'
  await AppContext.run({ org }, async () => {
    const handle = await client.workflow.start(example, {
      taskQueue: 'hello-world',
      args: ['Temporal'],
      workflowId: 'workflow-' + nanoid(),
    })
    console.log(`Started workflow ${handle.workflowId}`)

    console.log(await handle.result()) // Hello, Temporal!
  })
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
