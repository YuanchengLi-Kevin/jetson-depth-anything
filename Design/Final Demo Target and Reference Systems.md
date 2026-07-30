---
tags:
  - design
  - final-demo
  - related-work
  - depth-anything-v3
  - 3d-reconstruction
status: planning
---

# Final Demo Target and Reference Systems

## Start here: visual demo shortlist

These official demonstrations are the fastest way to understand the intended experience. They are visual and architectural references, not claims about achievable Orin Nano speed or quality.

| Demo | What to watch for | Why it is not the Jetson baseline |
|---|---|---|
| [Depth Anything 3 video reconstruction and SLAM gallery](https://depth-anything-3.github.io/) | Multi-view geometry, recovered cameras, and a scene becoming navigable in 3D | The official gallery demonstrates the broader DA3 model family and does not represent DA3 Small PyTorch throughput on an 8 GB Orin |
| [depth-anything.cpp streaming and voxel implementation](https://github.com/localai-org/depth-anything.cpp/pull/2) | Overlapping windows, progressive reveal, colored points and voxels, camera flythrough, and post-inference seam correction | The implementation can use larger models, windows, desktop GPUs, and optional corrective stages outside the required scope |
| [ViSTA-SLAM project gallery](https://ganlinzhang.xyz/vista-slam) and [live-camera video](https://github.com/user-attachments/assets/ac8732d0-4efd-4814-a168-01eae799df7c) | A live monocular viewer containing dense geometry, camera trajectory, and loop-closure structure | ViSTA-SLAM uses a different learned frontend and a complete optimized SLAM backend |
| [Open3D real-time reconstruction video](https://www.youtube.com/watch?v=pLCVCH7ypI4) | Responsive live capture, continuously maintained geometry, and an interactive reconstruction viewer | Open3D uses measured RGB-D input, making tracking and geometry easier than monocular predicted depth |

## Intended experience

The final project should feel like a slow, deliberate room scan in which a recognizable 3D world appears incrementally. The live RGB preview remains smooth while accepted Depth Anything 3 windows update the 3D map every 2–5 seconds. Previously reconstructed geometry remains visible as the camera moves, and the viewer can orbit the accumulated map independently of the capture camera.

A representative demonstration will:

1. Show the live RGB camera feed.
2. Move slowly through one small, mostly static room with strong overlap between views.
3. Pass a doorway, desk, and wall corner so the result contains recognizable structural landmarks.
4. Add a colored point-cloud or voxel-map update after every accepted DA3 window.
5. Show the estimated camera trajectory with the persistent reconstruction.
6. Finish by exporting the complete bounded room sweep and trajectory.

The required live target is at least one accepted viewer update every five seconds. The map remains bounded to 30 accepted windows and 1,000,000 points as defined in [[System Architecture]] and [[Capstone Proposal]].

> [!success] What counts as a good result
> The room does not need to resemble a polished laser scan. Moderate noise, blocky voxel geometry, and minor seams are acceptable when the doorway, desk, wall corner, and overall room layout remain recognizable and spatially coherent.

## Outcome tiers

### Passable capstone

- Process a recorded one-room sequence.
- Coherently align at least two overlapping windows.
- Produce a recognizable bounded accumulated cloud.
- Refresh the viewer during processing.
- Export and reload the final cloud and trajectory reliably.

### Strong capstone

- Use live camera input with a responsive RGB preview.
- Produce at least one accepted map update every five seconds.
- Keep the map within 30 accepted windows and 1,000,000 points.
- Make the doorway, furniture, and wall structure recognizable.
- Offer both point and voxel display modes.
- Complete the 15-minute stability protocol.

### Exceptional capstone

- Approach one accepted update per second without exceeding the memory gate.
- Reduce visible seam duplication through optional ICP refinement.
- Remain coherent when the camera returns toward its starting view.
- Provide a remote browser or WebGL viewer.
- Document the measured quality-versus-memory tradeoff.

These levels describe outcome quality, not additional graduation requirements. The acceptance criteria in [[Capstone Proposal]] and [[Evaluation Plan]] remain authoritative.

## Stretch goals and non-goals

The following qualities are useful future directions but are not required:

- Reconstruction updates after every video frame
- Fast handheld camera motion
- Very dense, clean surface geometry
- Robust handling of reflective objects and textureless walls
- Loop closure and pose-graph optimization
- Elimination of all duplicated or thickened surfaces
- Long-duration or multi-room mapping
- Fully metric geometry without an independent reference
- TSDF fusion, meshing, semantic reconstruction, or Gaussian splatting

The project should be compared with these systems by architecture and visual outcome, not by headline frame rate. Many references use larger GPUs, measured RGB-D input, more complete SLAM backends, or substantially heavier scene representations.

## Closest references

### [DA3-Streaming](https://github.com/ByteDance-Seed/Depth-Anything-3/blob/main/da3_streaming/README.md)

DA3-Streaming is the closest official architectural reference. It processes long image sequences in chunks, carries state between chunks, and produces camera and combined geometry artifacts while reducing the memory cost of long-sequence DA3 inference.

**Visual/demo:** The [DA3-Streaming README](https://github.com/ByteDance-Seed/Depth-Anything-3/blob/main/da3_streaming/README.md) documents its outputs and results but does not provide a separate official demo. Use the broader [official DA3 video reconstruction and large-scale SLAM gallery](https://depth-anything-3.github.io/) only as visual context for the model family.

**Borrow:** overlapping chunks, state carried between chunks, confidence filtering, combined point-cloud output, and separate camera and geometry artifacts.

**Why it is not a performance baseline:** its published configurations and long-sequence stack target substantially larger memory budgets than the Orin Nano's 8 GB shared memory. This project uses smaller 4-frame/336 px or fallback 3-frame/280 px windows and a bounded local map.

### [depth-anything.cpp streaming and voxel implementation](https://github.com/localai-org/depth-anything.cpp/pull/2)

This merged implementation is the closest visual and algorithmic reference for the desired progressive room reveal. It stitches overlapping DA3 video windows with Sim(3), accumulates a coherent cloud, and adds optional seam ICP, loop closure, pose-graph optimization, surface fusion, trajectory playback, surfels, and colored voxel cubes. It is the stable primary reference for the demo effect rather than an ambiguous social-media post.

**Visual/demo:** Review the [merged streaming and voxel implementation](https://github.com/localai-org/depth-anything.cpp/pull/2), especially the progressive point-cloud reveal, voxel rendering, capture-path flythrough, and source-frame picture-in-picture.

**Borrow:** pixel-matched overlap correspondences, weighted Sim(3) alignment, append-only progressive reveal, separation of mapping from rendering, point and voxel modes, independent free orbit, trajectory display, and explicit post-processing stages.

**Why it is not a performance baseline:** its demonstrations can use larger DA3 models, larger windows, desktop-class discrete GPUs, and several corrective stages that are outside the required Jetson scope. The Orin target is a slower, bounded, slightly noisier version of the same broad experience.

### [ViSTA-SLAM](https://github.com/zhangganlin/vista-slam)

ViSTA-SLAM demonstrates live monocular dense reconstruction using a lightweight two-view frontend, Sim(3) pose-graph optimization, loop closure, and a viewer that presents reconstruction, camera poses, and graph edges. Its live-camera mode is a useful example of how the final demonstration can communicate tracking and mapping state.

**Visual/demo:** The [official project gallery](https://ganlinzhang.xyz/vista-slam) shows qualitative reconstructions and the pose-graph presentation. The authors also provide a direct [live-camera demonstration](https://github.com/user-attachments/assets/ac8732d0-4efd-4814-a168-01eae799df7c).

**Borrow:** small-view processing, Sim(3) reasoning, separation of frontend association from global optimization, live-camera presentation, trajectory visualization, and explicit loop-closure structure.

**Why it is not a performance baseline:** it is a complete research SLAM system with a different learned frontend and global backend. Its published real-time behavior does not establish DA3 Small PyTorch performance on an 8 GB Orin Nano.

## Mapping and viewer references

### [Open3D reconstruction system](https://www.open3d.org/docs/release/tutorial/reconstruction_system/index.html)

Open3D separates local fragment creation, registration, refinement, integration, and visualization in a complete reconstruction pipeline.

**Visual/demo:** The Open3D team's [real-time reconstruction, registration, and web visualizer video](https://www.youtube.com/watch?v=pLCVCH7ypI4) is a useful UI and pipeline reference. It demonstrates RGB-D rather than monocular reconstruction.

**Borrow:** clear stage boundaries, interactive 3D visualization, camera trajectory presentation, registration diagnostics, and CPU/GPU execution separation.

**Why it is not a performance baseline:** the reconstruction pipeline expects synchronized, measured RGB-D input. Its odometry and TSDF integration solve an easier geometry problem than monocular predicted depth.

### [nvblox](https://github.com/nvidia-isaac/nvblox)

nvblox is an NVIDIA-oriented GPU library for incremental TSDF and ESDF reconstruction, with C++, Python, and ROS 2 interfaces.

**Visual/demo:** The [official nvblox documentation](https://nvidia-isaac.github.io/nvblox/public/index.html) includes reconstruction examples and Jetson-oriented workflows. Its examples consume measured depth and poses.

**Borrow:** bounded GPU voxel-map structures, incremental integration, robotics-style telemetry, and Jetson deployment practices. It is the most relevant reference if TSDF fusion becomes a later extension.

**Why it is not a performance baseline:** nvblox is designed primarily for robots with RGB-D cameras and consumes measured depth. Raw DA3 relative-depth windows would require pose, scale, uncertainty, and integration adapters.

### [LiveScan3D](https://github.com/MarekKowalski/LiveScan3D)

LiveScan3D combines multiple Kinect or Azure Kinect depth sensors into a live colored point cloud in one shared coordinate system.

**Visual/demo:** The authors' [LiveScan3D presentation](https://www.youtube.com/watch?v=9y_WglwpJtE) shows multiple RGB-D sensors contributing to one persistent live colored cloud.

**Borrow:** the viewer outcome of multiple observations continually contributing colored geometry to one persistent scene.

**Why it is not a performance baseline:** it uses multiple calibrated hardware depth sensors rather than one monocular RGB camera and learned relative depth.

## Supporting and future-direction references

### [pySLAM](https://github.com/luigifreda/pyslam)

pySLAM combines monocular, stereo, and RGB-D tracking with depth prediction, loop closure, volumetric reconstruction, and semantic mapping.

**Visual/demo:** The official [pySLAM v2.10 demonstration](https://www.youtube.com/watch?v=jzwKByzyqzg) shows its modular viewer, tracking, dense reconstruction, and mapping outputs across a much broader stack.

**Borrow:** modular boundaries between tracking, depth prediction, dense reconstruction, loop closure, and visualization.

**Why it is not a performance baseline:** it is a broad experimentation framework with many interchangeable subsystems, not a fixed DA3 Small deployment optimized for the Orin Nano.

### [ORB-SLAM3](https://github.com/UZ-SLAMLab/ORB_SLAM3)

ORB-SLAM3 is a mature sparse SLAM reference supporting monocular, stereo, RGB-D, and visual-inertial configurations with map reuse and camera trajectory output.

**Visual/demo:** The official [ORB-SLAM3 overview video](https://youtu.be/HyLNq-98LRo) shows tracking state, sparse map structure, keyframes, and trajectory presentation rather than dense DA3 geometry.

**Borrow:** tracking-state reporting, keyframe selection concepts, relocalization and failure states, trajectory display, and decoupling the map from the viewer.

**Why it is not a performance baseline:** its primary map is sparse and its geometry, tracking, and compute profile differ substantially from dense DA3 point-cloud inference.

### [RTG-SLAM](https://github.com/MisEty/RTG-SLAM)

RTG-SLAM uses a compact Gaussian representation and selective online optimization for real-time large-scale RGB-D reconstruction.

**Visual/demo:** The [official RTG-SLAM project page](https://gapszju.github.io/RTG-SLAM/) contains reconstruction videos, comparisons, and a method overview. It uses RGB-D input and Gaussian splatting.

**Borrow:** ideas for future scene representations, selective updates, and separating stable from actively optimized geometry.

**Why it is not a performance baseline:** it uses measured RGB-D input, Gaussian optimization, and a heavier reconstruction stack. Gaussian splatting remains a future direction rather than part of the required project.

## Project position

This project occupies a narrower edge-computing niche than the reference systems:

> A compact, bounded DA3 Small sliding-window point-cloud mapper designed specifically around the Jetson Orin Nano Super's 8 GB shared-memory constraint.

The intended contribution is not a new full SLAM system or visual parity with desktop demonstrations. It is a reproducible evaluation of whether joint any-view depth and pose can support a coherent, continually updated one-room reconstruction under a strict embedded memory and latency budget.

## Related notes

- [[Capstone Proposal]]
- [[System Architecture]]
- [[Window Alignment and Mapping]]
- [[Deployment Roadmap]]
- [[Evaluation Plan]]
- [[Risks and Limitations]]
