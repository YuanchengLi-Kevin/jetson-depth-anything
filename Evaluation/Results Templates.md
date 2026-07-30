---
tags:
  - evaluation
  - results
  - reporting
  - figures
status: planning
---

# Results Templates

## Resource feasibility

| Frames | Resolution | Runs completed | Peak memory | Inference p50/p95 | Decision |
|---:|---:|---:|---:|---:|---|
| 4 | 336 | | | | |
| 3 | 280 | | | | |

Record the fallback row only when the primary fails.

## Camera calibration

| Images accepted | Resolution | Mean reprojection error | Maximum error | Focus/exposure locked |
|---:|---:|---:|---:|---|
| | | | | |

## Single-window outputs

| Window | Valid depth | Confidence p40 | Retained points | Predicted fx/fy | PLY reload |
|---|---:|---:|---:|---:|---|
| | | | | | |

## Window alignment

| Attempts | Accepted | Rejected | Success rate | Median correspondences | Median inlier ratio | Median residual |
|---:|---:|---:|---:|---:|---:|---:|
| | | | | | | |

For rejected attempts, include a separate count by rejection reason.

## Doorway after scale alignment

| Dimension | Reference | Reconstructed | Absolute error | Percentage error |
|---|---:|---:|---:|---:|
| Width | | | | |
| Height | | | | |

Also report the raw internal length of the independent 1.0 m reference and the resulting scale factor.

## Live performance

| Window config | Inference p50/p95 | Alignment p50/p95 | Update interval p50/p95 | Peak memory | Avg/peak power | Max temp |
|---|---:|---:|---:|---:|---:|---:|
| Locked configuration | | | | | | |

## Sustained run

| Duration | Accepted windows | Rejected windows | Final points | Peak memory | Max p95 update interval | Max temp | Pass |
|---:|---:|---:|---:|---:|---:|---:|---|
| 15 min | | | | | | | |

## Required figures

- One window's processed RGB, relative depth, and confidence
- Single-window cloud with predicted cameras
- Two-window overlap before and after Sim(3)
- Final bounded colored cloud and trajectory
- Annotated scale reference
- Annotated doorway width and height
- Accepted and rejected registrations by reason
- Window-stage latency
- Memory, point count, power, temperature, and update interval over 15 minutes

## Reporting conventions

- State whether the primary or fallback window was used
- Report raw relative and metric-scaled results separately
- Use p50 and p95 for latency and update interval
- Preserve rejected attempts in all denominators
- Label manually selected endpoints
- Report all map consolidation and point-cap events
- Distinguish preview frame rate from reconstruction update rate

## Interpretation

Address these questions directly:

1. Did DA3 Small fit the target Jetson stack?
2. Was geometry coherent inside individual windows?
3. Were overlapping windows joined reliably?
4. What metric error remained after one independent scale alignment?
5. Was the chunked live update rate convincing and stable?

Do not equate low overlap residual with ground-truth pose accuracy. Do not describe the scaled map as survey-grade. State the restricted scene and motion conditions.

## Related notes

- [[Evaluation Plan]]
- [[Test Protocols]]
- [[Capstone Proposal]]
- [[Risks and Limitations]]
