---
tags:
  - evaluation
  - benchmarking
  - 3d-reconstruction
  - experiments
status: planning
---

# Evaluation Plan

## Evaluation questions

1. How accurate and temporally stable is the indoor metric-depth model on the selected camera and room?
2. How much numerical and geometric change does TensorRT FP16 introduce?
3. Can consecutive predicted RGB-D frames support reliable camera tracking?
4. How accurately does the fused point cloud preserve measured room geometry?
5. How do resolution, TSDF voxel size, and power mode trade reconstruction quality for performance?
6. Which subsystem is the dominant source of final reconstruction error?

## Default configuration

Unless one variable is being tested, use:

- TensorRT FP16
- 518×518 depth inference
- Batch size 1
- 0.3-8.0 m usable depth
- 2 cm TSDF voxels
- 8 cm TSDF truncation
- 25 W Jetson power mode
- Active cooling
- Fixed camera calibration and capture mode
- One small indoor room

## Single-frame metric-depth experiment

Place a flat, high-contrast target perpendicular to the camera at:

`0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, and 4.0 m`

For each distance and runtime:

1. Lock the camera and target position.
2. Capture at least 30 stable frames.
3. Use the median depth in a fixed central target region.
4. Retain the per-frame median values.
5. Repeat for PyTorch FP32 and TensorRT FP16 at 518×518.

Report:

- Mean absolute error in metres
- Root mean squared error in metres
- Signed bias by distance
- Relative error by distance
- Frame-to-frame standard deviation
- TensorRT-versus-PyTorch depth RMSE
- TensorRT-versus-PyTorch mean absolute difference
- Spearman rank correlation

PyTorch FP32 is the conversion reference, not assumed ground truth. The measured target distance is the metric reference.

## Camera-calibration quality

Report:

- Number of accepted calibration images
- Mean and maximum reprojection error
- Distribution of checkerboard poses across the image
- Calibration image resolution
- Camera mode and focus setting

The mean reprojection error must be below 0.5 pixels. If the camera mode, focus, or resolution changes, recalibrate.

## Reconstruction geometry

Measure and document at least five room dimensions:

- Wall-to-wall distance
- Doorway width
- Doorway height
- Table or cabinet width
- Table height
- Distance between two fixed objects

Only five are required, but retain all available measurements. For each selected dimension:

1. Photograph and label the physical measurement.
2. Identify corresponding endpoints or planes in the reconstruction.
3. Record reconstructed and reference values.
4. Calculate absolute error in centimetres and percentage error.

Fit planes to at least three surfaces such as a wall, floor, and tabletop. Report point-to-plane RMSE, inlier count, and the region used for each fit.

Estimate completeness as the percentage of intended major room surfaces that contain usable reconstructed points. Document the surface list in advance and include annotated screenshots; treat completeness as a project-defined coverage measure, not a standardized benchmark.

## Trajectory and consistency

Record three repeatable trajectories:

1. **Normal sweep:** slow lateral motion with high overlap.
2. **Closed loop:** return to the starting view.
3. **Stress sequence:** faster motion plus a low-texture wall and reflective object.

Repeat each trajectory three times. Keep the stress results separate from the headline normal-condition results.

Report:

- Total processed frames
- Successful and failed odometry updates
- Pose-success rate
- Accepted keyframes and acceptance reasons
- Successful pose updates per second
- Integrated keyframes per second
- Estimated ending translation and rotation relative to the starting pose for the loop
- Visible duplicated walls, bending, holes, ghost surfaces, and scale drift

The target is successful odometry for at least 80% of processed frame pairs on the normal-light trajectory. Keyframe acceptance is reported separately and is expected to be lower because it is intentionally gated by motion and time thresholds.

## Quality-performance matrix

Use the same recorded normal sequence and change one variable at a time.

| Experiment | Runtime | Resolution | Voxel size | Power mode |
|---|---|---:|---:|---:|
| Default | TensorRT FP16 | 518×518 | 2 cm | 25 W |
| Runtime | PyTorch FP16 | 518×518 | 2 cm | 25 W |
| Resolution | TensorRT FP16 | 392×392 | 2 cm | 25 W |
| Fusion | TensorRT FP16 | 518×518 | 4 cm | 25 W |
| Power | TensorRT FP16 | 518×518 | 2 cm | 15 W |

Run each recorded-sequence configuration three times. For live performance, warm up for 30 seconds and then measure at least three 60-second trials.

### Performance metrics

- Depth-inference latency and FPS
- RGB-D odometry latency
- TSDF integration latency
- Point-cloud extraction and visualization latency
- Queue wait time
- End-to-end p50 and p95 latency
- Pose updates and integrated keyframes per second
- Peak RAM
- CPU and GPU utilization
- Average and peak power
- Maximum temperature

Use NVIDIA's [`tegrastats`](https://docs.nvidia.com/jetson/archives/r34.1/DeveloperGuide/text/AT/JetsonLinuxDevelopmentTools/TegrastatsUtility.html) to log memory, processor use, power rails, and temperatures.

### Quality metrics

- Single-frame metric-depth MAE and RMSE
- Dimension absolute and percentage error
- Planar RMSE
- Pose-success rate
- Loop translation and rotation closure error
- Documented surface completeness

## Sustained-run test

Run the default live configuration continuously for 15 minutes.

Record:

- Latency and processing rate over time
- RAM and map size over time
- Power and temperature over time
- Number of tracked, rejected, and fused frames
- Any tracking reset, corruption, crash, or display stall

The test passes when it completes without out-of-memory failure, corrupted output, or continuously increasing queue latency.

## Results tables

### Metric depth

| Runtime | Resolution | Reference distance | Median prediction | MAE | Bias | Temporal SD |
|---|---:|---:|---:|---:|---:|---:|
| PyTorch FP32 | 518×518 | TBD | | | | |
| TensorRT FP16 | 518×518 | TBD | | | | |

### Reconstruction

| Configuration | Pose success | Dimension MAE | Planar RMSE | Closure translation | Closure rotation |
|---|---:|---:|---:|---:|---:|
| Default | | | | | |
| PyTorch FP16 | | | | | |
| 392×392 | | | | | |
| 4 cm voxels | | | | | |
| 15 W | | | | | |

### Performance

| Configuration | Depth ms | Odometry ms | Integration ms | End-to-end p50/p95 | RAM | Power | Max temp |
|---|---:|---:|---:|---:|---:|---:|---:|
| Default | | | | | | | |
| PyTorch FP16 | | | | | | | |
| 392×392 | | | | | | | |
| 4 cm voxels | | | | | | | |
| 15 W | | | | | | | |

## Required figures

- Predicted versus measured depth
- Depth error and temporal variation versus distance
- PyTorch and TensorRT depth-difference examples
- Annotated final point cloud
- Reconstructed versus measured room dimensions
- Planar residual distributions
- Camera trajectory for each sequence
- Loop-closure endpoint error
- Pipeline-stage latency breakdown
- Quality versus processing rate
- Power versus processing rate
- Temperature, memory, and latency during the 15-minute run

## Interpretation

Do not reduce the result to a single FPS value. The final recommendation must consider geometry error, tracking success, drift, map completeness, latency, memory headroom, power, and sustained thermal behavior. Attribute observed errors to evidence from the nearest relevant stage rather than treating all reconstruction defects as model failures.

## Related notes

- [[Capstone Proposal]]
- [[Deployment Plan]]
- [[Risks and Limitations]]
