---
tags:
  - deployment
  - roadmap
  - depth-anything-v3
  - 3d-reconstruction
status: planning
---

# Deployment Roadmap

## Phase 0 — Freeze environment and inputs

- [ ] Complete the software record in [[Jetson Platform and Feasibility]]
- [ ] Configure active cooling and 25 W mode
- [ ] Lock the camera mode, focus, and exposure
- [ ] Complete calibration below 0.5 px mean reprojection error
- [ ] Record development and untouched evaluation sweeps

**Gate:** the final camera mode and Jetson software stack are reproducible.

## Phase 1 — DA3 resource feasibility

- [ ] Install the basic official DA3 environment
- [ ] Download DA3 Small
- [ ] Run the 2-frame warm-up
- [ ] Apply the primary 4×336 five-window test
- [ ] Apply the 3×280 fallback only if required
- [ ] Lock and record the selected configuration

**Gate:** five windows complete below 7.0 GB, or the project records a feasibility stop.

## Phase 2 — Output and coordinate validation

- [ ] Validate every output in [[DA3 Model and Outputs]]
- [ ] Visualize processed RGB, depth, and confidence
- [ ] Verify world-to-camera convention and matrix inversion
- [ ] Compare predicted and calibrated intrinsics diagnostically
- [ ] Save a complete diagnostic window

**Gate:** one window has valid outputs, coherent cameras, and verified coordinates.

## Phase 3 — Single-window point cloud

- [ ] Apply the 40th-percentile confidence filter
- [ ] Back-project with predicted intrinsics
- [ ] Transform points with inverted extrinsics
- [ ] Attach processed-image colors
- [ ] Normalize first-window median retained depth to 1.0
- [ ] Downsample at 0.01 internal units
- [ ] Display, export, and reload the PLY

**Gate:** single-window geometry has correct color and coordinate conventions.

## Phase 4 — Two-window alignment

- [ ] Preserve exact shared frames and processed grids
- [ ] Construct shared-frame 3D correspondences
- [ ] Implement RANSAC Sim(3)
- [ ] Refine with Umeyama alignment
- [ ] Apply every gate in [[Window Alignment and Mapping]]
- [ ] Transform points and cameras into global coordinates
- [ ] Append non-overlap geometry only
- [ ] Verify rejected windows change no global state

**Gate:** two windows align without visible duplication.

## Phase 5 — Recorded bounded reconstruction

- [ ] Process the untouched sweep using the locked window
- [ ] Consolidate every five accepted windows
- [ ] Enforce 30-window and 1,000,000-point limits
- [ ] Refresh the viewer after every accepted window
- [ ] Export relative PLY and trajectory
- [ ] Confirm rejected windows contributed no points or poses

**Gate:** the recorded sequence produces a coherent bounded map.

## Phase 6 — Live integration

- [ ] Implement the bounded stages in [[System Architecture]]
- [ ] Keep one active inference and at most one pending window
- [ ] Replace only stale non-overlap candidates
- [ ] Keep capture and preview responsive
- [ ] Update the viewer after accepted windows
- [ ] Produce at least one accepted update every five seconds
- [ ] Save all required runtime artifacts

**Gate:** the five-minute live performance protocol passes.

## Phase 7 — Scale and final evaluation

- [ ] Apply the independent 1.0 m scale reference
- [ ] Save raw relative and metric-scaled outputs
- [ ] Measure doorway width and height
- [ ] Complete every required protocol
- [ ] Complete the 15-minute sustained run
- [ ] Populate [[Results Templates]]

## Optional optimization

- [ ] Test ray pose once against the baseline
- [ ] Keep ray pose only if it fits memory/update limits and improves alignment
- [ ] Investigate TensorRT, C++/GGML, or reduced official streaming only after completion

Do not make optional optimization a graduation dependency.

## Deliverables

- Reproducible environment and camera records
- Source implementation and frozen configuration
- Development and evaluation run logs
- Raw relative and metric-scaled PLY clouds
- Raw relative and metric-scaled trajectories
- Alignment and performance metrics
- Annotated screenshots and final demonstration
- Completed result tables and interpretation

## Related notes

- [[System Architecture]]
- [[Jetson Platform and Feasibility]]
- [[Camera and Data Collection]]
- [[Evaluation Plan]]
