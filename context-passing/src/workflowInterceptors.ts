import {
  ActivityInput,
  WorkflowInterceptorsFactory,
  WorkflowInboundCallsInterceptor,
  WorkflowExecuteInput,
  WorkflowOutboundCallsInterceptor,
} from '@temporalio/workflow'
import { Payload } from '@temporalio/common'

let contextPayload: Payload

class WorkflowInboundContextInterceptor implements WorkflowInboundCallsInterceptor {
  async execute(input: WorkflowExecuteInput, next: any) {
    contextPayload = input.headers.context
    return next(input)
  }
}

class WorkflowOutboundContextInterceptor implements WorkflowOutboundCallsInterceptor {
  async scheduleActivity(input: ActivityInput, next: any) {
    input.headers.context = contextPayload
    return next(input)
  }
}

export const interceptors: WorkflowInterceptorsFactory = () => {
  return {
    inbound: [new WorkflowInboundContextInterceptor()],
    outbound: [new WorkflowOutboundContextInterceptor()],
  }
}
