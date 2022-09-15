# Nest Js Logger

A simple logger written in typescript with (Nest.js)[https://nestjs.com/] framework.

I used (typeorm)[https://typeorm.io/] and mysql. changing to other relational database possibly doesn't hurt! but there is no support for mongodb.

## TODO

- [ ] config module
- [ ] doc

## Errors

- In section module when a section softDeleted another section with same name
cannot be inserted because of unique index in table; this is a 500 server error
