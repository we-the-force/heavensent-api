module.exports = ({env}) => ({
  // host: env('HOST', '0.0.0.0'),
  host: env('HOST', 'localhost'),
  port: env.int('PORT', 1337),
  cron: {
    enabled: true,
  },
  admin: {
    autoOpen: false,
  },
});