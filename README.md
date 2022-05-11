http-mllp gateway
====

This is a fork of the [mllp](https://github.com/amida-tech/mllp) project with the simple addition of an Express HTTP listner to forward requests to an MLLP endpoint for HL7 v2.x messaging. Ideally this would use the Serverless framework to deploy to AWS Lambda but currently Lambda only supports HTTP.

Changes from the original project:

| Path                        | Description                                                  |
| --------------------------- | ------------------------------------------------------------ |
| `./gateway.js`              | Express HTTP server and request forwarder                    |
| `./test/gateway-functional` | Simple functional test using bash script with curl and test `er7` file |
| `index.js`                  | `//.split('\r')[1]` is commented out to return the full message |

### Overview

When a HTTP POST request is received containing a `Forward-To` header the body is sent to the header value address using `MLLPServer().send()`. The HTTP response contains 2 values in JSON format:

- `er7` - used for the response received from the MLLP send
- `error` - null or error message

#### Example

##### Request

(See [test/gateway-functional/cerner_ORU_R01.er7](test/gateway-functional/cerner_ORU_R01.er7))

```shell
curl -X POST -H \"Content-Type: text/plain\" -H \"Forward-To: mllp://ack.whitebrick.com:2575\" --data-binary @./cerner_ORU_R01.er7 $ENDPOINT
```

##### Response

```bash
{"er7":"MSH|^~\\&|VISN_OUT^VISN_OUT^L|VISN_OUT^VISN_OUT^L|HealthSentry^HealthSentry^L|Baseline West MC^33D1234567^L|20220511203003848+0000||ACK^R01^ORU_R01|201010010913000772A|P|2.5.1|||||||||PHLabReport-NoAck^^2.16.840.1.114222.4.10.3^ISOMSA|AA|201010010913000772\r\r"}
```

### Running Locally

```shell
git clone https://github.com/whitebrick/http-mllp-node
cd http-mllp-node
vi .env # to change server host/port
npm i
node gateway.js
```
