+++
title = "Composite rough numbers in almost all short intervals"
date = 2026-08-24T15:30:00-03:00
draft = true

[taxonomies]
tags = ["sieve methods", "number theory", "maths"]
+++

By now, I will have uploaded to the arXiv my first ever paper, Composite rough numbers in almost all short intervals! In this post, I'll try to give a relatively accessible exposition of the main ideas in the paper as well as some insight into the research process behind all of it, including how I learned about all of this stuff in the first place and how I came up with some of the ideas in the paper.

## 1. Rough numbers

Roughly speaking[^rough-number-pun], let us say that a number is *rough* if its least prime factor is large, and define $p(n)$ to be the least prime factor of a natural number $n$[^rough-number-convention]. The word rough is supposed to suggest that a number can't be broken down nicely into small prime factors. Conversely, we can also define notion of smooth numbers, although we won't be discussing this here. Both have already been studied extensively in the literature, and are in fact the main object of study in fields like sieve theory, which has seen some exciting developments in the past few decades. The great interest in such numbers, at least the way I see it, is due to the fact that rough numbers are in some sense slightly weaker versions of prime numbers, with the primes being "maximally rough". To see this, since for every $n$ we have $p(n) \le \sqrt{n}$, the set of primes up to $N$ is indeed the set of rough numbers $n \le N$ with $p(n) > \sqrt{n}$. Because of this, we can study weaker variants of conjectures like the twin prime conjecture for rough numbers and be able to use certain techniques that wouldn't work for the original conjectures. 

## 2. Composite rough numbers

Now that we've discussed some of the motivation for studying rough numbers, let's talk about the problems addressed in the paper. We consider several questions that ask whether one find, close to given a natural number $n$, a number whose prime factors are large relative to its distance from $n$. We state these problems below and discuss the common structure underlying them, as well as some preliminary observations. 

{% <statement kind="Problem" number="1.1" title="Erdős #463" label="Erdos-463"> %}
Is there a function $f$ with $f(n) \to \infty$ as $n \to \infty$ such that, for all large $n$, there is a composite number $m$ such that 
$$n + f(n) < m < n + p(m)?$$
{% </statement> %}

Writing $h \coloneqq m - n$ to be the length of the gap between $m$ and $n$, the condition required is 
$$f(n) < h < p(n + h),$$
and thus the problem asks whether for all large enough $n$, we can find a growing gap length $h$ less than $p(n + h)$ such that $n + h$ is composite. 

{% <statement kind="Problem" number="1.2" title="Erdős #385" label="Erdos-385"> %}
Let
$$F(n) \coloneqq \max_{\substack{m < n} \\ m \text{ composite}} m + p(m).$$
Is it true that $F(n) > n$ for all sufficiently large $n$? Does $F(n) - n \to \infty$ as $n \to \infty$?
{% </statement> %}

We can also rephrase this problem in a similar fashion. Writing $h \coloneqq n - m$, it is enough to find a composite number $n - h$ for which $p(n - h) - h > 0$, or tends to infinity for the second part of the question.

{% <statement kind="Problem" number="1.3" title="Erdős #681" label="Erdos-681"> %}
Is it true that for all large $n$, there exists $h$ such that $n + h$ is composite and 
$$p(n + h) > h^2?$$
{% </statement> %}

