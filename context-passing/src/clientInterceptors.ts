import { WorkflowClientInterceptor, WorkflowStartInput } from '@temporalio/client'
import { AppContext } from './appContext'

export class ClientContextInterceptor implements WorkflowClientInterceptor {
  async start(input: WorkflowStartInput, next: any): Promise<string> {
    const context = AppContext.current()
    console.log('Outbound client context:', context)
    input.headers['context'] = { data: Buffer.from(JSON.stringify(context)) }
    return next(input)
  }
}
