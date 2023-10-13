#!/bin/sh

if [ -n "$SERVICE_URI" ]; then
  sed -i "s/localhost:8080/$SERVICE_URI/g" /usr/share/nginx/html/assets/env.js
fi

if [ -n "$STORAGE_URI" ]; then
  sed -i "s/localhost:8081/$STORAGE_URI/g" /usr/share/nginx/html/assets/env.js
fi

if [ -n "$SOCKET_URI" ]; then
  sed -i "s/localhost:8082/$SOCKET_URI/g" /usr/share/nginx/html/assets/env.js
fi

nginx -g 'daemon off;'