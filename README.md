# ft_transcendance

## 📔 Summary

 - [🔄 Dynamic reload](#-dynamic-reload)
 - [🔙 Backend](#-backend)
 - [❔ How do I send a `POST` request to backend ?](#-how-do-i-send-a-post-request-to-backend-)
 - [🔗 How do I connect frontend with backend?](#-how-do-i-connect-frontend-with-backend)
 - [🚀 How to install PostgreSQL database and connect it to nestjs?](#-how-to-install-postgresql-database-and-connect-it-to-nestjs)
 - [🗃️ ressources](#%EF%B8%8F-ressources)

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
## 🗃️ ressources
#### docker and react live reload
https://medium.com/@chavezharris/live-reload-with-docker-and-react-3d6de03920af
#### postgres install
https://github.com/khezen/compose-postgres
#### install dockerize app with nestjs/postgreSQL and prisma
https://dev.to/mnzs/database-with-prisma-orm-docker-and-postgres-nestjs-with-passport-02-180l
