import { CreateScheduleInput, CreateScheduleOutput, ScheduleClientInterceptor, WorkflowClientInterceptor, WorkflowStartInput } from '@temporalio/client'
import { AppContext } from './appContext'

export class WorkflowClientContextPropagator implements WorkflowClientInterceptor {
  async start(input: WorkflowStartInput, next: any): Promise<string> {
    const context = AppContext.current()
    console.log('Outbound client context:', context)
    input.headers['context'] = AppContext.toPayload(context)
    return next(input)
  }
}

export class ScheduleClientContextPropagator implements ScheduleClientInterceptor {
  async create(input: CreateScheduleInput, next: any): Promise<CreateScheduleOutput> {
    const context = AppContext.current()
    console.log('Outbound client context:', context)
    input.headers['context'] = AppContext.toPayload(context)
    return next(input)
  }
}
