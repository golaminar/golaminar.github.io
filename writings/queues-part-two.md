In part one of this series, we showed you that queues are weird and don't conform to our intuitive expectations of how they will behave. They're weird because randomness is weird. Or to be more precise: when memoryless random events meet processes with cumulative effects, weird things happen. Concretely, queues have a tendency to grow much longer than we intuitively expect them to. We also pointed out that queues are everywhere in software development, and so is randomness. In this part, we're going to talk about why long queues present problems and how we can avoid long queues in practice.

Let's revisit our airport check-in queues. Why is it a problem if those queues get long? The longer the queues get, the more dissatisfied our customers get. Past a certain point, our queue becomes long enough that people arriving at the airport the recommended three hours before their flight cannot get checked in and through security to their gate in time. At this point, we need to have another member of staff walk through the queue, calling forward all the passengers for flights soon to depart for expedited check-in. At a certain point, if the queue is still growing, even expediting won't help us, and people will start missing their flights. If this happens too often, the airport ceases to function. So there is a cost to having people stand in line for longer, and that cost escalates and has inflection points where additional costs arise.

TODO: ANY STAGE GATE IS AN OPPORTUNITY FOR A QUEUE TO FORM. A SINGLE ITEM WAITING IS IN A QUEUE OF ONE (n.b. Tom still not convinced this is needed or comes at this point)

In software development, there are also direct costs to queues. The longer a product backlog becomes, the more maintenance it requires: Is this story really still relevant? What does this comment from Eliza 18 months ago mean? Is that market research still valid? The longer feature requests wait in between someone asking for them and us deploying them to customers, the more people ask for status updates, and then someone has to find out about and report the status. The more _stuff_ I'm confronted with, the more effort I have to expend on determining what that _stuff_ is, and what of that _stuff_ is the best thing for me to pick up next[1]. Those are the direct costs of having long queues. Some call them the carrying costs.

But there's also a significant indirect cost. We call it _cost of delay_. In the case of a product backlog item, its cost of delay is the amount of value that could be realized per day [or hour, or minute], for each day [hour, minute] that it is delayed and not moving through our process. To take a concrete example: we think that allowing users of our website to 'like' each others' posts will lead to a significant increase in their engagement, and hence (via advertising impressions) to our profits. Once the feature is finally deployed, our analysts tell us that we make 1000 additional euros per hour. Unfortunately, there were various points in the development of this feature where it was in started, but waiting. After the PM, designer, and tech lead had drafted the 5 constituent stories, the engineers weren't ready to start working on it for another 4 weeks, because they were working on other things. For each story, there was a pull request which waited for code review for an average of 4 hours while potential reviewers worked on other things. After code review was complete, rework waited for an average of 2 hours per change while the engineer responsible was working on the next code change. And so on. Before long, we've amassed a huge amount of wait time. Maybe we only worked on this feature for one-person week, but it was waiting somewhere in our system for 5 weeks. And 5 weeks of €1000 per hour is a lot of cost.

* Cost of delay is a huge deal and grows if queues grow
The more items there are waiting in a queue, the longer it takes for a new item entering the queue to receive attention and be actively worked on. So the longer the queue, the more delay cost there is associated with it. Cost of delay can quickly become a huge deal, and quickly outweigh all other costs.

Let's run some numbers to see why. Imagine we pay a sole developer €50 per hour[2]. Let's also assume for simplicity that the ongoing value of what they deliver is the same as what we pay them. Then let's imagine there are 10 items in the development backlog, each requiring 10 hours of that developer's time to complete. The expected minimum value of each of these items, once released, is 10*€50 per hour -- €500. A new item entering the queue will need to wait 10*10 hours for the other items on the queue to be completed before it receives attention. So the cost of delay we pay on that new item is €50,000. In that time, we're also paying the cost of delay on the other items in the queue - €45,000 for the 10th item with 9 in front of it, €40,000 for the next item up, and so on. So in the time it takes for that new item to reach the front of the queue, we have paid €275,000 in delay cost for the items in this queue. Meanwhile, 100 hours of developer time have passed, costing us €5,000.

