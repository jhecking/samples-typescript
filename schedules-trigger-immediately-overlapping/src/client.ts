import { Connection, Client, ScheduleOverlapPolicy } from '@temporalio/client';
import { example } from './workflows';
import { nanoid } from 'nanoid';

async function run() {
  const connection = await Connection.connect({ address: 'localhost:7233' });
  const client = new Client({ connection });

  const handle = await client.schedule.create({
    action: {
      type: 'startWorkflow',
      workflowType: example,
      args: ['Temporal'],
      taskQueue: 'hello-world',
    },
    scheduleId: 'workflow-' + nanoid(),
    policies: {
      overlap: ScheduleOverlapPolicy.BUFFER_ONE,
    },
    spec: {
      intervals: [{ every: '1s' }],
    },
    state: {
      triggerImmediately: true,
    }
  });
  console.log(`Created schedule ${handle.scheduleId}`);

  await new Promise((resolve) => setTimeout(resolve, 10000));
  await handle.delete();
  console.log(`Deleted schedule ${handle.scheduleId}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
