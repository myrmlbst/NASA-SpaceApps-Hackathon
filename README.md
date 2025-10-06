<div align="center">
  <img src="./frontend/src/images/logos/adastra-black-logo.jpeg" alt="Ad Astra Logo" width="300">
  <h1>A World Away: Hunting for Exoplanets</h1>
  <p><em>Source code for Ad Astra's exoplanet-detecting machine learning model (Developed for the NASA Space Apps Hackathon)</em></p>
</div>

## Project Overview

**A World Away** is an end-to-end platform that leverages machine learning to detect and analyze exoplanets using photometric data from the Kepler Space Telescope. Designed for both researchers and astronomy enthusiasts, the system provides powerful tools for exoplanet discovery, analysis, and education.

## Technical Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS + Tailwind Forms/Typography
- **3D Visualization**: Three.js + React Three Fiber
- **Data Visualization**: Chart.js, D3.js
- **State Management**: React Hooks, Context API, React Query
- **Routing**: React Router v7
- **Build Tool**: Vite


### Backend
- **Framework**: Flask 2.2.0
- **Machine Learning**: Scikit-learn 1.2.0+
- **Scientific Computing**: NumPy, SciPy, Pandas
- **Astronomy Tools**: Lightkurve, Astroquery
- **API**: RESTful endpoints with CORS support
- **Containerization**: Docker

## Key Features
### For Researchers
- **Data Analysis Pipeline**
  - Process raw Kepler light curve data
  - Extract transit features and stellar parameters
  - Generate comprehensive reports with confidence intervals

### Educational Components
- **Interactive Playground**
  - Visualize exoplanet flux charts
  - Learn about detection methods
  - Learn about habitability of exoplanets

### Technical Implementation
- **Data Processing**
  - Light curve normalization and detrending
  - Transit feature extraction
  - Stellar parameter estimation
  - Outlier detection and handling

- **Model Architecture**
  - Ensemble learning for robust predictions
  - Feature importance analysis
  - Confidence scoring for detections

## System Architecture

### Frontend Architecture
1. **Core Technologies**
   - React 19 with Vite for fast development and building
   - Tailwind CSS for utility-first styling
   - React Router for client-side navigation

2. **Main Components**
   - **ForResearchers.jsx**: Interface for researchers to upload and analyze light curve data
   - **AboutPhysics.jsx**: Educational content about astrophysics and exoplanet research
   - **AboutModel.jsx**: Technical details about the ML model and its performance
   - **Playground.jsx**: Interactive tools for exploring exoplanet concepts

3. **State Management**
   - React Hooks for component-level state
   - Context API for global state management
   - React Query for server state and data fetching

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

## Project Structure

```
├── backend/                     
│   ├── input-test.csv       
│   ├── detailed_data.csv               # process light curves
│   ├── features.csv                    # extract features
│   ├── model/                  
│   │   ├── model.pkl                   # trained model
│   │   └── metrics.json                # performance metrics
│   ├── format-data.py                  # data preprocessing
│   ├── ml-model.py                     # training
│   ├── star_aggregator.py              # feature extraction
│   ├── input-test.py                   # prediction script
│   └── data/                           # raw light curve data and test data
│
├── frontend/                   
│   └── src/
│       ├── components/                # reusable UI components
│       │   ├── calculator/            # habitability calculator components
│       │   ├── game/                  # light curve game components
│       │   └── ui/                    # base UI components (buttons, animations, etc.)
│       ├── pages/                   
│       │   ├── AboutModel.jsx         # model technical details
│       │   ├── AboutPhysics.jsx       # interact with the ML model
│       │   ├── ForResearchers.jsx     # data analysis interface
│       │   └── Playground.jsx         # interactive tools for non-technical users
│       ├── lib/                       # utilities
│       │ 
│       ├── App.jsx                  
│       ├── main.jsx           
│       └── App.css 
│
├── .gitignore
├── LICENSE               
└── README.md                  
```

## Data Format

### Input Data Requirements
CSV files should contain the following columns:
- `time`: Timestamps of observations
- `flux`: Measured brightness values
- `flux_err`: Measurement errors
- `star_id`: Identifier for the star (optional for single-star analysis)

## Getting Started

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.9+ (for backend)
- pip (Python package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/myrmlbst/NASA-SpaceApps-Hackathon.git
   cd NASA-SpaceApps-Hackathon
   ```

2. **Set up the backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running Locally
1. **Start the backend server**
   ```bash
   cd backend
   flask run --port 5050
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

3. Access the application at `http://localhost:5173`

## Contributing
We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/FeatureName`)
3. Commit your changes (`git commit -m 'Add FeatureName'`)
4. Push to the branch (`git push origin feature/FeatureName`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.