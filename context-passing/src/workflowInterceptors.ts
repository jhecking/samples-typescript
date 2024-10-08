import {
  ActivityInput,
  WorkflowInterceptorsFactory,
  WorkflowInboundCallsInterceptor,
  WorkflowExecuteInput,
  WorkflowOutboundCallsInterceptor,
} from '@temporalio/workflow'

let context: Uint8Array | null | undefined

class WorkflowInboundContextInterceptor implements WorkflowInboundCallsInterceptor {
  async execute(input: WorkflowExecuteInput, next: any) {
    context = input.headers.context?.data
    return next(input)
  }
}

class WorkflowOutboundContextInterceptor implements WorkflowOutboundCallsInterceptor {
  async scheduleActivity(input: ActivityInput, next: any) {
    input.headers.context = { data: context }
    return next(input)
  }
}

export const interceptors: WorkflowInterceptorsFactory = () => {
  return {
    inbound: [new WorkflowInboundContextInterceptor()],
    outbound: [new WorkflowOutboundContextInterceptor()],
  }
}
