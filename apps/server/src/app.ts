import './database'
import './amqp'

import express, { Request, Response } from 'express'

import ExpressMongoSanitize from 'express-mongo-sanitize'
import compression from 'compression'
import config from './config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import xss from 'xss-clean'
import Screenshot from './schemas/screenshot'
import { publishMessage } from './amqp'

const app = express()
app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// sanitize request data
app.use(xss())
app.use(ExpressMongoSanitize())

// gzip compression
app.use(compression())

if (config.ENV !== 'development') app.set('trust proxy', 1)

app.get('/', (req: Request, res: Response) => res.send('Yep im alive'))

// TODO: add routes here. or refactor with a better scaffolding if you wish!
app.post('/screenshot', async (req: Request, res: Response) => {
  try{
    const { url } = req.body

    if(!url) {
      return res.status(400).json({ message: 'URL is required' })
    }

    const screenshot = new Screenshot({ url, 'status': 'queued' });
    await screenshot.save();

    // Invio del messaggio a RabbitMQ
    const message = { id: screenshot._id };
    const queueName = 'screenshot_queue';
    publishMessage(queueName, message);

    res.status(201).json({id: screenshot._id});
  }catch(error){
    console.error(`Error in post screenshot:`, error);
    res.status(500).json({ message: `Internal server error` });
  }
})

app.get('/screenshot/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  try{
    const screenshot = Screenshot.findById(id);
    if(!screenshot){
      return res.status(404).json({ message: 'Screenshot not found' });
    }
    res.status(200).json(screenshot);
  } catch (error) {
    console.error(`Error retrieving screenshot with ID ${id}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

// 404
app.use((req: Request, res: Response) => res.status(404).json({ message: 'Not found' }))

const server = app.listen(config.PORT, () => console.info(`Webserver started on port ${config.PORT}`))

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.info('HTTP server closed')
  })
})

export default { app, server }
