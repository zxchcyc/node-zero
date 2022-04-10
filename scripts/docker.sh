# redis
run -p 6379:6379 --name redis -v $PWD/redis/data:/data  -d redis:latest redis-server --appendonly yes

# mysql
docker run -p 3306:3306 --name 202004-mysql -v $PWD/mysql/conf:/etc/mysql/conf.d -v $PWD/mysql/logs:/logs -v $PWD/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.7

# canal
https://www.xiaerblog.com/articles/2021/07/22/1626697649519.html
https://blog.csdn.net/csdn_xpw/article/details/111033275

# xxljob
docker run -e PARAMS="--spring.datasource.url=jdbc:mysql://192.168.31.168:3306/xxl_job?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai --spring.datasource.username=root --spring.datasource.password=123456 --xxl.job.accessToken=9217CF7406F643BEB71CC00731129CC9" -p 8888:8080 -v /tmp:/data/applogs --name xxl-job-admin  -d xuxueli/xxl-job-admin:2.3.0

# es
https://aliliin.com/2022/02/11/Mac%20%E9%80%9A%E8%BF%87%20Docker%20%E5%AE%89%E8%A3%85%20ES/


docker run -itd -p 9200:9200 -p 9300:9300 \
-e "discovery.type=single-node" \
-e ES_JAVA_OPTS="-Xms64m -Xmx128m" \
-v ~/docker/elasticsearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml \
-v ~/docker/elasticsearch/data:/usr/share/elasticsearch/data \
-v ~/docker/elasticsearch/plugins:/usr/share/elasticsearch/plugins \
--name es elasticsearch:7.16.3

docker run -d --name kibana -e ELASTICSEARCH_HOSTS="http://192.168.0.107:9200" -p 5601:5601 -d kibana:7.16.3

# kafka
docker run -d --name zookeeper -p 2181:2181 -t wurstmeister/zookeeper
docker run -d --name kafka --hostname kafka -p 19092:19092 \
-e KAFKA_BROKER_ID=0  \
-e KAFKA_ZOOKEEPER_CONNECT=docker.for.mac.host.internal:2181/kafka \
-e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://kafka:9092,CONNECTIONS_FROM_HOST://192.168.31.168:19092 \
-e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092,CONNECTIONS_FROM_HOST://0.0.0.0:19092 \
-e KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=PLAINTEXT:PLAINTEXT,CONNECTIONS_FROM_HOST:PLAINTEXT \
-e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1  wurstmeister/kafka 

docker run -d --restart=always --name=kafka-manager -p 9000:9000 -e ZK_HOSTS="docker.for.mac.host.internal:2181" sheepkiller/kafka-manager

./kafka-console-producer.sh --broker-list localhost:9092 --topic first-topic
./kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic first-topic --from-beginning

