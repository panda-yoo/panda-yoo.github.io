---
title: Non Equilibrium Notes
layout: note
category: Physics
toc: true
---

# Physics Notes: Linear Response Theory and Fluctuation-Dissipation
## Newton's Law of Motion for a Tagged Particle

$$
m \dot{v}(t) = F_{\text{tot}}(t) \quad \text{where } F_{\text{tot}} = \text{total force}
$$

$$
F_{\text{tot}}(t) = F_{\text{ext}}(t) + F_{\text{int}}(t)
$$

$$
F_{\text{ext}} = \text{all external forces (applied forces)}
$$

$$
F_{\text{int}} = \text{arising from bombardment of medium}
$$

$$
\rightarrow F_{\text{int}} \text{ is a random force}
$$

* It turns out internal consistency requires $F_{\text{int}}$ to create 2 distinct parts:

$$
F_{\text{int}}(t) = \eta(t) + F_{\text{sys}}(t)
$$


$$ \langle \eta(t) \rangle = 0$$
   $\rightarrow$ truly random force/noise\
   $\rightarrow$and is independent of the state of the tagged particle

$F_{\text{sys}}(t) \rightarrow$ Systematic random force that depends on state of tagged particle

* Simple assumption for $F_{\text{sys}}(t)$ is proportional to instantaneous velocity of tagged particle and is directed opposite direction:

$$
F_{\text{sys}}(t) = -\gamma \, v(t)
$$

- $\gamma > 0$ positive friction or coefficient

---

# Example: Velocity of Particle


$$ \langle v(t) v(0) \rangle = 0$$


- if it decays fast → System forgets quickly

- if it decays slowly → memory effects

---

# Correlation Function → Fluctuation at Equilibrium

# Response Function → Reaction at Perturbation

---

# Example: Brownian Motion

* Mobility: $\mu = \text{response to force}$

From equilibrium fluctuating:

$$
D = \int_0^\infty \langle v(t) v(0) \rangle dt
$$

Then,

$$
D = \mu k_B T \quad \text{→ Einstein relation (FDT)}
$$

---

# In Linear Response Theory

$$
y = f(x) \rightarrow \text{fluctuation}
$$

## Linear Response Theory (LRT)

Suppose a system is at equilibrium, and you apply a small external force $f(t)$.

According to LRT:
$$
\langle A(t) \rangle = \int_{-\infty}^t  \chi(t - t') f(t') dt'
$$

Where:
- $A(t) \to$ Observable (position, magnetization, etc.)
- $f(t) \to$ External perturbation
- $\chi(t) \to$ Response function

**Why Linear Assumption?**
1. Perturbation is Small
2.  Response $\propto$ force (1st order only)

---

## Fluctuation-Dissipation Theorem (DTE)

$$
\chi(t) \sim \langle A(t) A(0) \rangle_{eq}
$$

- The way a system responds to a perturbation is related to how it fluctuates at equilibrium.

---

## Correlation Function

$$
C(t) = \langle A(t) A(0) \rangle
$$

- If I observe $A$ now, how related is it to its value later.

---

## Diffusion Current (Fick's 1st Law)

$$
j(x,t) = -D \nabla c(x,t)
$$

**Fick's 1st Law:**
$$
\frac{\partial c}{\partial t} + \nabla \cdot j = 0
$$

**From above, we get:**
$$
\frac{\partial c}{\partial t} = D \nabla^2 c
$$

**Mol's Substitutes:**
$$
P_{eq}(v) = \left( \frac{m}{2\pi kT} \right)^{3/2} e^{-\frac{mv^2}{2kT}}
$$

- $\int_{-\infty}^{\infty} dv \, P_{eq}(v) = 1$
- $\langle v \rangle_{eq} = \int_{-\infty}^{\infty} v \, P_{eq}(v) dv = 0$
- $\langle v^2 \rangle_{eq} = \int_{-\infty}^{\infty} v^2 \, P_{eq}(v) dv = \frac{kT}{m}$

**Variance:**
$$
\sigma^2 = \langle (V - \langle V \rangle_{eq})^2 \rangle_{eq} = \langle V^2 \rangle_{eq} - \langle V \rangle_{eq}^2
$$

$$
\sqrt{\sigma^2} = SD = \left( \frac{kT}{m} \right)^{1/2}
$$

**Diagram:**
- A graph of $M(t)$ vs $t$ with a label "instantaneous M" at $M(0)$ and a label "x(t)" at a point on the curve. The curve shows a decay over time.