As suggested in [Erdős Problems website](https://www.erdosproblems.com/forum/thread/681), the stronger statement where the exponent $2$ is replaced with any $d > 0$ may also be true. 

After some more exploration, we observe that almost all (in the usual natural density sense) variants of both the first part of [Problem 1.2](#Erdos-385) and [Problem 1.3](#Erdos-681) are trivial, which we can show as follows. For [Problem 1.2](#Erdos-385), ff $n - 1$ is composite, then taking $m = n - 1$ gives 
$$F(n) - n \ge p(n - 1) - 1 \ge 1,$$
and so $F(n) > n$ for all $n$ for which $n - 1$ is composite. For the $n$ that are not of this form, i.e., for $n$ the form $n = p + 1$ for some prime $p$, we have that, by the prime number theorem, they make up a zero density set of size $\asymp X / \log X$ for a dyadic interval $[X, 2X]$. By this short argument, it follows that for almost all $n$ the first part of the [Problem 1.2](#Erdos-385) holds. Similarly, for [Problem 1.3](#Erdos-681) we can consider the exceptional set of numbers of the form $n = p - 1$. 

In my paper, we give a slight improvement to these trivial results by showing that, in all three problems, there are *many* admissible $h$ such that they hold for almost all $n$, instead of only showing that there's at least one such $h$. Our arguments are relatively straightforward and essentially follow almost directly from an existing estimate on rough numbers in the literature, but nevertheless I thought it'd be worthwhile to write it up as a note. Here are the main results:

{% <statement kind="Theorem" number="1.4" title="Erdős #463 density-one analogue" label="463-analogue"> %}
Let $H \to \infty$, $H = X^{o(1)}$, and $f : \mathbb{Z}^+ \to \mathbb{R}_{\ge 0}$ be such that $f(n) \to \infty$ and $f(n) = o(H / \log H)$ uniformly for $n \in [X, 2X]$. Then, for almost all positive integers $n \in [X, 2X]$, there exist $\asymp H / \log H$ composite numbers $m \in (n, n + H]$ such that 
$$n + f(n) < m < n + p(m).$$
{% </statement> %}

This basically says that we can choose any sufficiently small interval and sufficiently slowly growing function $f$ such that for almost all positive integers $n \in [X, 2X]$, the number of composite $m$ in this interval satisfying the bounds above is of order $\asymp H / \log H$. As an example, picking $H = \log n$ and $f(n) \asymp \frac{\log n}{(\log \log n)^2}$, it follows from this (after concatenating dyadic intervals $[X, 2X]$, as we'll explain later) that for almost all $n$, there are $\asymp \frac{\log n}{\log \log n}$ composite numbers $m$ in $(n, n + \log n]$ such that 
$$n + \frac{\log n}{(\log \log n)^2} < m < n + p(m).$$

{% <statement kind="Theorem" number="1.5" title="Erdős #385 density-one analogue" label="385-analogue"> %}
Let $y \to \infty$, $2 \le y = X^{o(1)}$, and define $F(n)$ as in [Problem 1.2](#Erdos-385). Then
$$F(n) - n > (1 - o(1))y$$
for almost all positive integers $n \in [X, 2X]$. 
{% </statement> %}

For example, it follows from this that for almost all $n$, 
$$F(n) - n > (1 - o(1))n^{1 / \log \log n}.$$

{% <statement kind="Theorem" number="1.6" title="Erdős #681 density-one analogue" label="681-analogue"> %}
Let $H \to \infty$, $H = X^{o(1)}$. For any fixed $d > 0$, we have that for almost all positive integers $n \in [X, 2X]$, there exist $\asymp_d \frac{H}{\log H}$ composite numbers $n + h \in (n, n + H]$ such that
$$p(n + h) > h^d.$$
{% </statement> %}

As a quick example, we have that for almost all $n$ there exist $\asymp \frac{\log n}{\log \log n}$ composite numbers $n + h$ in $(n, n + \log n]$ such that $p(n + h) > h^{100}$, say. 

Before actually going on into any more details, I first want to discuss how these problems are related to more general questions in analytic number theory and also how they actually address much deeper problems in sieve methods (and hence why they are actually interesting), since it's not immediately obvious by just looking at them. In fact, they may even seem quite arbitrary at first. Well, first of all, by rephrasing the problems as above, we've essentially reduced them to showing that there are many composite rough numbers, i.e., obtaining good estimates on composite rough numbers. Now, increasing the roughness threshold $y$ makes the condition $p(n + h) > y$ stronger and shrinks the admissible set. Indeed, a heuristic estimate predicts about $\frac{H}{\log y}$ admissible $h$ for some fixed interval $0 < h \le H$. For $h \asymp X^{1/2}$, and since $n \asymp X$ (since $n \in [X, 2X]$), we essentially have
$$p(X + X^{1/2}) > X^{1/2},$$
so these problems become very close to asking whether we can find two almost-primes very close to each other, and if we can always ensure that one of them is composite. This seems quite similar to Chen's theorem, and indeed this would give some useful insight into tackling other related problems like the twin prime conjecture. 

For this reason, it would perhaps be more interesting if we could show that there are *large* admissible $h$ in almost all short intervals instead of many admissible $h$ as shown in my paper, but it would likely require considerably more sophisticated machinery[^experience].

Throughout my paper we work in a dyadic interval $[X, 2X]$, which is essentially the same as working in $[1, N]$ for $n \le N$ because we can "glue together" a bunch of dyadic intervals to create $[1, N]$:
$$[1, N] \asymp [1, 2] \cup [2, 4] \cup [4, 8] \cup \cdots \cup [2^{k - 1}, 2^{k}]$$
for some $k \asymp \sqrt{n}$. 

We'll refer to $(n, n + H]$ or $[n - H, n)$ as **short** intervals (the precise conditions imposed on $H$ may vary slightly throughout our arguments). We write 
$$\mathcal{R}(y) \coloneqq \{n : p(n) > y\}, \qquad \mathcal{P} \coloneqq \{n : n \text{ prime}\}, \qquad \mathcal{C}(y) \coloneqq \mathcal{R}(y) \setminus \mathcal{P}$$
to denote the sets of rough numbers with $p(n) > y$, primes, and composite rough numbers, respectively. We'll also use the notation $V(y) \coloneqq \prod_{p \le y} \left(1 - \frac{1}{p}\right)$.

As discussed above, our approach is based on the fact that by rephrasing the problems as above, it essentially suffices to obtain good estimates on rough numbers in short intervals in order to show that there are many $h$ such that they hold for almost all $n$, for which existing estimates in the literature are already suitable for this purpose. In particular, we'll be making good use of the following estimate for rough numbers in short intervals obtained by Friedlander and Iwaniec, where we've slightly adapted the original statement:

{% <statement kind="Proposition" number="1.7" title="Rough number estimate in short intervals" label="rough-number-estimate"> %}
Suppose $y \le X^{1/20}$ and $\log y = o(H)$. Then, for all except $o(X)$ positive integers $x \in [X, 2X]$,
$$\sum_{x < n \le x + H} \mathbf{1}_{\mathcal{R}(y)} (n) \asymp HV(y).$$
{% </statement> %}

Loosely speaking, this says that for almost all $x$, the rough number count in the interval $(x, x + H]$ has the expected order of magnitude. Indeed, the density of integers divisible by a prime $p$ is $\frac{1}{p}$, and so the probability of a number being rough with $p(n) > y$ is around $\prod_{p \le y} \left(1 - \frac{1}{p}\right) = V(y)$, and hence the expected rough number count is $HV(y)$. 

I initially came across this result while reading a paper by Gorodetsky on bounding the variance of rough number estimates, where he briefly referred to it when talking about related literature.

Using this, we'll prove the following estimate on composite rough numbers, which we'll then use to prove [Theorem 1.4](#463-analogue), [Theorem 1.5](#385-analogue), and [Theorem 1.6](#681-analogue). 

{% <statement kind="Lemma" number="1.8" title="Short interval composite rough number estimate" label="composite-rough-number-estimate"> %}
Let $H \ge 1$ and $2 \le y = X^{o(1)}$ be parameters depending on $X$ such that $\log y = o(H)$. Then, for all but $o(X)$ positive integers $n \in [X, 2X]$,
$$\sum_{0 < h \le H} \mathbf{1}_{\mathcal{C}(y)} (n + h) \asymp \frac{H}{\log y}.$$
{% </statement> %}

{% <proof> %}
We rely on the estimate of [Proposition 1.7](#rough-number-estimate) to show that for almost all $n$ in $[X, 2X]$, there are many gap lengths $h$ in short intervals for which $n + h$ is rough. Then, to conclude that there are many $h$ for which $n + h$ is rough and composite, we show that the prime contribution in the interval is negligible compared to the rough number contribution, under the contraint $y = X^{o(1)}$ on the roughness threshold $y$, which gives us enough wiggle room between the rough number and prime contribution. 
    
We first estimate the rough number count. By [Proposition 1.7](#rough-number-estimate) and Mertens' theorem, for all integers $n \in [X, 2X]$ outside an exceptional set of size $o(X)$, we have 
$$
\begin{aligned}
\sum\msub{n < n+h \le n+H} \mathbf{1}\msub{\mathcal{R}(y)}(n+h) &= \sum\msub{0 < h \le H} \mathbf{1}\msub{\mathcal{R}(y)}(n+h) \\\\
&\asymp HV(y) \asymp \frac{H}{\log y}.
\end{aligned}
$$
{% </proof> %}

## Further improvements

I first got the idea of attempting to prove a density-one variant of these problems after seeing a paper of Gafni and Tao on a related problem, where they established an almost-all result on rough numbers between gaps in consecutive primes. They also used a sieve-theoretic and probabilistic approach, and indeed, this is where I also got the general idea for the approach through this paper. Although the arguments are quite different in terms of the steps, they follow more or less the same approach of using moment methods to show that certain estimates are concentrated around their mean. 

Furthermore, as mentioned before, Gorodetsky.

## x. On research

I originally became aware of the "Erdős problems" about a year before they became as prominent as in the past few months, but never really seriously had a go at any of the problems. After hearing about AI achieving the remarkable milestone of being able to prove (or disprove) several of these problems as well as even more famous ones like the unit distance conjecture, I became very excited (as many did) and dedided to actually try some of these problems, which ultimately led to my first paper.

Like many people, I was originally very skeptical about AI and had neglected it until only about a year and a half ago[^AI-use]. I also became really excited not only about AI capabilities in mathematics, but about AI in general. This was ultimately what led me to become interested 


I'll also say that I've improved my writing quite considerably (not that it's still any good). 

[^rough-number-pun]: Pun not intended. Funny, though.
[^rough-number-convention]: We follow the convention that $p(1) = 1$.
[^experience]: By that I mean I have nowhere near enough experience to be able to execute such an argument.
[^AI-use]: In fact, I hadn't even dared to interact with an LLM until around a year and a half ago!