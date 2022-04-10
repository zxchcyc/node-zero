// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['192.168.31.168:19092'],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'test-group' });

const run = async () => {
  // Producing
  await producer.connect();
  const result = await producer.send({
    topic: 'node-zero',
    messages: [{ value: 'Hello KafkaJS Archer Zheng!' }],
  });
  console.log(result);

  // Consuming
  await consumer.connect();
  await consumer.subscribe({ topic: 'node-zero', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
    },
  });
};

run().catch(console.error);
