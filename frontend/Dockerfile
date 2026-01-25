# 1. Node.js ka stable version istemal karein
FROM node:20-alpine

# 2. Linux ke build tools install karein (Jo better-sqlite3 ko chahiye)
# Yeh Docker ke andar automatically ho jayega
RUN apk add --no-cache python3 make g++

# 3. Working directory set karein
WORKDIR /app

# 4. Sirf package files copy karein
COPY package*.json ./

# 5. NPM install chalaein (Ab ye Linux mein chalega aur koi error nahi dega)
RUN npm install

# 6. Baqi sara code copy karein
COPY . .

# 7. Frontend ki port open karein
EXPOSE 3000

# 8. App ko start karein
CMD ["npm", "run", "dev"]