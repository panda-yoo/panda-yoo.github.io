---
title: 2D Ising Model
permalink: /projects/ising-model/
layout: single
author_profile: true
toc: true
toc_label: "Contents"
---

# 2D Ising Model Monte Carlo Simulation

A computational physics project implementing Monte Carlo simulations of the 2D Ising model to study magnetic phase transitions. This project was developed as part of **PH755: Computational Physics** during my Master of Science in Physics program.

## 📋 Overview

The Ising model is a mathematical model in statistical mechanics that describes ferromagnetism. This implementation simulates a 2D square lattice of spins that can be either up (+1) or down (-1), interacting with nearest neighbors. The project explores:

- **Phase transitions** and critical phenomena
- **Thermodynamic properties** near the critical temperature
- **Algorithm efficiency** comparison between different Monte Carlo methods

## 🔬 Physics Background

The 2D Ising model exhibits a second-order phase transition at the critical temperature **T_c ≈ 2.269** (in units where J/k_B = 1). Below this temperature, the system shows spontaneous magnetization (ferromagnetic phase), while above it becomes paramagnetic.

Key observables computed:
- **Energy** ⟨E⟩
- **Magnetization** ⟨M⟩  
- **Heat Capacity** C_v (from energy fluctuations)
- **Magnetic Susceptibility** χ (from magnetization fluctuations)
- **Binder Cumulant** U_4 (for finite-size scaling analysis)

## 🛠️ Implementations

This repository contains **two implementations** of the Ising model simulation:

### 1. Python Implementation (Jupyter Notebook)
**File:** `computational_project_PH755.ipynb`

The original implementation developed for the course, featuring:

- **Metropolis Algorithm** with Numba JIT compilation for performance
- Complete thermodynamic analysis pipeline
- Visualization of phase transition behavior
- Ensemble averaging for statistical accuracy

**Key Features:**
- Numba-optimized Monte Carlo evolution
- Automated calculation of thermodynamic quantities
- Publication-quality plots showing:
  - Energy vs Temperature
  - Heat Capacity vs Temperature (with critical temperature identification)
  - Magnetic Susceptibility vs Temperature  
  - Magnetization vs Temperature
  - Binder Cumulant analysis

**Requirements:**
```bash
pip install numpy matplotlib scipy numba
```

**Usage:**
```bash
jupyter notebook computational_project_PH755.ipynb
```

### 2. C++ Implementation
**Directory Structure:**
```
├── src/
│   ├── main_metropolis.cpp
│   └── main_wolff.cpp
├── include/
│   └── lattice_utils.hpp
├── data/
└── CMakeLists.txt
```

A refactored, modular implementation with:

- **Metropolis Algorithm** (single-spin flip)
- **Wolff Algorithm** (cluster flip)
- CMake build system
- Optimized for performance and code organization

**Key Features:**
- Modular C++ design with header/source separation
- Both single-spin and cluster algorithms
- Configurable simulation parameters
- Data export for post-processing

## ⚙️ Algorithms Implemented

### Metropolis Algorithm
A **single-spin-flip** Monte Carlo method:
1. Randomly select a spin
2. Calculate energy change ΔE if flipped
3. Accept flip with probability:
   - P = 1 if ΔE ≤ 0
   - P = exp(-β·ΔE) if ΔE > 0

**Characteristics:**
- Simple and efficient at low temperatures
- Suffers from critical slowing down near T_c
- Local update scheme

### Wolff Algorithm  
A **cluster-based** Monte Carlo method:
1. Start from a random seed spin
2. Grow a cluster of aligned spins probabilistically
3. Flip the entire cluster simultaneously

**Characteristics:**
- Highly efficient near critical temperature
- Reduces autocorrelation times
- Global update scheme that overcomes critical slowing down

## 🚀 Building and Running

### Python Version
1. Open `computational_project_PH755.ipynb` in Jupyter
2. Run cells sequentially to:
   - Initialize lattice
   - Perform Monte Carlo evolution
   - Calculate thermodynamic quantities
   - Generate plots

### C++ Version

**Prerequisites:**
- C++17 compatible compiler
- CMake 3.10+
- CLion (recommended) or any CMake-compatible IDE

**Building with CLion:**
1. Open the project folder in CLion
2. CLion auto-detects `CMakeLists.txt`
3. Build automatically or click the hammer icon

**Building via Command Line:**
```bash
mkdir build && cd build
cmake ..
make
./metropolis_sim  # or ./wolff_sim
```

**Configuration:**
Edit parameters in `include/lattice_utils.hpp`:
- `LATTICE_SIZE`: Grid dimension (e.g., 50×50)
- `NO_OF_ITERATIONS`: Monte Carlo steps
- `BETA_J`: Inverse temperature β = 1/(k_B·T)
- `EXTERNAL_B`: External magnetic field

**Note:** Set CLion's working directory to project root to ensure data files save correctly.

## 📊 Results and Analysis

The Python implementation reproduces key features of the 2D Ising model:

1. **Critical Temperature Identification:**
   - Heat capacity peak at T_c ≈ 2.128
   - Susceptibility peak at T_c ≈ 2.326
   - Values close to theoretical T_c ≈ 2.269

2. **Phase Transition Behavior:**
   - Sharp magnetization drop near T_c
   - Energy curve showing continuous transition
   - Diverging fluctuations at criticality

3. **Algorithm Performance:**
   - Metropolis: Good general-purpose performance
   - Wolff: Superior near critical point (reduced autocorrelation)

## 📈 Data Output

The C++ simulations generate files in the `data/` directory:

| File | Description |
|------|-------------|
| `energy.dat` | Energy per Monte Carlo step |
| `initial_lattice.dat` | Initial spin configuration |
| `final_lattice.dat` | Final equilibrated configuration |
| `parameters.dat` | Simulation parameters used |

These can be analyzed with Python/MATLAB/Gnuplot for visualization.

## 🎯 Learning Outcomes

This project provided hands-on experience with:
- **Statistical mechanics** concepts (ensemble averages, fluctuations, criticality)
- **Monte Carlo methods** and their performance characteristics
- **Computational physics** workflows (simulation → data → analysis)
- **Code optimization** (Numba JIT, C++ refactoring)
- **Version control** and project organization

## 📚 References

- Onsager, L. (1944). Crystal Statistics: The Two-Dimensional Ising Model. *Physical Review*, 65(3-4), 117-149.
- Newman, M. E. J., & Barkema, G. T. (1999). *Monte Carlo Methods in Statistical Physics*. Oxford University Press.
- Wolff, U. (1989). Collective Monte Carlo Updating for Spin Systems. *Physical Review Letters*, 62(4), 361-364.
- https://courses.physics.illinois.edu/PHYS446/sp2023/Ising/IsingModel.html
- https://www.youtube.com/watch?v=nnw0Xlbj3JM

## 📝 License

This project was developed for educational purposes as part of coursework at NITK Surathkal.

## 👤 Author

**Pranav Shinde**  
M.Sc. Physics  
NITK Surathkal  
Spring 2025

---