
Admin scripts to deal with databases.

recreate_database.js
Use it when you onboard this project or messed up with the DB.
It deletes everything and creates a new one.

1. Download "Focused Targets" sheet from Google spreadsheet, as CSV.
2. Configure PostgresDB credentials in ../db/dbconfig.js
3. In terminal, run the script with node. It will delete & recreate DB schema and try to add as many streamers in the spreadsheet as possible. For the failed ones, you will see the error messages about which columns have incorrect values.
> node recreate_database.js [PATH_TO_CSV]

For example, if you downloaded the CSV file to c:/streamer_data.csv, run 
> node recreate_database.js c:/streamer_data.csv