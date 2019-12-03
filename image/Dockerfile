# FROM golang:latest


# RUN mkdir -p /srv/app/grampy-chat
# WORKDIR /srv/app/grampy-chat

# COPY go.mod /srv/app/grampy-chat
# COPY go.sum /srv/app/grampy-chat
# RUN go mod download
# COPY . /srv/app/grampy-chat


# RUN go build -o main .

# # Expose port 8080 to the outside world
# EXPOSE 1234

# # Command to run the executable
# CMD ["./main"]

# Dockerfile References: https://docs.docker.com/engine/reference/builder/

# Start from golang:1.12-alpine base image
# FROM golang:1.12-alpine
FROM golang:latest

# The latest alpine images don't have some tools like (`git` and `bash`).
# Adding git, bash and openssh to the image
# RUN apk update && apk upgrade && \
#   apk add --no-cache bash git openssh

# Add Maintainer Info
LABEL maintainer="Gabriel Villalonga <gabitriqui@gmail.com>"

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependancies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source from the current directory to the Working Directory inside the container
COPY . .

# Build the Go app
RUN go build

# Expose port 8080 to the outside world
EXPOSE 1234

# Run the executable
CMD ["./gramp"]