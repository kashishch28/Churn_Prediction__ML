# 📊 Telco Customer Churn Prediction Dashboard

An end-to-end Machine Learning project that predicts telecom customer churn. It uses a Random Forest model trained on the Telco Customer Churn dataset and serves predictions via a Flask API to a modern React Dashboard.

## ✨ Features

🔮 **Real-time Churn Prediction:** Enter customer details manually to get an instant churn risk score.  
📂 **Batch Analysis:** Load existing customers directly from the CSV dataset to analyze their retention status.  
📈 **Interactive Dashboard:** Beautiful, responsive UI built with React and pure modern CSS (no external UI libraries).  
🧠 **Explainable AI:** Displays top risk factors contributing to a customer's churn probability.  
📊 **Live Model Metrics:** Shows actual model accuracy and F1-score directly on the dashboard.  

## 🛠️ Tech Stack

| Component | Technology | Description |
|------------|-------------|-------------|
| Frontend | React.js | Interactive dashboard UI |
| Backend | Flask | REST API for serving predictions & data |
| ML Model | Scikit-Learn | Random Forest Classifier |
| Data Processing | Pandas, NumPy | Data cleaning and feature engineering |
| Styling | CSS3 | Custom responsive design (Glassmorphism) |

---

## 🚀 Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
- Python 3.10+
- Node.js 16+ & npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/kashishch28/Churn_Prediction__ML.git
cd Churn_Prediction__ML
