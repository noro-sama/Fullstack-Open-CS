const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info('Connected to MongoDB')
    const port = config.PORT || 3001
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`)
    })
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message)
    process.exit(1)
  })
