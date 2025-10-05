import pandas as pd
import numpy as np
import os

# --- READ CSV ---
project_root = os.path.dirname(os.path.abspath(__file__)) 
out_file_path = os.path.join(project_root, 'data', 'data_step2.csv')
df = pd.read_csv(out_file_path)   #add location CSV file 

def calculate_additional_params(df: pd.DataFrame):

    # --- CONSTANTS ---
    G = 6.67430e-11                   # Gravitational constant (m^3 kg^-1 s^-2)
    R_sun = df['radius'][0]
    M_sun = df['mass'][0]
    R_earth = 6.371e6                 # Earth radius (m)
    seconds_per_day = 24 * 3600       # Conversion from days to seconds

    # --- EXTRACT NEEDED PARAMETERS ---
    R_star = df['radius'][0] * R_sun          # stellar radius in meters
    M_star = df['mass'][0] * M_sun            # stellar mass in kg
    depth = df['depth_over_duration'][0]                    # fractional transit depth
    P_days = df['duration_mean'][0]                # assuming duration is orbital period in days (adjust if needed)
    P_sec = P_days * seconds_per_day                # convert to seconds

    # --- PLANETARY RADIUS ---
    R_p = R_star * np.sqrt(depth)                   # in meters
    R_p_Re = R_p / R_earth                          # in Earth radii

    # --- SEMI-MAJOR AXIS ---
    a = ((G * M_star * P_sec**2) / (4 * np.pi**2))**(1/3)

    # --- ORBITAL VELOCITY ---
    v_orb = (2 * np.pi * a) / P_sec                 # m/s
    v_orb_km = v_orb / 1000                         # km/s

    # --- IMPACT PARAMETER ---
    k = R_p / R_star
    T = df['duration_mean'][0] * seconds_per_day    # total transit duration in seconds
    b = np.sqrt(max(0, (1 + k)**2 - (a / R_star * np.sin(np.pi * T / P_sec))**2))

    # --- INCLINATION ---
    i = np.degrees(np.arccos(np.clip(b * R_star / a, -1, 1)))

    # --- INGRESS / EGRESS DURATION ---
    tau = (R_p * P_sec) / (np.pi * a)               # seconds
    tau_hr = tau / 3600                             # hours

    # --- PRINT RESULTS ---
    print("\n🪐 Exoplanetary Parameter Estimation\n" + "-"*45)
    print(f"Stellar Radius (R★): {R_star:.3e} m")
    print(f"Stellar Mass   (M★): {M_star:.3e} kg")
    print(f"Transit Depth (δ): {depth:.3e}")
    print(f"Orbital Period (P): {P_days:.3f} days")

    print(f"\n→ Planetary Radius (Rp): {R_p:.3e} m ({R_p_Re:.3f} R⊕)")
    print(f"→ Semi-Major Axis (a): {a:.3e} m")
    print(f"→ Orbital Velocity (v): {v_orb_km:.3f} km/s")
    print(f"→ Impact Parameter (b): {b:.3f}")
    print(f"→ Inclination (i): {i:.2f}°")
    print(f"→ Ingress/Egress Duration (τ): {tau_hr:.3f} hours")
    print("-"*45)

    additionalParams = {
        'stellar_radius': R_star,
        'stellar_mass': M_star,
        'transit_depth': depth,
        'orbital_period': P_days,
        'planetary_radius': [R_p, R_p_Re],
        'semimajor_axis': a,
        'orbital_velocity': v_orb_km,
        'impact_parameter': b,
        'inclination': i,
        'ingr_egr_duration': tau_hr
    }

    return additionalParams