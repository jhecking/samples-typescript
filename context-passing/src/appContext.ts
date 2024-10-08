import { AsyncLocalStorage } from 'async_hooks'
import { Payload } from '@temporalio/common'

type Context = Record<string, any>

export class AppContext {
  private static asyncLocalStorage = new AsyncLocalStorage<Context>()

  public static async run<T>(context: Context, fn: () => T | Promise<T>): Promise<T> {
    return AppContext.asyncLocalStorage.run(context, fn)
  }

  public static current(): Context {
    const store = AppContext.asyncLocalStorage.getStore()
    if (!store) {
      throw new Error('No context available')
    }
    return store
  }

  public static toPayload(context: Context): Payload {
    return { data: Buffer.from(JSON.stringify(context)) }
  }

  public static fromPayload(payload: Payload): Context {
    if (!payload.data) {
      return {}
    }
    return JSON.parse(Buffer.from(payload.data).toString())
  }
}