ILLUSTRATION OF THE QUEUE

Now, maybe you're saying it's a stretch to assume that every feature the developer works on will immediately give us €500 per hour in value. Quite often, we deliver things that deliver value less quickly than that, but we still choose to do so, because it's value that we have for as long as we maintain the feature, and eventually we break even on the initial investment of developer time and the ongoing maintenance costs. On the other hand, some things that we deliver have tremendous value as soon as we release them -- very quickly outweighing the investment of time. How much does this affect the balance of delay cost vs operating cost?

If the average value of the backlog items were 10 cents per hour -- requiring 208 days to break even -- the delay cost per item would be €1 per hour, and the total cost of delay paid for a ten-item queue would be €550. On the other hand, if every item in there were really valuable and urgent, such that delivering it would immediately give us €100 per hour in value, the delay cost would be €550,000.

Maybe that first number -- a delay cost of only €550, versus personnel costs of €5,000 -- doesn't concern you too much. Fair enough, but remember: queues grow if left uncontrolled, so ten items is not a state you can expect to maintain for long without intervention. Also note that we're only talking about one queue here, and a typical development process has multiple stages, with multiple opportunities for a queue to form and delay cost to be paid.


------ END PART 2, START PART 3 ----

* How do we avoid cost of delay approaching infinity (inability to innovate at all)?
	* avoid queues if possible - do you need an approval gate there?
	* make it sync as opposed to async (shift left on security, ops, code review)
	* but if you can't avoid the queue: reduce capacity utilization

In the previous post, we saw that queues which we expected to remain under control in fact tended to get very long over time. Now that we understand cost of delay, we can see the danger to an organization attempting to deliver value by releasing software. As the queues grow, our delay costs escalate. Without intervention, a process that we intuitively expected to deliver value in a timely fashion, and continue to do so sustainably, actually leads us over time to a position where we cannot release enough value to cover our costs, or where our competitors beat us to the punch every time, and we can no longer function. That's obviously something we want to avoid. How on Earth can we do so?

Three ways. First: if there is an opportunity to remove the ability for a queue to form, you should seriously consider taking it. For example: do you really need to manually test every change before it can be released to beta testers, or would it suffice to ... TODO: INSERT ACTUAL GOOD EXAMPLE OF A NEEDLESS STAGE GATE HERE.
Second: if the hand-off is unavoidable, consider making it a synchronous, blocking action rather than asynchronous. For example: if automated tests need to pass before a code change can be pushed to the main branch, it is better for the author of the code change to wait for the tests to run and pass (for example, by running them on their local machine) than for them to run them on a build server and work on the next change. Why is this? Well, the next change _also_ needs to pass the tests, and so allowing work on it while the tests for the previous change are running adds to the queue of changes needing to be tested. There are other benefits to making some portion of the automated test suite into a blocking set -- what I call a check-in build -- among them an incentive to keep the build running fast, and some guarantee that it's possible to run the software locally in some form. But for now let's concentrate on just the queue aspect. There are actually _two_ potential queues in this example. The other queue arises when the tests fail and the code change needs to be reworked. If the author is busy working on some other code change, they're not going to get to that rework as soon as it's clear it needs to be done, and so a rework queue can form.

Other examples of unavoidable hand-offs that can benefit from being made synchronous include: security reviews: instead of working for six months, handing our stuff off to a security team for audit, and one month later we receiving a laundry list of vulnerabilities, we instead involve the security team as quickly as possible for any significant architectural change, and don't start work on it until we've agreed an approach; deployment to production; code review; and acceptance testing with the product owner.

Third: if the hand-off is unavoidable and it's not feasible to make it a synchronous, blocking action, you should limit capacity utilization.

* WTF is capacity utilization? GRAPH HERE - EXPLANATORY TEXT relates back to airline check-in agents - sometimes some people are idle and hence available to serve

