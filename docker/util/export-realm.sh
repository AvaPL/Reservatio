#!/usr/bin/env bash

container_name=infra_keycloak_1
realm_name=reservatio

docker exec -it ${container_name} /opt/jboss/keycloak/bin/standalone.sh \
  -Djboss.socket.binding.port-offset=100 \
  -Dkeycloak.migration.action=export \
  -Dkeycloak.migration.provider=singleFile \
  -Dkeycloak.migration.realmName=${realm_name} \
  -Dkeycloak.migration.usersExportStrategy=REALM_FILE \
  -Dkeycloak.migration.file=/tmp/${realm_name}-realm.json

docker cp ${container_name}:/tmp/${realm_name}-realm.json ../keycloak/
