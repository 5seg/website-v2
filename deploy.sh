#!/bin/bash

echo Deploying
bun run build
sudo cp -r dist/ /var/www/5seg.top/
echo Done