"Capacity utilization? What's that? Just when you were starting to get practical and make some concrete recommendations, you throw in another theory term?"

Yes, sorry about that. We need to take another quick dive into queueing theory to understand what I'm talking about here, and then I promise it will get practical again.

In queueing theory -- and maybe you saw this when playing with the airline check-in interactive in Part 1 -- there is a relation between the expected size of a queue and the extent to which the server's capacity is used. If a server is idle most of the time -- they can serve customers in 10 seconds on average, and customers arrive once every minute on average, or a capacity utilization of 1/6 or 16.67% -- then the queue will stay under control and stay very short. At the other extreme, perhaps obviously, if customers arrive every 5 seconds on average and the server still takes 10 seconds per customer (a capacity utilization of 200%), the queue will continue to grow over time with no upper bound. The exact shape of the relationship between capacity utilization is an exponential relation, as the graph below shows.

GRAPH GOES HERE

What we can see here is that when capacity utilization is at or below roughly 80% (the server takes 8 seconds per customer, and customers arrive every 10 seconds) the queue size is fairly stable. Once we pass that point, we start to be on the steep part of the exponential curve, and the queue size quickly gets to unsustainably high levels, with correspondingly high cost of delay. This accounts for those surprising numbers from part 1, where a server with an average service time of 120 seconds, serving arrivals with an average interval of 121 seconds (capacity utilization: 120/121 = 99.17%) had an expected average queue size of 118, whereas two servers working the same queue at the same rate (capacity utilization: 60/121 = 49.59%) had an expected average queue size of 0.3.

Since capacity utilization has an exponential relationship with queue size, anything on the right of that roughly 80% mark looks pretty scary and anything on the left looks pretty reasonable. So it seems a good rule of thumb to shoot for capacity utilization for our processes of roughly 80%.

* How do we reduce capacity utilization?
	* Hard to do it directly. For example, Scrum team could take 0.8 * Velocity as their commitment to next sprint, but it would require pretty good estimation to get this right. Being off by 20% on an estimate is pretty common. Plus the capacity is unknown ahead of time, because people might still be unavailable, so you need to account for that anyway. Not sure how you would do it for code review - available capacity for code review is much more elastic, because it's done by people who are doing other things.
	* BUT you can do it indirectly! WIP limits take advantage of the randomness to push down capacity utilization. INTERACTIVE HERE
	* The amazing thing about this is that _not only_ are we reducing our queue problem by taking advantage of the very problem that causes the issue -- randomness -- but _also_ we solve our queue problem by just... controlling the queue size.

How do we achieve that? Well, at first glance it's not easy. Let's take a look at the macro level: a Scrum team could decide they want to control capacity utilization by only taking on 80% of the story points their velocity suggests they can handle in an average sprint. And indeed, if they could do this accurately and not take on any unplanned work during the duration of their sprint, they would be controlling capacity utilization at 80%. But this would require their estimation of story points to be _really_ accurate. Being off by 20% on an estimate isn't uncommon, but would totally blow up this team's strategy for controlling their capacity utilization.

When we look at the micro level, it's much more difficult to understand how we would apply this kind of direct approach to controlling capacity utilization. Take code review as an example. The available capacity for this activity is elastic, since it's done by people who also do other things. There's a theoretical maximum capacity -- all the developers exclusively do code review and no other activity -- and a theoretical minimum -- no developer ever performs code review -- and obviously, the former case would lead to there being nothing in the code review queue and the latter would lead to a review queue that grows forever. So the appropriate amount of time to spend on code review as a team lies somewhere in between the two extremes. But I'm at a loss for how one would determine this amount of time in advance so that you would hit 80% capacity utilization for the process.

With multiple queues throughout our processes and the inherent unpredictability of software development (you might say the inherent unpredictability of life) the direct approach seems doomed to failure at first contact with reality. Fortunately, there is a way to control capacity utilization _indirectly_.

