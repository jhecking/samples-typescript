import { AppContext } from './appContext'

export async function greet(name: string): Promise<string> {
  const context = AppContext.current()
  console.log('App context inside activity: ', context)
  return `Hello, ${name}!`
}
