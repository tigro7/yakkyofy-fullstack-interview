import { Connection } from 'rabbitmq-client'
import config from './config'

const rabbit = new Connection(config.RABBIT_MQ)
rabbit.on('error', err => console.error('RabbitMQ connection error', err))
rabbit.on('connection', () => console.info('Connection successfully (re)established'))

// create your publisher
// const publisher = rabbit.createPublisher({ <config> })

async function onShutdown() {
  console.info('SIGTERM signal received: closing RabbitMQ connections')
  // Waits for pending confirmations and closes the underlying Channel
  // await publisher.close()
  // Stop consuming. Wait for any pending message handlers to settle.
  // await sub.close()
  await rabbit.close()
}
process.on('SIGINT', onShutdown)
process.on('SIGTERM', onShutdown)

export { rabbit }
