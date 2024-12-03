import dotenv from 'dotenv'
dotenv.config()

export default {
  ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/interview',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'r_secret',
  RABBIT_MQ: process.env.RABBIT_MQ || 'amqp://guest:guest@localhost',
}
