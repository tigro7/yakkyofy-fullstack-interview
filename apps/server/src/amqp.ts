import { Connection } from 'rabbitmq-client'
import config from './config'

const rabbit = new Connection(config.RABBIT_MQ)
rabbit.on('error', err => console.error('RabbitMQ connection error', err))
rabbit.on('connection', () => console.info('Connection successfully (re)established'))

// create your publisher
// const publisher = rabbit.createPublisher({ <config> })
// await publisher.send(<queue>, <body>)

async function publishMessage(queueName: string, body: object) {
  const publisher = rabbit.createPublisher({
    confirm: true, 
  });

  await publisher.send(queueName, Buffer.from(JSON.stringify(body)));
  console.info(`Message sent to queue ${queueName}:`, body);
}

async function onShutdown() {
  console.info('SIGTERM signal received: closing RabbitMQ connections')
  // Waits for pending confirmations and closes the underlying Channel
  // await publisher.close()
  await rabbit.close()
}
process.on('SIGINT', onShutdown)
process.on('SIGTERM', onShutdown)

export { rabbit, publishMessage}
