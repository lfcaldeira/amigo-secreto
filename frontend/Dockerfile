FROM nginx:stable-alpine

# Apaga a configuração default e copia a tua
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os ficheiros da app
COPY . /usr/share/nginx/html

EXPOSE 80
