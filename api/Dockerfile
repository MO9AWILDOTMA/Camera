# Stage 1: Build the JAR file
FROM maven:3.8.6-openjdk-8 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM openjdk:8-jre-alpine
WORKDIR /app
COPY --from=build /app/target/camera-0.0.1-SNAPSHOT.jar app.jar

# Set memory limits for the JVM
ENV JAVA_OPTS="-Xmx300m -Xss512k -XX:CICompilerCount=2 -Dfile.encoding=UTF-8"

# Expose the port (Heroku will override this with $PORT)
EXPOSE 8080

# Command to run the application (JSON array format)
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar --server.port=${PORT:-8080}"]
