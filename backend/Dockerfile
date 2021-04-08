# TODO: Change to openjdk-11 (maybe alpine if available?)
FROM maven:3-openjdk-15-slim as build
COPY pom.xml .
# Cache dependencies
RUN ["mvn", "verify", "clean", "--fail-never"]
COPY src src
RUN ["mvn", "package", "-DskipTests"]

FROM openjdk:15-alpine
EXPOSE 8080
COPY --from=build target/*.jar reservatio.jar
ENTRYPOINT ["java","-jar","reservatio.jar"]