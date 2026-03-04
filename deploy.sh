#!/bin/bash

echo Deploying
bun run build
sudo rm -r /var/www/5seg.top/
sudo cp -r dist/ /var/www/5seg.top/
echo Done