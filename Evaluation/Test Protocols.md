---
tags:
  - evaluation
  - protocols
  - benchmarking
  - depth-anything-v3
status: planning
---

# Test Protocols

## Resource-feasibility protocol

For the primary configuration, then the fallback only if needed:

1. Load DA3 Small and warm up with one window.
2. Run five recorded windows.
3. Record inference success, p50/p95 latency, peak unified memory, and output validity.
4. Confirm at least 1 GB remains available for the rest of the application.

The primary passes when all five 4×336 windows complete below 7.0 GB. If it fails, apply the same rule to five 3×280 windows. If both fail, stop the live implementation and report infeasibility on the available stack.

## Calibration protocol

Report:

- Accepted calibration-image count
- Mean and maximum reprojection error
- Calibration resolution
- Camera mode, focus, and exposure

Mean reprojection error must be below 0.5 px. Compare calibrated and DA3-predicted `fx`, `fy`, `cx`, and `cy` diagnostically, but use DA3 intrinsics for reconstruction.

## Single-window validity protocol

Evaluate five development windows and report:

- Finite valid-depth percentage
- Confidence distribution and 40th-percentile threshold
- Predicted focal lengths and principal points
- Camera-center plot
- Retained point count
- Visible geometry defects

Verify:

- Depth and confidence align with processed RGB
- Extrinsics follow world-to-camera convention
- Inverted extrinsics place cameras and points coherently
- Colors use processed-image coordinates
- PLY export reloads successfully

Do not make metric-depth claims before scale alignment.

## Overlapping-window alignment protocol

Run the untouched evaluation sweep once with the locked configuration. For every attempted registration record:

- Shared frame identifiers
- Valid correspondence count
- RANSAC inlier count and ratio
- Refined Sim(3) scale
- Median inlier residual
- Accepted status or rejection reason
- Correspondence and alignment latency

Acceptance requires:

- At least 1,000 correspondences
- At least 50% inliers
- Median residual no greater than 2% of median global overlap depth
- Scale in `[0.5, 2.0]`

The target is at least 80% accepted registrations. Rejected windows must add neither points nor camera poses.

## Scale and doorway protocol

Use the independent 1.0 m segment in the first accepted window:

1. Select its endpoints in the raw relative cloud.
2. Measure its internal-unit length.
3. Calculate and apply one global metric scale.
4. Save the raw and scaled clouds and trajectories.

Then measure doorway inside-frame width and height:

1. Photograph and label the physical measurement.
2. Mark corresponding endpoints in the scaled cloud.
3. Record reference and reconstructed values.
4. Calculate absolute error in centimetres and percentage error.
5. Save an annotated screenshot.

The scale reference and doorway must be different objects.

## Live-performance protocol

Warm up for 30 seconds, then run the complete live system for five minutes.

Report:

- Preview frame rate
- Selected frames per second
- Window-inference p50 and p95 latency
- Sim(3)-alignment p50 and p95 latency
- Map-update latency
- Accepted updates per minute
- p50 and p95 time between accepted viewer updates
- Peak unified memory
- Average and peak power
- Maximum temperature
- Dropped or replaced candidate frames

Use NVIDIA's [`tegrastats`](https://docs.nvidia.com/jetson/archives/r34.1/DeveloperGuide/text/AT/JetsonLinuxDevelopmentTools/TegrastatsUtility.html). The target is at least one accepted update every five seconds with a responsive preview and bounded queues.

## Sustained-run protocol

Run the target configuration continuously for 15 minutes. Record:

- Window latency and update interval over time
- Unified memory and global point count over time
- Power and temperature over time
- Accepted and rejected windows
- Consolidations and point-cap events
- Inference failures, queue growth, corrupted geometry, crashes, or viewer stalls

The run passes without:

- Out-of-memory failure
- Unbounded selected-frame queue or update latency
- More than 30 accepted windows or 1,000,000 points
- Points or poses from a rejected window
- Corrupted PLY output
- Application crash
- Viewer stall

## Optional ray-pose protocol

After the baseline succeeds, process the same recorded evaluation sweep once with `use_ray_pose=True`.

Keep ray pose only when:

- Peak used memory remains below 7.0 GB
- Accepted updates remain at least one every five seconds
- Registration acceptance or median overlap residual improves

## Related notes

- [[Evaluation Plan]]
- [[Results Templates]]
- [[Camera and Data Collection]]
- [[Window Alignment and Mapping]]
