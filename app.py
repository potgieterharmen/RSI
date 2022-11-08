from re import DEBUG, sub
from flask import Flask, render_template, request, redirect, send_file, url_for
from werkzeug.utils import secure_filename, send_from_directory
import os
import subprocess

app = Flask(__name__)
#nav = Navigation(app)


uploads_dir = os.path.join(app.instance_path, 'uploads')

os.makedirs(uploads_dir, exist_ok=True)


@app.route("/")
def index():
    return render_template('index.html')

@app.route("/about")
def about():
    return render_template("about.html");

@app.route("/detection")
def detection():
    return render_template("detection.html");

@app.route("/resources")
def resources():
    return render_template("resources.html");


@app.route("/detect", methods=['POST'])
def detect():
    if not request.method == "POST":
        return
    conf = request.form['conf']
    
    video = request.files['video']
    video.save(os.path.join(uploads_dir, secure_filename(video.filename)))
    #subprocess.run("ls", shell=False)
    subprocess.run(['py', 'detect.py', '--source', os.path.join(uploads_dir, secure_filename(video.filename)), '--data', 'RSI_data.yaml', '--weights', 'rsi_weight.pt', '--conf', conf, '--img', '1280'], shell=False)
    # return os.path.join(uploads_dir, secure_filename(video.filename))
    obj = secure_filename(video.filename)
    return obj

@app.route("/opencam", methods=['GET'])
def opencam():
    print("here")
    subprocess.run(['py', 'detect.py', '--source', '0', '--data', 'RSI_data.yaml', '--weights', 'rsi_weight.pt', '--img', '1280'], shell=False) #'--data', 'data/RSI_data.yaml',
    return "done"
    

@app.route('/return-files', methods=['GET'])
def return_file():
    obj = request.args.get('obj')
    loc = os.path.join("runs/detect", obj)
    print(loc)
    try:
        return send_file(os.path.join("runs/detect", obj), attachment_filename=obj)
        # return send_from_directory(loc, obj)
    except Exception as e:
        return str(e)

# @app.route('/display/<filename>')
# def display_video(filename):
# 	#print('display_video filename: ' + filename)
# 	return redirect(url_for('static/video_1.mp4', code=200))