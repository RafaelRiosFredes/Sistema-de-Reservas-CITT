# ETAPA 1: Construcción (Build)
# Usamos una imagen con Maven para descargar dependencias y compilar el código.
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copiamos solo el pom.xml primero para aprovechar la caché de Docker
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Ahora copiamos el código fuente y compilamos
COPY src ./src
RUN mvn clean package -DskipTests

# ETAPA 2: Ejecución (Run)
# Usamos una imagen JRE (solo entorno de ejecución) súper ligera
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copiamos solo el archivo .jar compilado desde la etapa anterior
COPY --from=builder /app/target/*.jar app.jar

# Exponemos el puerto donde correrá Spring Boot
EXPOSE 8080

# Comando para iniciar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
