+++
title = "Improvements in prime gaps"
date = 2026-09-06T00:00:00+01:00

[taxonomies]
tags = ["AI", "sieve methods", "number theory", "maths"]
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

I think these are certainly impressive and should definitely be celebrated, but I don't really understand the point of using AI on these kinds of problems[^hypocrisy]. By that I mean, as mentioned by Tao [in this post](https://mathstodon.xyz/@tao/117219548485446992 ), that there aren't really any real world applications to problems like these, or even significant impacts within analytic number theory itself. As an analogy, these problems are somewhat like interesting puzzles that you wouldn't really want to be given the answer to before you solve it yourself. In fact, I think using AI for this kind of stuff in particular could actually be harmful for lots of reasons I won't go into in this post (maybe in a future one). Anyway, they do serve as good benchmarks to measure AI capabilities (but also they're much more than that). 

[^hypocrisy]: This is kind of hypocritical because do I occasionally test AI capabilities using open problems for fun 