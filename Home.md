---
aliases:
  - Depth Anything Jetson
tags:
  - capstone
  - jetson
  - monocular-depth
  - 3d-reconstruction
status: planning
---

# Live Monocular 3D Reconstruction on Jetson Orin Nano

> [!abstract] Project in one sentence
> Use Depth Anything V2 Small to predict metric depth from a calibrated RGB camera, track the resulting synthetic RGB-D stream, and fuse it into a live local 3D reconstruction on a Jetson Orin Nano Super.

## Research question

> How accurately and efficiently can monocular metric-depth predictions be tracked and fused into a live local 3D reconstruction on a resource-constrained edge platform?

## Architecture

```text
calibrated RGB camera
    → undistorted frame
    → metric Depth Anything V2 Small
    → synthetic RGB-D
    → Open3D odometry
    → keyframe selection
    → TSDF fusion
    → live colored point cloud
```

## Locked direction

- **Scene:** one small indoor room
- **Model:** Depth Anything V2 Small indoor metric checkpoint
- **Primary runtime:** TensorRT FP16
- **Primary input:** 518×518, batch size 1
- **Depth range:** 0.3-8.0 m
- **Pose backend:** Open3D hybrid RGB-D odometry
- **Fusion:** scalable TSDF, 2 cm voxels, 8 cm truncation
- **Map bound:** 300 accepted keyframes
- **Platform:** Jetson Orin Nano Super, active cooling, 25 W
- **Primary contribution:** reconstruction accuracy and stability

## Completion tiers

### Minimum viable

- Calibrated camera
- Live metric-depth inference
- Correct per-frame colored point clouds
- Offline odometry and TSDF fusion
- Measured-distance accuracy results
- Saved PLY cloud and trajectory

### Target final

- Live accumulated room-scale point cloud
- TensorRT FP16 inference
- Geometry, planar, tracking, drift, latency, memory, power, and thermal evaluation
- Quality-performance comparison across resolution, voxel size, and power mode

### Stretch

- CUDA-enabled Open3D
- ORB-SLAM3 loop closure or relocalization
- RGB-D reference scan
- Mesh extraction
- Multi-room or outdoor mapping

## Project notes

- [[Capstone Proposal]] — motivation, scope, contribution, and success criteria
- [[Model and Hardware]] — checkpoint, Jetson, camera calibration, and fusion settings
- [[Deployment Plan]] — staged path from calibration to live TSDF reconstruction
- [[Evaluation Plan]] — metric-depth, geometry, tracking, drift, and performance tests
- [[Risks and Limitations]] — predicted-depth, odometry, fusion, and platform risks

## Milestones

- [ ] Record the exact JetPack and dependency versions
- [ ] Confirm the camera and final capture mode
- [ ] Calibrate the camera below 0.5 px reprojection error
- [ ] Validate indoor metric-depth predictions
- [ ] Generate and export a per-frame point cloud
- [ ] Record the controlled reconstruction sequences
- [ ] Complete offline RGB-D odometry
- [ ] Complete offline TSDF fusion
- [ ] Export ONNX and build TensorRT FP16 engine
- [ ] Integrate the bounded live pipeline
- [ ] Complete measured geometry and plane evaluation
- [ ] Complete trajectory and closure evaluation
- [ ] Complete the 15-minute sustained test
- [ ] Analyze quality-performance trade-offs

## Next actions

- [ ] Record JetPack, CUDA, cuDNN, TensorRT, Python, and PyTorch versions
- [ ] Choose and lock the camera resolution, focus, and exposure
- [ ] Print or obtain an accurately measured checkerboard
- [ ] Collect calibration images
- [ ] Download the official indoor metric Small checkpoint
