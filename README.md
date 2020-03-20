# 3rd-party-server-example

A simple NodeJS express application that can be used by 3rd parties as a starting point to receive TWS messages.

It contains a message validator that used the 'yup' library to verify the schema.

## Requirements

1. Node.js (>= 12)
1. npm

## Install & run

```
$ npm i
$ npm start
...Aquacheck TWS server example running port: 3011
```

## Test

In a separate terminal:

```
$ curl -H 'Content-Type: application/json' -d @./test/g52.json http://localhost:3011
"Valid TWS message"

$ curl -H 'Content-Type: application/json' -d @./test/sigfox.json http://localhost:3011
"Valid TWS message"

$ curl -H 'Content-Type: application/json' -d '{}' http://localhost:3011
{"deviceType":"is a required field","serialNumber":"is a required field","timestamp":"is a required field","techData":"must be defined","probeData":"must be defined"}
```
