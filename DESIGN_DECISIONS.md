# CineAlgo — Design Decisions

This document explains the key architectural, algorithmic, and design decisions behind **CineAlgo**. It is intended to clarify *why* the system is built the way it is, not merely *how* it works.

CineAlgo was designed as an educational instrument, not a visual toy. Every decision prioritizes correctness, determinism, and learning clarity over visual spectacle.

---

## 1. Why Generator-Based Algorithms

All algorithms in CineAlgo are implemented using **generator functions** that yield a sequence of immutable states.

### Rationale

* Algorithms are inherently sequential and temporal.
* Generators naturally model step-by-step execution without artificial timers or animation hacks.
* Each `yield` represents a *meaningful computational moment*, not a rendered frame.

### Benefits

* Deterministic replay: the same input always produces the same state sequence.
* Precise control over stepping, rewinding, and scrubbing.
* Visualization logic remains completely separate from algorithm logic.

This mirrors how algorithms are reasoned about in textbooks and proofs — as a sequence of discrete state transitions.

---

## 2. Immutability of State

Every yielded state is treated as **immutable**.

### Rationale

* Prevents accidental side effects during visualization.
* Enables true backward stepping without recomputation tricks.
* Makes debugging and reasoning about execution simpler.

Instead of mutating arrays or nodes in place, each step produces a new state object representing the algorithm at that moment.

This choice trades a small amount of memory for significant gains in correctness and clarity.

---

## 3. Separation of Concerns

CineAlgo strictly separates responsibilities:

* **Algorithms**: compute and yield pure states
* **Visualization Engine**: consumes state and renders visuals
* **UI Layer**: handles controls, layout, and interaction
* **Learning Layer**: explains logic, complexity, and invariants

### Explicit Constraints

* No DOM access inside algorithm files
* No drawing logic inside algorithms
* No UI state mutation inside visualization code

This separation ensures that algorithms remain testable, reusable, and pedagogically honest.

---

## 4. Determinism Over Real-Time Animation

CineAlgo avoids real-time animation systems (`setInterval`, `requestAnimationFrame` loops tied to logic) for algorithm execution.

### Rationale

* Real-time animation introduces race conditions and skipped states.
* Learning requires control over time, not speed.

Instead, time is **user-controlled**:

* Step forward
* Step backward
* Scrub to any state

Motion exists only to *communicate change*, not to entertain.

---

## 5. Comparison Mode Architecture

Comparison mode runs **two independent algorithms** on the **same input**.

### Key Design Choices

* Each algorithm has its own state generator
* Each has its own pseudocode panel
* Each has its own explanation narrative
* Execution is synchronized in lockstep

### Why This Matters

This prevents a common educational flaw where comparison modes share logic or explanations, obscuring genuine differences between algorithms.

Learners can observe:

* Different decision-making paths
* Different invariants
* Different performance characteristics

Side-by-side, without interference.

---

## 6. Pseudocode as a First-Class Citizen

Pseudocode is not decorative — it is *active*.

### Design Decisions

* Full pseudocode is always visible
* Current executing line is highlighted
* Highlighting is driven directly by algorithm state

This ensures a tight coupling between:

> **Code → State → Visualization → Explanation → Pseudocode**

The learner never has to guess *why* something is happening.

---

## 7. Visual Restraint and Color Philosophy

CineAlgo deliberately avoids loud or flashy visuals.

### Principles

* Warm, low-saturation colors reduce cognitive fatigue
* Color is semantic, not decorative
* Stillness is meaningful

Examples of semantic color usage:

* Active elements
* Compared elements
* Stable / invariant regions

Nothing moves or changes color without a reason tied to the algorithm.

---

## 8. Scrollable, Spatial Layout

CineAlgo is intentionally **not** constrained to a single screen.

### Rationale

* Learning benefits from spatial separation
* Explanations, visuals, and controls should not compete
* Vertical scrolling mirrors reading and reasoning flow

Empty space is used deliberately and often filled with:

* Historical context
* Fun facts
* Conceptual insights

These are optional, non-intrusive, and never block the core experience.

---

## 9. No Frameworks, By Choice

CineAlgo uses only:

* HTML
* CSS
* Vanilla JavaScript

### Why?

* Forces clarity of data flow
* Avoids abstraction leaks
* Makes algorithm–visualization boundaries explicit
* Demonstrates foundational web engineering skills

This decision was intentional, not a limitation.

---

## 10. Educational First, Always

Every feature is evaluated against a single question:

> **Does this improve understanding?**

If the answer is no, the feature is removed or redesigned.

CineAlgo aims to be:

* Trustworthy to a professor
* Understandable to a beginner
* Respectful of the learner’s attention

---

## Closing Note

CineAlgo is an ongoing exploration of how computation can be *seen*, *felt*, and *understood*.

Its design choices reflect a belief that clarity, correctness, and restraint are the foundations of good educational software.
