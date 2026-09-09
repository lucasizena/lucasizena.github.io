+++
title = "New result on the Collatz Conjecture"
date = 2026-09-09T08:00:00+01:00

[taxonomies]
tags = ["AI", "maths", "combinatorics"]
+++

I've just seen now that [Lech Mazur in ProofAtlas](https://www.proofatlas.ai/papers/positive-density-log-time-collatz/Mazur_Explicit_Positive_Density_Collatz_Convergence_in_Logarithmic_Time_v2.pdf) has proved that for all large enough positive integers $X$ (for some explicit bound $X \ge X_0$), at least $\gg X$ positive integers $n < X$ (for some small explicit constant $c$) satisfy $\tau(n) \ll \log n$ (again, for some explicit constant), where $\tau(n)$ is the least number of iterates of 
$$
T(n) = 
\begin{cases}
    n / 2 & \text{if } n \text{ even}, \\
    3n + 1 & \text{otherwise.}
\end{cases}
$$

This shows that all $n$ in a set of positive lower natural density converge to $1$ in at most $\ll \log n$ iterations.

The proof strategy is to construct many numbers backwards from a carefully chosen number already known to reach $1$ while also controlling their return time. 