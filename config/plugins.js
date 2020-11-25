module.exports = ({env}) => (
    console.log("ayyy\r\n", process.env.SENDGRID_API_KEY),
    {
        email: {
          provider: 'gmail-2lo',
          providerOptions: {
            username: 'info@heavensentnow.com',
            clientId: '117647978551988719134',
            privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDB207x1Tu9Pr6r\n1QiSaD9N5WPNpzcP3CHMZ2dnQuoAnz/hZWdJ+Cj3YzBfExw4zQVCnHnVjNp4L+4l\nFiAsgJLjU6CoUgoxjGul7p+7gnEgZ1CqAKa4p6AqfvzSnwaqnvF6NCC8xDJ1QWWw\nx00Yr+e/Fi/oFVbF2e8/XjBJPGxgph2T87Pj6hsNaUlRg+eXTYsnjXbZVWPrjf5G\n0qnp5nrHD/jdbgykbew4Te7cHumlslBouhU89oKw3WluTUQjoUI7yPoHnLae1ltZ\n5mT/nmoeO5/6n5A1Pdef8DnWtjWU1LSUZTomL+KmjiE3iOIkRMzULF/XIFAqq17A\nBDmxxYG7AgMBAAECggEABKBTNfo8vrtsmXUwCy5ptFYxF4tSCRLby6D8Gr7CDtm+\nEIb2/BDsCVtYoCw4lDJwWbKaRbpizFN4f3ITunwnBT3Nq7apf502RHN5ZGQshvVw\nO15gnC+D5v+40N3yrse0Q5JS5a5Y9etlnd5jvJ8WDL1ez08TDw2wY/a/eD/05imF\n/IsmeDVCQo8eaEUCw+8KBWE5nZCZv9O0r5rRh43MKAElDQhvYQrvB044xMGnTZDE\nIlJTiKZyHtxhMq6DsI7LiUNSR5//yUVMJtE+sREQMr85FEjhka9Y3nOu8cJCnhWe\n+FMwiKR0/TOIw/cBvt/B2Xg9ESe2cOo8hQa12G82oQKBgQD78sUymQT2HjIahNsQ\nYAYSvUS7zn50D8StUKeezOWNveLqIRSpxL0oewCiIP4AnPhCE6kadi/fKLrR9kIz\nh0YPkM3VCv++es8iediY1I6EW5FDgMsWBVAkoFbBlt/ah0SCL+G3Mx/+u8wHx/yZ\neQlOg4YTtoOlPALWoQjTkuAmFQKBgQDE+WJj70bzNGQze5FtpknE8z8S+XQvTCl6\nUpD+8JePxN74xe1JwIofsKhLlrjMWo6Qxe6hPuwo4hQtjlnmNICAkknJfy+5u7+f\npjV9ONoAoq2p0JahDRPpC/Lwe+Adc6mPC8V/tAux4tDWFJPcVI/V2SWOBvMoibgC\nrS9OsLpMjwKBgHVfVNTMio4p5QeLqw5G3a1vNQ0VFr309pgTQfNt2uccdhDCloC8\nYa7xFotxOUOJ3PHTfO0R8B1TOS1FPvQIafAocmt0c04GomaaQvh31Wj9y3+aCYJZ\nuUtG0wPeyKxiZd0Md2fETnx6eoOJfDj3NQm5pgWa+ltIyL26SYVfIEM9AoGBAK87\naROcp9LvFgFS+dLBb7k96Sv5LipxqCjBUWrsIPlu3CoW8v18w6RjpaTxZl+uZExZ\nOezLLI9GaUsJ6+JHbNZ0zh3q/0tNwrDFzaokLJUKJFMBVS/bkY3u6maU3ZF19y9h\n+oacZxcOwFjjn5MQy5EkiCts9V9n/YKsDX0E7gfzAoGBAMYPoo15BMvzM/iSIQaM\nVfergmpN5L+Av2ACehAfLm3XL9nQgPI+bcRaThCo3cj4czKNV5lrVm71Pq3tUvoI\nfuRJ4PBPmEnBQa0pgN2eanJH1+FatE8b5rtstSVWMEDdYJUkWy1i49YR7CJ9WYRa\nXgJNaKi/xHGAmMcVbf4xRjhb\n-----END PRIVATE KEY-----\n',
          },
          settings: {
            defaultFrom: 'info@heavensentnow.com',
            defaultReplyTo: 'info@heavensentnow.com',
          },
        },
    }
);