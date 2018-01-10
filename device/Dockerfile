FROM python:2.7-slim

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD ./ /app
ADD supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Install any needed packages specified in requirements.txt
RUN apt-get update && apt-get install -y redis-server
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 8080
EXPOSE 9001

ENTRYPOINT ["/usr/local/bin/supervisord"]

# Define environment variable
#ENV VIN "xxxx"

# Start when the container launches
#CMD [""]