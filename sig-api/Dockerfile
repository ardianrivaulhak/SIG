FROM composer:2.0 as vendor

WORKDIR /tmp/

COPY database/ database/
COPY tests/ tests/
COPY composer.json composer.json
COPY composer.lock composer.lock

RUN composer install \
    --ignore-platform-reqs \
    --no-interaction \
    --no-plugins \
    --no-scripts \
    --prefer-dist && \
    composer update \
    --ignore-platform-reqs \
    --no-interaction \
    --no-plugins \
    --no-scripts \
    --prefer-dist && \
    composer dump-autoload

FROM php:8.0-apache

COPY ./apache/apache2.conf /etc/apache2/
COPY ./apache/000-default.conf /etc/apache2/sites-available/
COPY ./ /var/www/html/sig-api/

COPY --from=vendor /tmp/vendor/ /var/www/html/sig-api/vendor/

COPY ./apache/envy /var/www/html/sig-api/

RUN a2enmod rewrite && \
    apt-get update && \
    apt-get install -y \
        zlib1g-dev \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install mysqli pdo pdo_mysql gd && \
    chmod -R 777 /var/www/html/sig-api && \
    mv /var/www/html/sig-api/envy /var/www/html/sig-api/.env

EXPOSE 80
