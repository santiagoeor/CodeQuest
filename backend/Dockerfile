FROM php:8.2-cli

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring pcntl bcmath zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy application files
COPY . .

# Install dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader 2>/dev/null || true

# Expose port
EXPOSE 8000

# Start Laravel respecting dynamic PORT from cloud platforms (Railway/Render)
CMD ["sh", "-c", "if [ ! -f vendor/autoload.php ]; then composer install --no-interaction --prefer-dist 2>/dev/null || true; fi && php artisan migrate --force && php artisan optimize:clear && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}"]
