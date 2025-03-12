# Use an official Maven image to build the JAR file
FROM maven:3.8.6-openjdk-8 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Use an official OpenJDK runtime for Java 8
FROM openjdk:8-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/camera-0.0.1-SNAPSHOT.jar app.jar

# Expose the port your Spring Boot app runs on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
