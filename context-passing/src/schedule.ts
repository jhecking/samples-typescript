import { Connection, Client } from '@temporalio/client'
import { example } from './workflows'
import { nanoid } from 'nanoid'
import { WorkflowClientContextPropagator, ScheduleClientContextPropagator } from './clientInterceptors'
import { AppContext } from './appContext'

async function run() {
  const connection = await Connection.connect({ address: 'localhost:7233' })

  const client = new Client({
    connection,
    interceptors: {
      workflow: [new WorkflowClientContextPropagator()],
      schedule: [new ScheduleClientContextPropagator()]
    },
  })

  await AppContext.run({ org: 'temporal' }, async () => {
    await client.schedule.create({
      scheduleId: 'schedule-' + nanoid(),
      spec: {
        intervals: [{ every: '10s' }],
      },
      action: {
        type: 'startWorkflow',
        workflowType: example,
        workflowId: 'workflow-' + nanoid(),
        taskQueue: 'hello-world',
        args: ['World', 0],
      },
      state: {
        remainingActions: 3,
      }
    })
  })
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
