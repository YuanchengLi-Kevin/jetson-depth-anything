---
tags:
  - evaluation
  - benchmarking
  - depth-anything-v3
  - 3d-reconstruction
status: planning
---

# Evaluation Plan

## Evaluation questions

1. Which approved DA3 Small window configuration fits within the Jetson's shared 8 GB memory?
2. Does DA3 Small produce usable relative depth, confidence, intrinsics, and poses for a controlled indoor sweep?
3. Can shared-frame Sim(3) alignment join at least 80% of attempted windows?
4. After one independent scale alignment, how closely does the map preserve doorway width and height?
5. Can the bounded live system update at least once every five seconds and remain stable for 15 minutes?

## Locked test configuration

- DA3 Small with PyTorch FP16
- Primary 4-frame/2-overlap window at 336 px
- Fallback 3-frame/2-overlap window at 280 px only if the primary fails
- `upper_bound_resize`
- `ref_view_strategy="middle"`
- `use_ray_pose=False`
- Discard the lowest 40% confidence values per frame
- Slow motion and approximately 2 selected frames/s
- 25 W mode with active cooling
- Maximum 30 accepted windows and 1,000,000 points

Do not treat the fallback decision as a broad configuration study. Stop testing larger configurations after the primary passes.

## Required evaluations

- Jetson resource feasibility
- Camera calibration quality
- Single-window output and geometry validity
- Overlapping-window alignment
- Independent scale normalization and doorway geometry
- Five-minute live performance
- Fifteen-minute sustained stability

Detailed procedures are authoritative in [[Test Protocols]]. Record results using [[Results Templates]].

## Headline acceptance criteria

- Mean calibration reprojection error below 0.5 px
- Five primary or fallback windows complete below 7.0 GB peak used memory
- Required DA3 outputs are finite and have their documented shapes
- Correct single-window color and coordinate conventions
- At least 80% accepted window registrations
- No geometry or poses from rejected windows
- No more than 30 accepted windows or 1,000,000 points
- At least one accepted viewer update every five seconds
- Doorway errors reported after a separate 1.0 m scale reference
- Fifteen minutes without out-of-memory failure, unbounded queues, corrupted output, crash, or viewer stall

There is no predetermined doorway-error threshold. The geometry measurement characterizes the scaled result rather than defining survey-grade success.

## Optional evaluation

Run `use_ray_pose=True` once after the baseline succeeds. Retain it only if it:

- Fits below 7.0 GB
- Preserves the five-second update target
- Improves registration acceptance or median overlap residual

TensorRT, official DA3-Streaming, ICP, and V2 baseline comparisons remain stretch work.

## Reporting principle

Distinguish:

1. DA3 resource feasibility
2. Coherence inside one window
3. Coherence across aligned windows
4. Approximate metric behavior after one scale reference
5. Live update cadence and sustained resource behavior

A convincing cloud does not establish metric accuracy. Report the result as chunked live reconstruction rather than camera-frame-rate mapping.

## Related notes

- [[Test Protocols]]
- [[Results Templates]]
- [[Window Alignment and Mapping]]
- [[Risks and Limitations]]
