import sys
import json
import os
import joblib
import numpy as np

BASE_DIR = os.path.dirname(__file__)
MODELS_DIR = os.path.join(BASE_DIR, "models")
METRICS_PATH = os.path.join(BASE_DIR, "model_metrics.json")

FEATURE_NAMES = [
    "years_experience",
    "education_level",
    "role_level",
    "company_size"
]

MODEL_FILES = {
    "linear_regression": "linear_regression.joblib",
    "random_forest": "random_forest.joblib",
    "gradient_boosting": "gradient_boosting.joblib"
}

def load_models():
    models = {}
    for key, fname in MODEL_FILES.items():
        path = os.path.join(MODELS_DIR, fname)
        if os.path.exists(path):
            models[key] = joblib.load(path)
    return models

def build_feature_vector(features_dict):
    values = []
    for name in FEATURE_NAMES:
        values.append(float(features_dict.get(name, 0)))
    return np.array([values])

def predict(features, model_choice=None):
    models = load_models()
    if not models:
        raise RuntimeError("No models found. Run train_models.py first.")

    x = build_feature_vector(features)
    per_model = {}
    preds = []

    for name, model in models.items():
        p = float(model.predict(x)[0])
        per_model[name] = p
        preds.append(p)

    ensemble_pred = float(np.mean(preds))

    if model_choice and model_choice in per_model:
        active_model = model_choice
    else:
        # if metrics file exists, take best_model, otherwise ensemble
        if os.path.exists(METRICS_PATH):
            with open(METRICS_PATH, "r", encoding="utf-8") as f:
                m = json.load(f)
            active_model = m.get("best_model")
        else:
            active_model = None

    result = {
        "per_model": per_model,
        "ensemble": ensemble_pred,
        "active_model": active_model,
        "active_prediction": per_model.get(active_model, ensemble_pred)
    }
    return result

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No features provided"}))
        return

    try:
        features = json.loads(sys.argv[1])
        model_choice = None
        if len(sys.argv) >= 3:
            model_choice = sys.argv[2]
        result = predict(features, model_choice=model_choice)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
