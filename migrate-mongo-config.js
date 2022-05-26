require('dotenv/config');

const config = {
  mongodb: {
    url: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:27017/`,

    databaseName: process.env.DB_NAME,

    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  migrationsDir: 'migrations',

  changelogCollectionName: 'changelog',

  migrationFileExtension: '.ts',

  useFileHash: false,

  moduleSystem: 'commonjs',
};

module.exports = config;
