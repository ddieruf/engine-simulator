#!/bin/sh

#$1 = AWS access key
#$2 = AWS secret key
#$3 = API endpoint where sensor data will be posted

read -p "Name of the engine instance: "  engineName

echo
echo "-------------CREATING EC2 INSTANCE----------------"

docker-machine create --driver amazonec2 \
  --amazonec2-access-key $1 \
  --amazonec2-secret-key $2 \
  --amazonec2-instance-type "t2.small" \
  --amazonec2-region "us-east-1" \
  --amazonec2-security-group "engine-simulator" \
  --amazonec2-ssh-user "ubuntu" \
  --amazonec2-subnet-id "subnet-20522445" \
  --amazonec2-vpc-id "vpc-f9fcaa9f" \
  --amazonec2-zone "d" \
  --amazonec2-root-size "8" \
  $engineName

wait

echo
echo "-------------SETTING ACTIVE MACHINE----------------"
bb=$(docker-machine env $engineName | sed -n 's/export DOCKER_TLS_VERIFY=\(.*\)/\1/p' | sed 's/"//g')
export DOCKER_TLS_VERIFY=$bb

cc=$(docker-machine env $engineName | sed -n 's/export DOCKER_HOST=\(.*\)/\1/p' | sed 's/"//g')
export DOCKER_HOST=$cc

dd=$(docker-machine env $engineName | sed -n 's/export DOCKER_CERT_PATH=\(.*\)/\1/p' | sed 's/"//g')
export DOCKER_CERT_PATH=$dd

ee=$(docker-machine env $engineName | sed -n 's/export DOCKER_MACHINE_NAME=\(.*\)/\1/p' | sed 's/"//g')
export DOCKER_MACHINE_NAME=$ee

eval $(docker-machine env $engineName)

env | grep DOCKER_TLS_VERIFY
env | grep DOCKER_HOST
env | grep DOCKER_CERT_PATH
env | grep DOCKER_MACHINE_NAME

echo
echo "-------------CONFIRM ACTIVE----------------"
acv=$(docker-machine active)
if [[ $acv != $engineName ]]; then
  echo "Machine not marked as active"
  exit 1
fi 
echo $acv

echo
echo "-------------DEPLOYING DOCKER IMAGE----------------"
docker run -d -p 8080:8080 -p 9001:9001 -e "VIN=$engineName" -e "ENDPOINT=$3" --name $engineName ddieruf/engine-simulator:latest

echo
echo "-------------ALL DONE----------------"