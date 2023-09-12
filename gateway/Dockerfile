FROM openjdk:17-jdk-alpine
EXPOSE 8081
COPY /target/*.jar /usr/local/lib/gateway.jar
ENTRYPOINT ["java", "-jar", "/usr/local/lib/gateway.jar"]