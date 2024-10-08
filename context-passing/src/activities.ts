import { AppContext } from './appContext'

export async function greet(name: string): Promise<string> {
  const context = AppContext.current()
  console.log('Context in activity: ', context)
  return `Hello, ${name}!`
}
