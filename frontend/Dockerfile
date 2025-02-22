# --- Build Stage ---
    FROM node:20-alpine as builder

    WORKDIR /usr/src/app
    
    # Copy package.json and yarn.lock
    COPY package.json yarn.lock ./
    
    # Install dependencies using yarn
    RUN yarn install --frozen-lockfile --production
    
    # Copy the rest of the application code
    COPY . .
    
    # Build the React app
    RUN yarn build
    
    # --- Production Stage ---
    FROM nginx:stable-alpine
    
    # Copy the built app from the builder stage
    COPY --from=builder /usr/src/app/build /usr/share/nginx/html
    
    # Copy nginx configuration (optional, if you have a custom config)
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Expose port 80
    EXPOSE 80
    
    # Start Nginx
    CMD ["nginx", "-g", "daemon off;"]