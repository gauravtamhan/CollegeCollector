## Downloading Data: ##

The original data file itself was too large to push to github. Therefore, here is the link to view the data : https://collegescorecard.ed.gov/data/

Upon clicking the link, find the section, "Featured Downloads". From there, download the file labeled "Most recent data" if you wish to view the entirety of the data.

For this project we chose to include a subsection of categories for each school, including:
* INSTITUTION NAME
* CITY
* STATE ABBREVIATION
* INSTITUTION URL
* LATITUDE
* LONGITUDE
* CARNEGIE CLASSIFICATION OF SCHOOL SIZE
* PUBLIC/PRIVATE STATUS
* REGION
* TUITION FEE (IN-STATE)
* TUITION FEE (OUT-OF-STATE)
* ADMISSION RATE
* RETENTION RATE
* AVG SAT READING SCORE
* AVG SAT MATH SCORE
* AVG SAT WRITING SCORE
* AVG ACT CUMULATIVE SCORE
* AVG ACT ENGLISH SCORE
* AVG ACT MATH SCORE
* AVG ACT WRITING SCORE
* MEAN EARNINGS 6 YEARS AFTER GRADUATION
* MEAN EARNINGS 7 YEARS AFTER GRADUATION
* MEAN EARNINGS 8 YEARS AFTER GRADUATION
* MEAN EARNINGS 9 YEARS AFTER GRADUATION
* MEAN EARNINGS 10 YEARS AFTER GRADUATION
* PERCENTAGE OF UNDERGRADUTATE MALES
* PERCENTAGE OF UNDERGRADUTATE FEMALES

We also removed schools that contained null values for most of these categories (except Avg ACT Reading Score). 

For performance reasons, we divided the data for each school by state. Once you select a state, the application then only loads the schools for that state. This makes loading times much faster and allows the application to run more smoothly. 
