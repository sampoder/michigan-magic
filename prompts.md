# Prompts

These prompts will eventually be passed to OpenAI's APIs. For now, I'm just dumping them in here.

The goal is for these to be modular.

## Initial Prompt

```
We're going to play a game. Here's the situation. Sam Altman has been removed as the CEO of OpenAI.

The game player is going to be the new CEO of OpenAI. You'll need to generate tasks for them based on what they do in previous tasks.

This was their first task. They received the following phone call:

“Hey Sam, you're the new CEO for OpenAI. We’ve removed Sam Altman as the board no longer has confidence in his ability to continue leading OpenAI.

Your goals as CEO will be: (a) grow the use of OpenAI's products in a safe manner, (b) ensure OpenAI remains fiscally viable, and (c) to ensure that artificial general intelligence benefits all humanity.

For now, what we need you to do is to draft a tweet announcing your hiring.”

And this was the user's tweet:

{{ the_tweet }}

Generate three sample replies to this tweet created by average users of Twitter (use colloquialisms and include both positive and negative responses).

Format it as a JSON array of strings. Only include the JSON. No additional commentary.
```

## Action Prompts

These are prompts that require the "CEO" to take an action.

### Choose from X Options

```
{{ month }}'s task is a scandal.

Generate a 250 character-long description of a hypothetical scandal.

You may choose to reference the events in previous months or to not reference them. Refer to the CEO as "you".

Generate 4 options (max 50 characters) for how the new CEO could respond.

Format it as JSON object with two keys:

description: a string with the description

responses: an array of strings with the 50 character-long description of each option.

Only include the JSON. No additional commentary.
```

Response:

```
The CEO choose "{{ option }}".

{{ next_months_action }}
```

### Write a Tweet

```
{{ month }}'s task is writing a tweet.

In 250 characters, explain why this tweet is needed and it's importantance to OpenAI's future.

You may choose to reference the events in previous months or to not reference them. Refer to the CEO as "you".

Format it as JSON object with one key:

description: a string with the situation's description

Only include the JSON. No additional commentary.
```

Response:

```
The CEO tweeted "{{ tweet }}".

In 150 characters, explain how the public responded to that tweet.

Format it as JSON object with one key:

response: a string describing the public's opinion.

Only include the JSON. No additional commentary.
```

### Podcast

```
{{ month }}'s task is responding to a question on a podcast.

In 250 characters, explain the podcast's context and the difficult question you've been asked.

You may choose to reference the events in previous months or to not reference them. Refer to the CEO as "you".

Format it as JSON object with one key:

description: a string with the situation's description

Only include the JSON. No additional commentary.
```

Response:

```
The CEO responded by saying "{{ response }}".

In 150 characters, explain how the public responded to that answer.

Format it as JSON object with one key:

response: a string describing the public's opinion.

Only include the JSON. No additional commentary.
```

### News Interview

```
{{ month }}'s task is responding to a question on live TV news.

In 250 characters, explain the show's context and the difficult question you've been asked.

You may choose to reference the events in previous months or to not reference them. Refer to the CEO as "you".

Format it as JSON object with one key:

description: a string with the situation's description

Only include the JSON. No additional commentary.
```

Response:

```
The CEO responded by saying "{{ response }}".

In 150 characters, explain how the public responded to that answer.

Format it as JSON object with one key:

response: a string describing the public's opinion.

Only include the JSON. No additional commentary.
```

### Write a Text Message

```
{{ month }}'s task is sending a text message to an important individual.

In 250 characters, introduce this important individual and the context behind the text. This important individual should be a real world figure and be identified by name.

You may choose to reference the events in previous months or to not reference them. Refer to the CEO as "you".

Format it as JSON object with one key:

description: a string with the situation's description

Only include the JSON. No additional commentary.
```

Response:

```
The CEO texted this individual "{{ response }}".

What does individual respond with? Don't include any questions in the response.

Format it as JSON object with one key:

response: a string with the individual's response.

Only include the JSON. No additional commentary.
```

### Launch a Feature

```
{{ month }}'s task is to launch a new feature. Please respond with an empty JSON object.

Only include the JSON. No additional commentary.
```

This task should only ever show up once. It's DevDay.

Response:

```
The CEO described their new feature as "{{ response }}".

In 150 characters, explain how the public responded to that feature.

Format it as JSON object with one key:

response: a string describing the public's opinion.

Only include the JSON. No additional commentary.
```

### Attend a Board Meeting

```
{{ month }}'s task is responding to a question at a board meeting.

In 250 characters, explain the difficult question you've been asked.

You may choose to reference the events in previous months or to not reference them. Refer to the CEO as "you".

Format it as JSON object with one key:

description: a string with the situation's description

Only include the JSON. No additional commentary. 
```

Response:

```
The CEO responded by saying "{{ response }}".

In 150 characters, explain how the board responded to that answer.

Format it as JSON object with one key:

response: a string describing the board's opinion.

Only include the JSON. No additional commentary.
```

### Team Social

```
{{ month }}'s task is celebrating the team's success.

In 250 characters, explain the hypothetical cause for celebration and prompt the CEO to come up with a social idea.

You may choose to reference the events in previous months or to not reference them. Do not use "the CEO" in the description, refer to them as "you".

Format it as JSON object with one key:

description: a string with the situation's description

Only include the JSON. No additional commentary. 
```

Response:

```
The CEO proposed the following social: "{{ response }}".

In 150 characters, explain how the team reacted to the social event.

Format it as JSON object with one key:

response: a string describing the team's opinion.

Only include the JSON. No additional commentary.
```

## Quarterly Updates

After the action and response in December / March / June / September and December:

```
As it's {{ month }}, you'll provide a quarterly update. Format it as a JSON array with three keys:

public_confidence: a float ranging from 0 to 1 representing the public's confidence in OpenAI

new_users: the amount of new users for OpenAI this quarter

cash: a positive or negative number representing the amount of money OpenAI lost / gained this quarter

Only include the JSON. No additional commentary.
```
