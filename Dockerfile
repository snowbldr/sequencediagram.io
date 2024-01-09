FROM avasconcelos114/docker-java-node

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i --force && mkdir /data
COPY src/ src/
COPY src-backend-mock/ src-backend-mock/
COPY src-backend/ src-backend/
COPY scripts/ scripts/
COPY public/ public/
COPY start.sh local.env.sh ./
ENV DB_DIR=/data
ENTRYPOINT /app/start.sh