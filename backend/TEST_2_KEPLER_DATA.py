import pandas as pd
from lightkurve import search_lightcurve
from astroquery.ipac.nexsci.nasa_exoplanet_archive import NasaExoplanetArchive
import numpy as np
import os

# Get Kapler catalog with labels

koi = NasaExoplanetArchive.query_criteria(
    table="cumulative",             
    select="kepid,koi_disposition"
)
koi = koi.to_pandas()

# CONFIRMED/CANDIDATE = 1, FALSE POSITIVE = 0
koi = koi[koi["koi_disposition"].isin(["CONFIRMED","CANDIDATE","FALSE POSITIVE"])]
koi["label"] = koi["koi_disposition"].map({"CONFIRMED":1,"CANDIDATE":1,"FALSE POSITIVE":0})


# Get stellar parameters

stellar = NasaExoplanetArchive.query_criteria(
    table="q1_q17_dr25_stellar",
    select="kepid,teff,radius,mass,logg,feh"
).to_pandas()

# Merge
koi = pd.merge(koi, stellar, on="kepid", how="inner")


# Select a subset (number of false pos and pos)
planets = koi[koi["label"]==1].sample(30, random_state=42)
falsepos = koi[koi["label"]==0].sample(30, random_state=42)
selected = pd.concat([planets,falsepos])


# Fetch light curves and attach stellar params

all_rows = []

def fetch_lightcurve(kepid, label, teff, radius, mass, logg, feh):
    try:
        # Add KIC prefix for Kepler IDs (required)
        lc_search = search_lightcurve(f"KIC{kepid}", mission="Kepler")
        lc_file = lc_search.download()
        if lc_file is not None:
            lc = lc_file.PDCSAP_FLUX.remove_nans()
            for t,f,e in zip(lc.time.value, lc.flux.value, lc.flux_err.value):
                all_rows.append([kepid, t, f, e, label, teff, radius, mass, logg, feh])
        else:
            print(f"No light curve found for KIC{kepid}")
    except Exception as e:
        print(f"Skipping {kepid}: {e}")

# Loop through selected stars
for row in selected.itertuples():
    fetch_lightcurve(row.kepid, row.label, row.teff, row.radius, row.mass, row.logg, row.feh)


#CSV

df = pd.DataFrame(all_rows, columns=[
    "star_id","time","flux","flux_err","label",
    "teff","radius","mass","logg","feh"
])
# df.to_csv("kepler_1000stars_with_stellar_params.csv", index=False)


#Calculation transit features (depth, duration, ingress, egress, symmetry)
 
"""

Note: the transit features are star spesific, basically we are comparing the fluxes of 1 star 
to get max min and calculate the features 

"""
#(star specific)

# Add empty columns for new features
df["depth"] = np.nan
df["duration"] = np.nan
df["ingress"] = np.nan
df["egress"] = np.nan
df["symmetry"] = np.nan

# Process star by star
for star_id, group in df.groupby("star_id"):
    flux = group["flux"].values
    time = group["time"].values
    flux_err = group["flux_err"].values

    # Robust baseline = median flux
    baseline = np.median(flux)

    # Threshold just below baseline
    threshold = baseline - 2 * np.median(flux_err)

    # Find dip points
    dip_mask = flux < threshold

    if np.any(dip_mask):
        # Depth = (baseline - min_flux) / baseline
        min_flux = np.min(flux[dip_mask])
        depth = (baseline - min_flux) / baseline

        # Duration = time difference between first and last dip points
        dip_times = time[dip_mask]
        duration = dip_times[-1] - dip_times[0]

        # Ingress = start to min flux
        t_start = dip_times[0]
        t_min = time[np.argmin(flux)]
        ingress = t_min - t_start if t_min > t_start else np.nan

        print(t_start)
        print(t_min)
        print(ingress)

        # Egress = min flux to end
        t_end = dip_times[-1]
        egress = t_end - t_min if t_end > t_min else np.nan

        # Symmetry ratio
        symmetry = ingress / egress if (ingress and egress and egress > 0) else np.nan
    else:
        depth = duration = ingress = egress = symmetry = np.nan

    # Assign results back to all rows of this star
    df.loc[df["star_id"] == star_id, "depth"] = depth
    df.loc[df["star_id"] == star_id, "duration"] = duration
    df.loc[df["star_id"] == star_id, "ingress"] = ingress
    df.loc[df["star_id"] == star_id, "egress"] = egress
    df.loc[df["star_id"] == star_id, "symmetry"] = symmetry


# Final dataset
project_root = os.path.dirname(os.path.abspath(__file__)) 
out_file_path = os.path.join(project_root, 'data', 'game_data.csv')
df.to_csv(out_file_path, index=False)