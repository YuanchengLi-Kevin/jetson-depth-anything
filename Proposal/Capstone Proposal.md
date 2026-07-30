---
tags:
  - capstone
  - proposal
  - edge-ai
  - depth-anything-v3
  - 3d-reconstruction
status: draft
---

# Capstone Proposal

## Working title

**Live Any-View 3D Reconstruction on the Jetson Orin Nano Super Using Depth Anything V3 Small**

## Project summary

This project will adapt Depth Anything V3 Small for incremental multi-view point-cloud reconstruction on an 8 GB Jetson Orin Nano Super. Instead of predicting each frame independently and estimating motion with a separate odometry system, the model will process small overlapping image windows and jointly produce relative depth, confidence, camera intrinsics, and camera extrinsics. Each window will be converted into a confidence-filtered colored point cloud. Consecutive windows will be registered through their shared frames with a similarity transform, accumulated into a bounded global cloud, displayed continually, and exported with the estimated camera trajectory.

The official [Depth Anything 3 repository](https://github.com/ByteDance-Seed/Depth-Anything-3) describes DA3 as an any-view geometry model that accepts one or more images and estimates spatially consistent depth and camera geometry. Its [DA3 Small model card](https://huggingface.co/depth-anything/DA3-SMALL) lists approximately 0.08B parameters and support for relative depth, pose estimation, and pose conditioning. This makes it a better conceptual match for coherent reconstruction than a per-frame depth model, but multi-view activations and window stitching create new resource and systems challenges.

## Research question

> How effectively can Depth Anything V3 Small be adapted for incremental, spatially coherent point-cloud reconstruction on an 8 GB edge device?

## Motivation

Live monocular reconstruction requires both scene geometry and camera motion. A per-frame depth model leaves pose estimation, scale consistency, and cross-frame alignment to separate subsystems. [Depth Anything 3](https://arxiv.org/abs/2511.10647) predicts depth and camera geometry jointly from arbitrary visual inputs, allowing a compact window of overlapping views to form a coherent local reconstruction.

DA3 is not automatically a complete long-term mapper. Its Small any-view model predicts relative rather than guaranteed metric geometry, consecutive windows have independent similarity frames, and multi-view inference increases activation memory. The official [DA3-Streaming documentation](https://github.com/ByteDance-Seed/Depth-Anything-3/blob/main/da3_streaming/README.md) targets longer chunks and reports published memory figures above the Orin Nano's 8 GB capacity. The capstone contribution is therefore a smaller Jetson-specific windowing, alignment, map-bounding, and evaluation design rather than a direct deployment of the full streaming configuration.

## Objectives

1. Calibrate one RGB camera and establish a repeatable slow, high-overlap capture procedure.
2. Deploy the official DA3 Small checkpoint with PyTorch FP16 on the Jetson.
3. Determine whether 4-frame inference at 336 px fits the memory budget, using a defined 3-frame/280 px fallback.
4. Validate DA3 depth, confidence, world-to-camera extrinsics, intrinsics, and processed-image outputs.
5. Back-project each window into a confidence-filtered colored point cloud.
6. Align consecutive windows with a robust Sim(3) transform estimated from identical pixels in their shared frames.
7. Append only new-frame geometry to a bounded global point cloud and camera trajectory.
8. Display each accepted map update and export PLY, trajectory, window, alignment, and telemetry artifacts.
9. Measure feasibility, window alignment, update latency, memory, power, temperature, scaled doorway geometry, and 15-minute stability.

## Completion tiers

### Minimum viable result

- Calibrated, repeatable RGB capture
- Successful DA3 Small FP16 inference using the primary or documented fallback window
- Verified relative depth, confidence, intrinsics, and extrinsics
- Confidence-filtered colored point cloud from one window
- Successful Sim(3) alignment of two overlapping recorded windows
- Bounded accumulated map from one recorded room sweep
- Continually updating viewer
- Saved PLY cloud, trajectory, configuration, and logs

### Target final result

- Live capture feeding bounded overlapping windows
- At least one accepted point-cloud update every five seconds
- Metric normalization from one independent known-length reference
- Reconstructed doorway width and height evaluation
- Per-window latency, alignment quality, peak memory, power, and temperature reporting
- A 15-minute run without memory failure, unbounded queues, map corruption, crash, or viewer stall

### Stretch goals

- TensorRT or C++/GGML deployment
- Official DA3-Streaming integration
- Ray-based pose estimation as the primary mode
- ICP refinement
- Loop closure and pose-graph optimization
- DA3 Metric Large or Nested metric reconstruction
- V2-plus-odometry baseline comparison
- TSDF fusion, meshing, semantic labels, or Gaussian splatting
- Multi-room reconstruction

## Expected contribution

The result will be a reproducible edge-deployment workflow for DA3 Small and a bounded sliding-window mapper designed around the Orin Nano's memory limit. The project will show whether joint any-view depth and pose can replace a separate conventional odometry backend for a short live room scan, how reliably overlapping windows can be joined, and what update rate and resource cost are achievable.

## Success criteria

- The final camera mode has mean calibration reprojection error below 0.5 pixels.
- DA3 Small runs in FP16 on either the 4-frame/336 px primary configuration or the 3-frame/280 px fallback without out-of-memory failure.
- Every accepted prediction contains finite depth, confidence, intrinsics, and world-to-camera extrinsics with the documented shapes.
- Single-window geometry has correct color association and consistent coordinate conventions.
- At least 80% of attempted window registrations pass the overlap-alignment quality gates.
- Rejected windows add neither geometry nor trajectory poses.
- The global map never exceeds 30 accepted windows or 1,000,000 points.
- The live system produces at least one accepted viewer update every five seconds.
- A separate known-length reference is used for scale; doorway width and height errors are then reported without a predetermined pass threshold.
- A 15-minute run completes without out-of-memory failure, unbounded queue growth, corrupted output, crash, or viewer stall.

## Boundaries

The required result is a bounded local reconstruction of one small, mostly static indoor room. DA3 Small's internal scale is not claimed to be metres until a separate known-length alignment is applied. Full SLAM, loop closure, relocalization, pose ground truth, survey-grade accuracy, the official large-chunk streaming configuration, TensorRT conversion, Gaussian splatting, and persistent multi-room mapping are outside the required scope.

## Technical references

- [[System Architecture]]
- [[DA3 Model and Outputs]]
- [[Window Alignment and Mapping]]
- [[Jetson Platform and Feasibility]]
- [[Evaluation Plan]]
- [[Risks and Limitations]]
