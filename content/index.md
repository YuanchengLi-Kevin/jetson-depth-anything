---
aliases:
  - Depth Anything Jetson
title: Live 3D Reconstruction on a Jetson Orin Nano Using Depth Anything V3
description: A capstone project investigating bounded, incremental monocular 3D reconstruction on an 8 GB edge device.
tags:
  - capstone
  - jetson
  - depth-anything-v3
  - 3d-reconstruction
status: planning
---

This capstone investigates whether **Depth Anything V3 Small** can turn a live monocular camera stream into a continually updated, room-scale 3D reconstruction on an **8 GB Jetson Orin Nano Super**.

| Platform | Model | Target update rate |
|---|---|---|
| Jetson Orin Nano Super, 8 GB | Depth Anything V3 Small | One accepted 3D map update every 2–5 seconds |

<br>

## Intended result

The visual target is Richard Palethorpe's [depth-anything.cpp voxel reconstruction demo](https://x.com/jichiep/status/2074051381887946972): a source camera view beside a persistent colored voxel world that can be replayed and explored from an independent 3D viewpoint.

[![The depth-anything.cpp DA3 Studio displaying a colored voxel reconstruction of a building beside its source camera frame](https://pbs.twimg.com/amplify_video_thumb/2074046892137140224/img/mBwEr7dHduVaMzoV.jpg)](https://x.com/jichiep/status/2074051381887946972)

*Voxel reconstruction reference by [Richard Palethorpe](https://x.com/jichiep). Select the image to view the original demo.*

> [!important] Visual reference—not a hardware performance baseline
> The reference uses phone time-lapse footage and a desktop-oriented depth-anything.cpp and SLAM pipeline. This project aims for a slower, bounded Jetson adaptation: deliberate movement through one small room, a responsive RGB preview, and a persistent point or voxel map updated after each accepted inference window.

A successful final demonstration will make recognizable structures—such as a doorway, desk, and wall corner—appear incrementally while preserving previously accepted geometry. Moderate noise, seams, and blocky voxels are acceptable when the room remains spatially coherent.

See [[Final Demo Target and Reference Systems]] for a detailed comparison with this demo and related systems.

## Research question

> **How effectively can Depth Anything V3 Small be adapted for incremental, spatially coherent point-cloud reconstruction on an 8 GB edge device?**

The challenge is not simply whether the model can run. The project must determine whether small overlapping predictions can be aligned reliably, accumulated without exhausting memory, and updated frequently enough to support a useful live demonstration.

## Core approach

```text
RGB camera
    ↓
Small overlapping image windows
    ↓
Depth Anything V3 Small
depth + confidence + camera geometry
    ↓
Confidence-filtered colored point cloud
    ↓
Sim(3) alignment through shared frames
    ↓
Bounded persistent point or voxel map
```

The primary configuration uses four frames with two retained overlap frames at 336 px. If that does not fit the memory budget, the documented fallback uses three frames with two retained overlap frames at 280 px.

## Capstone contribution

The contribution is a **Jetson-specific sliding-window reconstruction pipeline and evaluation**, not merely a model deployment. The work measures:

- multi-frame inference within 8 GB of shared memory;
- consistency and alignment across independently predicted windows;
- update latency and bounded point-cloud growth;
- reconstruction quality at reduced input resolution; and
- sustained memory, power, and thermal behavior.

Full SLAM, loop closure, Gaussian splatting, survey-grade metric accuracy, and desktop-class real-time performance are outside the required scope.

## Outcome tiers

### Minimum viable

- Run DA3 Small on recorded frames using the primary or fallback configuration.
- Produce a confidence-filtered colored point cloud from one window.
- Align at least two overlapping windows and accumulate a recorded room sweep.
- Export the final cloud, trajectory, configuration, and logs.

### Target

- Use live camera input with a responsive RGB preview.
- Produce at least one accepted map update every five seconds.
- Maintain a persistent point or voxel view bounded to 30 accepted windows and 1,000,000 points.
- Complete a recognizable one-room reconstruction and a 15-minute stability run.

### Stretch

- Increase the accepted update rate beyond the required target.
- Reduce visible seams with optional ICP refinement.
- Add loop closure, pose-graph optimization, or a remote WebGL viewer.
- Investigate TensorRT, C++ deployment, or Gaussian splatting after the core system succeeds.

## Current status

**Planning and feasibility validation**

Next technical milestones:

1. Run DA3 Small FP16 on the Jetson and measure 2-, 3-, and 4-frame memory use.
2. Validate depth, confidence, intrinsics, pose outputs, and coordinate conventions.
3. Export one confidence-filtered colored point cloud.
4. Test shared-frame consistency and align two overlapping windows with Sim(3).
5. Accumulate a bounded recorded room sweep before integrating live capture.

## Project notes

- [[Capstone Proposal|Proposal]] — motivation, objectives, completion tiers, and success criteria
- [[System Architecture]] — runtime data flow, queues, state, and artifacts
- [[Window Alignment and Mapping]] — shared-frame Sim(3) registration and bounded accumulation
- [[Jetson Platform and Feasibility]] — memory budget, dependencies, and feasibility gates
- [[Deployment Roadmap]] — ordered implementation phases and deliverables
- [[Evaluation Plan]] — evaluation questions, acceptance criteria, and stability testing
- [[Risks and Limitations]] — deployment, alignment, validity, and scope risks
- [[Final Demo Target and Reference Systems|Final Demo]] — visual target and comparison with related systems
