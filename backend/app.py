from flask import Flask, request, jsonify, make_response, send_file
from flask_cors import CORS, cross_origin
import joblib
import os
import numpy as np
import random
import pandas as pd
from star_aggregator import extract_features
from format_data import add_features
import matplotlib.pyplot as plt
import io
from extra_features import calculate_additional_params

app = Flask(__name__)

DEFAULT_ALLOWED = "http://20.187.48.226:5173,http://localhost:5173,http://127.0.0.1:5173"
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", DEFAULT_ALLOWED).split(",")

# Configure CORS to allow requests from your frontend
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app, resources={
    r"/*": {
        "origins": ALLOWED_ORIGINS,
        "methods": ["GET", "OPTIONS", "POST"],
        "allow_headers": ["Content-Type"]
    },
})

# Load the model
project_root = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(project_root, 'model', 'model.pkl')
model_data = joblib.load(model_path)
model = model_data["model"]

@app.route('/predict', methods=['POST'])
def predict():
        
    try:
        # Get data from request
        data = request.json.get('data', [])
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        # Extract features
        data = pd.DataFrame(data)
        features = add_features(data)
            
        features = features.groupby("star_id").apply(extract_features).reset_index()

        features = features.drop(columns="star_id")
        if 'label' in features.columns:
            features = features.drop(columns="label")
                
        # Make prediction and get probabilities for all classes
        probabilities = model.predict_proba(features)[0]
        probability = float(probabilities[1])  # Probability of class 1 (exoplanet)
        
        # Calculate standard error of the prediction (as a simple approximation of uncertainty)
        # This assumes binary classification with classes 0 and 1
        n = len(probabilities)  # Number of training samples (approximate)
        standard_error = np.sqrt((probability * (1 - probability)) / n) if n > 0 else 0.05
        
        # Calculate margin of error (95% confidence interval)
        z_score = 1.96  # For 95% confidence
        margin_of_error = z_score * standard_error
        
        # Calculate confidence interval bounds
        lower_bound = max(0, probability - margin_of_error)
        upper_bound = min(1, probability + margin_of_error)

        addParams = calculate_additional_params(features)
        
        return jsonify({
            "probability": probability,
            "probability_percentage": round(probability * 100, 2),
            "margin_of_error": round(margin_of_error * 100, 2),
            "confidence_interval": {
                "lower_bound": round(lower_bound * 100, 2),
                "upper_bound": round(upper_bound * 100, 2)
            },
            "additionalParams": addParams,
            "message": "Prediction successful"
        })
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": str(e)}), 500

project_root = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(project_root, 'data', 'detailed_data.csv')
df = pd.read_csv(data_path)

@app.route('/lightcurve/random', methods=['GET'])
def random_lightcurve_block():

    number = random.randint(0, len(df))
    start = df.iloc[number]['star_id']
    arr = list()
    
    arr = df[df['star_id'] == start]

    sending = {
        'label': df.iloc[number]['label'],
        'data': list(arr['flux'])
    }

    return sending

@app.route('/health', methods=['GET', 'OPTIONS'])
@cross_origin()
def health_check():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', '*')
        response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
        return response
    return jsonify({"status": "healthy"})

# if __name__ == "__main__":
#     app.run(host="127.0.0.1", port=5050, debug=True)

if __name__ == '__main__':
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", "5050"))
    debug = os.environ.get("FLASK_DEBUG", "") == "1"
    app.run(host=host, port=port, debug=debug)
