+++
title = "Improvements in prime gaps"
date = 2026-09-06T00:00:00+01:00

[taxonomies]
tags = ["sieve methods", "number theory", "maths"]
+++

Recently, [Stadlmann](https://arxiv.org/abs/2608.31126) improved the bound on small gaps between primes to $\liminf (p_{n + 1} - p_n) \le 240$, and then [OpenAI's ChatGPT 6 Astra](https://cdn.openai.com/pdf/51126fac-1b68-4128-9666-c908bcc16033/short_gaps.pdf) improved this slightly to $\le 186$.

As for large prime gaps, [DottedCalculator](https://github.com/DottedCalculator/ai-math/blob/main/Erdos_4_GPT_5.6_Sol.pdf) recently proved using ChatGPT 5.6 Sol the improvement 
$$
\begin{aligned}
G(X) \coloneqq \sup_{p_n \le X} (p_{n + 1} - p_n) \gg \frac{\log X \log \log X}{\log \log \log \log X}
\end{aligned}
$$
and even more recently, [ChatGPT 6 Astra](https://cdn.openai.com/pdf/51126fac-1b68-4128-9666-c908bcc16033/long_gaps.pdf#page=8&zoom=100,96,526) improved this bound to 
$$
\begin{aligned}
G(X) = \frac{\log X (\log \log X)^2 \log \log \log \log X}{(\log \log \log X)^2}.
\end{aligned}
$$