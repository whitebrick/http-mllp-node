# !/usr/bin/env bash

ENDPOINT="http://localhost:3030/"

echo -e "Sending ER7 format..."

cmd="curl -X POST -H \"Content-Type: text/plain\" -H \"Forward-To: mllp://ack.whitebrick.com:2575\" --data-binary @./cerner_ORU_R01.er7 $ENDPOINT"
echo -e "\n$cmd\n"
eval $cmd
echo -e "\n\n"