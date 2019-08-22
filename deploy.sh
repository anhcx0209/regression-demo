#!/bin/bash

echo "starting deployment..."

ng build --prod

mv dist dist2

tar -czvf dist2.tar.gz dist2

scp ./dist2.tar.gz anhcx@data-analyzer-lab:./ 

ssh anhcx@data-analyzer-lab "tar xzf ./dist2.tar.gz"

echo "clean up..."

rm -rf dist2 ./dist2.tar.gz

echo "Deploy successful!"
