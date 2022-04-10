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
  await producer.send({
    topic: 'test-topic',
    messages: [{ value: 'Hello KafkaJS ArcherZheng!' }],
  });

  // Consuming
  await consumer.connect();
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

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
