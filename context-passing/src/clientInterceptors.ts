import { WorkflowClientInterceptor, WorkflowStartInput } from '@temporalio/client'

export class ClientContextInterceptor implements WorkflowClientInterceptor {
  async start(input: WorkflowStartInput, next: any): Promise<string> {
    const context = { org: 'borneo' }
    console.log('Outbound client context:', context)
    input.headers['context'] = { data: Buffer.from(JSON.stringify(context)) }
    return next(input)
  }
}
