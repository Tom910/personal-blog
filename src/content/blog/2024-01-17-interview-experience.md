---
date: "2024-01-17"
title: Cracking the FAANG Interview. My experience and recommendations
tags:
  - interview
description: I have tried to pass interviews at FAANG companies three times. Each time, I increased the amount of time I spent preparing for the interview. Over the years, I have read and watched a lot of information related to interview preparation. In this article, I want to cover some of the aspects which I found useful in my journey.
---

I have tried to pass interviews at FAANG companies three times. Each time, I increased the amount of time I spent preparing for the interview. Over the years, I have read and watched a lot of information related to interview preparation. In this article, I want to cover some of the aspects which I found useful in my journey. I have read many times from engineers negative feedback about interviews because they are not real, do not cover real work, are random, and so on. This is close to true, but it is something that we cannot change, and we can only adapt to it. This article will be interesting for engineers of all levels.

## Luck as an important aspect of interviews

Luck is an important aspect of any interview. It's like a game of Baldur's Gate 3 where every time you roll the die, you could have a critical fail and fail any possible interview. This could happen, for example, because an interviewer in a bad mood, the task is hard and requires approaches that are new for you. Maybe they have already chosen another candidate and your interview is just a part of the process which they cannot skip. There are hundreds of reasons why we can fail an interview.

So, rejection is a normal part of the interview process. You need to work on yourself so that failure does not affect you. Because any interview is a good experience for you. You can learn something new about yourself, your skills, and your knowledge. This helps you improve yourself and your skills, which improves your chances of passing the next interview.

## Preparation is a key aspect of interviews

Unfortunately, preparation is a key aspect for passing the interview process at a high level in top companies. I am almost certain that the average FAANG engineer who has worked for more than 10 years cannot pass the interview process of their company without preparation. Only a limited amount of positions assumes a lot of tasks related to algorithms and system design which are used in interviews.

In one of my previous companies, I was an interviewer for four years with more than 200 interviews. I often asked candidates about their preparations, algorithms, and LeetCode problems. I used this knowledge to adapt the first task for a candidate. In reality, if a candidate did not prepare for the interview, they had a small chance to pass the interview on a medium+ level, even if they had 10 years of experience. I saw many times when a candidate knew the theory, for example, how binary search works, but they could not implement it. Because if they learned something 5-10-15 years ago and did not use it, they only remembered the high-level theory. So, it is better to prepare for the interview.

Also, as a part of preparation, it is important to understand the requirements of companies. Different companies have different sections, tasks, and focuses, and it is better to find this information. It increases the chance to pass the interview.

## Level of English

It is a super important topic for me as a non-native speaker. Previously, I read that a good level of English is not important for the interview process. Not exactly. Yes, you have a chance to pass the interview with bad English, but you significantly decrease your chance to pass it. Because problems happen at all steps of the interview process:

### Coding parts
Some companies use long grids text for coding tasks, and you need to read and understand them. It's hard to do this with bad English and without translation applications. You also need to be able to speak about your task, how you solved it, what its complexity is, and so on. All of this requires communication and the ability to understand what the interviewer says. Once, I had a problem with a task that used the word "produce" in its description. Originally, I thought that "produce" was a variation of "sum."

Also, the interviewer would try to help you when you are stuck. But can you understand this help?

### System design parts

In fact, it is a 35-minute presentation. The core part of this interview is your ability to present your idea to the interviewer. If the interviewer understands your ideas, and you find the main case, you will pass the interview.

### Behavioral parts

Also, present yourself. You need to be able to talk about your experience, your projects, your team, and so on. All of this requires a basic level of English. For example, one company did not offer me a job because I sometimes stammered in my answers to the manager. I passed all other interviews in this company with good feedback, but the manager wasn't sure if I would communicate effectively in a team.

Overall, your English level may create problems for you and for the interviewer::
- For you - you spend a lot of energy speaking. Any stressful situation decreases your ability to speak.
- For the interviewer - they spend additional energy to understand you, and when they can't understand you, they might make a decision that you are not suitable for that role.

What works for me:
- A lot of sessions with my English teacher. I have had 2-3 sessions per week for the last 5 years. Five years ago, I didn't speak English at all because I didn't learn it at school or university. An English teacher can also help you with the behavioral part of the interview. They can help you check your answers, improve the structure of an answer, and adapt the next lessons to improve those aspects. My teacher asked me maybe 50+ behavioral questions.
- A good microphone. It's worth spending money on a good microphone because the interviewer will spend less energy on understanding you.
- Consume English content. When possible, I switch to English. Also, this blog is a part of my effort to improve my writing skills.


## Companies are different

![levels of companies](/assets/article-interview/levels-of-companies.webp)

