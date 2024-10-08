import { ActivityInterceptorsFactory, ActivityInboundCallsInterceptor } from '@temporalio/worker'
import { AppContext } from './appContext'

class ActivityContextInterceptor implements ActivityInboundCallsInterceptor {
  async execute(input: any, next: any) {
    const context = JSON.parse(Buffer.from(input.headers.context.data).toString())
    console.log('Inbound activity context:', context)
    return AppContext.run(context, async () => {
      return next(input)
    })
  }
}

export const activityInterceptorsFactory: ActivityInterceptorsFactory = () => {
  return {
    inbound: new ActivityContextInterceptor(),
  }
}
