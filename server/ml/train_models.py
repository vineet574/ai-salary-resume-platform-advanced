import os
import json
import numpy as np
import pandas as pd

from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import train_test_split, RandomizedSearchCV, cross_val_score
from sklearn.metrics import mean_squared_error
from scipy.stats import randint, uniform
import joblib

RANDOM_STATE = 42

FEATURE_NAMES = [
    "years_experience",
    "education_level",
    "role_level",
    "company_size"
]

TARGET_NAME = "salary"


def generate_synthetic_data(n: int = 1200) -> pd.DataFrame:
    rng = np.random.RandomState(RANDOM_STATE)

    years_exp = rng.randint(0, 21, size=n)
    education = rng.randint(0, 3, size=n)
    role_level = rng.randint(0, 3, size=n)
    company_size = rng.randint(0, 4, size=n)

    base = 30000
    salary = (
        base
        + years_exp * 2000
        + education * 9000
        + role_level * 15000
        + company_size * 8000
        + rng.normal(0, 7000, size=n)
    )

    return pd.DataFrame({
        "years_experience": years_exp,
        "education_level": education,
        "role_level": role_level,
        "company_size": company_size,
        "salary": salary
    })


def load_or_generate_data() -> pd.DataFrame:
    csv_path = os.path.join(os.path.dirname(__file__), "salary_data.csv")

    if os.path.exists(csv_path):
        print("Loading dataset from salary_data.csv")
        df = pd.read_csv(csv_path)
        return df

    print("No salary_data.csv found – generating synthetic dataset.")
    return generate_synthetic_data()


def rmse(y_true, y_pred):
    """RMSE that works on all sklearn versions."""
    return float(mean_squared_error(y_true, y_pred) ** 0.5)


def train_and_evaluate():
    df = load_or_generate_data()

    X = df[FEATURE_NAMES].values
    y = df[TARGET_NAME].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE
    )

    models = {}

    # -------- LINEAR REGRESSION --------
    lr = LinearRegression()
    lr.fit(X_train, y_train)
    models["linear_regression"] = lr

    # -------- RANDOM FOREST --------
    rf = RandomForestRegressor(random_state=RANDOM_STATE)
    rf_search = RandomizedSearchCV(
        rf,
        {
            "n_estimators": randint(80, 250),
            "max_depth": randint(3, 14),
            "min_samples_split": randint(2, 8)
        },
        n_iter=15,
        cv=3,
        scoring="neg_mean_squared_error",
        random_state=RANDOM_STATE,
        n_jobs=-1
    )
    rf_search.fit(X_train, y_train)
    models["random_forest"] = rf_search.best_estimator_

    # -------- GRADIENT BOOSTING --------
    gb = GradientBoostingRegressor(random_state=RANDOM_STATE)
    gb_search = RandomizedSearchCV(
        gb,
        {
            "n_estimators": randint(80, 250),
            "learning_rate": uniform(0.01, 0.2),
            "max_depth": randint(2, 6)
        },
        n_iter=15,
        cv=3,
        scoring="neg_mean_squared_error",
        random_state=RANDOM_STATE,
        n_jobs=-1
    )
    gb_search.fit(X_train, y_train)
    models["gradient_boosting"] = gb_search.best_estimator_

    # -------- SAVE MODELS + METRICS --------
    os.makedirs(os.path.join(os.path.dirname(__file__), "models"), exist_ok=True)

    metrics = {}

    for name, model in models.items():
        preds_test = model.predict(X_test)
        test_rmse = rmse(y_test, preds_test)

        cv_scores = cross_val_score(
            model, X, y, cv=5, scoring="neg_mean_squared_error"
        )
        cv_rmse = np.sqrt(-cv_scores)

        metrics[name] = {
            "rmse_test": float(test_rmse),
            "rmse_cv_mean": float(cv_rmse.mean()),
            "rmse_cv_std": float(cv_rmse.std())
        }

        model_path = os.path.join(os.path.dirname(__file__), "models", f"{name}.joblib")
        joblib.dump(model, model_path)
        print(f"{name} saved → {model_path}")
        print(f"  Test RMSE: {test_rmse:.2f}")
        print(f"  CV RMSE: {cv_rmse.mean():.2f} (±{cv_rmse.std():.2f})\n")

    # Determine best model by RMSE
    best_model_name = min(metrics, key=lambda k: metrics[k]["rmse_test"])
    metrics["best_model"] = best_model_name
    metrics["features"] = FEATURE_NAMES

    # Save metrics file
    metrics_path = os.path.join(os.path.dirname(__file__), "model_metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)

    print("✔ Training complete!")
    print(f"Best model: {best_model_name}")
    print(f"Metrics written to {metrics_path}")


if __name__ == "__main__":
    train_and_evaluate()
