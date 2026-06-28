from flask import Flask, request, jsonify, render_template
from google import genai
import dotenv
import os
import time

# Load environment variables
dotenv.load_dotenv()

API_KEY = os.getenv("API_KEY")

# Initialize Gemini client
client = genai.Client(api_key=API_KEY)

app = Flask(__name__)


@app.route("/", methods=["GET", "POST"])
def index():

    if request.method == "POST":

        try:
            data = request.get_json()
            user_input = data["user_input"]

            max_retries = 3

            for attempt in range(max_retries):
                try:
                    result = client.models.generate_content(
                        model="gemini-2.5-flash",
                        contents=user_input
                    )

                    return jsonify({
                        "response": result.text
                    })

                except Exception as e:

                    error = str(e)

                    # Retry only for temporary server errors
                    if "503" in error and attempt < max_retries - 1:
                        print(f"Retrying... ({attempt + 1}/{max_retries})")
                        time.sleep(2)
                        continue

                    raise e

        except Exception as e:

            return jsonify({
                "response": f"❌ {str(e)}"
            }), 500

    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)