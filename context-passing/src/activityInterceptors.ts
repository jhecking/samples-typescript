import { ActivityInterceptorsFactory, ActivityInboundCallsInterceptor } from '@temporalio/worker'

class ActivityContextInterceptor implements ActivityInboundCallsInterceptor {
  async execute(input: any, next: any) {
    const context = JSON.parse(Buffer.from(input.headers.context.data).toString())
    console.log('Inbound activity context:', context)
    return next(input)
  }
}

export const activityInterceptorsFactory: ActivityInterceptorsFactory = () => {
  return {
    inbound: new ActivityContextInterceptor(),
  }
}
