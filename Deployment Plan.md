---
tags:
  - deployment
  - tensorrt
  - open3d
  - 3d-reconstruction
status: planning
---

# Deployment Plan

## Target pipeline

```text
Calibrated RGB camera
    → capture and undistort
    → metric Depth Anything V2 Small
    → metric-depth filtering
    → synthetic RGB-D frame
    → RGB-D odometry
    → keyframe acceptance
    → TSDF integration
    → point-cloud extraction, display, and export
```

Every stage must expose timing and success/failure information. Failed pose estimates must not be silently replaced with identity transforms or fused into the map.

## Phase 1 — Environment and camera

- [ ] Install and record the JetPack software stack
- [ ] Configure active cooling and 25 W mode
- [ ] Record camera, capture mode, focus, exposure, and storage configuration
- [ ] Capture checkerboard calibration images across the field of view
- [ ] Compute intrinsics and distortion coefficients
- [ ] Confirm mean reprojection error below 0.5 pixels
- [ ] Save calibration metadata and diagnostic images
- [ ] Validate live capture and undistortion

**Gate:** do not begin geometric evaluation until the final camera mode has a valid calibration.

## Phase 2 — Metric-depth baseline

- [ ] Install the official Depth Anything V2 metric-depth implementation
- [ ] Download the Small indoor checkpoint
- [ ] Run PyTorch FP32 inference on fixed images
- [ ] Run PyTorch FP16 inference on the same inputs
- [ ] Preserve raw floating-point depth in metres
- [ ] Filter invalid values and truncate depth to 0.3-8.0 m
- [ ] Validate predicted depth against a flat target at known distances
- [ ] Run metric-depth inference on live camera frames

**Gate:** raw depth orientation, units, resizing, and numerical range must be verified before 3D projection.

## Phase 3 — Per-frame point clouds

- [ ] Scale calibrated intrinsics to the depth-map resolution
- [ ] Back-project valid depth pixels into XYZ coordinates
- [ ] Attach corresponding RGB values
- [ ] Confirm axis orientation and scale with a simple measured scene
- [ ] Display the current point cloud
- [ ] Export a PLY file and reload it successfully
- [ ] Measure projection and visualization time

**Gate:** known geometry must appear at the correct orientation and approximate metric scale.

## Phase 4 — Recorded-sequence reconstruction

- [ ] Record a slow, high-overlap indoor RGB sequence
- [ ] Save frames, timestamps, depth maps, and metadata
- [ ] Create consecutive synthetic RGB-D frames
- [ ] Estimate motion with Open3D hybrid RGB-D odometry
- [ ] Record successful and failed odometry updates
- [ ] Accumulate the camera trajectory
- [ ] Apply the keyframe acceptance policy
- [ ] Fuse accepted keyframes into a scalable TSDF volume
- [ ] Extract and save the final point cloud
- [ ] Evaluate geometry and tracking before attempting live fusion

[Open3D's RGB-D odometry documentation](https://open3d.org/docs/latest/tutorial/pipelines/rgbd_odometry.html) describes the hybrid photometric/geometric method used for the primary pose backend. [Open3D TSDF integration](https://open3d.org/docs/release/tutorial/t_reconstruction_system/integration.html) supplies the scalable volumetric fusion and point-cloud extraction workflow.

**Gate:** the same recorded sequence must produce a reproducible map without fusing rejected frames.

## Phase 5 — TensorRT FP16

- [ ] Export the metric Small model through ONNX at fixed shape
- [ ] Validate ONNX output against PyTorch FP32
- [ ] Build 518×518 TensorRT FP16 engine on the Jetson
- [ ] Build 392×392 engine after the primary engine is stable
- [ ] Compare raw TensorRT depth with PyTorch
- [ ] Benchmark engine-only latency with `trtexec`
- [ ] Integrate TensorRT into recorded-sequence reconstruction
- [ ] Confirm that conversion does not materially degrade geometry

NVIDIA recommends `trtexec` for reproducible TensorRT engine benchmarking in its [performance benchmarking guide](https://docs.nvidia.com/deeplearning/tensorrt/latest/performance/benchmarking.html).

## Phase 6 — Live bounded reconstruction

Implement bounded asynchronous stages:

1. **Capture:** retain only the newest undistorted frame.
2. **Depth:** infer metric depth and drop stale pending frames.
3. **Tracking:** estimate every processed frame's pose.
4. **Fusion:** integrate accepted keyframes only.
5. **Display/export:** extract the accumulated cloud at 1-2 Hz.

Record queue wait time and stage latency. Dropping old frames is preferable to allowing end-to-end latency to grow without bound.

- [ ] Run live RGB-D odometry
- [ ] Accept a keyframe after successful tracking when translation is at least 5 cm, rotation is at least 3°, or one second has elapsed
- [ ] Fuse with 2 cm voxels and 8 cm TSDF truncation
- [ ] Enforce the 300-keyframe and 8 m depth limits
- [ ] Display the camera trajectory and accumulated cloud
- [ ] Save the TSDF state, PLY cloud, trajectory, frame log, and timing log
- [ ] Complete a 15-minute sustained run

## Tracking fallback

If fewer than 80% of processed frame pairs obtain successful odometry estimates on the controlled normal-light trajectory:

1. Verify undistortion, depth alignment, intrinsic scaling, timestamps, and coordinate conventions.
2. Reduce odometry resolution while preserving aspect ratio.
3. Increase frame overlap by slowing camera motion and tracking consecutive processed frames.
4. Tune Open3D's documented depth range, depth-difference, and correspondence thresholds on a development sequence.
5. Repeat the untouched evaluation sequence.
6. If success remains below 80%, replace only the pose backend with ORB-SLAM3 RGB-D mode and retain the same depth, fusion, logging, and evaluation interfaces.

[ORB-SLAM3](https://arxiv.org/abs/2007.11898) supports monocular, stereo, RGB-D, and visual-inertial configurations. Loop closure and relocalization remain stretch work; they are not required for the primary Open3D local map.

## Runtime artifacts

Each run must create a unique results directory containing:

- Frozen configuration and software versions
- Camera calibration identifier
- Input source and timestamps
- Raw or referenced RGB frames
- Raw metric-depth outputs for selected frames
- Per-frame pose and tracking status
- Keyframe acceptance reason
- Per-stage timing records
- `tegrastats` telemetry
- Final trajectory
- PLY point cloud
- TSDF state when supported
- Summary metrics and annotated screenshots

## Related notes

- [[Model and Hardware]]
- [[Evaluation Plan]]
- [[Risks and Limitations]]
