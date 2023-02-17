# ft_transcendance

> Project is in progress.. The final readme will come soon  
> From today you can use it to understand the basic concepts for the backend  
> I am gonna explain progressively how to install the basic structure of the project, using NestJS, PostgreSQL, Prisma for the backend, and ReactJS for the frontend.

## ⚙️ How to run the project?

1. Run the command `make up`  
2. On a different terminal, after the project has been built, in the /project folder run `make exec` to go inside the backend service  
3. Run the command: `npx prisma studio`    
4. Go to your navigator:  
    --> `localhost:3000`: for the frontend  
    --> `localhost:5555`: for prisma studio  

## 📔 Summary

 - [🏗️ How to build a web app?](#%EF%B8%8F-how-to-build-a-web-app)
 - [🔄 Dynamic reload](#-dynamic-reload)
 - [🔙 Backend](#-backend)
 - [❔ How do I send a `POST` request to backend ?](#-how-do-i-send-a-post-request-to-backend-)
 - [🔗 How do I connect frontend with backend?](#-how-do-i-connect-frontend-with-backend)
 - [🚀 How to install PostgreSQL database and connect it to nestjs?](#-how-to-install-postgresql-database-and-connect-it-to-nestjs)
 - [🗃️ ressources](#%EF%B8%8F-ressources)

## 🏗️ How to build a web app?
At first, I didn't know where to start, so here are the steps to follow if you want to properly build your web application. The following instructions are precious, and could save you some time. 
  
  1. Install your frontend using the ReactJs framework  
  2. Dockerize your frontend (check my documentation on how to dynamicaly reload your page)  
  3. When this is done, install your backend using NestJs, PostgreSQL and Prisma ORM  
  4. Dockerize your backend (check my documentation on how to install your backend)  
  5. Then, finish by linking your frontend to your backend. Dockerize your full app from the root of the repository.  

Now that you have the project logic, we gonna go deeper into the building of your web application.  
Drop a star to support my work ⭐ Thank you  

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
  1) From bash using curl cmd:
````bash
curl -X POST -H "Content-Type: application/json" -d '{"num1":3,"num2":4}' http://localhost:3000/calculator/add`
````
  3) javascript: 
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

### 🔗 How do I connect frontend with backend?
Here is an example of how you might connect a frontend and backend using a RESTful API with the Nest.js framework:

On the backend, create a new Nest.js project using the Nest CLI and then create a new controller for your API. For example, you might create a file called `users.controller.ts` and add the following code:

````typescript
import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return 'This action returns all users';
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return `This action adds a new user: ${createUserDto}`;
  }
}
````
Create the service to handle the logic of the controllers, in this example, the `users.service.ts`:
````typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  create(user: User) {
    this.users.push(user);
  }

  findAll(): User[] {
    return this.users;
  }
}
````
On the frontend, you can use a JavaScript library like axios to send HTTP requests to the backend API. For example, you might create a file called `users.js` and add the following code:
````javascript
import axios from 'axios';

export const getUsers = () => {
  return axios.get('http://localhost:3000/users').then(response => response.data);
}

export const createUser = (data) => {
  return axios.post('http://localhost:3000/users', data).then(response => response.data);
}
````
Finally, you can use these methods to retrieve data from the backend or send data to be stored or processed. For example, in a React component you can use the methods to fetch the data from the backend and update the component's state:
````javascript
import { useState, useEffect } from 'react';
import { getUsers, createUser } from './users';

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(data => setUsers(data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser({ name: 'John Doe', age: 30 }).then(() => getUsers().then(data => setUsers(data)));
  }

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <button type="submit">Add user</button>
      </form>
    </div>
  );
}
````
### 🚀 How to install PostgreSQL database and connect it to nestjs?
To properly configure the connection to a PostgreSQL database and set it up on a Nest.js application, you can follow these steps:

Install the @nestjs/typeorm and pg (or pg-native) package in your Nest.js application:
````bash
npm install @nestjs/typeorm pg
````
Create a new configuration file, for example ormconfig.json, in the root of your project. This file should contain the configuration settings for connecting to your PostgreSQL database. Here is an example:
````json
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "postgres",
  "password": "postgres",
  "database": "testdb",
  "entities": ["dist/**/*.entity{.ts,.js}"],
  "synchronize": true
}
````
In the main file of your application, for example main.ts, you need to import TypeOrmModule from @nestjs/typeorm and call the forRoot method with the path to the ormconfig.json file.
````typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UsersModule,
  ],
})
export class AppModule {}
````
In the module where you want to use the entities, you need to import TypeOrmModule and call the forFeature method passing the entities you want to use.
````typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
````
In your service, you can use the getRepository function from typeorm to perform CRUD operations on your entities.
````typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async create(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async update(id: number, user: User): Promise<void> {
    await this.usersRepository.update(id, user);
  }

  async delete(id: numberand : Promise<void> {
    await this.usersRepository.delete(id);
  }
}
````
Finally, you should start your application and check if the connection to the database is working correctly.

Note that you need to have a PostgreSQL server running and accessible from your application, also, make sure to use the correct credentials for your database in the ormconfig.json file, and the database should exist before running the application.

It's also good to test the connection before running the application and if there's an issue, you can check the PostgreSQL server logs for more information.

Drop a ⭐ if that helped you ;)

## 🔔 Reminder
For backend, you can use Postman to test your api request. I am using Insomnia which is more minimalist and pleasant to use.  
https://insomnia.rest/download  

`yarn start:dev` --> to run the backend application  
use insomnia to interact using POST resquest  
`docker-compose up backend -d` --> to build your postgres database  

