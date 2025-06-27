# frontend/Dockerfile – build & run Next.js
FROM node:20-alpine

WORKDIR /app

# 1️⃣ Manifests
COPY frontend/package*.json ./

# 2️⃣ Dépendances
RUN npm install --no-audit --fund=false

# 3️⃣ Code source
COPY frontend/ .        

# 4️⃣ Build puis start
RUN npm run build

ENV PORT=3000
EXPOSE 3000
CMD ["npm", "start", "--", "-p", "3000"]
