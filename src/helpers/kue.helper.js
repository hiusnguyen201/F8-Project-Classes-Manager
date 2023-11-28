const kue = require("kue");
const queue = kue.createQueue({
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    // auth: process.env.REDIS_PASS,
  },
});

module.exports = {
  createJob: async (type, data, executeFunc) => {
    var job = queue.create(type, data).save(function (error) {
      if (error) console.log(error);
    });

    queue.process(type, 1, () => executeFunc);
  },
};
