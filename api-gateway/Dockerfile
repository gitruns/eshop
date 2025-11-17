FROM eclipse-temurin:21-jdk AS build
WORKDIR /workspace

# Cache deps
COPY mvnw* pom.xml ./
COPY .mvn/ .mvn/
RUN ./mvnw -q -DskipTests dependency:go-offline

# Build
COPY src/ src/
RUN ./mvnw -q -DskipTests package

# Extract Spring Boot layers
RUN JAR=$(ls target/*.jar | head -n1) \
 && java -Djarmode=layertools -jar "$JAR" extract --destination /layers

FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy layers (better cache)
COPY --from=build /layers/dependencies/ ./
COPY --from=build /layers/snapshot-dependencies/ ./
COPY --from=build /layers/resources/ ./
COPY --from=build /layers/application/ ./

# Sensible JVM defaults for containers
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75 -Djava.net.preferIPv4Stack=true"

# Spring will bind to whatever server.port is in config
EXPOSE 8080
USER 10001
ENTRYPOINT ["java","org.springframework.boot.loader.launch.JarLauncher"]
