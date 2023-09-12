FROM openjdk:17-jdk-alpine
EXPOSE 8080
COPY target/*.jar /usr/local/lib/spring.jar
ENTRYPOINT ["java", "-jar", "/usr/local/lib/spring.jar"]