#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

# Kill all child processes when this script exists
trap 'kill -TERM 0' EXIT

source local.env.sh

# Start backend dev server
echo starting mock backend
node src-backend-mock/api-server-localhost.js &

echo starting ui server
# Start front end dev server and block for Ctrl-C
PORT=$WEB_APP_DEV_SERVER_PORT REACT_APP_API_SERVER=http://localhost:$API_SERVER_PORT npx react-scripts start

echo server started!