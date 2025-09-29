import joblib
from sklearn.metrics import accuracy_score #works
from sklearn.discriminant_analysis import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.calibration import CalibratedClassifierCV
from sklearn.model_selection import train_test_split
from sklearn.metrics import balanced_accuracy_score, f1_score, log_loss, precision_score, recall_score, roc_auc_score, brier_score_loss, average_precision_score
import pandas as pd
import os
import json

project_root = os.path.dirname(os.path.abspath(__file__)) 
file_path = os.path.join(project_root, 'data', 'features.csv')

features = pd.read_csv(file_path)

X = features.drop(columns=["star_id","label"])
y = features["label"].astype(int)

X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

base_lr = LogisticRegression(
    solver="lbfgs",
    penalty="l2",
    C=0.018,
    max_iter=100,
    class_weight="balanced",
    random_state=42
)

pipe = Pipeline([
    ("scaler", StandardScaler(with_mean=True, with_std=True)),
    ("lr", base_lr),
])

cal = CalibratedClassifierCV(
    estimator=pipe,
    method="sigmoid",  # 'sigmoid' is robust on small data; 'isotonic' needs more samples
    cv=5
)
cal.fit(X_tr, y_tr)

proba = cal.predict_proba(X_te)[:, 1]
pred  = (proba >= 0.5).astype(int)  # adjust threshold if needed

metrics = {
    "Accuracy": accuracy_score(y_te, pred),
    "Balanced Accuracy": balanced_accuracy_score(y_te, pred),
    "Precision": precision_score(y_te, pred, zero_division=0),
    "Recall": recall_score(y_te, pred, zero_division=0),
    "F1": f1_score(y_te, pred, zero_division=0),
    "ROC AUC": roc_auc_score(y_te, proba),
    "PR AUC (Average Precision)": average_precision_score(y_te, proba),
    "Log Loss": log_loss(y_te, proba, labels=[0,1]),
    "Brier Score": brier_score_loss(y_te, proba),
}

print("\n=== Test Metrics ===")
for k, v in metrics.items():
    print(f"{k:>28}: {v:.4f}")

# saving metrics in separate file
metrics_path = os.path.join(project_root, 'model', 'metrics.json')
with open(metrics_path, 'w') as f:
    json.dump(metrics, f, indent=4)
print('Metrics saved in /model/metrics.json')

# saving model in separate file
artifact = {
    "model": cal,
    "feature_order": X.columns.tolist(),  # to enforce same order on load
    "classes_": cal.classes_.tolist()
}

out_file_path = os.path.join(project_root, 'model', 'model.pkl')
joblib.dump(artifact, out_file_path)
print("Saved to model.pkl")