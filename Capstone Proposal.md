---
tags:
  - capstone
  - proposal
  - edge-ai
  - 3d-reconstruction
status: draft
---

# Capstone Proposal

## Working title

**Live Monocular 3D Reconstruction with Depth Anything V2 on the Jetson Orin Nano Super**

## Project summary

This project will investigate whether monocular metric-depth predictions can support live, room-scale 3D reconstruction on a resource-constrained edge platform. An RGB camera connected to a Jetson Orin Nano Super will provide frames to the indoor metric Depth Anything V2 Small model. Each predicted depth map will be converted into a synthetic RGB-D frame, tracked with RGB-D odometry, and fused into a colored truncated signed distance function (TSDF) volume. The accumulated result will be displayed and exported as a point cloud.

The central contribution is not simply running a pretrained model. It is the design and evaluation of a complete reconstruction pipeline in which model error, camera calibration, pose drift, fusion parameters, latency, memory, power, and thermal behavior all affect the final map.

## Research question

> How accurately and efficiently can monocular metric-depth predictions be tracked and fused into a live local 3D reconstruction on a resource-constrained edge platform?

## Motivation

Dense 3D reconstruction normally depends on an RGB-D, stereo, or LiDAR sensor. Monocular depth estimation offers a lower-cost alternative using a conventional RGB camera, but depth predictions can be biased or temporally inconsistent. Small per-frame errors can become more damaging when frames are registered and accumulated.

[Depth Anything V2](https://arxiv.org/abs/2406.09414) provides models at several scales and separately fine-tuned metric-depth checkpoints. The [official metric-depth implementation](https://github.com/DepthAnything/Depth-Anything-V2/tree/main/metric_depth) includes a 24.8-million-parameter Small model trained for indoor scenes using Hypersim. The [Jetson Orin Nano Super](https://developer.nvidia.com/blog/nvidia-jetson-orin-nano-developer-kit-gets-a-super-boost/) provides an Ampere GPU, 8 GB of shared memory, and a 25 W performance mode, making it a plausible but constrained platform for combining learned depth, tracking, fusion, and visualization.

## Objectives

1. Calibrate the selected RGB camera and preserve its intrinsic and distortion parameters.
2. Deploy the indoor metric Depth Anything V2 Small checkpoint on the Jetson.
3. Back-project metric-depth predictions into correctly scaled colored point clouds.
4. Estimate camera motion from consecutive synthetic RGB-D frames.
5. Fuse accepted keyframes into a bounded TSDF volume.
6. Display and save an accumulated room-scale point cloud and camera trajectory.
7. Quantify single-frame depth error, reconstruction geometry, planar consistency, tracking stability, and drift.
8. Measure latency, throughput, memory, power, and temperature.
9. Analyze which errors arise from depth prediction, calibration, tracking, fusion, or resource constraints.

## Completion tiers

### Minimum viable result

- Calibrated camera with saved intrinsics, distortion coefficients, and calibration error
- Live metric-depth inference from Depth Anything V2 Small
- Correct per-frame colored point-cloud projection
- Reproducible offline odometry and TSDF fusion on a recorded sequence
- Measured-distance evaluation of single-frame depth
- Exported PLY point cloud and estimated camera trajectory

### Target final result

- Live camera-motion estimation and bounded room-scale TSDF fusion on the Jetson
- Live display of the accumulated point cloud
- TensorRT FP16 depth inference
- Quantitative geometry, plane, stability, drift, latency, memory, power, and thermal results
- Comparison of depth resolution and TSDF voxel size
- A justified recommendation for the most useful quality-performance configuration

### Stretch goals

- CUDA-enabled Open3D build on ARM64
- ORB-SLAM3 RGB-D tracking with loop closure or relocalization
- RGB-D reference-camera validation
- Mesh extraction and color refinement
- Multi-room or outdoor reconstruction

## Expected contribution

The project will produce a reproducible workflow for converting monocular metric-depth predictions into a live local 3D map on embedded hardware. Its capstone value lies in systems integration and experimental analysis: it will show whether frame-level depth quality is sufficient for multi-frame reconstruction, how errors accumulate, and which configuration best balances geometry quality with edge-device performance.

## Success criteria

- The camera calibration has mean reprojection error below 0.5 pixels.
- Per-frame point clouds are correctly oriented, colored, and expressed in metres.
- A recorded sequence reconstructs reproducibly before live fusion is attempted.
- The live system estimates poses and displays an accumulated point cloud while the camera moves.
- At least 80% of processed frame pairs in the normal-light test trajectory produce successful odometry estimates.
- A 15-minute mapping run completes without an out-of-memory failure or unbounded latency growth.
- At least five measured dimensions and three planar surfaces are evaluated quantitatively.
- PyTorch-to-TensorRT depth differences and their effect on reconstruction are reported.
- Conclusions distinguish depth, calibration, tracking, fusion, and platform limitations.

## Boundaries

The target is a bounded local map of one small indoor room, not a persistent full-SLAM or survey-grade system. Loop closure, relocalization, dynamic-scene reconstruction, and guaranteed metric accuracy are outside the required scope.

## Related notes

- [[Model and Hardware]]
- [[Deployment Plan]]
- [[Evaluation Plan]]
- [[Risks and Limitations]]
