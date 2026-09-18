# Kleanzo - Agency Matching Engine Specification

## Matching Algorithm

When a customer or architect searches for handover cleaning in a location (e.g. Pune / Baner) for a specific service or stain type, Kleanzo evaluates candidate agencies against a weighted scoring matrix:

```
Score = (C * w_c + A * w_a + D * w_d + R * w_r + E * w_e + P * w_p + S * w_s) / Total_Weights
```

| Factor | Default Weight | Description |
| :--- | :--- | :--- |
| **Service Capability (C)** | 25% | Agency coverage of requested service/stain type and PIN code. |
| **Availability (A)** | 20% | Crew availability on target scheduled date and shift. |
| **Proximity / Distance (D)** | 20% | Haversine distance from agency base to job site. |
| **Quality Rating (R)** | 15% | Customer & studio review score average (1-5 stars). |
| **Experience (E)** | 10% | Years operating in commercial/post-civil cleaning. |
| **Price Competitiveness (P)**| 5% | Minimum order pricing alignment. |
| **Response Speed (S)** | 5% | Historical lead acceptance time. |

All weights are live-configurable via the Kleanzo Admin Panel at `/admin/dashboard`.
