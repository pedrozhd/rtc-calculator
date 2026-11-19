# Compila a API oficial do Simples Nacional e gera o banco SQLite somente leitura.
# shortcut: clona a branch main sem fixar commit; fixe um SHA se precisar de builds reproduzíveis.
FROM eclipse-temurin:21-jdk AS build
RUN apt-get update && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*
WORKDIR /src
# Os scripts Flyway que geram o banco ficam no repositório do regime regular.
RUN git clone --depth 1 https://github.com/ReceitaFederal/calculadora-rtc-simples-nacional.git app \
 && git clone --depth 1 https://github.com/ReceitaFederal/calculadora-rtc-regime-regular.git rr \
 && cp -r rr/flyway app/flyway
WORKDIR /src/app
RUN mkdir -p calculadora/db && chmod +x mvnw \
 && ./mvnw flyway:migrate -Dflyway.configFiles=./flyway/flyway-pro.conf --batch-mode --errors
RUN ./mvnw clean package -DskipTests --batch-mode

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /src/app/target/api-simples-nacional.jar app.jar
COPY --from=build /src/app/calculadora calculadora
ENV SPRING_PROFILES_ACTIVE=offline
# Porta padrão 8082; sobrescreva com SERVER_PORT se o provedor exigir outra.
EXPOSE 8082
CMD ["java", "-jar", "app.jar"]
