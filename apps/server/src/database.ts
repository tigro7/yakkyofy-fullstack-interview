import config from './config'
import mongoose from 'mongoose'

const options = {
  autoIndex: config.ENV !== 'development' ? false : true // Don't build indexes (for production)
}

// Create the database connection
mongoose.connect(config.MONGO_URL, options).catch(error => {
  console.error('Mongoose connection error')
  console.error(error)
})

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => console.debug('Mongoose default connection open'))

// If the connection throws an error
mongoose.connection.on('error', error => console.error('Mongoose default connection error: ' + error))

// When the connection is disconnected
mongoose.connection.on('disconnected', () => console.info('Mongoose default connection disconnected'))

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.info('Mongoose default connection disconnected through app termination')
  process.exit(0)
})

export const connection = mongoose.connection
