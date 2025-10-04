import joblib
import pandas as pd
import os
from format_data import add_features
from star_aggregator import extract_features

project_root = os.path.dirname(os.path.abspath(__file__)) 
model_path = os.path.join(project_root, 'model', 'model.pkl')

artifact = joblib.load(model_path)
model = artifact["model"]
feature_order = artifact["feature_order"]

file_path = os.path.join(project_root, 'data', 'input-test.csv')

test = pd.read_csv(file_path)
test = add_features(test)

test = test.groupby("star_id").apply(extract_features).reset_index()

test = test.drop(columns="star_id")
test = test.drop(columns="label")

# # Predict percentage likelihood
proba_percent = model.predict_proba(test)[:,1] * 100

print(f'There is a {proba_percent[0]:.2f}% probability that this star contains exoplanets.')