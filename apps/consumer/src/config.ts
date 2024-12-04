import dotenv from 'dotenv'
dotenv.config()

export default {
  ENV: process.env.NODE_ENV || 'development',
  BASE_DIR: __dirname,
  RABBIT_MQ: process.env.RABBIT_MQ || 'amqp://guest:guest@localhost',
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/interview'
}
