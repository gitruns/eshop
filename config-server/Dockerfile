FROM eclipse-temurin:21-jdk AS build
WORKDIR /workspace

# Cache deps
COPY mvnw* pom.xml ./
COPY .mvn/ .mvn/
RUN ./mvnw -q -DskipTests dependency:go-offline

# Build jar
COPY src/ src/
RUN ./mvnw -q -DskipTests package

# Extract Spring Boot layers (layertools, NOT tools)
RUN JAR=$(ls target/*.jar | head -n1) \
 && java -Djarmode=layertools -jar "$JAR" extract --destination /layers

# Runtime image
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy layers in the order Spring Boot uses
COPY --from=build /layers/dependencies/ ./
COPY --from=build /layers/snapshot-dependencies/ ./
COPY --from=build /layers/spring-boot-loader/ ./
COPY --from=build /layers/application/ ./

EXPOSE 9000

ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75 -Djava.net.preferIPv4Stack=true"

USER 10001
ENTRYPOINT ["java","org.springframework.boot.loader.launch.JarLauncher"]
