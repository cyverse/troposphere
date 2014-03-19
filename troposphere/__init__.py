from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route('/application', defaults={'path': ''})
@app.route('/application/', defaults={'path': ''})
@app.route('/application/<path:path>')
def application(path):
    return render_template('application.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
