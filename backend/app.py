from flask import Flask, render_template, request, jsonify, make_response
from flask_cors import CORS
import pymysql
import jwt
import datetime
from functools import wraps



app = Flask(__name__)
CORS(app)

# Make connection to database
connection = pymysql.connect(host='headlinr.ceyqwsm3r2jw.us-east-1.rds.amazonaws.com', 
                             user='masterUsername', 
                             password='password', 
                             db='headlinr', 
                             charset='utf8mb4', 
                             cursorclass=pymysql.cursors.DictCursor) 

# Secrety key for creating login token
app.config['SECRET_KEY'] = 'thisisarandomsecretkeyblahblahblah'

# Function to check login status
def login_required(f):
    @wraps(f)
    def dec(*args, **kwargs):
        token = request.args.get('token')

        # If token is not provided
        if not token: 
            return jsonify({'message' : 'Token is missing !!'}), 401
   
        try: 
            # decoding the payload to fetch the stored details 
            data = jwt.decode(token, app.config['SECRET_KEY']) 
            current_user = data['user'] 
        except: 
            return jsonify({ 
                'message' : 'Token is invalid !!'
            }), 401
        # returns the current logged in users contex to the routes 
        return  f(current_user, *args, **kwargs)
    return dec


@app.route("/api/loginAuth", methods = ['POST'])
def loginAuth():
    data = request.get_json()
    username = data['username']
    password = data['password']

    with connection.cursor() as cursor:
        query = 'SELECT * FROM user WHERE username = %s AND password = %s'
        cursor.execute(query,(username,password))
    #fetch one line
    user = cursor.fetchone()
    print(user)

    if not user:
        return make_response(jsonify({'message': 'Username password combination not recognized'}), 500, '')
    # Once successfully logged in, send the login token to the front end
    token = jwt.encode({'user': username, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=1440)}, app.config['SECRET_KEY'])
    response = {'status': 200, 'message': 'success', 'token': token.decode('UTF-8')}

    return make_response(jsonify(response))


@app.route("/api/registerAuth", methods = ['POST'])
def registerAuth():
    data = request.get_json()
    username = data['username']
    password = data['password']

    try:
        with connection.cursor() as cursor:
            query = "INSERT INTO user (username, password) VALUES (%s, %s)"
            cursor.execute(query, (username, password))
            connection.commit()
    except pymysql.err.IntegrityError:
        return make_response(jsonify({'message': 'User already exists'}), 500)
    
    # Once successfully registered, send the login token to the frontend
    token = jwt.encode({'user': username, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=1440)}, app.config['SECRET_KEY'])
    response = {'status': 200, 'message': 'success', 'token': token.decode('UTF-8')}
    return jsonify(response)


#showing all the likes for a given news
@app.route("/api/like", methods = ['GET', 'POST'])
@login_required
def like(user):
    if request.method == 'POST':
        # Inserting into the like_news table
        newsId = request.get_json()
        print(user)
        query = "INSERT INTO like_news (username, news_id) VALUES (%s, %s)"
        with connection.cursor() as cursor:
            cursor.execute(query, (user, newsId))
        connection.commit()
        return make_response("{} succesfully liked the article, id = {}".format(user, newsId), 200)
    else:
        # Get all the article ids associated with the likes of a particular user
        query = "SELECT * FROM like_news WHERE username = %s"
        with connection.cursor() as cursor:
            cursor.execute(query, [user])
        data = cursor.fetchall()
        articles_ids = []
        for artile_dict in data:
            articles_ids.append(artile_dict['news_id'])
            
        if articles_ids:
            # Getting the articles from the article ids we got above
            params = ', '.join(list(map(lambda x: '%s', articles_ids)))
            query = "SELECT * FROM news WHERE news_id IN ({})".format(params)
            print(query)
            print(articles_ids)
            with connection.cursor() as cursor:
                cursor.execute(query, articles_ids)
            articles = cursor.fetchall()
            articles = articles[::-1]
            return jsonify(articles)
        return make_response("You don't have any liked articles", 500)

#showing all the liked artile ids for a given news
@app.route("/api/getAllLikedIds", methods = ['GET'])
@login_required
def getAllLikedIds(user):
    # Inserting into the like_news table
    query = "SELECT news_id FROM like_news WHERE username = %s"
    with connection.cursor() as cursor:
        cursor.execute(query, (user))
    data = cursor.fetchall()
    temp = [d["news_id"] for d in data]
    result = {"news_id": temp}
    return jsonify(result)

@app.route("/api/unlike", methods = ['POST'])
@login_required
def unlike(user):
    # Inserting into the like_news table
    newsId = request.get_json()
    print(user)
    query = "DELETE FROM like_news WHERE username = %s AND news_id = %s"
    with connection.cursor() as cursor:
        cursor.execute(query, (user, newsId))
    connection.commit()
    return make_response("{} succesfully unliked the article, id = {}".format(user, newsId), 200)


@app.route("/api/setPreference", methods = ['POST'])
@login_required
def setPreference(user):
    # Setting preference
    userPref = request.get_json()
    print(userPref)
    favTags = ', '.join(userPref['tags'])
    print(favTags)
    query = "UPDATE user SET preference = %s WHERE username = %s"
    with connection.cursor() as cursor:
        cursor.execute(query, (favTags, user))
    connection.commit()
    return make_response("Succesfully set the preference of the user {} as {}".format(user, favTags), 200)

@app.route("/api/getPreference", methods = ['GET'])
@login_required
def getPreference(user):
    # Getting preference
    query = "SELECT preference FROM user WHERE username = %s"
    with connection.cursor() as cursor:
        cursor.execute(query, (user))
    data = cursor.fetchone()
    preferences = data['preference'].split(', ')
    print(preferences)
    return jsonify(preferences)



@app.route("/api/viewAllHeadlines")
def viewAllHeadlines():
    #select the genre of news
    if not len(request.args):
        print("nor arg")
        query = "SELECT * FROM news"
        with connection.cursor() as cursor:
            cursor.execute(query, [])
        data = cursor.fetchall()
    elif request.args.get("NewsId"):
        newsId = request.args.get("NewsId")
        query = "SELECT * FROM news WHERE news_id = %s"
        with connection.cursor() as cursor:
            cursor.execute(query, [newsId])
        data = cursor.fetchone()
    elif request.args.get("NewsTitle"):
        newsTitle = request.args.get("NewsTitle")
        newsTitle = "%" + newsTitle + "%"
        print(newsTitle)
        query = "SELECT * FROM news WHERE title LIKE %s"
        with connection.cursor() as cursor:
            cursor.execute(query, [newsTitle])
        data = cursor.fetchall()

    return jsonify(data)

# if __name__ == "__main__":
#     app.run(host="localhost", port=5000, threaded=True)