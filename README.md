# AI-Powered Salary Prediction & Resume Analyzer Platform (Advanced)

Tech Stack:
- **Backend:** Node.js, Express.js, MongoDB, JWT
- **ML Service:** Python, Scikit-learn
- **Frontend:** React.js, Tailwind CSS
- **Other:** Axios

## Advanced Features (Stand-out for Resume)

- **Ensemble ML system** with **Linear Regression**, **Random Forest**, and **Gradient Boosting**.
- **Hyperparameter tuning** & **cross-validation** for tree-based models using `RandomizedSearchCV`.
- **Model metrics API** and dashboard widgets for:
  - RMSE per model
  - Which model currently performs best
- **Ensemble prediction** (mean of all models) + option to query a **specific model** from the UI.
- **JWT-protected analytics dashboard** with lifetime usage stats for predictions and resume analyses.
- **Role-specific resume analyzer** with weighted keyword matching and a match score.

## High-Level Architecture

- `ml/` – Python salary prediction models (training + prediction + metrics).
- `server/` – Node.js + Express backend API (auth, salary prediction, resume analysis, dashboard).
- `client/` – React + Tailwind CSS frontend with model selection & analytics cards.

## Quick Start

### 1. Train ML models (Python)

```bash
cd ml
pip install -r requirements.txt
python train_models.py
```

This will create `models/` with three trained estimators and a `model_metrics.json` file.

### 2. Start backend (Node.js + Express)

```bash
cd server
npm install
# Set env vars in .env (copy from .env.example)
npm run dev
```

### 3. Start frontend (React + Vite + Tailwind)

```bash
cd client
npm install
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).

## Env Vars (Backend)

- `MONGO_URI` – MongoDB connection string.
- `JWT_SECRET` – secret key for JWT signing.
- `PYTHON_BIN` – Python executable (default: `python`).

## Notes

- The ML pipeline here uses a synthetic dataset just for demo purposes. Replace `train_models.py` with
  your own dataset / feature engineering as needed.
- The project is intentionally structured to **showcase full-stack ML engineering skills**:
  - data generation / training / evaluation,
  - secure REST API with Node.js & JWT,
  - and a modern React + Tailwind dashboard.
