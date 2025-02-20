FROM postgres:17.3

ENV POSTGRES_USER=sensor
ENV POSTGRES_PASSWORD=sensor
ENV POSTGRES_DB=sensor_data

COPY pg_hba.conf /etc/postgresql/postgresql.conf
COPY postgresql.conf /etc/postgresql/postgresql.conf

EXPOSE 5432