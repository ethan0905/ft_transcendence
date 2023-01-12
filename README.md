# ft_transcendance

## 🔄 Dynamic reload
````yaml volumes:: // This section specifies the volumes to create for the service.

./:/react-docker:delegated: // This creates a volume that links the current directory on the host machine to the /react-docker directory in the container. The :delegated option tells Docker to use the host machine's filesystem for this volume, rather than creating a new filesystem within the container.

/node_modules: // This creates a volume for node_modules directory

environment:: // This section defines environment variables to be passed to the service

CHOKIDAR_USEPOLLING=true: // This sets the environment variable CHOKIDAR_USEPOLLING to true, which will be passed to the container and can be accessed by the React application.
````

### ressources
#### docker and react live reload
https://medium.com/@chavezharris/live-reload-with-docker-and-react-3d6de03920af
