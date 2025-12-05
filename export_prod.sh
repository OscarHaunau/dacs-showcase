rm -rf ../nginx-docker/nginx/web/dacs-showcase
mkdir ../nginx-docker/nginx/web/dacs-showcase
ng build --configuration=production  --base-href=/dacs-showcase/
cp -r ./dist/dacs-showcase/browser/* ../nginx-docker/nginx/web/dacs-showcase/