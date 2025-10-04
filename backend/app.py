from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
from functools import wraps
import joblib
import os
import numpy as np
import pandas as pd
from scipy.stats import skew, kurtosis
from scipy.signal import lombscargle
from star_aggregator import extract_features
from format_data import add_features

app = Flask(__name__)

# Configure CORS to allow requests from your frontend
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app, resources={
    r"/predict": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["OPTIONS", "POST"],
        "allow_headers": ["Content-Type"]
    },
    r"/*": {
        "origins": "*"
    }
})

# Load the model
project_root = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(project_root, 'model', 'model.pkl')
model_data = joblib.load(model_path)
model = model_data["model"]

@app.route('/predict', methods=['POST'])
@cross_origin(origins=['http://localhost:5173', 'http://127.0.0.1:5173'],
              methods=['POST'],
              allow_headers=['Content-Type'])
def predict():
        
    try:
        # Get data from request
        data = request.json.get('data', [])
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        # Extract features
        data = pd.DataFrame(data)
        features = add_features(data)
        # if not features:
        #     return jsonify({"error": "Could not extract features from data"}), 400
            
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
        
        return jsonify({
            "probability": probability,
            "probability_percentage": round(probability * 100, 2),
            "margin_of_error": round(margin_of_error * 100, 2),
            "confidence_interval": {
                "lower_bound": round(lower_bound * 100, 2),
                "upper_bound": round(upper_bound * 100, 2)
            },
            "message": "Prediction successful"
        })
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": str(e)}), 500

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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
