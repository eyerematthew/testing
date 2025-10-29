#!/bin/bash

# Input your details
PRIVATE_KEY="0x59c7ccbe7c2247d127603745ce21f47d821baf2671c02ed4a1f7c56"
RPC_URL="https://mainnet.unichain.org"
CONTRACT_NAME="myContract.sol" # Replace with the name of your contract
DEPLOY_COUNT=250 # Replace with how many times you want to deploy

# Deploy the contract specified number of times
for i in $(seq 1 $DEPLOY_COUNT); do
  forge create --rpc-url $RPC_URL --private-key $PRIVATE_KEY $CONTRACT_NAME --broadcast
done
