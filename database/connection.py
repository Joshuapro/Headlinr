import pymysql.cursors


connection = pymysql.connect(host='headlinr.ceyqwsm3r2jw.us-east-1.rds.amazonaws.com', 
                             user='masterUsername', 
                             password='password', 
                             db='headlinr', 
                             charset='utf8mb4', 
                             cursorclass=pymysql.cursors.DictCursor) 
 
cursor = connection.cursor()
query = "INSERT INTO `news` (`url`,`snippet`,`tag`,`title`) VALUES ('www.google.com', 'what ever it is', 'global','news title')"

try:
    cursor.execute(query);
    connection.commit();
    #print("data insert success")
finally:
    connection.close();

