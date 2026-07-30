---
tags:
  - depth-anything-v3
  - model-selection
  - inference
  - coordinates
status: planning
---

# DA3 Model and Outputs

## Model selection

The official [Depth Anything 3 repository](https://github.com/ByteDance-Seed/Depth-Anything-3) provides any-view, monocular, metric, and nested series. Its [model table](https://github.com/ByteDance-Seed/Depth-Anything-3#-model-cards) lists:

| Model | Parameters | Relevant capability | Project role |
|---|---:|---|---|
| DA3 Small | 0.08B | Relative depth, pose estimation, pose conditioning | Required model |
| DA3 Base | 0.12B | Same any-view task family | Outside required scope |
| DA3 Large 1.1 | 0.35B | Higher-quality any-view geometry | Too risky for 8 GB |
| DA3 Metric Large | 0.35B | Metric monocular depth only | Stretch metric branch |
| DA3 Nested Giant-Large 1.1 | 1.40B | Any-view geometry plus metric depth | Inappropriate for the primary device |

DA3 Small uses the Apache 2.0 license and is the only required checkpoint. Gaussian output requires larger variants and is outside the primary pipeline.

## Locked inference configuration

- **Checkpoint:** `depth-anything/DA3-SMALL`
- **Model series:** any-view
- **Precision:** PyTorch FP16
- **Primary resolution:** `process_res=336`
- **Resize mode:** `upper_bound_resize`
- **Primary window:** 4 frames with 2-frame overlap
- **Fallback:** 3 frames with 2-frame overlap at `process_res=280`
- **Reference view:** `middle`
- **Pose implementation:** camera decoder with `use_ray_pose=False`
- **Confidence filter:** retain values at or above each frame's 40th percentile

The official [Python API](https://github.com/ByteDance-Seed/Depth-Anything-3/blob/main/docs/API.md) defaults to 504 px and recommends the `middle` reference strategy for video. The reduced resolutions are explicit Jetson memory tradeoffs.

## Output contract

For `N` input views, require:

| Output | Shape | Meaning |
|---|---|---|
| `processed_images` | `[N, H, W, 3]` | RGB aligned to the model outputs |
| `depth` | `[N, H, W]` | Relative depth |
| `conf` | `[N, H, W]` | Prediction confidence |
| `extrinsics` | `[N, 3, 4]` | OpenCV/Colmap-style world-to-camera transforms |
| `intrinsics` | `[N, 3, 3]` | Per-view camera matrices |

Reject a prediction when:

- Any required output is missing or has the wrong shape
- Depth is entirely non-finite or non-positive
- Confidence, intrinsics, or extrinsics contain non-finite values
- Processed RGB dimensions do not match depth and confidence

Invalid individual depth pixels are removed rather than rejecting an otherwise valid window.

## Confidence filtering

For each frame:

1. Select finite, positive-depth pixels with finite confidence.
2. Compute the 40th percentile of those confidence values.
3. Retain pixels at or above the threshold.
4. Preserve the threshold and retained-point count in the window log.

Confidence is a relative filtering signal, not a calibrated probability.

## Coordinates and back-projection

Use DA3-returned intrinsics and processed RGB coordinates. Independent OpenCV calibration is diagnostic and does not replace predicted intrinsics in the unconditioned pipeline.

For retained pixel `(u, v)`:

```text
X_camera = (u - cx) × Z / fx
Y_camera = (v - cy) × Z / fy
Z_camera = relative depth
```

Convert each `[3, 4]` extrinsic into a homogeneous OpenCV world-to-camera matrix. Invert it before transforming camera points:

```text
point_window = inverse(T_camera_window) × point_camera
```

Attach color from the matching location in `processed_images`.

## Single-window normalization

Normalize the first accepted window so the median retained depth is 1.0 internal unit. Apply the same factor to its points and camera translations. This is a numerical convention only; it does not make the output metric.

## Pose modes

The camera decoder (`use_ray_pose=False`) is the baseline because the official documentation describes it as faster. Ray pose is an optional evaluation after the baseline succeeds and must still satisfy memory and update-rate requirements.

## Related notes

- [[Jetson Platform and Feasibility]]
- [[Window Alignment and Mapping]]
- [[Test Protocols]]
- [[Risks and Limitations]]
