<div align="center">
  <img src="./frontend/src/images/logos/adastra-black-logo.jpeg" alt="Ad Astra Logo" width="300">
  <h1>A World Away: Hunting for Exoplanets</h1>
  <p><em>Source code for Ad Astra's exoplanet-detecting machine learning model (Developed for the NASA Space Apps Hackathon)</em></p>
</div>

## Project Overview

**A World Away** is a machine learning-powered system designed to detect potential exoplanets by analyzing light curve data from the Kepler Space Telescope. This project was developed for the NASA Space Apps Challenge and provides researchers with a powerful tool for identifying exoplanet candidates in astronomical data.

## Features
- **Automated Data Processing**: Processes raw light curve data into meaningful features
- **Machine Learning Pipeline**: Implements a robust classification model for exoplanet detection
- **Comprehensive Analysis**: Calculates various transit characteristics and stellar parameters
- **Web Interface**: User-friendly interface for data upload and analysis
- **Detailed Reporting**: Provides probability scores and confidence metrics for detections

## System Architecture

### Backend Components
1. **Data Processing Pipeline**
   - `format-data.py`: Processes raw light curve data and enriches it with stellar parameters
   - `star_aggregator.py`: Extracts statistical features from light curve data
   - `ml-model.py`: Implements and trains the machine learning model
   - `input-test.py`: Handles prediction on new data

2. **Data Flow**
   - Raw light curve data → `format-data.py` → Enriched data
   - Enriched data → `star_aggregator.py` → Feature matrix
   - Feature matrix → `ml-model.py` → Trained model
   - New data → `input-test.py` → Predictions

## Model Details
### Features
- **Flux Statistics**: Mean, standard deviation, skewness, kurtosis
- **Transit Characteristics**: Depth, duration, ingress/egress times, symmetry
- **Stellar Parameters**: Effective temperature (Teff), radius, mass, surface gravity (logg), metallicity (feh)

### Performance Metrics
- Accuracy and Balanced Accuracy
- Precision, Recall, and F1 Score
- ROC AUC and PR AUC
- Log Loss and Brier Score

## Prerequisites
- Python 3.7+
- Required Python packages (see `requirements.txt`)   

## Project Structure

```
├── backend/                     
│   ├── data/                    
│   │   ├── input-test.csv       
│   │   ├── detailed_data.csv    # process light curves
│   │   └── features.csv         # extract features
│   ├── model/                  
│   │   ├── model.pkl            # trained model
│   │   └── metrics.json         # performance metrics
│   ├── format-data.py           # data preprocessing
│   ├── ml-model.py              # training
│   ├── star_aggregator.py       # feature extraction
│   └── input-test.py            # prediction script
├── frontend/                   
│   ├── public/
│   └── src/
│       ├── components/         # reusable UI components
│       ├── pages/              # application pages
│       └── App.jsx             # main application component
└── README.md                  
```

## Data Format

### Input Data Requirements
CSV files should contain the following columns:
- `time`: Timestamps of observations
- `flux`: Measured brightness values
- `flux_err`: Measurement errors
- `star_id`: Identifier for the star (optional for single-star analysis)

## Contributing
Contributions are welcome! Feel free to submit a pull request:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/FeatureName`)
3. Commit your changes (`git commit -m 'Add FeatureName'`)
4. Push to the branch (`git push origin feature/FeatureName`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

