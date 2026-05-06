FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline
COPY src ./src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod
RUN addgroup -S spring && adduser -S spring -G spring && mkdir -p /app/data && chown -R spring:spring /app
USER spring:spring
EXPOSE 8080
COPY --from=build --chown=spring:spring /app/target/*.jar /app/app.jar
ENTRYPOINT ["sh", "-c", "java -jar /app/app.jar --server.port=${PORT}"]