Step to install the backend:  
`nest new backend` --> to create the repository  
remove all useless .controller and .service files inside src  
dockerize the database `postgres`  
write the `docker-compose.yml` file  
then implement `prisma`  
`yarn add -D prisma` and `yarn add @prisma/client`  
then run `npx prisma init`  
after having changed prisma schema file, run `npx prisma migrate dev`  
`npx prisma studio` allows us to check the database  

Be carefull !! Prisma folder containing the schema is the official one generated by installing   prisma. The other one is simply a module that will allow us to connect it to postgres  

`nest g module prisma` --> to create a module template called prisma  
`nest g service prisma --no-spec` --> to create a service template called prisma  

Be carefull ! If you have any mistake related to prisma imports inside other modules, it is probably related to the fact that in order to use it, you have to also export it from the prisma module.  
Or, use the @Global decorator, to globally export it (way cleaner !)  

Be carefull ! Each time you are adding a module, don't forget to add it to the app.module.ts file, if not, the server will display the following error:  
````bash
[Nest] 47769  - 02/06/2023, 7:17:18 PM   ERROR [ExceptionHandler] Nest can't resolve dependencies of the AuthService (?). Please make sure that the argument PrismaService at index [0] is available in the AuthModule context.

Potential solutions:
- Is AuthModule a valid NestJS module?
- If PrismaService is a provider, is it part of the current AuthModule?
- If PrismaService is exported from a separate @Module, is that module imported within AuthModule?
  @Module({
    imports: [ /* the Module containing PrismaService */ ]
  })

Error: Nest can't resolve dependencies of the AuthService (?). Please make sure that the argument PrismaService at index [0] is available in the AuthModule context.
````

Step AuthDto:  
`yarn add class-validator class-transformer` --> add library   
use it to check data type object when posting request  

Hash datas:  
You can use bcrypt, but there is a problem, it is limited to the first 72 bytes. So for that reason I am using argon.
`yarn add argon2` --> to install packages

Errors sent:  
need to import PrismaClientKnownRequestError from `@prisma/client/runtime` if you want it work properly  
ForbiddenExecption is from `@nestjs/common`  

Working on config env var:
`yarn add @nestjs/config`

Authentification:
`yarn add @nestjs/passport passport @nestjs/jwt passport-jwt` --> install authentification packages  
`yarn add -D @types/passport-jwt`  
JSON web tokens --> jwt --> we store the var inside the .env file, and we create a var that `config.get('JWT_SECRET')` from env.
strategy folder and JwtStrategy class is for validating the token   

implementing our own end to end tests:
`yarn add -D  pactum`
`yarn test:e2e` --> allows us to run the test e2e file
We gonna need to use an other database in order to not mess up with the real one. For that reason we gonna use `yarn add -D dotenv-cli` to get env variable in a cleaner way, not changing the prisma schema.  
Then, we doing some sexy env injection --> `dotenv -e .env.test --` before the concerned test command. 
`"prisma:test:deploy": "dotenv -e .env.test -- prisma migrate deploy",`  
`"test:e2e": "dotenv -e .env.test -- jest --watch --no-cache --config ./test/jest-e2e.json"`  
I created a `pretest:e2e` that clean the existing volumes, and get launch when you call `yarn test:e2e` command.  
We then need to restart prisma studio using the special test env `npx dotenv -e .env.test -- prisma studio`  

Be carefull, stop the server before running e2e tests. If not, you gonna get this kind of errors  
````bash
  ● App e2e › Auth › Signup › should signup

    listen EADDRINUSE: address already in use :::3333

      22 |     );
      23 |     await app.init();
    > 24 |     await app.listen(3333);
         |               ^
      25 |
      26 |     prisma = app.get(PrismaService);
      27 |     await prisma.cleanDatabase();
````
E2E testing is designed to test that your app works properly based on the API request done with it. To be sure that everything is ok, you should also implement integration testing (using insomnia).

To push further:
We can work on api security, we can run our api in a cluster mode.. and more... 

Dockerizing your entire app:
1. Create your Dockerfiles inside frontend and backend. Tests them individualy using the `docker build .` command.  
2. Go to the root of your directory and create your `docker-compose.yml` file.   
3. 

If you have any trouble, go inside your container using this command:  
`docker exec -it <name> sh`

## 🗃️ ressources
#### docker and react live reload
https://medium.com/@chavezharris/live-reload-with-docker-and-react-3d6de03920af
#### postgres install
https://github.com/khezen/compose-postgres
#### install dockerize app with nestjs/postgreSQL and prisma
https://dev.to/mnzs/database-with-prisma-orm-docker-and-postgres-nestjs-with-passport-02-180l

#### nestjs api
https://www.youtube.com/watch?v=GHTA143_b-s&ab_channel=freeCodeCamp.org  
https://github.com/vladwulf/nestjs-api-tutorial  

#### Troubles dockerizing your app on Mac m1 chips?
https://pythonspeed.com/articles/docker-build-problems-mac/

#### My savior!!!!!!!!!!!!!!!!!!!!
https://stackoverflow.com/questions/71251937/error-p1001-cant-reach-database-server-at-localhost5200  
pb1: un packet propre a l'architecture macos arm64 encore dans mon package.json (qui empechait mon backend de se lancer)  
pb2: le port 5432 qui etait pas accessible depuis mon back (il fallait remplacer localhost par ma db_name, et le port 5434 par le port 5432)  

#### install prisma studio inside docker-compose
https://hub.docker.com/r/timothyjmiller/prisma-studio  
npm i -D @prisma/cli@dev  
go inside container, copy the schema.prisma config in /schema.prisma.  
run `docker cp backend/prisma/schema.prisma backend_prisma:/schema.prisma`  
run `docker exec backend_prisma npx prisma migrate dev`  
go on the `localhost:5555` and it should be good  