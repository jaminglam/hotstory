const env = process.env.NODE_ENV

const local = {
  stage: "local",
  app: {
    port: 3000
  },
  db: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'abc123QWE',
    database: 'yzy' 
  },
  backend: {
    latestHotstoryLimit: 40,
  }
}

const dev = {
  stage: "dev",
  app: {
    port: 3000
  },
  db: {
    host: "localhost",
    port: 3306,
    user: 'root',
    password: 'abc123QWE',
    database: 'yzy'
  },
  backend: {
    latestHotstoryLimit: 40
  }
}

const config = {
  local,
  dev
}

module.exports = config[env];