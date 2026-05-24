FROM nginx:alpine

COPY dist/first-app/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
##docker build -t ftarrino_helloapi .
##docker run -d -p 8743:80 --name ftarrino_homes ftarrino_helloapi