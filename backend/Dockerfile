FROM maven:3-openjdk-11-slim as build
COPY pom.xml .
# Cache dependencies
RUN ["mvn", "verify", "clean", "--fail-never"]
COPY src src
RUN ["mvn", "package", "-DskipTests"]

FROM openjdk:11-jre-slim
EXPOSE 8080
COPY --from=build target/*.jar reservatio.jar
ENTRYPOINT ["java","-jar","reservatio.jar"]