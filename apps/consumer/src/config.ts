import dotenv from 'dotenv'
dotenv.config()

export default {
  ENV: process.env.NODE_ENV || 'development',
  BASE_DIR: __dirname,
  RABBIT_MQ: process.env.RABBIT_MQ || 'amqp://localhost',
  MONGO_URL: process.env.MONGO_URL || ''
}
