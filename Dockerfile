FROM richarvey/nginx-php-fpm:latest
# install node, npm, chrome deps
RUN apt-get update && apt-get install -y nodejs npm \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
    libxcomposite1 libxdamage1 libgbm1 fonts-liberation
COPY . /var/www/html
RUN npm install && composer install
