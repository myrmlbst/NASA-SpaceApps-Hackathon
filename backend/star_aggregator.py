import pandas as pd
import numpy as np
from scipy.stats import skew, kurtosis
from scipy.signal import lombscargle
import os

project_root = os.path.dirname(os.path.abspath(__file__)) 
file_path = os.path.join(project_root, 'data', 'kepler_data.csv')

# Load data
df = pd.read_csv(file_path)

df = df.dropna()

# Feature extractor
def extract_features(group):
    feats = {}
    flux = group["flux"].values
    flux_err = group["flux_err"].values
    depth = group["depth"].values
    duration = group["duration"].values
    ingress = group["ingress"].values
    egress = group["egress"].values
    
    # Flux stats
    feats["flux_mean"] = np.mean(flux)
    feats["flux_std"] = np.std(flux)
    feats["flux_skew"] = skew(flux)
    feats["flux_kurt"] = kurtosis(flux)
    
    # Error stats
    feats["err_mean"] = np.mean(flux_err)
    feats["err_std"] = np.std(flux_err)
    
    # Transit stats
    feats["depth_mean"] = np.mean(depth)
    feats["depth_std"] = np.std(depth)
    feats["duration_mean"] = np.mean(duration)
    feats["duration_std"] = np.std(duration)
    feats["ingress_mean"] = np.mean(ingress)
    feats["egress_mean"] = np.mean(egress)
    feats["ratio_ingress_egress"] = np.mean(ingress) / (np.mean(egress) + 1e-6)
    feats["depth_over_duration"] = np.mean(depth) / (np.mean(duration) + 1e-6)

    # Add stellar metadata (take first since constant per star)
    feats["teff"] = group["teff"].iloc[0]
    feats["radius"] = group["radius"].iloc[0]
    feats["mass"] = group["mass"].iloc[0]
    feats["logg"] = group["logg"].iloc[0]
    feats["feh"] = group["feh"].iloc[0]

    # Label
    feats["label"] = group["label"].iloc[0]

    return pd.Series(feats)

# Aggregate
features = df.groupby("star_id").apply(extract_features).reset_index()

out_file_path = os.path.join(project_root, 'data', 'features.csv')
features.to_csv(out_file_path, index=False)