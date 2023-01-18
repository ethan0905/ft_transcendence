# ft_transcendance

## 🔄 Dynamic reload
````yaml
volumes:: // This section specifies the volumes to create for the service.
- ./:/react-docker:delegated: // This creates a volume that links the current directory on the host machine to the /react-docker directory in the container. The :delegated option tells Docker to use the host machine's filesystem for this volume, rather than creating a new filesystem within the container.
- /node_modules: // This creates a volume for node_modules directory
environment:: // This section defines environment variables to be passed to the service
- CHOKIDAR_USEPOLLING=true: // This sets the environment variable CHOKIDAR_USEPOLLING to true, which will be passed to the container and can be accessed by the React application.
````

## 🔙 Backend
Simple backend written in TypeScript using the NestJS framework:
````typescript
import { Controller, Post, Body } from '@nestjs/common';

@Controller('calculator')
export class CalculatorController {
  @Post('add')
  add(@Body() body: { num1: number, num2: number }) {
    return { result: body.num1 + body.num2 };
  }
}
````
This backend has a single endpoint, `/calculator/add`, which accepts `POST` requests and expects a `JSON` payload with two numbers, num1 and num2. It then adds these two numbers together and returns the result as a `JSON` object.

You can test this backend by running the nestjs application and sending a `POST` request to `http://localhost:3000/calculator/add` with a `JSON` payload like this:
````json
{
    "num1": 3,
    "num2": 4
}
````
The response would be:

````json
{
    "result": 7
}
````
### ❔ How do I send a `POST` request to backend ?
There are several ways to send a `POST` request to a backend, depending on your use case and the tools you have available.
  1) curl: `curl -X POST -H "Content-Type: application/json" -d '{"num1":3,"num2":4}' http://localhost:3000/calculator/add`
  2) javascript: 
 ````javascript
 fetch('http://localhost:3000/calculator/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ num1: 3, num2: 4 }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));
  ````

### ressources
#### docker and react live reload
https://medium.com/@chavezharris/live-reload-with-docker-and-react-3d6de03920af
