# change database
 ```bash
 \c dbname
 ```

 # list databases
 ```
 \l
 ```

# show tables in database
 ```bash
 \dt
 ```
# create database with owner

```bash
CREATE DATABASE dbname OWNER rolename;
```

# get all  user in postgres

 ```bash
 SELECT usename FROM pg_user;

 ```

# change database relative attribute

 ```bash

 ALTER DATABASE name [ [ WITH ] option [ ... ] ]

 where option can be:

     CONNECTION LIMIT connlimit

 ALTER DATABASE name RENAME TO new_name

 ALTER DATABASE name OWNER TO new_owner

 ALTER DATABASE name SET TABLESPACE new_tablespace

 ALTER DATABASE name SET configuration_parameter { TO | = } { value | DEFAULT }
 ALTER DATABASE name SET configuration_parameter FROM CURRENT
 ALTER DATABASE name RESET configuration_parameter
 ALTER DATABASE name RESET ALL

 ```

 # show table scheme

 ```
 \d+ tablename
 ```
