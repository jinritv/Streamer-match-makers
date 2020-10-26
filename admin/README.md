
Admin scripts to deal with databases.

## test_db_connection.js

Simple script to test DB connection, if all values in /db/dbconfig.js are set correctly.
> node test_db_connection.js


## recreate_database.js

Use it when you onboard this project or messed up with the DB. It deletes everything and creates a new one.

1. Download "Focused Targets" sheet from Google spreadsheet, as CSV.
2. Configure PostgresDB credentials in ../.env
3. In terminal, run the script with node. It will delete & recreate DB schema and try to add as many streamers in the spreadsheet to DB as possible. For the failed ones, you will see the error messages about which streamers & columns have incorrect values.
> node recreate_database.js [PATH_TO_CSV]

For example, if you downloaded the CSV file to c:/streamer_data.csv, run 
> node recreate_database.js c:/streamer_data.csv