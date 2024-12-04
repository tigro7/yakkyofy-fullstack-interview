import { Connection } from 'rabbitmq-client'
import { connection } from './database'
import config from './config'
import puppeteer from 'puppeteer'
import Screenshot from '../../server/src/schemas/screenshot'

const rabbit = new Connection(config.RABBIT_MQ)
rabbit.on('error', err => console.error('RabbitMQ connection error', err))
rabbit.on('connection', () => console.info('RabbitMQ Connection successfully (re)established'))

// TODO: here you should create your subscriber which is going to consume messages from the queue
// in this case, the consumer is going to be a microservice which is going to delete users from the database

// Wait for MongoDB connection and resolve errors on trying to access db before connection is established
async function waitForMongoConnection(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (connection.readyState === 1) { // Se la connessione è già attiva
      console.info('MongoDB already connected');
      resolve();
      return;
    }

    console.info('MongoDB not connected, waiting...');
    
    // Gestisci il caso di connessione
    connection.on('connected', () => {
      console.info('MongoDB connected');
      resolve(); // Risolvi quando la connessione è pronta
    });

    // Gestisci il caso di errore
    connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      reject(err); // Rifiuta se c'è un errore di connessione
    });

    // Gestisci la disconnessione
    connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
  });
}

// subscribers
async function startSubscriber() {
  console.info('Starting RabbitMQ subscriber');
  try {
    console.info('Waiting for MongoDB connection');
    await waitForMongoConnection();
    console.info('MongoDB connection established');

    // RabbitMQ Subscriber
    const subscriber = rabbit.createConsumer(
      {
        queue: 'screenshot_queue',
      },
      async (msg) => {
        const message = JSON.parse(msg.body.toString());
        const { id } = message;

        console.info(`Processing screenshot request for ID: ${id}`);

        try {
          // Recupera lo screenshot
          console.info(`Awaiting connection.collection: ${id}`);
          const screenshot = await Screenshot.findById(id).lean();
          if (!screenshot) {
            throw new Error(`Screenshot with ID ${id} not found`);
          }

          console.info(`Screenshot retrieved: ${screenshot.url}`);

          // Use Puppeteer to capture a screenshot
          const browser = await puppeteer.launch();
          const page = await browser.newPage();

          try {
            await page.goto(screenshot.url, { waitUntil: 'networkidle2' });
            const screenshotBuffer = await page.screenshot({ fullPage: true });

            // Update the screenshot with the actual screenshot and mark as done
            screenshot.file = Buffer.from(screenshotBuffer);
            screenshot.status = 'done';
            await Screenshot.updateOne(
              { _id: id },
              { $set: { file: screenshot.file, status: screenshot.status } }
            );

            console.info(`Screenshot captured and saved for ID: ${id}`);
          } catch (screenshotError) {
            console.error(`Failed to capture screenshot for URL ${screenshot.url}: ${screenshotError}`);
          } finally {
            await browser.close();
          }
        } catch (error) {
          console.error(`Error processing message for ID ${id}: ${error}`);
        }
      }
    );

    subscriber.on('error', err => console.error('Consumer error (saturation)', err));
  } catch (error) {
    console.error('Error:', error);
  }
}

// Start the Subscriber
startSubscriber();

async function onShutdown() {
  // console.info('SIGTERM signal received: closing RabbitMQ connections')
  // await subscriber.close()
  await rabbit.close()
}
process.on('SIGINT', onShutdown)
process.on('SIGTERM', onShutdown)
