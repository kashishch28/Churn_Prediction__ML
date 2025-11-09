import unittest
import json
from server.app import app
import server.app as app_module

class PredictEndpointTest(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.payload = {
            'tenure': 12,
            'MonthlyCharges': 70.35,
            'TotalCharges': 846.8,
            'SeniorCitizen': 0,
            'gender': 'Female',
            'Partner': 'No',
            'Dependents': 'No',
            'PhoneService': 'Yes',
            'MultipleLines': 'No',
            'InternetService': 'DSL',
            'OnlineSecurity': 'No',
            'OnlineBackup': 'No',
            'DeviceProtection': 'No',
            'TechSupport': 'No',
            'StreamingTV': 'No',
            'StreamingMovies': 'No',
            'Contract': 'Month-to-month',
            'PaperlessBilling': 'Yes',
            'PaymentMethod': 'Electronic check'
        }

    def test_predict_returns_json(self):
        resp = self.client.post('/predict', json=self.payload)
        self.assertIn(resp.status_code, (200, 400, 500))
        data = None
        try:
            data = resp.get_json()
        except Exception:
            self.fail('Response not JSON')

        self.assertIsInstance(data, dict)
        # Response should either contain prediction keys or an error message
        self.assertTrue('error' in data or 'churn_prediction' in data)

    def test_predict_with_dummy_model_without_proba(self):
        # Replace app.model with a dummy model that only implements predict
        class DummyModel:
            def predict(self, X):
                return [1]

        original_model = app_module.model
        app_module.model = DummyModel()
        try:
            resp = self.client.post('/predict', json=self.payload)
            self.assertEqual(resp.status_code, 200)
            data = resp.get_json()
            self.assertEqual(data.get('churn_prediction'), 'Yes')
            # Since predict_proba missing, probability should be 1.0 for pred=1
            self.assertEqual(data.get('churn_probability'), 1.0)
        finally:
            app_module.model = original_model

    def test_predict_validation_errors(self):
        # Missing required numeric field
        bad_payload = {
            'MonthlyCharges': 'not-a-number',
            'TotalCharges': 100.0,
            'SeniorCitizen': 0
        }
        resp = self.client.post('/predict', json=bad_payload)
        self.assertEqual(resp.status_code, 400)
        data = resp.get_json()
        self.assertIn('error', data)

if __name__ == '__main__':
    unittest.main()
