import pandas as pd
from lightkurve import search_lightcurve
from astroquery.ipac.nexsci.nasa_exoplanet_archive import NasaExoplanetArchive
import numpy as np
import os

def uniform_first_col_value(df: pd.DataFrame):
    """
    Return the value of the first column if ALL rows share the same value.
    - Raises ValueError if the DataFrame is empty, has no columns, or the
      first column contains multiple distinct values.
    - Treats NaN == NaN (i.e., an all-NaN first column passes and returns NaN).
    """
    if df.empty:
        raise ValueError("DataFrame is empty.")
    if df.shape[1] == 0:
        raise ValueError("DataFrame has no columns.")

    s = df.iloc[:, 0]            # first column as a Series
    first_val = s.iloc[0]

    # True when equal to the first value; also treat NaN==NaN
    equal_mask = s.eq(first_val) | (s.isna() & pd.isna(first_val))

    if not bool(equal_mask.all()):
        uniques = s.drop_duplicates().tolist()
        raise ValueError(f"First column is not uniform; found values: {uniques}")

    return first_val

def fetch_by_kic(kic_id: int):
    # Kepler DR25 stellar parameters (units: teff[K], logg[cgs], feh[dex], mass[Rsun? Msun?], radius[Rsun])
    star_tbl = NasaExoplanetArchive.query_criteria(
        table="q1_q17_dr25_stellar",
        select="kepid, teff, logg, feh, mass, radius",
        where=f"kepid={int(kic_id)}"
    )
    if len(star_tbl) == 0:
        return None

    row = star_tbl[0]

    teff = float(row['teff'].value)
    logg = float(row['logg'].value)
    feh = float(row['feh'].value)
    mass = float(row['mass'].value)
    rad = float(row['radius'].value)

    # KOI dispositions for exoplanet flag
    koi_tbl = NasaExoplanetArchive.query_criteria(
        table="q1_q17_dr25_koi",
        select="kepid, koi_disposition",
        where=f"kepid={int(kic_id)}"
    )
    n_conf = int(sum(koi_tbl["koi_disposition"] == "CONFIRMED")) if len(koi_tbl) else 0
    n_cand = int(sum(koi_tbl["koi_disposition"] == "CANDIDATE")) if len(koi_tbl) else 0

    return {
        "star_id": int(kic_id),
        "teff": teff,
        "radius": rad,
        "mass": mass,
        "logg": logg,
        "feh": feh,
        "label": n_conf + n_cand,
    }

def add_features(df: pd.DataFrame):
    star_id = uniform_first_col_value(df)
    data = fetch_by_kic(star_id)

    df['label'] = data['label']
    df['teff'] = data['teff']
    df['radius'] = data['radius']
    df['mass'] = data['mass']
    df['logg'] = data['logg']
    df['feh'] = data['feh']

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

    return df

project_root = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(project_root, 'data', 'input-test.csv')
df = pd.read_csv(data_path)

df = add_features(df)

out_data_path = os.path.join(project_root, 'data', 'detailed_data.csv')
df.to_csv(out_data_path, index=False)