Companies are different. I can split them into at least 3 levels (it isn't a complete list):
- Level 1 - Big tech companies like Meta, Google, Apple, and Microsoft. They often have a name FAANG or MANGO (a new one). They pay well but also have many positions and employees.
- Level 2 - Smaller companies that have a good product and pay well. But usually they have fewer open positions and a less mature brand.
- Level 3 - Small good companies that do not pay as much as big tech.
- Level 4 - Usually startups and companies where IT is not a priority.

The level of the company affects the interview process a lot. Because the most amount of people try to pass interviews in levels 1 and 2, they have many people wanting to be interviewed. Therefore, they increase the complexity of their interview to filter people. Levels 3-4 usually do not have complex interviews, and the process might have only 1-2 steps.

I have had experiences with level 3-4 companies. They have coding sections where they expect you to write a for loop and perform simple operations like increasing or multiplying numbers. These tasks are similar to the easy tasks on LeetCode. Every time, I was confused at first because I didn't expect it to be so easy. But it is.

Different companies have different levels of complexity in their interviews and expectations from candidates. 
- Level 1 and 2 - they have a list of things that an ideal candidate should do. They expect that you will do most of them. However, it is interesting to note that different companies have different lists of things. For example, one company expects you to cover all edge cases in your code, while another expects you to drive system design interviews. Another company expects you to write production-ready names of variables, while yet another expects good answers to behavioral questions on coding interviews. Therefore, it is better to understand what company expects from you to increase your chances.
- Level 3 and 4 - usually, they don't have additional materials for the interview, and it is hard to find experience from other candidates. However, they usually don't have strict requirements.

## There is no standardised interview process

In my experience, I have had interview processes for three different roles: Frontend role, Backend role, and Full-stack role.

### Frontend role
Most companies adapt tasks for web-specific topics, but not all. Here’s what you can expect:

- In common cases, you will solve tasks related to web-specific topics like writing a simple React application, writing a function that uses web API for animation, CSS, accessibility, HTML (without theoretical questions), and typical [BFE tasks](https://bigfrontend.dev). On system design, you need to design a component.
- In more complex cases, you will write tasks like writing a Minesweeper game. Your goal is to understand how to implement logic for 35 minutes. This task has an algorithmic part like matrix traversal (BFS/DFS), but usually without complex algorithms. On system design, you need to design a web application with knowledge of typical system design.
- Without difference, like Google, which asked just algorithmic tasks, the same as on Backend role.

### Backend role
The most standardized interview process, in my opinion, is for the Backend SWE role. You need to solve algorithmic tasks and typical system design tasks.

### Full-stack role
Usually, it is the same as the Backend role. Many companies don’t ask anything related to web topics.

## Coding Interviews

![levels of companies](/assets/article-interview/coding-step.webp)


In general, it is algorithmic tasks. When you need to understand the problem, find a good solution, and write code. But as usual, it’s not that simple. Usually, companies have a checklist of things they expect from you in this section. For example:

- Communication - How do you discuss this task? Do you ask enough questions?
- Problem-solving - How do you solve this task? Can you find a good solution?
- Coding - How do you write code? Can you write code without mistakes? How fast can you write code? What is the quality of your code?
- Testing - Can you test your code? Does it contain bugs?

You cannot start writing code immediately after receiving a task. You will not cover all aspects. It is better to have a style of solving tasks that covers all of these points. Here is my approach:
- Read and understand the task. Also, ask questions about constraints and edge cases.
- Retell the task in your own words.
- Write input and output data and recheck it with the interviewer.
- Tell the idea of how you will solve this task with the complexity of the solution.
- Write code.
- Debug you code line by line without running it.
- Tell the final complexity of the solution.
- Move to the next task.

Usually, you have less than 40 minutes to solve 2 tasks. So, you need to prepare to do it fast because any problem may be the reason you’re out of time. In level 1-2 companies, they usually ask 2 medium or 1 medium and 1 hard Leetcode task. Sometimes even 2 hard problems -_- but not often. So, you need to be able to solve medium tasks in less than 20 minutes.

Some companies expect that you will write code that will pass tests. So, you need to be able to write working code and have excellent skills in your programming language (you can choose on the interview). Because every minute you spend on debugging is a minute that you don't have for solving the next task.

Also you can meet one more variation of coding interviews like object design interviews. It’s when you need to design classes and connections between them. But I didn't have this experience and didn't prepare for it.

Some companies have different lists of topics for coding interviews. For example, a company can ban any DP tasks, and you will not have them (thank them for that). Or a company usually asks graph/tree tasks, or tasks over strings/numbers or mathematical tasks. Again, preparation is a key aspect of increasing your chance to pass the interview.

### My preparation for Coding interviews

As an example, I have solved a total of 175 LeetCode tasks (52 easy, 106 medium, 17 hard) (some tasks I have already solved 3+ times). I also have an additional repository where I solve tasks that don't have Leetcode or are under premium with 80 solved tasks. Additionally, I passed courses related to algorithmics and watched a lot of videos about algorithms. As a recommendation, prepare by a list of important tasks like [blind 75](https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions) and [similar lists based on algorithmic approaches](https://dev.to/codinglanguages/how-to-learn-not-memorize-any-algorithm-or-data-structure-analysis-of-20-problem-solving-techniques-you-must-know-d77).

## System design interviews

![System design interviews](/assets/article-interview/system-design-step.webp)

The most interesting and useful part of the interview process is preparing and solving System Design tasks, which made me much better in understanding how different systems work. Because usually at work, you have a couple of problems, and you know them well. But in an interview, you need to be able to solve and understand problems of systems that you don't know. For example, creating a Messenger.

System Design is a critical interview if you want to pass senior or staff level. Usually, System Design and Behavioral show your final level. Coding is usually the same for middle-staff levels, but on system design the company expects that you provide signals of senior/staff level.

Different roles have different sections. Examples of sections which I had:
- Frontend System Design,
- Product System Design,
- Backend System Design,
- Low-level System Design,
- Presentation of your previous system. 

It is better to understand what a company expects from you before you come to an interview. 

Usually, a task has a main problem/challenge which you need to find and solve. For example, you may need to design a Messenger. The main problem is how to send messages between users. So, you need to organize communication and explain how a message from user A will be delivered to user B.

The biggest problem is time. You will have 35 minutes to design a Messenger application. It is impossible to design a complex system in 35 minutes. So, you need to focus on the main problem, describe how it might work, and control time. As with a coding interview, you need to show signals and cover different aspects.

The amount of system design tasks is limited, and usually companies ask similar questions and problems.

### Structure of System Design Interview which I used:

- Clarification and calculations - 10 minutes
- Design - 20 minutes
  - High-level design
  - Detailed design of scenarios which solve the main problem
    - API design
    - Data model
- Bottlenecks - 5 minutes

Also, important:
- Drive the conversation. This section expects that you will drive the conversation. You need to tell more, write the design, and cover all aspects. 
- Provide alternatives and reasons to choose technology A over technology B.


But in reality, some interviewers had their own structure, and I changed and adapted mine to their requirements. But it created problems because without structure, I sometimes forgot to cover some aspects.

### My Preparation for System Design

There are many videos and materials about System Design available on the internet that are suitable for middle levels. For senior/staff level positions, you need to have more in-depth knowledge. The key is to filter content and search for specific authors or read company blogs/public speeches of engineers from the company you want to prepare for. You can also debug an example of a site. For example, if you want to understand how to implement a Netflix clone, you can read a blog, find public talks, and debug the Netflix site.

I also participated in a mock system design interview. You can find a partner who is also preparing for a system design interview and emulate a real interview. The mock interview will help you get a feel for the format of the section, learn to keep to time, and receive feedback from the interviewer. I have purchased one paid mock interview and completed many free mock interviews. You can find people who want to prepare for a system design interview in groups or sites related to interview preparation.

As an example, I solved a total of 25 different System Design problems with an understanding of the main problems and challenges. It helped me a lot to understand different patterns and how really popular systems work inside.

## Behavioral interviews

![Behavioral questions](/assets/article-interview/beh-questions.webp)

These sections are needed for the company to understand how suitable you are for their culture and their expectations of this role. The interviewer usually asks about the most interesting project you have worked on, conflict situations, or similar questions. Companies have different values/principles that they expect to hear from you in your answers. And actually, it is a good aspect of reviewing the company's style of work for you.

Should you be honest? It isn't a simple question. Because sometimes in an interview, they can ask you to lie. For example, "Why do you like crypto and WEB 3?" If I answer honestly, I will not pass this interview because, in reality, I don't think that crypto or either Web 3 is a cool thing. I answered honestly and was rejected. But let's imagine I wasn't honest and passed this interview. I would start to work in a company that would not be suitable for me, and this would affect my life because the company's culture would not be suitable for me. So, I think honesty is the best choice because it increases the chance that you will find a more suitable company for you.

In this section, it is very important to provide stories relative to your target level. So, if you want to pass an interview on a senior level, it is usually not a good idea to provide stories which can be solved by a junior engineer. It is better to check the expectations from each role and prepare stories which cover them or are bigger.

### My Preparation for Behavioral Interviews

Preparation is an important part because the interviewer expects stories in STAR format. The STAR format stands for Situation, Task, Action, and Result. However, I added a letter R (Role) to the STAR format (RSTAR) to also cover my role in this story, what exactly I have done in a project, and my personal results. Also, preparation is needed because if I just ask you about the most interesting project, you will probably answer in a natural way which will not cover all aspects that the interviewer expects from you. So, it is better to prepare stories and practice them.

I prepared more than 20 stories from my experience.


## Conclusion

I tried to pass FAANG interview three times. In the first time (2021), I failed because I didn't prepare enough, and my English wasn't good. In the second time, many of the interviews were canceled because of layoffs (2022). In the third time (2023-2024), I finally passed an interview in a FAANG company.

In this article, I have covered only a part of the nuances. Each topic has a lot more things to say which you can find in my new course as a FAANG engineer... Not really. This article doesn't have any advertisements and I don't have any courses. But the topic is big, that's true. Good luck at your next interview.
