#!/usr/bin/env bash

sql="
  CREATE DATABASE IF NOT EXISTS $MYSQL_RESERVATIO_DATABASE;
  CREATE USER IF NOT EXISTS '$MYSQL_RESERVATIO_USER'@'%' IDENTIFIED BY '$MYSQL_RESERVATIO_PASSWORD';
  GRANT ALL PRIVILEGES ON $MYSQL_RESERVATIO_DATABASE.* TO '$MYSQL_RESERVATIO_USER'@'%';

  CREATE DATABASE IF NOT EXISTS $MYSQL_KEYCLOAK_DATABASE;
  CREATE USER IF NOT EXISTS '$MYSQL_KEYCLOAK_USER'@'%' IDENTIFIED BY '$MYSQL_KEYCLOAK_PASSWORD';
  GRANT ALL PRIVILEGES ON $MYSQL_KEYCLOAK_DATABASE.* TO '$MYSQL_KEYCLOAK_USER'@'%';
"

echo "$sql" | sed "s/IDENTIFIED BY '.*'/IDENTIFIED BY '[HIDDEN]'/"

mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "$sql"
