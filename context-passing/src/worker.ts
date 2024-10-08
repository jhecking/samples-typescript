import { NativeConnection, Worker } from '@temporalio/worker'
import { activityInterceptorsFactory } from './activityInterceptors'
import * as activities from './activities'

async function run() {
  const connection = await NativeConnection.connect({
    address: 'localhost:7233',
  })
  const worker = await Worker.create({
    connection,
    namespace: 'default',
    taskQueue: 'hello-world',
    workflowsPath: require.resolve('./workflows'),
    interceptors: {
      activity: [activityInterceptorsFactory],
      workflowModules: [require.resolve('./workflowInterceptors')],
    },
    activities,
  })
  await worker.run()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
