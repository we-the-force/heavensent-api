module.exports = ({env}) => ({
    connections: {
        default: {
            settings: {
                host: env('DATABASE_HOST', '127.0.0.1'),
                port: env.int('DATABASE_PORT', 27017),
                database: env('DATABASE_NAME', 'strapi'),
                username: env('DATABASE_USERNAME', ''),
                password: env('DATABASE_PASSWORD', '')
            }
        }
    }
})