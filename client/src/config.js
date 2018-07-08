const env = process.env.REACT_APP_STAGE;

const local = {
  stage: "local",
  frontend: {
  },
  ws: {
    "host": "localhost",
    "port": 5000,
  },
}


const dev = {
  stage: "dev",
  frontend: {
  },
  ws: {
    "host": "149.28.206.129",
    "port": 5000,
  }
}

const configs = {
  local,
  dev
}


const config = configs[env];
export {config}; 