Below is a simulation of a single process where we apply a work-in-progress (WIP) limit to the queue. You can change the WIP limit to be applied, and let the process run its course. What you'll see is that over time, a WIP limit creates situations where there is excess capacity available, but there is nothing in the queue waiting to be served. So instead of the server being occupied 100% of the time (100% capacity utilization) they are sometimes waiting for short periods of time (less than 100% capacity utilization).

How does this happen? Again, it's all about randomness. The server deals with 5 items per hour on average, but not the same amount every hour. That means that in some hours, she is able to deal with 7 items. Other hours, she can only deal with 3. With no WIP limit on the queue and an arrival rate close to the service rate, there will almost always be something for her to work on and her capacity utilization will be at or near 100%, so the queue will grow. With a WIP limit on the queue -- let's say it's 6, as we set it by default -- there will be times when more items come in and we reject demand, capping the queue size at 6. It's possible that those times coincide with the times when the server is able to serve quicker than average, leading to her running out of work before new items come into the queue and having to wait (less than 100% capacity utilization.)

I find this extremely satisfying, for two reasons: first, we know that the randomness in our processes is what causes these counter-intuitive behaviours, and here, we use WIP limits to _take advantage_ of that randomness to create the mitigation we need - having lower capacity utilization. Second, the problem we're trying to deal with is the tendency of queues to grow out of control. It turns out that a really effective way to deal with that problem is to _directly control the size of the queues_!

* What does this look like in practice? What does 'rejecting demand' mean? That sounds scary and head-butty...

* Why haven't I talked about controlling and reducing randomness? Six Sigma is a thing, right? We don't want things to be unpredictable.
	* Software is inherently unpredictable
	* The value of what we do is often in direct proportion to how novel -- and hence how unpredictable it is.
	* Even if we could, and even if we wanted to, reduce randomness, it wouldn't help us at high capacity utilization levels. GRAPH HERE
* OK, but how bad are queues really? I don't want people sitting idle.
	* Of course it's an optimization. Airline check-in economics are a bit different from software development economics. We're trading off cost of capacity vs cost of delay.
		* GRAPH HERE, PROBABLY SOME ABILITY TO TWEAK VARIABLES
	* The thing is: if you pay 0 cost of capacity, you eventually pay _infinite_ cost of delay. You can build new stuff for a while, but you'll get slower and slower, and eventually you have no ability to innovate and bring new stuff to the market in a timely fashion, so your competitors  eat your lunch. If you want to avoid this, you must introduce _some_ slack into the system. Things need to be idle at least some of the time so that there's an ability to deal with new information. You could crunch all the numbers and optimize to the nth degree, or you could just bear in mind that 80% is roughly toward the bottom end and shoot for that (or even better, apply WIP limits and let the randomness do it for you.)
* So in summary, what do I suggest you do?
	* Recognize the massive impact of cost of delay. Build it into your financial reporting if you can.
	* Whenever you see an opportunity for a queue to form, ask yourself: is it possible to avoid this queue? If I can't avoid the queue, can I make the asynchronous hand-off into a synchronous and blocking operation?
	* Where queues exist, reduce capacity utilization. Don't try to do it directly -- apply WIP limits. EXAMPLES OF WIP LIMITS HERE

1: I'm quite certain by now that there are readers who are practically screaming at me: "but queues in product development aren't like airport check-in queues! They're not first-in, first-out. We prioritize them." This is absolutely correct, and a full response to this is beyond the scope of this article. In lieu of a full response, I'll say some provocative things here and promise to follow up with a full examination later. First, it is unlikely you are prioritizing correctly. Second, prioritizing correctly only _mitigates_ the cost of queues. It doesn't solve it. Third, there is a cost to prioritizing which scales non-linearly with the size of the queue.
2: €50 per hour translates to €400 per day and €92000 for a full year (subtracting 6 weeks for annual leave and public holidays, and assuming no other absences). Taking into account other costs of having engineers on staff, this seems like a pretty reasonable ballpark figure.