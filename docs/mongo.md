## run docker with auth
- run container without `--auth`
- create mongodb admin account
```
use admin
db.createUser(
   {
     user: "admin",
     pwd: "mongodb:passok",
     roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
   }
)
```
- restart container with `--auth` enable
- create a new database
```
use mydb
 db.createUser(
   {
     user: "tonny",
     pwd: "tonny",
     roles: [ { role: "readWrite", db: "mydb" } ]
   }
)

```

