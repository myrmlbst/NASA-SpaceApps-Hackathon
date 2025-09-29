import joblib
import pandas as pd
import os

project_root = os.path.dirname(os.path.abspath(__file__)) 
model_path = os.path.join(project_root, 'model', 'model.pkl')

artifact = joblib.load(model_path)
model = artifact["model"]
feature_order = artifact["feature_order"]

file_path = os.path.join(project_root, 'data', 'test-data.csv')

test = pd.read_csv(file_path)
test = test.drop(columns="star_id")

# Predict percentage likelihood
proba_percent = model.predict_proba(test)[:,1] * 100

print(f'There is a {proba_percent[0]:.2f}% probability that this star contains exoplanets.')