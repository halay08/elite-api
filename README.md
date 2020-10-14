# Elite API

A DDD application focused on separation of concerns and scalability.
Loosely coupling with clear dependency graphs provided by Inversion of Control.

![alt text](architecture.png "Clean Architecture")

## Project architecture

    .
    └── src
        ├── api # Layer that exposes application to external world (primary adapters)
        │   └── http # Exposes application over HTTP protocol
        ├── app # Layer that composes application use cases
        ├── domain # Business domain classes and everything that composes domain model
        ├── infra # Communication with what is external of application
        └── libs # Common functionalities

## Dev Environment

Start firestore for database.

```sh
yarn firestore:start
```

Open another terminal, then run:

```sh
yarn dev
```

## API

### Create an user

```sh
curl -XPOST -i -H"Content-Type: application/json" -d'{"id" : 1, "email": "abc@gmail.com", "name": "Learning Kubernetes"}' http://localhost:5000/todo-0711/us-central1/api/v1/users

# output
bC4XfImu5r9SC3UfhCFr
```

### List items

```sh
curl -I http://localhost:5000/todo-0711/us-central1/api/v1/users | jq
```

### List item by id

```sh
curl -I http://localhost:5000/todo-0711/us-central1/api/v1/users/bC4XfImu5r9SC3UfhCFr | jq
```

### Update User

```sh
curl -XPUT -i -H"Content-Type: application/json" -d'{"id" : 1, "email": "abc@gmail.com", "name": "Learning React"}' http://localhost:5000/todo-0711/us-central1/api/v1/users/bC4XfImu5r9SC3UfhCFr
```

# Delete User

```sh
curl -XDELETE -i http://localhost:5000/todo-0711/us-central1/api/v1/users/qPXJqaJrcly2BXja1v8v
```
