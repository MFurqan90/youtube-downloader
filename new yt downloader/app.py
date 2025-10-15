from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import yt_dlp, os, uuid, traceback

app = Flask(__name__)
CORS(app)

DOWNLOAD_FOLDER = "downloads"
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

@app.route("/download", methods=["POST"])
def download_video():
    try:
        data = request.get_json()
        url = data.get("url")
        fmt = data.get("format", "mp4")

        if not url:
            return jsonify({"error": "No URL provided"}), 400

        file_id = str(uuid.uuid4())
        ext = "mp3" if fmt == "mp3" else "mp4"
        output_template = os.path.join(DOWNLOAD_FOLDER, f"{file_id}.%(ext)s")

        # 🧠 yt-dlp options
        ydl_opts = {
            "outtmpl": output_template,
            "quiet": True,
        }

        if fmt == "mp3":
            ydl_opts.update({
                "format": "bestaudio/best",
                "postprocessors": [{
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "mp3",
                    "preferredquality": "192",
                }]
            })
        else:
            # 🧠 For video: merge best video + audio into one mp4 file
            ydl_opts.update({
                "format": "bestvideo+bestaudio/best",
                "merge_output_format": "mp4",
                "postprocessors": [{
                    "key": "FFmpegVideoConvertor",
                    "preferedformat": "mp4"
                }]
            })

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        # find final file
        for f in os.listdir(DOWNLOAD_FOLDER):
            if f.startswith(file_id) and f.endswith(f".{ext}"):
                return send_file(os.path.join(DOWNLOAD_FOLDER, f), as_attachment=True)

        return jsonify({"error": "Video file not found"}), 500

    except Exception as e:
        print("🔥 Error:", e)
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


