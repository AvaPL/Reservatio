FROM openjdk:15-alpine
EXPOSE 8080
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} reservatio.jar
ENTRYPOINT ["java","-jar","/reservatio.jar"]