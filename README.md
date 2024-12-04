# Yakkyo fullstack test

Hi! This is my submission for the Yakkyo fullstack test.
I found some problems in working with docker-compose.yml file, so please, in order to run the project
launch 
```console
docker run --name mongo -p 27017:27017 -v mongo_data:/data/db -d mongo:6.0 
docker run --name rabbitmq -p 5672:5672 -p 15672:15672 -v rabbitmq_data:/var/lib/rabbitmq -e RABBITMQ_DEFAULT_USER=guest -e RABBITMQ_DEFAULT_PASS=guest -d rabbitmq:3-management
```
and in three separates shells
```console
cd /apps/server
npm run dev
```
```console
cd /apps/client
npm run dev
```
```console
cd /apps/consumer
npm run dev
```

to test the funcionality open http://localhost:8080/screenshot in your preferred browser and wish me good luck!