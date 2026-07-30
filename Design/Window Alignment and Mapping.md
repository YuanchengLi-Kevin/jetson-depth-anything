---
tags:
  - alignment
  - sim3
  - point-cloud
  - mapping
  - scale
status: planning
---

# Window Alignment and Mapping

## Window overlap

The primary configuration advances by two frames:

```text
window A = [f0, f1, f2, f3]
window B = [f2, f3, f4, f5]
shared frames = [f2, f3]
```

The 3-frame fallback advances by one frame and retains its final two frames. Shared source frames must use identical preprocessing and pixel grids in both predictions.

## Correspondence construction

For each shared frame and pixel, pair:

- The stored 3D point already expressed in global coordinates
- The same processed pixel's 3D point expressed in the new window frame

Keep a pair only when both predictions contain finite positive depth and both points passed their respective 40th-percentile confidence thresholds. Uniformly sample at most 20,000 correspondences across the two shared frames.

## Sim(3) estimation

Estimate a similarity transform `S_global_window`:

1. Require at least 1,000 valid correspondences.
2. Estimate scale, rotation, and translation with RANSAC Sim(3).
3. Refine with Umeyama alignment on the RANSAC inliers.
4. Require at least 50% inliers.
5. Require median inlier residual no greater than 2% of median global overlap depth.
6. Require consecutive-window scale in `[0.5, 2.0]`.

Log correspondence count, inliers, ratio, residual, scale, rotation, and translation. Reject the entire window when any gate fails.

## Applying the transform

For an accepted `S_global_window`:

- Apply scale, rotation, and translation to every new-window point
- Apply scale, rotation, and translation to camera centers
- Compose camera orientations with the Sim(3) rotation only
- Transform overlap geometry for validation but do not append it
- Append points and camera poses from non-overlap frames only

If alignment fails, retain the last accepted overlap, global map, and trajectory without modification.

## Map policy

- **Internal normalization:** first-window median retained depth equals 1.0
- **Voxel size:** 0.01 internal units
- **Consolidation:** every 5 accepted windows
- **Maximum windows:** 30
- **Maximum global points:** 1,000,000
- **Viewer refresh:** after each accepted window

After consolidation, voxel-downsample the global cloud. If it still exceeds the point cap, retain a uniform spatial sample of exactly 1,000,000 points. Record every consolidation and point-cap event.

## Metric-scale alignment

The raw map remains in arbitrary internal units. Place a rigid, independently measured 1.0 m segment in the first accepted window:

```text
metric_scale = 1.0 m / reference_length_in_internal_units
point_metric = metric_scale × point_internal
translation_metric = metric_scale × translation_internal
```

Save both raw relative and scaled outputs. The reference segment must be separate from the evaluation doorway. This operation removes one global scale ambiguity but does not correct local depth error or drift.

## Alignment and mapping gates

- Two recorded windows must align without visible duplication before a full sequence is processed.
- A complete recorded sweep must produce a coherent bounded map before live capture is connected.
- At least 80% of attempted evaluation-window registrations must pass.
- Rejected windows must contribute no points or poses.
- Saved PLY output must reload successfully.

## Related notes

- [[System Architecture]]
- [[DA3 Model and Outputs]]
- [[Camera and Data Collection]]
- [[Test Protocols]]
- [[Risks and Limitations]]
