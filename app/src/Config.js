const env = process.env.NODE_ENV;

const protocol = window.location.protocol;

const Config = {
  development: {
    api: `${protocol}//api.my-analytics.test`
  },
  production: {
    api: `${protocol}//api.my-analytics.fr`
  }
};

export default Config[env];